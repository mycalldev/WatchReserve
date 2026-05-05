<script>
	import { fly, fade } from 'svelte/transition';
	import { cubicOut, cubicInOut } from 'svelte/easing';
	import { onMount, tick } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

	/**
	 * @typedef {'cart' | 'part-exchange' | 'deposit'} DrawerType
	 */

	/** @type {{ open: boolean, type: DrawerType, product: any, selectedVariant: any, checkoutUrl: string | null, onclose: () => void, ondepositsuccess?: () => void }} */
	let {
		open = false,
		type = 'cart',
		product = null,
		selectedVariant = null,
		checkoutUrl = null,
		onclose,
		ondepositsuccess
	} = $props();

	// ── Lock body scroll when open ─────────────────────────────────────────────
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = open ? 'hidden' : '';
		}
		return () => {
			if (typeof document !== 'undefined') document.body.style.overflow = '';
		};
	});

	// ── Escape key closes drawer ───────────────────────────────────────────────
	function handleKeydown(e) {
		if (e.key === 'Escape' && open) onclose?.();
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	// ── Helpers ────────────────────────────────────────────────────────────────
	function formatPrice(amount, currency = 'GBP') {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency,
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	const productImage = $derived(product?.images?.[0]?.url ?? null);
	const productTitle = $derived(product?.title ?? '');
	const productVendor = $derived(product?.vendor ?? '');
	const productPrice = $derived(
		selectedVariant?.price
			? formatPrice(selectedVariant.price, selectedVariant.currencyCode ?? 'GBP')
			: product?.minPrice
			? formatPrice(product.minPrice, product.currencyCode ?? 'GBP')
			: ''
	);

	const depositRawPrice = $derived(selectedVariant?.price ?? product?.minPrice ?? null);
	const depositAmount = $derived(
		depositRawPrice != null
			? formatPrice(depositRawPrice * 0.10, selectedVariant?.currencyCode ?? product?.currencyCode ?? 'GBP')
			: null
	);
	const balanceAmount = $derived(
		depositRawPrice != null
			? formatPrice(depositRawPrice * 0.90, selectedVariant?.currencyCode ?? product?.currencyCode ?? 'GBP')
			: null
	);

	// ── Panel titles / subtitles ───────────────────────────────────────────────
	const panelMeta = {
		cart: {
			title: 'Added to Cart',
			subtitle: 'Review your selection before checkout',
			icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`
		},
		'part-exchange': {
			title: 'Part Exchange',
			subtitle: 'Trade in your current watch',
			icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18m0 0l-4-4m4 4l-4 4M21 17H3m0 0l4-4m-4 4l4 4"/></svg>`
		},
		deposit: {
			title: 'Reserve This Timepiece',
			subtitle: 'Secure your watch with a deposit',
			icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
		},
	};

	// ── PART EXCHANGE FORM ─────────────────────────────────────────────────────
	let pxForm = $state({
		brand: '', model: '', reference: '', year: '',
		condition: '', estimatedValue: '',
		fullName: '', email: '', phone: ''
	});
	let pxTouched = $state({});
	let pxSubmitting = $state(false);
	let pxSuccess = $state(false);
	let pxError = $state('');
	let pxGdprConsent = $state(false);

	const conditionOptions = [
		{ value: '', label: 'Select condition…' },
		{ value: 'unworn', label: 'Unworn / New' },
		{ value: 'excellent', label: 'Excellent' },
		{ value: 'very-good', label: 'Very Good' },
		{ value: 'good', label: 'Good' },
		{ value: 'fair', label: 'Fair' }
	];

	function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
	function isValidPhone(v) { return /^[\d\s\+\-\(\)]{7,}$/.test(v.trim()); }

	const pxValid = $derived({
		brand: pxForm.brand.trim().length >= 1,
		model: pxForm.model.trim().length >= 1,
		condition: pxForm.condition !== '',
		fullName: pxForm.fullName.trim().length >= 2,
		email: isValidEmail(pxForm.email)
	});

	const pxCanSubmit = $derived(
		pxValid.brand && pxValid.model && pxValid.condition && pxValid.fullName && pxValid.email
	);

	async function submitPartExchange(e) {
		e.preventDefault();
		pxTouched = { brand: true, model: true, condition: true, fullName: true, email: true };
		if (!pxCanSubmit) return;

		pxSubmitting = true;
		pxError = '';

		try {
			const res = await fetch('/api/part-exchange', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name:          pxForm.fullName,
					email:         pxForm.email,
					phone:         pxForm.phone,
					brand:         pxForm.brand,
					model:         pxForm.model,
					reference:     pxForm.reference,
					year:          pxForm.year,
					condition:     pxForm.condition,
					estimatedValue: pxForm.estimatedValue,
					targetProduct: productVendor ? `${productVendor} ${productTitle}` : productTitle,
					source:        'product-page',
					gdprConsent:   pxGdprConsent
				})
			});

			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data.success) throw new Error(data.error ?? 'Request failed');

			pxSuccess = true;
		} catch (err) {
			pxError = err?.message || 'Something went wrong. Please try again.';
		} finally {
			pxSubmitting = false;
		}
	}

	function resetPx() {
		pxForm = { brand: '', model: '', reference: '', year: '', condition: '', estimatedValue: '', fullName: '', email: '', phone: '' };
		pxTouched = {};
		pxSuccess = false;
		pxError = '';
	}

	// ── DEPOSIT FORM ───────────────────────────────────────────────────────────
	let depStep = $state(1); // 1=details, 2=payment, 3=success
	let depForm = $state({ fullName: '', email: '', phone: '', notes: '' });
	let depGdprConsent = $state(false);
	let depTouched = $state({});

	// Deposit Stripe state
	let depStripe = $state(null);
	let depElements = $state(null);
	let depPaymentElement = null;
	let depClientSecret = $state('');
	let depStripeLoading = $state(false);
	let depPaymentMessage = $state('');
	let depConfirming = $state(false);

	const depValid = $derived({
		fullName: depForm.fullName.trim().length >= 2,
		email: isValidEmail(depForm.email),
		phone: isValidPhone(depForm.phone)
	});

	const depCanSubmit = $derived(depValid.fullName && depValid.email && depValid.phone);

	function submitDeposit(e) {
		e.preventDefault();
		depTouched = { fullName: true, email: true, phone: true };
		if (!depCanSubmit) return;
		depStep = 2;
	}

	async function initDepositStripe() {
		if (depClientSecret || depStripeLoading) return;
		depStripeLoading = true;
		depPaymentMessage = '';

		const price = depositRawPrice;
		const currency = selectedVariant?.currencyCode ?? product?.currencyCode ?? 'GBP';

		try {
			const [stripeInstance, res] = await Promise.all([
				loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY),
				fetch('/api/create-deposit-intent', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						productPrice:  price,
						currencyCode:  currency,
						productId:     product?.id     ?? '',
						productTitle:  product?.title  ?? '',
						productVendor: product?.vendor ?? '',
						customerName:  depForm.fullName,
						customerEmail: depForm.email,
						customerPhone: depForm.phone
					})
				})
			]);

			if (!stripeInstance) throw new Error('Could not load Stripe.');
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body?.message || 'Could not initialise payment.');
			}

			const payload = await res.json();
			depStripe = stripeInstance;
			depClientSecret = payload.clientSecret;

			depElements = depStripe.elements({
				clientSecret: depClientSecret,
				appearance: {
					theme: 'stripe',
					variables: {
						colorPrimary: '#160b11',
						colorText: '#160b11',
						colorBackground: '#ffffff',
						colorDanger: '#b04040',
						fontFamily: 'Montserrat, system-ui, sans-serif',
						borderRadius: '0px',
						spacingUnit: '4px',
						fontSizeBase: '15px'
					},
					rules: {
						'.Input': { border: '1px solid #e1dbd2', padding: '14px 16px', boxShadow: 'none' },
						'.Input:focus': { border: '1px solid #a1846d', boxShadow: 'none' },
						'.Label': { fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.4px', color: '#6a5f58', fontWeight: '500' }
					}
				}
			});

			depPaymentElement = depElements.create('payment', { layout: 'tabs', terms: { card: 'never' } });
			await tick();
			depPaymentElement.mount('#dep-stripe-payment-element');
		} catch (err) {
			depPaymentMessage = err?.message || 'Failed to load payment form.';
		} finally {
			depStripeLoading = false;
		}
	}

	async function confirmDeposit() {
		if (!depStripe || !depElements || depConfirming) return;
		depConfirming = true;
		depPaymentMessage = '';

		try {
			const { error: stripeError } = await depStripe.confirmPayment({
				elements: depElements,
				confirmParams: {
					return_url: typeof window !== 'undefined' ? window.location.href : '',
					receipt_email: depForm.email
				},
				redirect: 'if_required'
			});

			if (stripeError) {
				depPaymentMessage = stripeError.message || 'Payment failed. Please try again.';
			} else {
				depStep = 3;
				if (product?.id) {
					try {
						const reserved = JSON.parse(localStorage.getItem('wr_reserved') ?? '{}');
						reserved[product.id] = new Date().toISOString();
						localStorage.setItem('wr_reserved', JSON.stringify(reserved));
					} catch {}
				}
				ondepositsuccess?.();
			}
		} catch (err) {
			depPaymentMessage = err?.message || 'An unexpected error occurred.';
		} finally {
			depConfirming = false;
		}
	}

	function resetDep() {
		depForm = { fullName: '', email: '', phone: '', notes: '' };
		depTouched = {};
		depStep = 1;
		depClientSecret = '';
		depPaymentMessage = '';
		depStripe = null;
		depElements = null;
		depPaymentElement = null;
	}

	// Stripe initialisation deferred — KYC step active at depStep 2

	let depKycSubmitting = $state(false);
	let depKycError = $state('');

	async function submitKycDeposit() {
		if (depKycSubmitting) return;
		depKycSubmitting = true;
		depKycError = '';

		try {
			const res = await fetch('/api/kyc-deposit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fullName: depForm.fullName,
					email: depForm.email,
					phone: depForm.phone,
					notes: depForm.notes,
					productTitle: product?.title ?? '',
					productVendor: product?.vendor ?? '',
					depositAmount: depositAmount ?? '',
					gdprConsent: depGdprConsent
				})
			});

			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data.success) throw new Error(data.error ?? 'Request failed.');

			depStep = 3;
		} catch (err) {
			depKycError = err?.message || 'Something went wrong. Please try again.';
		} finally {
			depKycSubmitting = false;
		}
	}

	// Reset deposit state when drawer closes
	$effect(() => {
		if (!open) {
			depClientSecret = '';
			depStripe = null;
			depElements = null;
			depPaymentElement = null;
			depPaymentMessage = '';
			depKycError = '';
			if (depStep !== 1) depStep = 1;
		}
	});

