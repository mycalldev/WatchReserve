<script>
	import { onMount, tick } from 'svelte';
	import { enhance } from '$app/forms';
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
	import { cart as cartStore } from '$lib/stores/cart.svelte.js';
	import { trackEvent } from '$lib/ga.js';

	let { data } = $props();

	const STORAGE_KEY = 'wr_customer';

	const COUNTRY_CODES = {
		'United Kingdom': 'GB',
		Ireland: 'IE',
		France: 'FR',
		Germany: 'DE',
		Italy: 'IT',
		Spain: 'ES',
		Switzerland: 'CH',
		'United States': 'US',
		'United Arab Emirates': 'AE'
	};

	let step = $state(1);
	let returningCustomer = $state(false);
	let gdprConsent = $state(false);

	let contact = $state({
		firstName: '',
		lastName: '',
		email: ''
	});

	let shipping = $state({
		address1: '',
		address2: '',
		city: '',
		postcode: '',
		country: 'United Kingdom',
		phone: ''
	});

	let billingSameAsShipping = $state(true);
	let billing = $state({
		address1: '',
		address2: '',
		city: '',
		postcode: '',
		country: 'United Kingdom'
	});

	let errors = $state({});
	let placing = $state(false);
	let orderComplete = $state(false);
	let kycSubmitting = $state(false);
	let kycError = $state('');

	// Stripe state
	let stripe = $state(null);
	let elements = $state(null);
	let paymentElementInstance = null;
	let clientSecret = $state('');
	let stripeLoading = $state(false);
	let paymentMessage = $state('');

	async function initializeStripePayment() {
		if (clientSecret || stripeLoading) return;
		stripeLoading = true;
		paymentMessage = '';

		try {
			const [stripeInstance, res] = await Promise.all([
				loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY),
				fetch('/api/create-payment-intent', { method: 'POST' })
			]);

			if (!stripeInstance) throw new Error('Could not load Stripe.');
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body?.message || 'Could not initialise payment.');
			}

			const payload = await res.json();

			stripe = stripeInstance;
			clientSecret = payload.clientSecret;
			verifiedTotal = Number(payload.amount);

			elements = stripe.elements({
				clientSecret,
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
						'.Input': {
							border: '1px solid #e1dbd2',
							padding: '14px 16px',
							boxShadow: 'none'
						},
						'.Input:focus': {
							border: '1px solid #a1846d',
							boxShadow: 'none'
						},
						'.Label': {
							fontSize: '12px',
							textTransform: 'uppercase',
							letterSpacing: '1.4px',
							color: '#6a5f58',
							fontWeight: '500'
						}
					}
				}
			});

			paymentElementInstance = elements.create('payment', { layout: 'tabs', terms: { card: 'never' } });

			await tick();
			paymentElementInstance.mount('#stripe-payment-element');
		} catch (e) {
			paymentMessage = e?.message || 'Failed to load payment form.';
		} finally {
			stripeLoading = false;
		}
	}

	onMount(async () => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed.firstName) {
					contact.firstName = parsed.firstName;
					returningCustomer = true;
				}
				if (parsed.lastName) contact.lastName = parsed.lastName;
				if (parsed.email) contact.email = parsed.email;
			}
		} catch {
			/* ignore storage errors */
		}

		// Handle 3DS redirect return
		const url = new URL(window.location.href);
		const returnedSecret = url.searchParams.get('payment_intent_client_secret');
		if (returnedSecret) {
			try {
				const stripeInstance = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);
				const result = await stripeInstance.retrievePaymentIntent(returnedSecret);
				const pi = result?.paymentIntent;
				if (pi?.status === 'succeeded') {
					orderComplete = true;
					trackEvent('purchase', {
						transaction_id: pi.id,
						value: pi.amount ? pi.amount / 100 : displayTotal,
						currency: pi.currency ? pi.currency.toUpperCase() : currency
					});
				} else if (pi?.status === 'processing') {
					paymentMessage = 'Your payment is processing. We will confirm shortly.';
				} else {
					paymentMessage = 'Your payment was not completed. Please try again.';
				}
			} catch {
				paymentMessage = 'Could not verify payment status.';
			}

			url.searchParams.delete('payment_intent');
			url.searchParams.delete('payment_intent_client_secret');
			url.searchParams.delete('redirect_status');
			window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
		}
	});

	// Stripe initialisation deferred — KYC step active at step 3

	async function submitKycCheckout() {
		if (kycSubmitting) return;
		kycSubmitting = true;
		kycError = '';

		try {
			const res = await fetch('/api/kyc-checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName: contact.firstName.trim(),
					lastName: contact.lastName.trim(),
					email: contact.email.trim(),
					phone: shipping.phone.trim(),
					address1: shipping.address1.trim(),
					address2: shipping.address2?.trim() || '',
					city: shipping.city.trim(),
					postcode: shipping.postcode.trim(),
					country: shipping.country,
					gdprConsent
				})
			});

			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data.success) throw new Error(data.error ?? 'Request failed.');

			orderComplete = true;
			trackEvent('form_submit', { form_name: 'kyc_checkout' });
			trackEvent('purchase', {
				transaction_id: `kyc-${Date.now()}`,
				value: displayTotal,
				currency
			});
		} catch (err) {
			kycError = err?.message || 'Something went wrong. Please try again.';
		} finally {
			kycSubmitting = false;
		}
	}

	function persistCustomer() {
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					firstName: contact.firstName.trim(),
					lastName: contact.lastName.trim(),
					email: contact.email.trim()
				})
			);
		} catch {
			/* ignore storage errors */
		}
	}

	function validateContact() {
		const e = {};
		if (!contact.firstName.trim()) e.firstName = 'Please enter your first name.';
		if (!contact.lastName.trim()) e.lastName = 'Please enter your last name.';
		if (!contact.email.trim()) {
			e.email = 'Please enter your email.';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
			e.email = 'Please enter a valid email address.';
		}
		errors = e;
		return Object.keys(e).length === 0;
	}

	function validateShipping() {
		const e = {};
		if (!shipping.address1.trim()) e.address1 = 'Please enter your address.';
		if (!shipping.city.trim()) e.city = 'Please enter your city.';
		if (!shipping.postcode.trim()) e.postcode = 'Please enter your postcode.';
		if (!shipping.country.trim()) e.country = 'Please select a country.';
		if (!shipping.phone.trim()) e.phone = 'Please enter your phone number.';
		if (!billingSameAsShipping) {
			if (!billing.address1.trim()) e.billingAddress1 = 'Please enter your billing address.';
			if (!billing.city.trim()) e.billingCity = 'Please enter your billing city.';
			if (!billing.postcode.trim()) e.billingPostcode = 'Please enter your billing postcode.';
			if (!billing.country.trim()) e.billingCountry = 'Please select a billing country.';
		}
		errors = e;
		return Object.keys(e).length === 0;
	}

	function goToStep(target) {
		if (target <= step) {
			step = target;
			errors = {};
			return;
		}
		if (step === 1 && !validateContact()) return;
		if (step === 2 && !validateShipping()) return;
		if (step === 1) persistCustomer();
		step = target;
		errors = {};
	}

	function nextStep() {
		goToStep(step + 1);
	}

	function prevStep() {
		if (step > 1) {
			step -= 1;
			errors = {};
		}
	}

	async function placeOrder() {
		if (!stripe || !elements || !clientSecret) {
			paymentMessage = 'Payment form is not ready yet. Please return to the payment step.';
			return;
		}

		placing = true;
		paymentMessage = '';

		const shippingCountryCode = COUNTRY_CODES[shipping.country] || 'GB';
		const effectiveBilling = billingSameAsShipping ? shipping : billing;
		const billingCountryCode = COUNTRY_CODES[effectiveBilling.country] || 'GB';
		const fullName = `${contact.firstName} ${contact.lastName}`.trim();

		const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/checkout`,
				receipt_email: contact.email.trim() || undefined,
				shipping: {
					name: fullName || undefined,
					phone: shipping.phone.trim() || undefined,
					address: {
						line1: shipping.address1.trim(),
						line2: shipping.address2?.trim() || undefined,
						city: shipping.city.trim(),
						postal_code: shipping.postcode.trim(),
						country: shippingCountryCode
					}
				},
				payment_method_data: {
					billing_details: {
						name: fullName || undefined,
						email: contact.email.trim() || undefined,
						phone: shipping.phone.trim() || undefined,
						address: {
							line1: effectiveBilling.address1.trim(),
							line2: effectiveBilling.address2?.trim() || undefined,
							city: effectiveBilling.city.trim(),
							postal_code: effectiveBilling.postcode.trim(),
							country: billingCountryCode
						}
					}
				}
			},
			redirect: 'if_required'
		});

		if (confirmError) {
			paymentMessage = confirmError.message || 'Payment could not be completed.';
			placing = false;
			return;
		}

		if (paymentIntent?.status === 'succeeded') {
			orderComplete = true;
			trackEvent('purchase', {
				transaction_id: paymentIntent.id,
				value: displayTotal,
				currency
			});
		} else if (paymentIntent?.status === 'processing') {
			paymentMessage = 'Your payment is processing. We will confirm shortly.';
		} else {
			paymentMessage = 'Payment did not complete. Please try again.';
		}

		placing = false;
	}

	const cart = $derived(data.cart);
	const hasItems = $derived(Boolean(cart && cart.lines && cart.lines.length > 0));

	const subtotal = $derived(cart?.subtotal?.amount ? Number(cart.subtotal.amount) : 0);
	const tax = $derived(cart?.tax?.amount ? Number(cart.tax.amount) : 0);
	const total = $derived(cart?.total?.amount ? Number(cart.total.amount) : 0);
	const currency = $derived(cart?.total?.currencyCode || 'GBP');

	// Server-verified total from PaymentIntent — set once /api/create-payment-intent responds
	let verifiedTotal = $state(null);
	const displayTotal = $derived(verifiedTotal ?? total);
	const priceChanged = $derived(verifiedTotal !== null && Math.abs(verifiedTotal - total) >= 0.01);

	function formatMoney(amount, code = currency) {
		try {
			return new Intl.NumberFormat('en-GB', {
				style: 'currency',
				currency: code,
				minimumFractionDigits: 2
			}).format(amount);
		} catch {
			return `${code} ${amount.toFixed(2)}`;
		}
	}

	const greetingName = $derived(contact.firstName.trim() || '');
</script>

<svelte:head>
	<title>Checkout | Watch Reserve</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="checkout-page">
	<div class="checkout-container">
		<header class="checkout-header">
			<a href="/" class="checkout-wordmark">Watch Reserve</a>
			<p class="checkout-tagline">Secure Checkout</p>
		</header>

		{#if !hasItems}
			<div class="empty-state">
				<h1 class="empty-title">Your cart is empty</h1>
				<p class="empty-body">
					Browse our curated selection of pre-owned timepieces and add a watch to your cart to begin
					checkout.
				</p>
				<a href="/shop" class="empty-cta">Explore Timepieces</a>
			</div>
		{:else if orderComplete}
			<div class="complete-state">
				<div class="complete-icon" aria-hidden="true">
					<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20 6 9 17l-5-5" />
					</svg>
				</div>
				<h1 class="complete-title">
					Thank you{greetingName ? `, ${greetingName}` : ''}.
				</h1>
				<p class="complete-body">
					Your enquiry has been received. A member of our team will be in touch at
					<strong>{contact.email}</strong>{#if shipping.phone} or on <strong>{shipping.phone}</strong>{/if} shortly to complete your verification and arrange secure payment.
				</p>
				<a href="/shop" class="empty-cta">Continue Browsing</a>
			</div>
		{:else}
			<div class="checkout-layout">
				<div class="checkout-main">
					<ol class="steps" aria-label="Checkout progress">
						<li class="step" class:active={step === 1} class:done={step > 1}>
							<button type="button" class="step-button" onclick={() => goToStep(1)}>
								<span class="step-number">1</span>
								<span class="step-label">Contact</span>
							</button>
						</li>
						<li class="step" class:active={step === 2} class:done={step > 2}>
							<button type="button" class="step-button" onclick={() => goToStep(2)}>
								<span class="step-number">2</span>
								<span class="step-label">Shipping</span>
							</button>
						</li>
						<li class="step" class:active={step === 3}>
							<button type="button" class="step-button" onclick={() => goToStep(3)}>
								<span class="step-number">3</span>
								<span class="step-label">Next Steps</span>
							</button>
						</li>
					</ol>

					<div class="step-panel" hidden={step !== 1}>
						<h2 class="panel-title">
							{#if returningCustomer && contact.firstName}
								Welcome back, {contact.firstName}.
							{:else}
								Your details
							{/if}
						</h2>
						<p class="panel-intro">
							We'll use your details to send order updates and confirmations.
						</p>

						<div class="field-row">
							<label class="field">
								<span class="field-label">First Name</span>
								<input
									type="text"
									bind:value={contact.firstName}
									autocomplete="given-name"
									class:error={errors.firstName}
								/>
								{#if errors.firstName}<span class="field-error">{errors.firstName}</span>{/if}
							</label>
							<label class="field">
								<span class="field-label">Last Name</span>
								<input
									type="text"
									bind:value={contact.lastName}
									autocomplete="family-name"
									class:error={errors.lastName}
								/>
								{#if errors.lastName}<span class="field-error">{errors.lastName}</span>{/if}
							</label>
						</div>

						<label class="field">
							<span class="field-label">Email Address</span>
							<input
								type="email"
								placeholder="email@example.com"
								bind:value={contact.email}
								autocomplete="email"
								class:error={errors.email}
							/>
							{#if errors.email}<span class="field-error">{errors.email}</span>{/if}
						</label>

						<label class="gdpr-check">
							<input type="checkbox" bind:checked={gdprConsent} class="gdpr-check-input" />
							<span class="gdpr-check-box" aria-hidden="true"></span>
							<span class="gdpr-check-label">I am happy to receive updates and offers from Watch Reserve by email.</span>
						</label>

						<div class="step-actions">
							<button type="button" class="btn btn-primary" onclick={nextStep}>
								Continue to Shipping
							</button>
						</div>
					</div>

					<div class="step-panel" hidden={step !== 2}>
						<h2 class="panel-title">Shipping address</h2>
						<p class="panel-intro">
							All orders are delivered fully insured and require a signature upon receipt.
						</p>

						<label class="field">
							<span class="field-label">Address Line 1</span>
							<input
								type="text"
								bind:value={shipping.address1}
								autocomplete="address-line1"
								class:error={errors.address1}
							/>
							{#if errors.address1}<span class="field-error">{errors.address1}</span>{/if}
						</label>

						<label class="field">
							<span class="field-label">Address Line 2 <em>(optional)</em></span>
							<input type="text" bind:value={shipping.address2} autocomplete="address-line2" />
						</label>

						<div class="field-row">
							<label class="field">
								<span class="field-label">City</span>
								<input
									type="text"
									bind:value={shipping.city}
									autocomplete="address-level2"
									class:error={errors.city}
								/>
								{#if errors.city}<span class="field-error">{errors.city}</span>{/if}
							</label>
							<label class="field">
								<span class="field-label">Postcode</span>
								<input
									type="text"
									bind:value={shipping.postcode}
									autocomplete="postal-code"
									class:error={errors.postcode}
								/>
								{#if errors.postcode}<span class="field-error">{errors.postcode}</span>{/if}
							</label>
						</div>

						<div class="field-row">
							<label class="field">
								<span class="field-label">Country</span>
								<select bind:value={shipping.country} class:error={errors.country}>
									<option>United Kingdom</option>
									<option>Ireland</option>
									<option>France</option>
									<option>Germany</option>
									<option>Italy</option>
									<option>Spain</option>
									<option>Switzerland</option>
									<option>United States</option>
									<option>United Arab Emirates</option>
								</select>
							</label>
							<label class="field">
								<span class="field-label">Phone Number</span>
								<input
									type="tel"
									bind:value={shipping.phone}
									autocomplete="tel"
									class:error={errors.phone}
								/>
								{#if errors.phone}<span class="field-error">{errors.phone}</span>{/if}
							</label>
						</div>

						<div class="billing-section">
							<h3 class="billing-title">Billing address</h3>
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:checked={billingSameAsShipping}
									class="checkbox-input"
								/>
								<span class="checkbox-text">Same as shipping address</span>
							</label>

							{#if !billingSameAsShipping}
								<div class="billing-fields">
									<label class="field">
										<span class="field-label">Address Line 1</span>
										<input
											type="text"
											bind:value={billing.address1}
											autocomplete="billing address-line1"
											class:error={errors.billingAddress1}
										/>
										{#if errors.billingAddress1}<span class="field-error">{errors.billingAddress1}</span>{/if}
									</label>

									<label class="field">
										<span class="field-label">Address Line 2 <em>(optional)</em></span>
										<input type="text" bind:value={billing.address2} autocomplete="billing address-line2" />
									</label>

									<div class="field-row">
										<label class="field">
											<span class="field-label">City</span>
											<input
												type="text"
												bind:value={billing.city}
												autocomplete="billing address-level2"
												class:error={errors.billingCity}
											/>
											{#if errors.billingCity}<span class="field-error">{errors.billingCity}</span>{/if}
										</label>
										<label class="field">
											<span class="field-label">Postcode</span>
											<input
												type="text"
												bind:value={billing.postcode}
												autocomplete="billing postal-code"
												class:error={errors.billingPostcode}
											/>
											{#if errors.billingPostcode}<span class="field-error">{errors.billingPostcode}</span>{/if}
										</label>
									</div>

									<label class="field">
										<span class="field-label">Country</span>
										<select bind:value={billing.country} class:error={errors.billingCountry}>
											<option>United Kingdom</option>
											<option>Ireland</option>
											<option>France</option>
											<option>Germany</option>
											<option>Italy</option>
											<option>Spain</option>
											<option>Switzerland</option>
											<option>United States</option>
											<option>United Arab Emirates</option>
										</select>
										{#if errors.billingCountry}<span class="field-error">{errors.billingCountry}</span>{/if}
									</label>
								</div>
							{/if}
						</div>

						<div class="step-actions">
							<button type="button" class="btn btn-ghost" onclick={prevStep}>Back</button>
							<button type="button" class="btn btn-primary" onclick={nextStep}>
								Continue to Next Steps
							</button>
						</div>
					</div>

					<div class="step-panel" hidden={step !== 3}>
						<h2 class="panel-title">
							{#if greetingName}
								Almost there, {greetingName}.
							{:else}
								Next Steps
							{/if}
						</h2>
						<p class="panel-intro">
							Before we can process your payment, Watch Reserve requires a brief identity verification in line with our Know Your Customer obligations. A member of our team will contact you immediately by phone or email to facilitate this and arrange secure payment.
						</p>

						<div class="kyc-block">
							<div class="kyc-icon" aria-hidden="true">
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
									<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
								</svg>
							</div>
							<div class="kyc-copy">
								<p class="kyc-heading">Identity Verification Required</p>
								<p class="kyc-body">
									We'll reach out to you at <strong>{contact.email}</strong>{#if shipping.phone} or on <strong>{shipping.phone}</strong>{/if} to complete verification. This is a standard step for all Watch Reserve transactions.
								</p>
							</div>
						</div>

						{#if kycError}
							<p class="payment-message">{kycError}</p>
						{/if}

						<div class="step-actions">
							<button type="button" class="btn btn-ghost" onclick={prevStep} disabled={kycSubmitting}>Back</button>
							<button type="button" class="btn btn-primary" onclick={submitKycCheckout} disabled={kycSubmitting}>
								{#if kycSubmitting}
									Sending…
								{:else}
									Submit Request
								{/if}
							</button>
						</div>
					</div>
				</div>

				<aside class="checkout-summary" aria-label="Order summary">
					<h2 class="summary-title">Order Summary</h2>

					<ul class="summary-lines">
						{#each cart.lines as line (line.id)}
							<li class="summary-line">
								{#if line.image?.url}
									<div class="summary-image">
										<img src={line.image.url} alt={line.image.altText || line.productTitle} />
									</div>
								{/if}
								<div class="summary-detail">
									<p class="summary-vendor">{line.vendor}</p>
									<p class="summary-name">{line.productTitle}</p>
									{#if line.variantTitle && line.variantTitle !== 'Default Title'}
										<p class="summary-variant">{line.variantTitle}</p>
									{/if}
								</div>
								<div class="summary-line-end">
									<span class="summary-price">
										{formatMoney(Number(line.price?.amount || 0) * line.quantity, line.price?.currencyCode)}
									</span>
									<form method="POST" action="?/remove" use:enhance={() => async ({ result, update }) => {
										if (result.type === 'success') {
											cartStore.set(Math.max(0, cartStore.count - 1));
										}
										await update();
									}}>
										<input type="hidden" name="lineId" value={line.id} />
										<button type="submit" class="summary-remove" aria-label="Remove {line.productTitle}">
											<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
												<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
											</svg>
										</button>
									</form>
								</div>
							</li>
						{/each}
					</ul>

					<dl class="summary-totals">
						<div class="summary-row">
							<dt>Subtotal</dt>
							<dd>{formatMoney(subtotal)}</dd>
						</div>
						<div class="summary-row">
							<dt>Shipping</dt>
							<dd>Included</dd>
						</div>
						{#if tax > 0}
							<div class="summary-row">
								<dt>Tax</dt>
								<dd>{formatMoney(tax)}</dd>
							</div>
						{/if}
						<div class="summary-row summary-row-total" class:price-updated={priceChanged}>
							<dt>Total {#if priceChanged}<span class="price-updated-label">Updated</span>{/if}</dt>
							<dd>{formatMoney(displayTotal)}</dd>
						</div>
					</dl>

					<div class="summary-trust">
						<p>Fully insured worldwide delivery</p>
						<p>Authenticated by specialists</p>
						<p>14-day return guarantee</p>
					</div>
				</aside>
			</div>
		{/if}
	</div>
</section>

<style>
	.checkout-page {
		width: 100%;
		background-color: #f7f5f2;
		padding: 80px 40px 120px;
		min-height: calc(100vh - 200px);
		box-sizing: border-box;
		font-family: 'Montserrat', sans-serif;
		color: #160b11;
	}

	.checkout-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.checkout-header {
		text-align: center;
		margin-bottom: 48px;
	}

	.checkout-wordmark {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.75rem;
		color: #160b11;
		text-decoration: none;
		letter-spacing: 0.02em;
	}

	.checkout-tagline {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 6px 0 0;
	}

	.checkout-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
		gap: 56px;
		align-items: start;
	}

	.checkout-main {
		background: #ffffff;
		padding: 48px 48px 56px;
		border: 1px solid #ece7df;
	}

	.steps {
		display: flex;
		gap: 8px;
		list-style: none;
		padding: 0;
		margin: 0 0 40px;
		border-bottom: 1px solid #ece7df;
		padding-bottom: 24px;
	}

	.step {
		flex: 1;
	}

	.step-button {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 10px;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: #b7ada0;
		font-family: inherit;
		text-align: left;
	}

	.step.active .step-button,
	.step.done .step-button {
		color: #160b11;
	}

	.step-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 1px solid currentColor;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.step.active .step-number {
		background: #160b11;
		color: #ffffff;
		border-color: #160b11;
	}

	.step.done .step-number {
		background: #a1846d;
		color: #ffffff;
		border-color: #a1846d;
	}

	.step-label {
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.panel-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 2.6vw, 2.25rem);
		font-weight: 400;
		margin: 0 0 8px;
		color: #160b11;
		letter-spacing: -0.01em;
	}

	.panel-intro {
		font-size: 0.95rem;
		line-height: 1.6;
		color: #6a5f58;
		margin: 0 0 32px;
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 20px;
	}

	.field-label {
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #6a5f58;
		font-weight: 500;
	}

	.field-label em {
		font-style: italic;
		text-transform: none;
		letter-spacing: 0;
		color: #a89d94;
	}

	.field input,
	.field select {
		font-family: 'Montserrat', sans-serif;
		font-size: 1rem;
		padding: 14px 16px;
		border: 1px solid #e1dbd2;
		background: #ffffff;
		color: #160b11;
		transition: border-color 0.2s ease;
		border-radius: 0;
	}

	.field input:focus,
	.field select:focus {
		outline: none;
		border-color: #a1846d;
	}

	.field input.error,
	.field select.error {
		border-color: #b04040;
	}

	.field-error {
		font-size: 0.8rem;
		color: #b04040;
	}

	.billing-section {
		margin-top: 36px;
		padding-top: 28px;
		border-top: 1px solid #ece7df;
	}

	.billing-title {
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #6a5f58;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		margin-bottom: 0;
	}

	.checkbox-input {
		width: 16px;
		height: 16px;
		accent-color: #a1846d;
		cursor: pointer;
		flex-shrink: 0;
	}

	.checkbox-text {
		font-size: 0.875rem;
		color: #160b11;
	}

	.billing-fields {
		margin-top: 24px;
	}

	.step-actions {
		display: flex;
		gap: 16px;
		margin-top: 32px;
		justify-content: flex-end;
		flex-wrap: wrap;
	}

	.btn {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 16px 32px;
		border: 1px solid #160b11;
		background: #160b11;
		color: #ffffff;
		cursor: pointer;
		transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
		display: inline-flex;
		align-items: center;
		gap: 12px;
	}

	.btn:hover:not(:disabled) {
		background: #a1846d;
		border-color: #a1846d;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-ghost {
		background: transparent;
		color: #160b11;
	}

	.btn-ghost:hover:not(:disabled) {
		background: #160b11;
		color: #ffffff;
		border-color: #160b11;
	}

	.btn-large {
		padding: 20px 36px;
		font-size: 0.9rem;
	}

	.btn-amount {
		font-weight: 600;
	}

	.stripe-mount {
		min-height: 8px;
	}

	.stripe-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 40px 24px;
		color: #6a5f58;
		font-size: 0.85rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		border: 1px solid #ece7df;
		background: #faf7f2;
	}

	.stripe-spinner {
		width: 24px;
		height: 24px;
		border: 2px solid #ece7df;
		border-top-color: #a1846d;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.payment-message {
		margin: 16px 0 0;
		padding: 14px 18px;
		background: #fdf3f3;
		border: 1px solid #e5c5c5;
		color: #8a3030;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.price-changed-notice {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 14px 18px;
		background: #fffbeb;
		border: 1px solid #d97706;
		color: #92400e;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		line-height: 1.5;
		margin-bottom: 4px;
	}

	.price-changed-notice svg {
		flex-shrink: 0;
		margin-top: 2px;
		color: #d97706;
	}

	.summary-row-total.price-updated dd {
		color: #d97706;
	}

	.price-updated-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #d97706;
		margin-left: 6px;
	}

	.trust-row {
		display: flex;
		gap: 24px;
		margin-top: 20px;
		flex-wrap: wrap;
	}

	.trust-item {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #6a5f58;
	}

	.review-grid {
		display: grid;
		gap: 16px;
	}

	.review-card {
		border: 1px solid #ece7df;
		padding: 20px 24px;
	}

	.review-card-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.review-card-label {
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #a1846d;
		font-weight: 500;
	}

	.review-edit {
		background: none;
		border: none;
		font-family: inherit;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #160b11;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.review-line {
		margin: 2px 0;
		font-size: 0.95rem;
		color: #160b11;
	}

	.review-line.muted {
		color: #6a5f58;
	}

	/* Summary */
	.checkout-summary {
		background: #ffffff;
		padding: 40px 36px;
		border: 1px solid #ece7df;
		position: sticky;
		top: 40px;
	}

	.summary-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.4rem;
		font-weight: 400;
		margin: 0 0 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid #ece7df;
		color: #160b11;
	}

	.summary-lines {
		list-style: none;
		padding: 0;
		margin: 0 0 24px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.summary-line {
		display: grid;
		grid-template-columns: 72px 1fr auto;
		gap: 16px;
		align-items: center;
	}

	.summary-image {
		position: relative;
		width: 72px;
		height: 72px;
		background: #faf7f2;
		overflow: visible;
	}

	.summary-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

.summary-vendor {
		margin: 0 0 2px;
		font-size: 0.68rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.summary-name {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 500;
		line-height: 1.3;
		color: #160b11;
	}

	.summary-variant {
		margin: 2px 0 0;
		font-size: 0.78rem;
		color: #6a5f58;
	}

	.summary-line-end {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}

	.summary-price {
		font-size: 0.9rem;
		font-weight: 500;
		color: #160b11;
	}

	.summary-remove {
		background: none;
		border: none;
		padding: 2px;
		cursor: pointer;
		color: #a89f97;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.summary-remove:hover {
		color: #160b11;
	}

	.summary-totals {
		margin: 0 0 24px;
		padding-top: 20px;
		border-top: 1px solid #ece7df;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		padding: 6px 0;
		font-size: 0.9rem;
		color: #6a5f58;
	}

	.summary-row dt,
	.summary-row dd {
		margin: 0;
	}

	.summary-row-total {
		padding-top: 14px;
		margin-top: 10px;
		border-top: 1px solid #ece7df;
		font-size: 1.05rem;
		font-weight: 600;
		color: #160b11;
	}

	.summary-trust {
		border-top: 1px solid #ece7df;
		padding-top: 20px;
	}

	.summary-trust p {
		margin: 6px 0;
		font-size: 0.78rem;
		color: #6a5f58;
		letter-spacing: 0.04em;
	}

	.summary-trust p::before {
		content: '✓';
		margin-right: 8px;
		color: #a1846d;
		font-weight: 600;
	}

	/* KYC step */
	.kyc-block {
		display: flex;
		align-items: flex-start;
		gap: 18px;
		padding: 24px;
		border: 1px solid #ece7df;
		background: #faf7f2;
		margin-bottom: 28px;
	}

	.kyc-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: #f4efe7;
		color: #a1846d;
		flex-shrink: 0;
	}

	.kyc-copy {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.kyc-heading {
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #160b11;
		margin: 0;
	}

	.kyc-body {
		font-size: 0.9rem;
		line-height: 1.65;
		color: #6a5f58;
		margin: 0;
	}

	/* Empty state */
	.empty-state,
	.complete-state {
		background: #ffffff;
		padding: 80px 40px;
		border: 1px solid #ece7df;
		text-align: center;
		max-width: 640px;
		margin: 0 auto;
	}

	.empty-title,
	.complete-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 400;
		margin: 0 0 16px;
		color: #160b11;
	}

	.empty-body,
	.complete-body {
		font-size: 1rem;
		line-height: 1.7;
		color: #6a5f58;
		margin: 0 0 32px;
	}

	.empty-cta {
		display: inline-block;
		padding: 16px 32px;
		background: #160b11;
		color: #ffffff;
		text-decoration: none;
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		transition: background 0.2s ease;
	}

	.empty-cta:hover {
		background: #a1846d;
	}

	.complete-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: #f4efe7;
		color: #a1846d;
		margin: 0 auto 24px;
	}

	@media (max-width: 968px) {
		.checkout-page {
			padding: 60px 24px 80px;
		}

		.checkout-layout {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.checkout-main {
			padding: 36px 28px 40px;
			order: 2;
		}

		.checkout-summary {
			position: static;
			order: 1;
			padding: 32px 28px;
		}

		.field-row {
			grid-template-columns: 1fr;
			gap: 0;
		}
	}

	@media (max-width: 560px) {
		.checkout-page {
			padding: 40px 16px 60px;
		}

		.checkout-main {
			padding: 28px 20px 36px;
		}

		.steps {
			gap: 4px;
			padding-bottom: 18px;
			margin-bottom: 28px;
		}

		.step-label {
			display: none;
		}

		.step-button {
			justify-content: center;
		}

		.btn {
			width: 100%;
			justify-content: center;
		}

		.step-actions {
			flex-direction: column-reverse;
		}
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
		border: 1.5px solid #d0d0d0;
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
		font-size: 0.875rem;
		color: rgba(22, 11, 17, 0.75);
		line-height: 1.55;
	}
</style>