</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="so-backdrop"
		transition:fade={{ duration: 250, easing: cubicInOut }}
		onclick={onclose}
		aria-hidden="true"
	></div>

	<!-- Panel -->
	<div
		class="so-panel"
		role="dialog"
		aria-modal="true"
		aria-label={panelMeta[type]?.title}
		transition:fly={{ x: 520, duration: 380, easing: cubicOut }}
	>
		<!-- Header -->
		<div class="so-header">
			<div class="so-header-left">
				<span class="so-header-icon" aria-hidden="true">
					{@html panelMeta[type]?.icon}
				</span>
				<div class="so-header-copy">
					<h2 class="so-title">{panelMeta[type]?.title}</h2>
					<p class="so-subtitle">{panelMeta[type]?.subtitle}</p>
				</div>
			</div>
			<button class="so-close" onclick={onclose} aria-label="Close panel" type="button">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>

		<!-- Scrollable body -->
		<div class="so-body">

			<!-- ── CART PANEL ── -->
			{#if type === 'cart'}
				<div class="cart-panel">
					<!-- Added item card -->
					<div class="cart-item-card">
						{#if productImage}
							<div class="cart-item-img">
								<img src={productImage} alt={productTitle} />
							</div>
						{/if}
						<div class="cart-item-info">
							<p class="cart-item-vendor">{productVendor}</p>
							<p class="cart-item-title">{productTitle}</p>
							{#if selectedVariant?.title && selectedVariant.title !== 'Default Title'}
								<p class="cart-item-variant">{selectedVariant.title}</p>
							{/if}
							<p class="cart-item-price">{productPrice}</p>
						</div>
						<div class="cart-item-check" aria-label="Item added">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="20 6 9 17 4 12"/>
							</svg>
						</div>
					</div>

					<!-- Order summary -->
					<div class="cart-summary">
						<div class="cart-summary-row">
							<span>Subtotal</span>
							<span class="cart-summary-amount">{productPrice}</span>
						</div>
						<div class="cart-summary-row cart-summary-row--note">
							<span>Shipping &amp; taxes calculated at checkout</span>
						</div>
					</div>

					<!-- Trust strip -->
					<div class="cart-trust">
						<div class="cart-trust-item">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
							Authenticated
						</div>
						<div class="cart-trust-item">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
							Insured Delivery
						</div>
						<div class="cart-trust-item">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
							</svg>
							Secure Payment
						</div>
					</div>

					<!-- Actions -->
					<div class="cart-actions">
						<a href="/checkout" class="so-btn so-btn--primary">
							Proceed to Checkout
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M5 12h14M12 5l7 7-7 7"/>
							</svg>
						</a>
						<button class="so-btn so-btn--ghost" onclick={onclose} type="button">
							Continue Shopping
						</button>
					</div>

					<!-- Also interested in -->
					<div class="cart-also-interest">
						<p class="cart-also-label">Also available for this timepiece</p>
						<div class="cart-also-links">
							<button class="cart-also-link" type="button" onclick={() => { onclose?.(); setTimeout(() => document.dispatchEvent(new CustomEvent('open-drawer', { detail: 'part-exchange' })), 50); }}>
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
									<path d="M3 7h18m0 0l-4-4m4 4l-4 4M21 17H3m0 0l4-4m-4 4l4 4"/>
								</svg>
								Part Exchange
							</button>
						</div>
					</div>
				</div>

			<!-- ── PART EXCHANGE PANEL ── -->
			{:else if type === 'part-exchange'}
				<div class="px-panel">
					{#if pxSuccess}
						<div class="so-success-state">
							<div class="so-success-icon" aria-hidden="true">
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="20 6 9 17 4 12"/>
								</svg>
							</div>
							<h3 class="so-success-title">Enquiry Submitted</h3>
							<p class="so-success-body">Thank you. A Watch Reserve specialist will assess your watch and contact you within 24 hours with a valuation.</p>
							<a href="/" class="so-btn so-btn--outline so-btn--sm">
								Visit Home
							</a>
						</div>
					{:else}
						<!-- Product being purchased context -->
						<div class="so-context-pill">
							<span class="so-context-label">Part exchange towards</span>
							<span class="so-context-item">{productVendor} {productTitle}</span>
						</div>

						<div class="so-section-head">
							<span class="so-section-eyebrow">Your Watch</span>
							<div class="so-section-rule"></div>
						</div>

						<form class="so-form" onsubmit={submitPartExchange} novalidate>

							<div class="so-row-2">
								<div class="so-field" class:so-field--error={pxTouched.brand && !pxValid.brand}>
									<label for="px-brand" class="so-label">Brand <span class="so-req">*</span></label>
									<input id="px-brand" class="so-input" type="text" placeholder="e.g. Rolex" bind:value={pxForm.brand} onblur={() => (pxTouched.brand = true)} />
									{#if pxTouched.brand && !pxValid.brand}
										<p class="so-hint-err">Please enter the brand.</p>
									{/if}
								</div>
								<div class="so-field" class:so-field--error={pxTouched.model && !pxValid.model}>
									<label for="px-model" class="so-label">Model <span class="so-req">*</span></label>
									<input id="px-model" class="so-input" type="text" placeholder="e.g. Submariner" bind:value={pxForm.model} onblur={() => (pxTouched.model = true)} />
									{#if pxTouched.model && !pxValid.model}
										<p class="so-hint-err">Please enter the model.</p>
									{/if}
								</div>
							</div>

							<div class="so-row-2">
								<div class="so-field">
									<label for="px-ref" class="so-label">Reference <span class="so-optional">Optional</span></label>
									<input id="px-ref" class="so-input" type="text" placeholder="e.g. 126610LN" bind:value={pxForm.reference} />
								</div>
								<div class="so-field">
									<label for="px-year" class="so-label">Year <span class="so-optional">Optional</span></label>
									<input id="px-year" class="so-input" type="text" placeholder="e.g. 2019" bind:value={pxForm.year} />
								</div>
							</div>

							<div class="so-row-2">
								<div class="so-field" class:so-field--error={pxTouched.condition && !pxValid.condition}>
									<label for="px-condition" class="so-label">Condition <span class="so-req">*</span></label>
									<div class="so-select-wrap">
										<select id="px-condition" class="so-select" bind:value={pxForm.condition} onblur={() => (pxTouched.condition = true)} onchange={() => (pxTouched.condition = true)}>
											{#each conditionOptions as opt}
												<option value={opt.value}>{opt.label}</option>
											{/each}
										</select>
										<span class="so-select-arrow" aria-hidden="true">
											<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
										</span>
									</div>
									{#if pxTouched.condition && !pxValid.condition}
										<p class="so-hint-err">Please select a condition.</p>
									{/if}
								</div>
								<div class="so-field">
									<label for="px-value" class="so-label">Est. Value <span class="so-optional">Optional</span></label>
									<input id="px-value" class="so-input" type="text" placeholder="e.g. £8,500" bind:value={pxForm.estimatedValue} />
								</div>
							</div>

							<div class="so-divider"></div>
							<p class="so-section-eyebrow">Your Details</p>

							<div class="so-field" class:so-field--error={pxTouched.fullName && !pxValid.fullName}>
								<label for="px-name" class="so-label">Full Name <span class="so-req">*</span></label>
								<input id="px-name" class="so-input" type="text" placeholder="e.g. James Whitmore" autocomplete="name" bind:value={pxForm.fullName} onblur={() => (pxTouched.fullName = true)} />
								{#if pxTouched.fullName && !pxValid.fullName}
									<p class="so-hint-err">Please enter your full name.</p>
								{/if}
							</div>

							<div class="so-row-2">
								<div class="so-field" class:so-field--error={pxTouched.email && !pxValid.email}>
									<label for="px-email" class="so-label">Email <span class="so-req">*</span></label>
									<input id="px-email" class="so-input" type="email" placeholder="email@example.com" autocomplete="email" bind:value={pxForm.email} onblur={() => (pxTouched.email = true)} />
									{#if pxTouched.email && !pxValid.email}
										<p class="so-hint-err">Please enter a valid email.</p>
									{/if}
								</div>
								<div class="so-field">
									<label for="px-phone" class="so-label">Phone <span class="so-optional">Optional</span></label>
									<input id="px-phone" class="so-input" type="tel" placeholder="+44 7700 000000" autocomplete="tel" bind:value={pxForm.phone} />
								</div>
							</div>

							<p class="so-privacy">
								By submitting you agree to our <a href="/privacy-policy" class="so-privacy-link">Privacy Policy</a>.
							</p>

							<label class="gdpr-check">
								<input type="checkbox" bind:checked={pxGdprConsent} class="gdpr-check-input" />
								<span class="gdpr-check-box" aria-hidden="true"></span>
								<span class="gdpr-check-label">I am happy to receive updates and offers from Watch Reserve by email.</span>
							</label>

							{#if pxError}
								<p class="so-error-msg" role="alert">{pxError}</p>
							{/if}

							<button type="submit" class="so-btn so-btn--primary" disabled={pxSubmitting}>
								{#if pxSubmitting}
									<span class="so-spinner" aria-hidden="true"></span>
									Sending…
								{:else}
									Request Valuation
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M5 12h14M12 5l7 7-7 7"/>
									</svg>
								{/if}
							</button>

						</form>

						<div class="so-footer-note">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
							</svg>
							For an immediate valuation, call us on <a href="tel:+442081501987" class="so-link">+44 (0)20 8150 1987</a> or visit us in Canary Wharf.
						</div>
					{/if}
				</div>

			<!-- ── DEPOSIT / RESERVE PANEL ── -->
			{:else if type === 'deposit'}
				<div class="dep-panel">

					<!-- Step 1: Contact details -->
					{#if depStep === 1}
						<!-- Product being reserved -->
						<div class="dep-product-card">
							{#if productImage}
								<img class="dep-product-img" src={productImage} alt={productTitle} />
							{/if}
							<div class="dep-product-details">
								<p class="dep-product-vendor">{productVendor}</p>
								<p class="dep-product-title">{productTitle}</p>
								<p class="dep-product-price">{productPrice}</p>
							</div>
						</div>

						<!-- Deposit breakdown -->
						<div class="dep-info-block">
							<div class="dep-breakdown">
								<div class="dep-breakdown-row">
									<span class="dep-breakdown-label">Watch Price</span>
									<span class="dep-breakdown-val">{productPrice}</span>
								</div>
								<div class="dep-breakdown-row dep-breakdown-row--deposit">
									<span class="dep-breakdown-label">
										<strong>10% Deposit Required</strong>
									</span>
									<span class="dep-breakdown-val dep-breakdown-val--accent">
										{#if depositAmount}{depositAmount}{:else}10% of price{/if}
									</span>
								</div>
								<div class="dep-breakdown-rule" aria-hidden="true"></div>
								<div class="dep-breakdown-row dep-breakdown-row--balance">
									<span class="dep-breakdown-label">Balance on Collection</span>
									<span class="dep-breakdown-val">
										{#if balanceAmount}{balanceAmount}{:else}90% of price{/if}
									</span>
								</div>
							</div>

							<div class="dep-info-row">
								<div class="dep-info-item">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
									</svg>
									<div>
										<span class="dep-info-label">Watch Reserved For</span>
										<span class="dep-info-value">7 Days</span>
									</div>
								</div>
								<div class="dep-info-item">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
									</svg>
									<div>
										<span class="dep-info-label">Deposit Due Now</span>
										<span class="dep-info-value">{#if depositAmount}{depositAmount}{:else}10% of price{/if}</span>
									</div>
								</div>
							</div>
							<p class="dep-info-note">
								A 10% holding deposit secures this timepiece exclusively for you for 7 days. The remaining balance is payable upon collection.
							</p>
						</div>

						<div class="so-section-head">
							<span class="so-section-eyebrow">Your Details</span>
							<div class="so-section-rule"></div>
						</div>

						<form class="so-form" onsubmit={submitDeposit} novalidate>

							<div class="so-field" class:so-field--error={depTouched.fullName && !depValid.fullName}>
								<label for="dep-name" class="so-label">Full Name <span class="so-req">*</span></label>
								<input id="dep-name" class="so-input" type="text" placeholder="e.g. James Whitmore" autocomplete="name" bind:value={depForm.fullName} onblur={() => (depTouched.fullName = true)} />
								{#if depTouched.fullName && !depValid.fullName}
									<p class="so-hint-err">Please enter your full name.</p>
								{/if}
							</div>

							<div class="so-row-2">
								<div class="so-field" class:so-field--error={depTouched.email && !depValid.email}>
									<label for="dep-email" class="so-label">Email <span class="so-req">*</span></label>
									<input id="dep-email" class="so-input" type="email" placeholder="email@example.com" autocomplete="email" bind:value={depForm.email} onblur={() => (depTouched.email = true)} />
									{#if depTouched.email && !depValid.email}
										<p class="so-hint-err">Please enter a valid email.</p>
									{/if}
								</div>
								<div class="so-field" class:so-field--error={depTouched.phone && !depValid.phone}>
									<label for="dep-phone" class="so-label">Phone <span class="so-req">*</span></label>
									<input id="dep-phone" class="so-input" type="tel" placeholder="+44 7700 000000" autocomplete="tel" bind:value={depForm.phone} onblur={() => (depTouched.phone = true)} />
									{#if depTouched.phone && !depValid.phone}
										<p class="so-hint-err">Please enter a valid phone number.</p>
									{/if}
								</div>
							</div>

							<div class="so-field">
								<label for="dep-notes" class="so-label">Additional Notes <span class="so-optional">Optional</span></label>
								<textarea id="dep-notes" class="so-textarea" rows="3" placeholder="Any questions or preferred contact times…" bind:value={depForm.notes}></textarea>
							</div>

							<p class="so-privacy">
								By submitting you agree to our <a href="/privacy-policy" class="so-privacy-link">Privacy Policy</a> and <a href="/deposit-policy" class="so-privacy-link">Deposit Policy</a>.
							</p>

							<label class="gdpr-check">
								<input type="checkbox" bind:checked={depGdprConsent} class="gdpr-check-input" />
								<span class="gdpr-check-box" aria-hidden="true"></span>
								<span class="gdpr-check-label">I am happy to receive updates and offers from Watch Reserve by email.</span>
							</label>

							<button type="submit" class="so-btn so-btn--primary">
								Continue
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M5 12h14M12 5l7 7-7 7"/>
								</svg>
							</button>

						</form>
					{/if}

					<!-- Step 2: KYC placeholder -->
					<div hidden={depStep !== 2}>
						<!-- Mini product summary -->
						<div class="dep-payment-header">
							<div class="dep-payment-summary-row">
								<span class="dep-payment-summary-label">Deposit for</span>
								<span class="dep-payment-summary-item">{productVendor} {productTitle}</span>
							</div>
							<div class="dep-payment-amount-row">
								<span class="dep-payment-amount-label">10% Deposit</span>
								<span class="dep-payment-amount-val">{#if depositAmount}{depositAmount}{:else}10% of price{/if}</span>
							</div>
							<p class="dep-payment-balance-note">
								Balance of {#if balanceAmount}{balanceAmount}{:else}90%{/if} payable upon collection or delivery.
							</p>
						</div>

						<div class="dep-kyc-block">
							<div class="dep-kyc-icon" aria-hidden="true">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
									<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
								</svg>
							</div>
							<div class="dep-kyc-copy">
								<p class="dep-kyc-heading">Identity Verification Required</p>
								<p class="dep-kyc-body">
									As a regulated luxury goods dealer, Watch Reserve is required to carry out a brief Know Your Customer check before processing your deposit. A member of our team will contact you immediately at <strong>{depForm.email}</strong> or on <strong>{depForm.phone}</strong> to facilitate this.
								</p>
							</div>
						</div>

						{#if depKycError}
							<p class="dep-payment-error">{depKycError}</p>
						{/if}

						<div class="dep-payment-actions">
							<button
								class="so-btn so-btn--primary"
								onclick={submitKycDeposit}
								disabled={depKycSubmitting}
								type="button"
							>
								{#if depKycSubmitting}
									<span class="so-spinner" aria-hidden="true"></span>
									Sending…
								{:else}
									Submit Request
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M5 12h14M12 5l7 7-7 7"/>
									</svg>
								{/if}
							</button>
							<button
								class="so-btn so-btn--ghost"
								onclick={() => (depStep = 1)}
								disabled={depKycSubmitting}
								type="button"
							>
								Back
							</button>
						</div>
					</div>

					<!-- Step 3: Success -->
					{#if depStep === 3}
						<div class="so-success-state">
							<div class="so-success-icon" aria-hidden="true">
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="20 6 9 17 4 12"/>
								</svg>
							</div>
							<h3 class="so-success-title">Request Received</h3>
							<p class="so-success-body">
								Thank you, {depForm.fullName}. A Watch Reserve specialist will contact you at <strong>{depForm.email}</strong> or on <strong>{depForm.phone}</strong> immediately to complete your identity verification and arrange your deposit payment.
							</p>
							<p class="so-success-body" style="margin-top: 8px; font-size: 13px;">
								Once your deposit of {#if depositAmount}{depositAmount}{:else}10%{/if} is confirmed, this timepiece will be reserved in your name for 7 days.
							</p>
							<button class="so-btn so-btn--outline so-btn--sm" onclick={onclose} type="button">
								Close
							</button>
						</div>
					{/if}

				</div>

			{/if}

		</div>
	</div>
{/if}

<style>
	/* ── Backdrop ── */
	.so-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(22, 11, 17, 0.55);
		backdrop-filter: blur(3px);
		z-index: 1002;
		cursor: pointer;
	}

	/* ── Panel ── */
	.so-panel {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: min(480px, 100vw);
		background-color: #ffffff;
		z-index: 1003;
		display: flex;
		flex-direction: column;
		box-shadow: -8px 0 48px rgba(22, 11, 17, 0.18);
		overflow: hidden;
	}

	/* ── Header ── */
	.so-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 22px 24px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.08);
		background-color: #faf8f5;
		flex-shrink: 0;
	}

	.so-header-left {
		display: flex;
		align-items: center;
		gap: 14px;
		min-width: 0;
	}

	.so-header-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background-color: rgba(161, 132, 109, 0.1);
		color: #a1846d;
		flex-shrink: 0;
	}

	.so-header-copy {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.so-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.0625rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.01em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.so-subtitle {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.725rem;
		font-weight: 400;
		color: rgba(22, 11, 17, 0.45);
		margin: 0;
		letter-spacing: 0.01em;
	}

	.so-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: none;
		border: 1px solid rgba(22, 11, 17, 0.12);
		color: rgba(22, 11, 17, 0.5);
		cursor: pointer;
		flex-shrink: 0;
		transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}

	.so-close:hover {
		background-color: #160b11;
		color: #ffffff;
		border-color: #160b11;
	}

	/* ── Body ── */
	.so-body {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 28px 24px 32px;
		scrollbar-width: thin;
		scrollbar-color: rgba(161, 132, 109, 0.3) transparent;
	}

	.so-body::-webkit-scrollbar { width: 4px; }
	.so-body::-webkit-scrollbar-track { background: transparent; }
	.so-body::-webkit-scrollbar-thumb { background-color: rgba(161, 132, 109, 0.3); border-radius: 2px; }

	/* ── Shared form primitives ── */
	.so-form {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.so-row-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.so-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.so-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #3a2e33;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.so-req { color: #a1846d; font-size: 0.75rem; }
	.so-optional { font-size: 0.6rem; font-weight: 500; letter-spacing: 0.06em; color: #aaa; text-transform: uppercase; }

	.so-input,
	.so-select,
	.so-textarea {
		width: 100%;
		box-sizing: border-box;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 11px 14px;
		outline: none;
		transition: border-color 0.2s ease, background-color 0.2s ease;
		-webkit-appearance: none;
		appearance: none;
	}

	.so-input::placeholder,
	.so-textarea::placeholder { color: #b8b0a8; font-size: 0.825rem; }

	.so-input:focus,
	.so-select:focus,
	.so-textarea:focus {
		border-color: rgba(22, 11, 17, 0.18);
		border-bottom-color: #a1846d;
		background-color: #fefcfb;
	}

	.so-field--error .so-input,
	.so-field--error .so-select { border-bottom-color: #c94040; background-color: #fff8f8; }

	.so-hint-err {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		color: #c94040;
		margin: 0;
	}

	.so-select-wrap { position: relative; }

	.so-select {
		padding-right: 36px;
		cursor: pointer;
	}

	.so-select-arrow {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #a1846d;
		pointer-events: none;
		display: flex;
	}

	.so-textarea {
		resize: vertical;
		min-height: 90px;
		line-height: 1.6;
		padding: 12px 14px;
	}

	/* Section head */
	.so-section-head {
		display: flex;
		align-items: center;
		gap: 14px;
		margin: 20px 0 16px;
	}

	.so-section-head:first-child { margin-top: 0; }

	.so-section-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.4);
		white-space: nowrap;
	}

	.so-section-rule {
		flex: 1;
		height: 1px;
		background-color: rgba(22, 11, 17, 0.08);
	}

	.so-divider {
		height: 1px;
		background-color: rgba(22, 11, 17, 0.08);
		margin: 4px 0;
	}

	/* Context pill */
	.so-context-pill {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 13px 16px;
		background-color: #f9f5f7;
		border-left: 3px solid #a1846d;
		margin-bottom: 24px;
	}

	.so-context-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.so-context-item {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 0.9rem;
		color: #160b11;
	}

	/* Privacy */
	.so-privacy {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		color: rgba(22, 11, 17, 0.42);
		line-height: 1.5;
		margin: 0;
		padding-top: 6px;
		border-top: 1px solid rgba(22, 11, 17, 0.06);
	}

	.so-privacy-link,
	.so-link {
		color: #a1846d;
		text-decoration: none;
		border-bottom: 1px solid rgba(161, 132, 109, 0.3);
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.so-privacy-link:hover,
	.so-link:hover { color: #8a6f59; border-color: #8a6f59; }

	/* Footer note */
	.so-footer-note {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding: 14px 16px;
		background-color: #faf8f5;
		border: 1px solid rgba(22, 11, 17, 0.08);
		margin-top: 8px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		color: rgba(22, 11, 17, 0.55);
		line-height: 1.5;
	}

	.so-footer-note svg { flex-shrink: 0; color: #a1846d; margin-top: 1px; }

	/* ── Buttons ── */
	.so-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		height: 50px;
		padding: 0 24px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
		border: none;
		cursor: pointer;
		transition: background-color 0.22s ease, color 0.22s ease, transform 0.2s ease, box-shadow 0.22s ease;
		white-space: nowrap;
	}

	.so-btn--primary {
		background-color: #a1846d;
		color: #ffffff;
		width: 100%;
	}

	.so-btn--primary:hover:not(:disabled) {
		background-color: #8a6f59;
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(161, 132, 109, 0.3);
	}

	.so-btn--primary:active:not(:disabled) { transform: translateY(0); }
	.so-btn--primary:disabled { background-color: #ccc; cursor: not-allowed; }

	.so-btn--ghost {
		background-color: transparent;
		color: #160b11;
		border: 1px solid rgba(22, 11, 17, 0.18);
		width: 100%;
	}

	.so-btn--ghost:hover {
		background-color: rgba(22, 11, 17, 0.04);
		border-color: rgba(22, 11, 17, 0.3);
	}

	.so-btn--outline {
		background-color: transparent;
		color: #a1846d;
		border: 1.5px solid #a1846d;
	}

	.so-btn--outline:hover {
		background-color: rgba(161, 132, 109, 0.06);
		transform: translateY(-1px);
	}

	.so-btn--sm { height: 40px; font-size: 0.75rem; padding: 0 20px; }

	/* Spinner */
	.so-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: so-spin 0.65s linear infinite;
		flex-shrink: 0;
	}

	@keyframes so-spin { to { transform: rotate(360deg); } }

	/* ── Success state ── */
	.so-success-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 16px;
		padding: 40px 24px;
	}

	.so-success-icon {
		width: 56px;
		height: 56px;
		background-color: #a1846d;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	.so-success-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.25rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
	}

	.so-success-body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: rgba(22, 11, 17, 0.6);
		line-height: 1.65;
		margin: 0;
		max-width: 320px;
	}

	/* ── CART PANEL ── */
	.cart-panel {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.cart-item-card {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		padding: 16px;
		border: 1px solid rgba(22, 11, 17, 0.08);
		background-color: #fafaf9;
		position: relative;
	}

	.cart-item-img {
		width: 80px;
		height: 80px;
		flex-shrink: 0;
		overflow: hidden;
		background-color: #f0ece9;
	}

	.cart-item-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.cart-item-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		flex: 1;
	}

	.cart-item-vendor {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.cart-item-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 0.9375rem;
		color: #160b11;
		margin: 0;
		line-height: 1.3;
	}

	.cart-item-variant {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		color: rgba(22, 11, 17, 0.5);
		margin: 0;
	}

	.cart-item-price {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #160b11;
		margin: 0;
		margin-top: 4px;
	}

	.cart-item-check {
		flex-shrink: 0;
		width: 26px;
		height: 26px;
		background-color: #22a05a;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	.cart-summary {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 14px 16px;
		background-color: #faf8f5;
		border: 1px solid rgba(22, 11, 17, 0.07);
	}

	.cart-summary-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
	}

	.cart-summary-row--note {
		font-size: 0.72rem;
		color: rgba(22, 11, 17, 0.45);
		justify-content: flex-start;
	}

	.cart-summary-amount {
		font-weight: 600;
	}

	.cart-trust {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		padding: 14px 0;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
	}

	.cart-trust-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 500;
		color: rgba(22, 11, 17, 0.55);
	}

	.cart-trust-item svg { color: #a1846d; flex-shrink: 0; }

	.cart-actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.cart-also-interest {
		padding-top: 4px;
	}

	.cart-also-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.35);
		margin: 0 0 10px;
	}

	.cart-also-links {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.cart-also-link {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		background: none;
		border: 1px solid rgba(22, 11, 17, 0.12);
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: rgba(22, 11, 17, 0.6);
		cursor: pointer;
		text-decoration: none;
		transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
	}

	.cart-also-link svg { color: #a1846d; }

	.cart-also-link:hover {
		border-color: #a1846d;
		color: #a1846d;
		background-color: rgba(161, 132, 109, 0.04);
	}

	/* ── PART EXCHANGE PANEL ── */
	.px-panel {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	/* ── DEPOSIT PANEL ── */
	.dep-panel,
	.fin-panel {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.dep-product-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px;
		border: 1px solid rgba(22, 11, 17, 0.08);
		background-color: #fafaf9;
		margin-bottom: 22px;
	}

	.dep-product-img {
		width: 64px;
		height: 64px;
		object-fit: cover;
		flex-shrink: 0;
		display: block;
	}

	.dep-product-details {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.dep-product-vendor {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.dep-product-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 0.9rem;
		color: #160b11;
		margin: 0;
		line-height: 1.3;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 260px;
	}

	.dep-product-price {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9rem;
		font-weight: 600;
		color: #160b11;
		margin: 0;
		margin-top: 2px;
	}

	.dep-info-block {
		margin-bottom: 22px;
	}

	.dep-info-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-bottom: 14px;
	}

	.dep-info-item {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 14px;
		background-color: #f9f5f7;
		border: 1px solid rgba(161, 132, 109, 0.15);
	}

	.dep-info-item svg {
		color: #a1846d;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.dep-info-item > div {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.dep-info-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.4);
	}

	.dep-info-value {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		font-weight: 600;
		color: #160b11;
	}

	.dep-info-note {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		color: rgba(22, 11, 17, 0.55);
		line-height: 1.6;
		margin: 0;
		padding: 12px 14px;
		background-color: #faf8f5;
		border-left: 3px solid rgba(161, 132, 109, 0.4);
	}

	/* Deposit breakdown */
	.dep-breakdown {
		background: #f9f5f2;
		border: 1px solid rgba(161, 132, 109, 0.2);
		padding: 16px 18px;
		margin-bottom: 18px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.dep-breakdown-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		color: rgba(22, 11, 17, 0.65);
	}

	.dep-breakdown-row--deposit {
		color: #160b11;
		font-size: 0.875rem;
	}

	.dep-breakdown-row--balance {
		color: rgba(22, 11, 17, 0.55);
		font-size: 0.8rem;
	}

	.dep-breakdown-label { line-height: 1.4; }

	.dep-breakdown-val {
		font-weight: 600;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.dep-breakdown-val--accent {
		color: #a1846d;
		font-size: 1rem;
	}

	.dep-breakdown-rule {
		height: 1px;
		background: rgba(161, 132, 109, 0.2);
		margin: 2px 0;
	}


	.so-error-msg {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		color: #8b2635;
		background-color: #fff5f5;
		border: 1px solid rgba(139, 38, 53, 0.18);
		border-left: 3px solid #c94040;
		padding: 10px 14px;
		margin: 0;
		line-height: 1.5;
	}

	/* ── GDPR consent checkbox ── */
	.gdpr-check {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		cursor: pointer;
		user-select: none;
	}

	.gdpr-check-input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	.gdpr-check-box {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
		border: 1.5px solid #d8d0c8;
		background-color: #ffffff;
		position: relative;
		margin-top: 1px;
		transition: border-color 0.2s ease, background-color 0.2s ease;
	}

	.gdpr-check:hover .gdpr-check-box {
		border-color: #a1846d;
	}

	.gdpr-check-input:checked + .gdpr-check-box {
		background-color: #a1846d;
		border-color: #a1846d;
	}

	.gdpr-check-input:checked + .gdpr-check-box::after {
		content: '';
		position: absolute;
		left: 4px;
		top: 1px;
		width: 5px;
		height: 9px;
		border: 2px solid #ffffff;
		border-top: none;
		border-left: none;
		transform: rotate(45deg);
	}

	.gdpr-check-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		color: rgba(22, 11, 17, 0.45);
		line-height: 1.55;
	}

	/* ── Responsive ── */
	@media (max-width: 520px) {
		.so-panel { width: 100vw; }

		.so-header { padding: 18px 18px; }
		.so-body { padding: 22px 18px 28px; }

		.so-row-2 { grid-template-columns: 1fr; }

		.dep-info-row { grid-template-columns: 1fr; }

		.cart-trust { gap: 12px; }
		.cart-trust-item { font-size: 0.68rem; }

		.cart-also-links { flex-direction: column; }
		.cart-also-link { justify-content: center; }

	}

	@media (max-width: 380px) {
		.so-title { font-size: 0.9375rem; }
	}

	/* Deposit KYC step */
	.dep-kyc-block {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 18px;
		border: 1px solid rgba(161, 132, 109, 0.2);
		background: #faf7f2;
		margin-bottom: 20px;
	}

	.dep-kyc-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: rgba(161, 132, 109, 0.12);
		color: #a1846d;
		flex-shrink: 0;
	}

	.dep-kyc-copy {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.dep-kyc-heading {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #160b11;
		margin: 0;
	}

	.dep-kyc-body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.825rem;
		line-height: 1.65;
		color: rgba(22, 11, 17, 0.6);
		margin: 0;
	}

	/* Deposit payment step */
	.dep-payment-header {
		background: #f9f5f2;
		border: 1px solid rgba(161, 132, 109, 0.2);
		padding: 16px 18px;
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.dep-payment-summary-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}

	.dep-payment-summary-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(22, 11, 17, 0.5);
		white-space: nowrap;
	}

	.dep-payment-summary-item {
		font-family: 'Montserrat', sans-serif;
		font-size: 12px;
		font-weight: 600;
		color: #160b11;
		text-align: right;
	}

	.dep-payment-amount-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		padding-top: 8px;
		border-top: 1px solid rgba(161, 132, 109, 0.2);
	}

	.dep-payment-amount-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 12px;
		font-weight: 600;
		color: #160b11;
	}

	.dep-payment-amount-val {
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 20px;
		font-weight: 400;
		color: #a1846d;
	}

	.dep-payment-balance-note {
		font-family: 'Montserrat', sans-serif;
		font-size: 11px;
		color: rgba(22, 11, 17, 0.5);
		margin: 0;
		line-height: 1.5;
	}

	.dep-stripe-loading {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 16px 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 13px;
		color: rgba(22, 11, 17, 0.5);
	}

	.dep-stripe-element {
		min-height: 40px;
		margin-bottom: 16px;
	}

	.dep-payment-error {
		font-family: 'Montserrat', sans-serif;
		font-size: 13px;
		color: #b04040;
		margin: 0 0 14px;
		padding: 10px 14px;
		background: #fdf2f2;
		border-left: 3px solid #b04040;
	}

	.dep-payment-actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 16px;
	}

	.dep-secure-note {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: 'Montserrat', sans-serif;
		font-size: 11px;
		color: rgba(22, 11, 17, 0.45);
		margin-bottom: 8px;
	}
</style>
