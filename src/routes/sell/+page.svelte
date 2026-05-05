<script>
	import { fly, fade } from 'svelte/transition';
	import { cubicOut, cubicInOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	// ── Valuation modal state ────────────────────────────────────────────────────
	let modalOpen  = $state(false);
	let step       = $state(1); // 1 = brand, 2 = model, 3 = watch details, 4 = message, 5 = contact

	let brand      = $state('');
	let brandInput = $state('');
	let model      = $state('');
	let modelInput = $state('');
	let refInput   = $state('');

	let watchYear      = $state('');
	let watchCondition = $state('');
	let hasBox         = $state(false);
	let hasPapers      = $state(false);
	let watchMessage   = $state('');

	let details    = $state({ name: '', email: '', phone: '' });
	let submitting = $state(false);
	let submitted  = $state(false);
	let gdprConsent = $state(false);

	let brandRef   = $state(null);
	let modelRef   = $state(null);

	// Per-step measured heights — used to animate the modal body between steps.
	let h1 = $state(0);
	let h2 = $state(0);
	let h3 = $state(0);
	let h4 = $state(0);
	let h5 = $state(0);
	const stepHeight = $derived(step === 1 ? h1 : step === 2 ? h2 : step === 3 ? h3 : step === 4 ? h4 : h5);

	const POPULAR_BRANDS = [
		'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega',
		'Cartier', 'IWC', 'Breitling', 'Jaeger-LeCoultre',
		'Panerai', 'Tudor', 'TAG Heuer', 'Hublot'
	];

	function openModal() {
		modalOpen = true;
		step = 1;
		brand = brandInput = model = modelInput = refInput = '';
		watchYear = watchCondition = watchMessage = '';
		hasBox = hasPapers = false;
		details = { name: '', email: '', phone: '' };
		submitted = false;
		setTimeout(() => brandRef?.focus(), 80);
	}

	function closeModal() {
		modalOpen = false;
	}

	function confirmBrand() {
		const val = brandInput.trim();
		if (!val) return;
		brand = val;
		step = 2;
		setTimeout(() => modelRef?.focus(), 80);
	}

	function selectBrand(b) {
		brandInput = b;
		brand = b;
		step = 2;
		setTimeout(() => modelRef?.focus(), 80);
	}

	function confirmModel() {
		const val = modelInput.trim();
		if (!val) return;
		model = val;
		step = 3;
	}

	function confirmWatchDetails() {
		step = 4;
	}

	function confirmMessage() {
		step = 5;
	}

	function goBack() {
		if (step === 2) { step = 1; model = modelInput = refInput = ''; setTimeout(() => brandRef?.focus(), 80); }
		if (step === 3) { step = 2; setTimeout(() => modelRef?.focus(), 80); }
		if (step === 4) { step = 3; }
		if (step === 5) { step = 4; }
	}

	const canAdvanceWatchDetails = $derived(watchYear.trim().length > 0 && watchCondition !== '');

	function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

	const canSubmit = $derived(
		details.name.trim().length >= 2 &&
		isValidEmail(details.email) &&
		details.phone.trim().length >= 7
	);

	async function handleSubmit(e) {
		e.preventDefault();
		if (!canSubmit) return;
		submitting = true;

		try {
			const res = await fetch('/api/sell-valuation', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name:      details.name,
					email:     details.email,
					phone:     details.phone,
					brand,
					model,
					reference: refInput,
					year:      watchYear,
					condition: watchCondition,
					box:       hasBox,
					papers:    hasPapers,
					message:   watchMessage,
					gdprConsent
				})
			});

			const data = await res.json();
			if (!res.ok) {
				console.error('[sell-valuation]', data.error);
			}
		} catch (err) {
			console.error('[sell-valuation] fetch error:', err);
		} finally {
			submitting = false;
			submitted = true;
		}
	}

	function handleKeydown(e) {
		if (e.key === 'Escape' && modalOpen) closeModal();
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = modalOpen ? 'hidden' : '';
		}
		return () => { if (typeof document !== 'undefined') document.body.style.overflow = ''; };
	});

	// ── Consignment form ─────────────────────────────────────────────────────────
	let cf = $state({
		name: '', email: '', phone: '',
		brand: '', model: '', reference: '',
		condition: '', boxPapers: '', askingPrice: '',
		_hp: ''
	});
	let cfStep       = $state(1);
	let cfSubmitting = $state(false);
	let cfSubmitted  = $state(false);
	let cfBrandRef   = $state(null);
	let cfModelRef   = $state(null);

	let cfh1 = $state(0), cfh2 = $state(0), cfh3 = $state(0), cfh4 = $state(0);
	const cfStepHeight = $derived(cfStep === 1 ? cfh1 : cfStep === 2 ? cfh2 : cfStep === 3 ? cfh3 : cfh4);

	const cfCanStep1 = $derived(cf.brand.trim().length > 0);
	const cfCanStep2 = $derived(cf.model.trim().length > 0);
	const cfCanStep3 = $derived(cf.condition !== '' && cf.boxPapers !== '');

	function cfIsValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
	const cfCanSubmit = $derived(
		cf.name.trim().length >= 2 &&
		cfIsValidEmail(cf.email) &&
		cf.phone.replace(/\D/g, '').length >= 7
	);

	let cfErrors    = $state({});
	let cfAttempted = $state(false);

	function cfSelectBrand(b) {
		cf.brand = b;
		cfStep = 2;
		setTimeout(() => cfModelRef?.focus(), 80);
	}

	function cfConfirmBrand() {
		if (!cfCanStep1) return;
		cfStep = 2;
		setTimeout(() => cfModelRef?.focus(), 80);
	}

	function cfConfirmModel() {
		if (!cfCanStep2) return;
		cfStep = 3;
	}

	function cfConfirmDetails() {
		if (!cfCanStep3) return;
		cfStep = 4;
	}

	function cfGoBack() {
		if (cfStep > 1) cfStep -= 1;
	}

	async function handleCfSubmit(e) {
		e.preventDefault();
		if (cf._hp) return;
		cfAttempted = true;
		if (!cfCanSubmit) return;
		cfSubmitting = true;

		try {
			const res = await fetch('/api/sell-consignment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name:        cf.name,
					email:       cf.email,
					phone:       cf.phone,
					brand:       cf.brand,
					model:       cf.model,
					reference:   cf.reference,
					condition:   cf.condition,
					boxPapers:   cf.boxPapers,
					askingPrice: cf.askingPrice,
					gdprConsent
				})
			});

			const data = await res.json();
			if (!res.ok) {
				console.error('[sell-consignment]', data.error);
			}
		} catch (err) {
			console.error('[sell-consignment] fetch error:', err);
		} finally {
			cfSubmitting = false;
			cfSubmitted = true;
		}
	}

	$effect(() => {
		if (cfAttempted) cfErrors = {
			name:  cf.name.trim().length < 2                      ? 'Please enter your full name.'        : '',
			email: !cfIsValidEmail(cf.email)                      ? 'Please enter a valid email address.' : '',
			phone: cf.phone.replace(/\D/g, '').length < 7         ? 'Please enter a valid phone number.'  : ''
		};
	});
</script>

<section class="sell-hero-section">
	<div class="sell-hero-container">
		<div class="sell-hero-content">
			<h1 class="sell-hero-heading">
				A Trusted Way to Sell Your Luxury Watch
			</h1>
			<p class="sell-hero-text">
				Receive a fast, competitive offer from a team trusted by collectors across the UK and beyond with a personalised service tailored to you.
			</p>
		</div>
	</div>
</section>

<!-- ── REAL-TIME VALUATION CTA ── -->
<section class="valuation-cta">
	<div class="valuation-cta-inner">
		<p class="valuation-eyebrow">Sell With Confidence</p>
		<h2 class="valuation-heading">Discover what your watch<br class="br-desk" /> is worth today</h2>
		<p class="valuation-sub">
			Enter your watch brand and model for an instant expert valuation.
		</p>
		<button type="button" class="valuation-btn" onclick={openModal}>
			Get a Free Valuation
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M5 12h14M12 5l7 7-7 7"/>
			</svg>
		</button>
		<p class="valuation-note">
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
			</svg>
			Fully confidential
		</p>
	</div>
</section>

<!-- ── VALUATION MODAL ── -->
{#if modalOpen}
	<!-- Backdrop -->
	<div
		class="vm-backdrop"
		transition:fade={{ duration: 240, easing: cubicInOut }}
		onclick={closeModal}
		aria-hidden="true"
	></div>

	<!-- Modal -->
	<div
		class="vm-modal"
		role="dialog"
		aria-modal="true"
		aria-label="Get a free valuation"
		transition:fly={{ y: 40, duration: 360, easing: cubicOut }}
	>
		<!-- Modal header -->
		<div class="vm-header">
			<span class="vm-header-eyebrow">Watch Valuation</span>
			<button type="button" class="vm-close" onclick={closeModal} aria-label="Close">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
				</svg>
			</button>
		</div>

		<!-- Step progress -->
		<div class="vm-progress" aria-hidden="true">
			<div class="vm-progress-bar" style="width: {step === 1 ? 20 : step === 2 ? 40 : step === 3 ? 60 : step === 4 ? 80 : 100}%"></div>
		</div>

		<!-- ── STEPS (animated height + sequenced slide/fade) ── -->
		<div class="vm-body-stack" style:height={stepHeight ? `${stepHeight}px` : 'auto'}>
		<!-- ── STEP 1: BRAND ── -->
		{#if step === 1}
			<div
				class="vm-body"
				bind:clientHeight={h1}
				in:fly={{ x: 28, duration: 460, delay: 340, easing: cubicOut }}
				out:fly={{ x: -28, duration: 320, easing: cubicInOut }}
			>
				<p class="vm-step-label">Step 1 of 5</p>
				<h3 class="vm-step-heading">What brand is your watch?</h3>

				<div class="vm-field">
					<input
						bind:this={brandRef}
						bind:value={brandInput}
						type="text"
						class="vm-brand-input"
						placeholder="e.g. Rolex"
						autocomplete="off"
						spellcheck="false"
						onkeydown={(e) => e.key === 'Enter' && confirmBrand()}
					/>
					<div class="vm-input-line"></div>
				</div>

				<div class="vm-brand-grid">
					{#each POPULAR_BRANDS as b}
						<button
							type="button"
							class="vm-brand-chip"
							class:vm-brand-chip--active={brandInput === b}
							onclick={() => selectBrand(b)}
						>{b}</button>
					{/each}
				</div>

				<button
					type="button"
					class="vm-next-btn"
					onclick={confirmBrand}
					disabled={!brandInput.trim()}
				>
					Continue
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</button>
			</div>

		<!-- ── STEP 2: MODEL ── -->
		{:else if step === 2}
			<div
				class="vm-body"
				bind:clientHeight={h2}
				in:fly={{ x: 28, duration: 460, delay: 340, easing: cubicOut }}
				out:fly={{ x: -28, duration: 320, easing: cubicInOut }}
			>
				<p class="vm-step-label">Step 2 of 5</p>

				<!-- Brand crumb -->
				<button type="button" class="vm-brand-crumb" onclick={goBack} aria-label="Change brand">
					<span class="vm-brand-crumb-name">{brand}</span>
					<span class="vm-brand-crumb-change">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					</span>
				</button>

				<div class="vm-model-label-row">
					<span class="vm-model-label">MODEL</span>
					<span class="vm-model-hint">Type the model name below</span>
				</div>

				<div class="vm-model-search">
					<svg class="vm-model-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
					</svg>
					<input
						bind:this={modelRef}
						bind:value={modelInput}
						type="text"
						class="vm-model-input"
						placeholder="e.g. Submariner, Day-Date, Nautilus…"
						autocomplete="off"
						spellcheck="false"
						onkeydown={(e) => e.key === 'Enter' && confirmModel()}
					/>
				</div>
				<div class="vm-model-underline"></div>

				<!-- Optional reference number -->
				<div class="vm-ref-row">
					<label for="vm-ref" class="vm-ref-label">
						Ref. Number
						<span class="vm-ref-optional">— optional</span>
					</label>
					<input
						id="vm-ref"
						type="text"
						class="vm-ref-input"
						bind:value={refInput}
						placeholder="e.g. 126610LN"
						autocomplete="off"
						spellcheck="false"
					/>
					<div class="vm-ref-underline"></div>
				</div>

				{#if modelInput.trim()}
					<div class="vm-model-preview">
						<div class="vm-model-preview-icon" aria-hidden="true">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
								<line x1="12" y1="3" x2="12" y2="6" stroke-width="1.6"/><line x1="12" y1="18" x2="12" y2="21" stroke-width="1.6"/>
								<line x1="3" y1="12" x2="6" y2="12" stroke-width="1.6"/><line x1="18" y1="12" x2="21" y2="12" stroke-width="1.6"/>
							</svg>
						</div>
						<div class="vm-model-preview-info">
							<span class="vm-model-preview-brand">{brand}</span>
							<span class="vm-model-preview-model">{modelInput}</span>
						</div>
						<button type="button" class="vm-model-preview-select" onclick={confirmModel}>
							Select
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M5 12h14M12 5l7 7-7 7"/>
							</svg>
						</button>
					</div>
				{/if}

				{#if modelInput.trim()}
					<button
						type="button"
						class="vm-next-btn"
						onclick={confirmModel}
					>
						Continue
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
					</button>
				{/if}
			</div>

		<!-- ── STEP 3: WATCH DETAILS ── -->
		{:else if step === 3}
			<div
				class="vm-body"
				bind:clientHeight={h3}
				in:fly={{ x: 28, duration: 460, delay: 340, easing: cubicOut }}
				out:fly={{ x: -28, duration: 320, easing: cubicInOut }}
			>
				<p class="vm-step-label">Step 3 of 5</p>

				<!-- Watch summary -->
				<div class="vm-summary">
					<button type="button" class="vm-summary-back" onclick={goBack} aria-label="Go back">
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M19 12H5M12 5l-7 7 7 7"/>
						</svg>
					</button>
					<div class="vm-summary-watch">
						<div class="vm-summary-icon" aria-hidden="true">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
								<line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/>
								<line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>
							</svg>
						</div>
						<div>
							<span class="vm-summary-brand">{brand}</span>
							<span class="vm-summary-model">{model}</span>
						</div>
					</div>
				</div>

				<h3 class="vm-step-heading" style="margin-top: 8px;">Watch details</h3>

				<!-- Year -->
				<div class="vm-form-field" style="margin-bottom: 20px;">
					<label for="vm-year" class="vm-form-label">Year <span class="vm-req">*</span></label>
					<input
						id="vm-year"
						type="text"
						class="vm-form-input"
						placeholder="e.g. 2019"
						maxlength="4"
						bind:value={watchYear}
					/>
				</div>

				<!-- Condition -->
				<div class="vm-form-field" style="margin-bottom: 24px;">
					<label for="vm-condition" class="vm-form-label">Condition</label>
					<div class="vm-select-wrap">
						<select id="vm-condition" class="vm-form-input vm-select" bind:value={watchCondition}>
							<option value="" disabled>Select condition…</option>
							<option value="unworn">Unworn / New</option>
							<option value="excellent">Excellent</option>
							<option value="very-good">Very Good</option>
							<option value="good">Good</option>
							<option value="fair">Fair</option>
						</select>
						<span class="vm-select-arrow" aria-hidden="true">
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
						</span>
					</div>
				</div>

				<!-- Box & Papers -->
				<div class="vm-form-field" style="margin-bottom: 32px;">
					<span class="vm-form-label">Box &amp; Papers</span>
					<div class="vm-checkbox-group">
						<label class="vm-checkbox-label">
							<input type="checkbox" class="vm-checkbox" bind:checked={hasBox} />
							<span class="vm-checkbox-box"></span>
							Box
						</label>
						<label class="vm-checkbox-label">
							<input type="checkbox" class="vm-checkbox" bind:checked={hasPapers} />
							<span class="vm-checkbox-box"></span>
							Papers
						</label>
					</div>
				</div>

				<button type="button" class="vm-next-btn" onclick={confirmWatchDetails} disabled={!canAdvanceWatchDetails}>
					Continue
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</button>
			</div>

		<!-- ── STEP 4: MESSAGE ── -->
		{:else if step === 4}
			<div
				class="vm-body"
				bind:clientHeight={h4}
				in:fly={{ x: 28, duration: 460, delay: 340, easing: cubicOut }}
				out:fly={{ x: -28, duration: 320, easing: cubicInOut }}
			>
				<p class="vm-step-label">Step 4 of 5</p>

				<!-- Watch summary -->
				<div class="vm-summary">
					<button type="button" class="vm-summary-back" onclick={goBack} aria-label="Go back">
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M19 12H5M12 5l-7 7 7 7"/>
						</svg>
					</button>
					<div class="vm-summary-watch">
						<div class="vm-summary-icon" aria-hidden="true">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
								<line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/>
								<line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>
							</svg>
						</div>
						<div>
							<span class="vm-summary-brand">{brand}</span>
							<span class="vm-summary-model">{model}</span>
						</div>
					</div>
				</div>

				<h3 class="vm-step-heading" style="margin-top: 8px;">Anything else to add?</h3>

				<div class="vm-form-field" style="margin-bottom: 28px;">
					<label for="vm-message" class="vm-form-label">Your message <span class="vm-optional-label">— optional</span></label>
					<textarea
						id="vm-message"
						class="vm-form-input vm-textarea"
						placeholder="e.g. Any service history, known marks, or specific details about the watch…"
						rows="5"
						bind:value={watchMessage}
					></textarea>
				</div>

				<button type="button" class="vm-next-btn" onclick={confirmMessage}>
					Continue
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</button>
			</div>

		<!-- ── STEP 5: CONTACT DETAILS ── -->
		{:else if step === 5}
			<div
				class="vm-body"
				bind:clientHeight={h5}
				in:fly={{ x: 28, duration: 460, delay: 340, easing: cubicOut }}
				out:fly={{ x: -28, duration: 320, easing: cubicInOut }}
			>
				{#if submitted}
					<div class="vm-success">
						<div class="vm-success-icon" aria-hidden="true">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="20 6 9 17 4 12"/>
							</svg>
						</div>
						<h3 class="vm-success-title">Valuation Request Sent</h3>
						<p class="vm-success-body">
							Thank you — a Watch Reserve specialist will assess your <strong>{brand} {model}</strong> and respond within 24 hours with a competitive valuation.
						</p>
						<button type="button" class="vm-next-btn" onclick={closeModal}>
							Close
						</button>
					</div>
				{:else}
					<p class="vm-step-label">Step 5 of 5</p>

					<!-- Watch summary -->
					<div class="vm-summary">
						<button type="button" class="vm-summary-back" onclick={goBack} aria-label="Go back">
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M19 12H5M12 5l-7 7 7 7"/>
							</svg>
						</button>
						<div class="vm-summary-watch">
							<div class="vm-summary-icon" aria-hidden="true">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
									<line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/>
									<line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>
								</svg>
							</div>
							<div>
								<span class="vm-summary-brand">{brand}</span>
								<span class="vm-summary-model">{model}</span>
							</div>
						</div>
					</div>

					<h3 class="vm-step-heading" style="margin-top: 8px;">Your contact details</h3>

					<form class="vm-form" onsubmit={handleSubmit} novalidate>
						<div class="vm-form-field">
							<label for="vm-name" class="vm-form-label">Full Name <span class="vm-req">*</span></label>
							<input id="vm-name" type="text" class="vm-form-input" placeholder="e.g. James Whitmore" autocomplete="name" bind:value={details.name} />
						</div>
						<div class="vm-form-row">
							<div class="vm-form-field">
								<label for="vm-email" class="vm-form-label">Email <span class="vm-req">*</span></label>
								<input id="vm-email" type="email" class="vm-form-input" placeholder="email@example.com" autocomplete="email" bind:value={details.email} />
							</div>
							<div class="vm-form-field">
								<label for="vm-phone" class="vm-form-label">Phone <span class="vm-req">*</span></label>
								<input id="vm-phone" type="tel" class="vm-form-input" placeholder="+44 7700 000000" autocomplete="tel" bind:value={details.phone} />
							</div>
						</div>

						<p class="vm-privacy">
							By submitting you agree to our <a href="/privacy-policy">Privacy Policy</a>. We will never share your details with third parties.
						</p>

						<label class="gdpr-check">
							<input type="checkbox" bind:checked={gdprConsent} class="gdpr-check-input" />
							<span class="gdpr-check-box" aria-hidden="true"></span>
							<span class="gdpr-check-label">I am happy to receive updates and offers from Watch Reserve by email.</span>
						</label>

						<button type="submit" class="vm-next-btn" disabled={!canSubmit || submitting}>
							{#if submitting}
								<span class="vm-spinner" aria-hidden="true"></span>
								Sending…
							{:else}
								Get My Valuation
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M5 12h14M12 5l7 7-7 7"/>
								</svg>
							{/if}
						</button>
					</form>
				{/if}
			</div>
		{/if}
		</div>
	</div>
{/if}


<!-- ── CONSIGNMENT SECTION ── -->
<section class="consign-section">
	<!-- Banner image -->
	<div class="consign-banner">
		<img
			src="/assets/hero/Rolex_cards.jpg"
			alt="Rolex Daytona on leather with playing cards"
			class="consign-banner-img"
		/>
		<div class="consign-banner-overlay" aria-hidden="true"></div>
		<div class="consign-banner-content">
			<p class="consign-banner-eyebrow">Consignment</p>
			<h2 class="consign-banner-heading">Let us sell it for you</h2>
		</div>
	</div>

	<!-- Body -->
	<div class="consign-body">
		<div class="consign-body-inner">

			<!-- ── Consignment Form ── -->
			<div class="cf-wrap">
				<div class="cf-head-row">
					<h3 class="cf-heading">Enquire About Consignment</h3>
					<p class="cf-subheading">Complete the form below and a specialist will be in touch to discuss your watch and agree terms.</p>
				</div>

				<!-- Honeypot -->
				<input
					type="text"
					name="website"
					bind:value={cf._hp}
					tabindex="-1"
					autocomplete="off"
					aria-hidden="true"
					style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;"
				/>

				{#if cfSubmitted}
					<div class="cf-success" role="status" transition:fade={{ duration: 300 }}>
						<div class="cf-success-icon" aria-hidden="true">
							<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
								<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
							</svg>
						</div>
						<h4 class="cf-success-title">Enquiry received</h4>
						<p class="cf-success-text">Thank you — a member of our team will be in touch within one business day to discuss your consignment.</p>
					</div>
				{:else}
					<!-- Progress bar -->
					<div class="cf-progress" aria-hidden="true">
						<div class="cf-progress-bar" style="width: {cfStep * 25}%"></div>
					</div>

					<!-- Animated step panels -->
					<div class="cf-step-stack" style:height={cfStepHeight ? `${cfStepHeight}px` : 'auto'}>

						<!-- ── STEP 1: BRAND ── -->
						{#if cfStep === 1}
						<div
							class="cf-step-body"
							bind:clientHeight={cfh1}
							in:fade={{ duration: 260, delay: 140 }}
							out:fade={{ duration: 160 }}
						>
							<p class="cf-step-label">Step 1 of 4</p>
							<h4 class="cf-step-heading">What brand is your watch?</h4>

							<div class="cf-brand-field">
								<input
									bind:this={cfBrandRef}
									bind:value={cf.brand}
									type="text"
									class="cf-brand-input"
									placeholder="e.g. Rolex"
									autocomplete="off"
									spellcheck="false"
									onkeydown={(e) => e.key === 'Enter' && cfConfirmBrand()}
								/>
								<div class="cf-brand-input-line"></div>
							</div>

							<div class="cf-brand-grid">
								{#each POPULAR_BRANDS as b}
									<button
										type="button"
										class="cf-brand-chip"
										class:cf-brand-chip--active={cf.brand === b}
										onclick={() => cfSelectBrand(b)}
									>{b}</button>
								{/each}
							</div>

							<button type="button" class="cf-next-btn" onclick={cfConfirmBrand} disabled={!cfCanStep1}>
								Continue
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M5 12h14M12 5l7 7-7 7"/>
								</svg>
							</button>
						</div>

						<!-- ── STEP 2: MODEL + REFERENCE ── -->
						{:else if cfStep === 2}
						<div
							class="cf-step-body"
							bind:clientHeight={cfh2}
							in:fade={{ duration: 260, delay: 140 }}
							out:fade={{ duration: 160 }}
						>
							<p class="cf-step-label">Step 2 of 4</p>

							<button type="button" class="cf-brand-crumb" onclick={cfGoBack} aria-label="Change brand">
								<span class="cf-brand-crumb-name">{cf.brand}</span>
								<span class="cf-brand-crumb-change">
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
									</svg>
								</span>
							</button>

							<h4 class="cf-step-heading">Which model?</h4>

							<div class="cf-model-search">
								<svg class="cf-model-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
								</svg>
								<input
									bind:this={cfModelRef}
									bind:value={cf.model}
									type="text"
									class="cf-model-input"
									placeholder="e.g. Submariner, Nautilus, Royal Oak…"
									autocomplete="off"
									spellcheck="false"
									onkeydown={(e) => e.key === 'Enter' && cfConfirmModel()}
								/>
							</div>
							<div class="cf-model-underline"></div>

							<div class="cf-ref-row">
								<label for="cf-ref-s" class="cf-ref-label">
									Ref. Number
									<span class="cf-ref-optional">— optional</span>
								</label>
								<input
									id="cf-ref-s"
									type="text"
									class="cf-ref-input"
									bind:value={cf.reference}
									placeholder="e.g. 126610LN"
									autocomplete="off"
									spellcheck="false"
								/>
								<div class="cf-ref-underline"></div>
							</div>

							<button type="button" class="cf-next-btn" onclick={cfConfirmModel} disabled={!cfCanStep2}>
								Continue
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M5 12h14M12 5l7 7-7 7"/>
								</svg>
							</button>
						</div>

						<!-- ── STEP 3: WATCH DETAILS ── -->
						{:else if cfStep === 3}
						<div
							class="cf-step-body"
							bind:clientHeight={cfh3}
							in:fade={{ duration: 260, delay: 140 }}
							out:fade={{ duration: 160 }}
						>
							<p class="cf-step-label">Step 3 of 4</p>

							<div class="cf-step-summary">
								<button type="button" class="cf-summary-back" onclick={cfGoBack} aria-label="Go back">
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M19 12H5M12 5l-7 7 7 7"/>
									</svg>
								</button>
								<div class="cf-summary-watch">
									<div class="cf-summary-icon" aria-hidden="true">
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
											<line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/>
											<line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>
										</svg>
									</div>
									<div>
										<span class="cf-summary-brand">{cf.brand}</span>
										<span class="cf-summary-model">{cf.model}</span>
									</div>
								</div>
							</div>

							<h4 class="cf-step-heading" style="margin-top: 8px;">Watch details</h4>

							<!-- Condition -->
							<div class="cf-sfield" style="margin-bottom: 20px;">
								<label for="cfs-condition" class="cf-slabel">Condition <span class="cf-sreq">*</span></label>
								<div class="cf-select-wrap">
									<select id="cfs-condition" class="cf-sinput cf-select" bind:value={cf.condition}>
										<option value="" disabled>Select condition…</option>
										<option value="unworn">Unworn / New</option>
										<option value="excellent">Excellent</option>
										<option value="very-good">Very Good</option>
										<option value="good">Good</option>
										<option value="fair">Fair</option>
									</select>
									<span class="cf-select-arrow" aria-hidden="true">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
									</span>
								</div>
							</div>

							<!-- Box & Papers -->
							<div class="cf-sfield" style="margin-bottom: 20px;">
								<span class="cf-slabel">Box &amp; Papers <span class="cf-sreq">*</span></span>
								<div class="cf-radio-group" role="radiogroup">
									<label class="cf-radio-label">
										<input type="radio" class="cf-radio" bind:group={cf.boxPapers} value="yes" />
										<span class="cf-radio-box"></span>
										Yes
									</label>
									<label class="cf-radio-label">
										<input type="radio" class="cf-radio" bind:group={cf.boxPapers} value="no" />
										<span class="cf-radio-box"></span>
										No
									</label>
									<label class="cf-radio-label">
										<input type="radio" class="cf-radio" bind:group={cf.boxPapers} value="box-only" />
										<span class="cf-radio-box"></span>
										Box only
									</label>
									<label class="cf-radio-label">
										<input type="radio" class="cf-radio" bind:group={cf.boxPapers} value="papers-only" />
										<span class="cf-radio-box"></span>
										Papers only
									</label>
								</div>
							</div>

							<!-- Asking Price (optional) -->
							<div class="cf-sfield" style="margin-bottom: 32px;">
								<label for="cfs-price" class="cf-slabel">Asking Price <span class="cf-soptional">optional</span></label>
								<input
									id="cfs-price"
									type="text"
									class="cf-sinput"
									bind:value={cf.askingPrice}
									placeholder="e.g. £12,500"
								/>
							</div>

							<button type="button" class="cf-next-btn" onclick={cfConfirmDetails} disabled={!cfCanStep3}>
								Continue
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M5 12h14M12 5l7 7-7 7"/>
								</svg>
							</button>
						</div>

						<!-- ── STEP 4: CONTACT DETAILS ── -->
						{:else if cfStep === 4}
						<div
							class="cf-step-body"
							bind:clientHeight={cfh4}
							in:fade={{ duration: 260, delay: 140 }}
							out:fade={{ duration: 160 }}
						>
							<p class="cf-step-label">Step 4 of 4</p>

							<div class="cf-step-summary">
								<button type="button" class="cf-summary-back" onclick={cfGoBack} aria-label="Go back">
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M19 12H5M12 5l-7 7 7 7"/>
									</svg>
								</button>
								<div class="cf-summary-watch">
									<div class="cf-summary-icon" aria-hidden="true">
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
											<line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/>
											<line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>
										</svg>
									</div>
									<div>
										<span class="cf-summary-brand">{cf.brand}</span>
										<span class="cf-summary-model">{cf.model}</span>
									</div>
								</div>
							</div>

							<h4 class="cf-step-heading" style="margin-top: 8px;">Your contact details</h4>

							<form class="cf-contact-form" onsubmit={handleCfSubmit} novalidate>
								<div class="cf-sfield" class:cf-sfield--error={cfErrors.name}>
									<label for="cfs-name" class="cf-slabel">Full Name <span class="cf-sreq">*</span></label>
									<input
										id="cfs-name"
										type="text"
										class="cf-sinput"
										bind:value={cf.name}
										placeholder="John Smith"
										autocomplete="name"
									/>
									{#if cfErrors.name}<p class="cf-serror" role="alert">{cfErrors.name}</p>{/if}
								</div>

								<div class="cf-sfield" class:cf-sfield--error={cfErrors.email}>
									<label for="cfs-email" class="cf-slabel">Email <span class="cf-sreq">*</span></label>
									<input
										id="cfs-email"
										type="email"
										class="cf-sinput"
										bind:value={cf.email}
										placeholder="email@example.com"
										autocomplete="email"
									/>
									{#if cfErrors.email}<p class="cf-serror" role="alert">{cfErrors.email}</p>{/if}
								</div>

								<div class="cf-sfield" class:cf-sfield--error={cfErrors.phone}>
									<label for="cfs-phone" class="cf-slabel">Phone <span class="cf-sreq">*</span></label>
									<input
										id="cfs-phone"
										type="tel"
										class="cf-sinput"
										bind:value={cf.phone}
										placeholder="+44 7700 000000"
										autocomplete="tel"
									/>
									{#if cfErrors.phone}<p class="cf-serror" role="alert">{cfErrors.phone}</p>{/if}
								</div>

								<p class="cf-privacy-note">
									By submitting you agree to our <a href="/privacy-policy">Privacy Policy</a>. Your details will never be shared.
								</p>

								<button type="submit" class="cf-next-btn" disabled={cfSubmitting} aria-busy={cfSubmitting}>
									{#if cfSubmitting}
										<span class="cf-spinner" aria-hidden="true"></span>
										Submitting…
									{:else}
										Submit Enquiry
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
											<path d="M5 12h14M12 5l7 7-7 7"/>
										</svg>
									{/if}
								</button>
							</form>
						</div>
						{/if}

					</div>
				{/if}
			</div>

		</div>
	</div>
</section>


<style>
	.sell-hero-section {
		position: relative;
		width: 100%;
		min-height: 80vh;
		display: flex;
		align-items: center;
		background-image: url('/assets/lifestyle/Sell_Hero1.avif');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.sell-hero-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.7) 0%,
			rgba(0, 0, 0, 0.4) 50%,
			rgba(0, 0, 0, 0.1) 100%
		);
		z-index: 1;
	}

	.sell-hero-container {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 100px 0;
	}

	.sell-hero-content {
		max-width: 600px;
		width: 100%;
		padding-left: 40px;
	}

	.sell-hero-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 32px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
		text-align: left;
	}

	.sell-hero-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1rem, 1.5vw, 1.25rem);
		color: #ffffff;
		margin: 0 0 48px 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		text-align: left;
		opacity: 0.95;
	}

	@media (max-width: 1024px) {
		.sell-hero-container {
			padding: 80px 0;
		}

		.sell-hero-content {
			max-width: 100%;
			padding-left: 30px;
		}
	}

	@media (max-width: 768px) {
		.sell-hero-section {
			min-height: 70vh;
			background-image: url('/assets/lifestyle/Sell_Hero.avif');
		}

		.sell-hero-container {
			padding: 60px 0;
		}

		.sell-hero-content {
			padding-left: 20px;
		}

		.sell-hero-heading {
			margin: 0 0 24px 0;
		}

		.sell-hero-text {
			margin: 0 0 40px 0;
		}
	}

	@media (max-width: 480px) {
		.sell-hero-section {
			min-height: 60vh;
		}

		.sell-hero-container {
			padding: 40px 0;
		}

		.sell-hero-content {
			padding-left: 20px;
		}
	}

	/* ── VALUATION CTA SECTION ── */
	.valuation-cta {
		width: 100%;
		background-color: #ffffff;
		padding: 96px 40px;
		box-sizing: border-box;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		text-align: center;
	}

	.valuation-cta-inner {
		max-width: 640px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
	}

	.valuation-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 20px;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(161, 132, 109, 0.25);
	}

	.valuation-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 24px;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.valuation-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9rem, 1.2vw, 1rem);
		color: rgba(22, 11, 17, 0.55);
		line-height: 1.7;
		font-weight: 300;
		margin: 0 0 40px;
		max-width: 480px;
	}

	.valuation-btn {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 16px 40px;
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background-color 0.22s ease, transform 0.2s ease, box-shadow 0.22s ease, gap 0.22s ease;
		margin-bottom: 24px;
	}

	.valuation-btn:hover {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(161, 132, 109, 0.3);
		gap: 14px;
	}

	.valuation-btn:active { transform: translateY(0); }

	.valuation-note {
		display: flex;
		align-items: center;
		gap: 7px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		color: rgba(22, 11, 17, 0.38);
		margin: 0;
		letter-spacing: 0.02em;
	}

	.valuation-note svg { color: #a1846d; flex-shrink: 0; }

	.br-desk { display: block; }

	@media (max-width: 640px) {
		.valuation-cta { padding: 72px 24px; }
		.br-desk { display: none; }
	}

	@media (max-width: 480px) {
		.valuation-cta { padding: 56px 20px; }
	}

	/* ── CONSIGNMENT SECTION ── */
	.consign-section {
		width: 100%;
		background-color: #ffffff;
	}

	/* Banner */
	.consign-banner {
		position: relative;
		width: 100%;
		height: clamp(320px, 45vw, 560px);
		overflow: hidden;
	}

	.consign-banner-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 35%;
		display: block;
		transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.consign-section:hover .consign-banner-img {
		transform: scale(1.03);
	}

	.consign-banner-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(10, 4, 8, 0.82) 0%,
			rgba(10, 4, 8, 0.4) 45%,
			rgba(10, 4, 8, 0.15) 100%
		);
	}

	.consign-banner-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 52px 80px;
		box-sizing: border-box;
		max-width: 1400px;
		margin: 0 auto;
	}

	.consign-banner-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 12px;
	}

	.consign-banner-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.25rem, 5vw, 4rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0;
		line-height: 1.1;
		letter-spacing: -0.025em;
	}

	/* Body */
	.consign-body {
		background-color: #faf8f5;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		padding: 80px 80px 96px;
		box-sizing: border-box;
	}

	.consign-body-inner {
		max-width: 1240px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 56px;
	}

	/* Intro */
	.consign-intro {
		max-width: 780px;
	}

	.consign-intro-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.0625rem);
		color: rgba(22, 11, 17, 0.65);
		line-height: 1.8;
		font-weight: 300;
		margin: 0;
	}

	/* Pillars grid */
	.consign-pillars {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 40px 64px;
		max-width: 900px;
	}

	.consign-pillar {
		display: flex;
		align-items: flex-start;
		gap: 18px;
	}

	.consign-pillar-icon {
		width: 44px;
		height: 44px;
		background-color: rgba(161, 132, 109, 0.1);
		color: #a1846d;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.consign-pillar-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.0625rem;
		font-weight: 400;
		color: #160b11;
		margin: 0 0 8px;
		letter-spacing: -0.01em;
	}

	.consign-pillar-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: rgba(22, 11, 17, 0.55);
		line-height: 1.7;
		font-weight: 300;
		margin: 0;
	}

	/* ── Consignment Form (step flow) ── */
	.cf-wrap {
		border-top: 1px solid rgba(22, 11, 17, 0.08);
		padding-top: 48px;
	}

	.cf-head-row {
		margin-bottom: 32px;
	}

	.cf-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.25rem, 2vw, 1.6rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 10px 0;
		letter-spacing: -0.01em;
	}

	.cf-subheading {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: rgba(22, 11, 17, 0.55);
		margin: 0;
		font-weight: 300;
		line-height: 1.65;
		max-width: 560px;
	}

	/* Progress bar */
	.cf-progress {
		height: 2px;
		background-color: rgba(22, 11, 17, 0.07);
		margin-bottom: 40px;
		max-width: 640px;
	}

	.cf-progress-bar {
		height: 100%;
		background-color: #a1846d;
		transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	/* Step stack */
	.cf-step-stack {
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		align-items: start;
		overflow-x: hidden;
		transition: height 520ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.cf-step-stack > .cf-step-body {
		grid-area: 1 / 1;
		min-width: 0;
	}

	.cf-step-body {
		display: flex;
		flex-direction: column;
		gap: 0;
		max-width: 640px;
	}

	/* Step labels */
	.cf-step-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.35);
		margin: 0 0 10px;
	}

	.cf-step-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 28px;
		letter-spacing: -0.01em;
		line-height: 1.2;
	}

	/* Brand input (step 1) */
	.cf-brand-field {
		margin-bottom: 4px;
	}

	.cf-brand-input {
		width: 100%;
		box-sizing: border-box;
		background: none;
		border: none;
		outline: none;
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 400;
		color: #160b11;
		letter-spacing: -0.02em;
		padding: 0 0 8px;
		caret-color: #a1846d;
	}

	.cf-brand-input::placeholder { color: rgba(22, 11, 17, 0.2); }

	.cf-brand-input-line {
		height: 2px;
		background: linear-gradient(90deg, #a1846d 0%, rgba(161,132,109,0.2) 100%);
		margin-bottom: 28px;
	}

	/* Brand chips */
	.cf-brand-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 32px;
	}

	.cf-brand-chip {
		padding: 7px 14px;
		background: none;
		border: 1px solid rgba(22, 11, 17, 0.14);
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		font-weight: 500;
		color: rgba(22, 11, 17, 0.6);
		cursor: pointer;
		transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
		white-space: nowrap;
	}

	.cf-brand-chip:hover { border-color: #a1846d; color: #a1846d; background-color: rgba(161,132,109,0.04); }

	.cf-brand-chip--active {
		background-color: #a1846d;
		border-color: #a1846d;
		color: #ffffff;
	}

	/* Brand crumb (step 2) */
	.cf-brand-crumb {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		margin-bottom: 20px;
		width: fit-content;
	}

	.cf-brand-crumb-name {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		font-weight: 400;
		color: #160b11;
		letter-spacing: -0.02em;
		border-bottom: 2px solid #a1846d;
		padding-bottom: 2px;
	}

	.cf-brand-crumb-change {
		width: 26px;
		height: 26px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid rgba(22,11,17,0.15);
		color: rgba(22,11,17,0.4);
		flex-shrink: 0;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.cf-brand-crumb:hover .cf-brand-crumb-change { background-color: #160b11; color: #ffffff; border-color: #160b11; }

	/* Model search (step 2) */
	.cf-model-search {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.cf-model-search-icon { color: rgba(22,11,17,0.3); flex-shrink: 0; }

	.cf-model-input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		font-family: 'Montserrat', sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: #160b11;
		padding: 6px 0;
		caret-color: #a1846d;
	}

	.cf-model-input::placeholder { color: rgba(22,11,17,0.25); }

	.cf-model-underline {
		height: 1.5px;
		background-color: rgba(22, 11, 17, 0.12);
		margin-bottom: 20px;
	}

	/* Reference field (step 2) */
	.cf-ref-row {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 28px;
	}

	.cf-ref-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.4);
	}

	.cf-ref-optional {
		font-weight: 400;
		letter-spacing: 0.04em;
		text-transform: none;
		color: rgba(22, 11, 17, 0.3);
	}

	.cf-ref-input {
		background: none;
		border: none;
		outline: none;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9rem;
		color: #160b11;
		padding: 5px 0;
		caret-color: #a1846d;
		width: 100%;
	}

	.cf-ref-input::placeholder { color: rgba(22, 11, 17, 0.25); }

	.cf-ref-underline {
		height: 1px;
		background-color: rgba(22, 11, 17, 0.1);
	}

	/* Step summary row (steps 3 & 4) */
	.cf-step-summary {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 20px;
	}

	.cf-summary-back {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: none;
		border: 1px solid rgba(22,11,17,0.12);
		color: rgba(22,11,17,0.45);
		cursor: pointer;
		flex-shrink: 0;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.cf-summary-back:hover { background-color: #160b11; color: #ffffff; border-color: #160b11; }

	.cf-summary-watch {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
		min-width: 0;
	}

	.cf-summary-icon {
		width: 38px;
		height: 38px;
		background-color: rgba(161,132,109,0.1);
		color: #a1846d;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.cf-summary-watch > div {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.cf-summary-brand {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.cf-summary-model {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1rem;
		color: #160b11;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Step fields (steps 3 & 4) */
	.cf-sfield {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.cf-sfield--error .cf-sinput,
	.cf-sfield--error .cf-select {
		border-color: #c0392b;
	}

	.cf-slabel {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.55);
	}

	.cf-sreq { color: #a1846d; }

	.cf-soptional {
		font-weight: 400;
		letter-spacing: 0.04em;
		text-transform: none;
		color: rgba(22, 11, 17, 0.35);
		font-size: 0.65rem;
	}

	.cf-serror {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		color: #c0392b;
		margin: 0;
	}

	/* Shared input style (steps 3 & 4) */
	.cf-sinput {
		width: 100%;
		box-sizing: border-box;
		padding: 11px 14px;
		background: #faf9f8;
		border: 1px solid rgba(22, 11, 17, 0.14);
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
		outline: none;
		appearance: none;
		-webkit-appearance: none;
	}

	.cf-sinput::placeholder { color: rgba(22, 11, 17, 0.3); }

	.cf-sinput:focus {
		border-color: #a1846d;
		box-shadow: 0 0 0 3px rgba(161, 132, 109, 0.12);
		background: #fff;
	}

	.cf-select {
		padding-right: 36px;
		cursor: pointer;
	}

	.cf-select-wrap { position: relative; }

	.cf-select-arrow {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: rgba(22, 11, 17, 0.4);
		display: flex;
		align-items: center;
	}

	/* Radio group (step 3) */
	.cf-radio-group {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 24px;
		padding-top: 4px;
	}

	.cf-radio-label {
		display: flex;
		align-items: center;
		gap: 9px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		cursor: pointer;
		user-select: none;
	}

	.cf-radio {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.cf-radio-box {
		display: inline-block;
		width: 17px;
		height: 17px;
		border: 1.5px solid rgba(22, 11, 17, 0.25);
		border-radius: 50%;
		flex-shrink: 0;
		position: relative;
		transition: border-color 0.18s ease;
	}

	.cf-radio:checked + .cf-radio-box { border-color: #a1846d; }

	.cf-radio:checked + .cf-radio-box::after {
		content: '';
		position: absolute;
		inset: 3px;
		border-radius: 50%;
		background: #a1846d;
	}

	.cf-radio:focus-visible + .cf-radio-box {
		box-shadow: 0 0 0 3px rgba(161, 132, 109, 0.22);
	}

	/* Contact form (step 4) */
	.cf-contact-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.cf-privacy-note {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		color: rgba(22,11,17,0.4);
		line-height: 1.55;
		margin: 0;
		padding-top: 4px;
		border-top: 1px solid rgba(22,11,17,0.06);
	}

	.cf-privacy-note a { color: #a1846d; text-decoration: none; border-bottom: 1px solid rgba(161,132,109,0.3); }
	.cf-privacy-note a:hover { color: #8a6f59; }

	/* Next / Submit button */
	.cf-next-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 15px 36px;
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		cursor: pointer;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		transition: background-color 0.22s ease, transform 0.2s ease, box-shadow 0.22s ease, gap 0.22s ease;
		margin-top: 8px;
		white-space: nowrap;
	}

	.cf-next-btn:hover:not(:disabled) {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(161, 132, 109, 0.28);
		gap: 14px;
	}

	.cf-next-btn:active:not(:disabled) { transform: translateY(0); }

	.cf-next-btn:disabled {
		background-color: rgba(22, 11, 17, 0.12);
		color: rgba(22, 11, 17, 0.35);
		cursor: not-allowed;
	}

	.cf-spinner {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.35);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: cf-spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes cf-spin { to { transform: rotate(360deg); } }

	/* Success state */
	.cf-success {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding: 40px 0;
	}

	.cf-success-icon {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: rgba(161, 132, 109, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #a1846d;
	}

	.cf-success-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.3rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.01em;
	}

	.cf-success-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9rem;
		color: rgba(22, 11, 17, 0.6);
		margin: 0;
		font-weight: 300;
		line-height: 1.7;
		max-width: 480px;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.consign-banner-content { padding: 44px 40px; }
		.consign-body { padding: 72px 40px 88px; }
	}

	@media (max-width: 768px) {
		.consign-body { padding: 60px 30px 72px; }
		.consign-banner-content { padding: 36px 30px; }
		.cf-brand-chip { font-size: 0.75rem; padding: 7px 12px; }
	}

	@media (max-width: 480px) {
		.consign-banner { height: clamp(260px, 60vw, 380px); }
		.consign-body { padding: 48px 20px 60px; }
		.consign-banner-content { padding: 28px 20px; }
		.cf-next-btn { width: 100%; }
		.cf-brand-chip { font-size: 0.72rem; padding: 6px 10px; }
	}

	/* ── VALUATION MODAL ── */
	.vm-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(22, 11, 17, 0.6);
		backdrop-filter: blur(4px);
		z-index: 900;
		cursor: pointer;
	}

	.vm-modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(580px, calc(100vw - 32px));
		max-height: calc(100vh - 48px);
		background-color: #ffffff;
		z-index: 901;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 24px 80px rgba(22, 11, 17, 0.22), 0 8px 24px rgba(22, 11, 17, 0.12);
	}

	/* Header */
	.vm-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 28px 16px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.08);
		flex-shrink: 0;
	}

	.vm-header-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.4);
	}

	.vm-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: none;
		border: 1px solid rgba(22, 11, 17, 0.12);
		color: rgba(22, 11, 17, 0.5);
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.vm-close:hover { background-color: #160b11; color: #ffffff; border-color: #160b11; }

	/* Progress bar */
	.vm-progress {
		height: 2px;
		background-color: rgba(22, 11, 17, 0.07);
		flex-shrink: 0;
	}

	.vm-progress-bar {
		height: 100%;
		background-color: #a1846d;
		transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	/* Body */
	.vm-body-stack {
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		align-items: start;
		overflow-x: hidden;
		transition: height 520ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.vm-body-stack > .vm-body {
		grid-area: 1 / 1;
		min-width: 0;
	}

	.vm-body {
		padding: 32px 28px 36px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(161,132,109,0.3) transparent;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.vm-step-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.35);
		margin: 0 0 10px;
	}

	.vm-step-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.5rem;
		font-weight: 400;
		color: #160b11;
		margin: 0 0 28px;
		letter-spacing: -0.01em;
		line-height: 1.2;
	}

	/* Brand input */
	.vm-field { margin-bottom: 4px; }

	.vm-brand-input {
		width: 100%;
		box-sizing: border-box;
		background: none;
		border: none;
		outline: none;
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 2rem;
		font-weight: 400;
		color: #160b11;
		letter-spacing: -0.02em;
		padding: 0 0 8px;
		caret-color: #a1846d;
	}

	.vm-brand-input::placeholder { color: rgba(22, 11, 17, 0.2); }

	.vm-input-line {
		height: 2px;
		background: linear-gradient(90deg, #a1846d 0%, rgba(161,132,109,0.2) 100%);
		margin-bottom: 28px;
	}

	/* Brand chips */
	.vm-brand-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 32px;
	}

	.vm-brand-chip {
		padding: 7px 14px;
		background: none;
		border: 1px solid rgba(22, 11, 17, 0.14);
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		font-weight: 500;
		color: rgba(22, 11, 17, 0.6);
		cursor: pointer;
		transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
		white-space: nowrap;
	}

	.vm-brand-chip:hover { border-color: #a1846d; color: #a1846d; background-color: rgba(161,132,109,0.04); }

	.vm-brand-chip--active {
		background-color: #a1846d;
		border-color: #a1846d;
		color: #ffffff;
	}

	/* Brand crumb (step 2 back button) */
	.vm-brand-crumb {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		margin-bottom: 24px;
		width: fit-content;
	}

	.vm-brand-crumb-name {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.75rem;
		font-weight: 400;
		color: #160b11;
		letter-spacing: -0.02em;
		border-bottom: 2px solid #a1846d;
		padding-bottom: 2px;
	}

	.vm-brand-crumb-change {
		width: 26px;
		height: 26px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid rgba(22,11,17,0.15);
		color: rgba(22,11,17,0.4);
		flex-shrink: 0;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.vm-brand-crumb:hover .vm-brand-crumb-change { background-color: #160b11; color: #ffffff; border-color: #160b11; }

	/* Model label */
	.vm-model-label-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.vm-model-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.4);
	}

	.vm-model-hint {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		color: rgba(22, 11, 17, 0.35);
	}

	/* Model search */
	.vm-model-search {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.vm-model-search-icon { color: rgba(22,11,17,0.3); flex-shrink: 0; }

	.vm-model-input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		font-family: 'Montserrat', sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: #160b11;
		padding: 6px 0;
		caret-color: #a1846d;
	}

	.vm-model-input::placeholder { color: rgba(22,11,17,0.25); }

	.vm-model-underline {
		height: 1.5px;
		background-color: rgba(22, 11, 17, 0.12);
		margin-bottom: 20px;
	}

	/* Model preview card (appears while typing) */
	.vm-model-preview {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 16px;
		border: 1px solid rgba(22, 11, 17, 0.08);
		background-color: #faf8f5;
		margin-bottom: 24px;
		cursor: default;
	}

	.vm-model-preview-icon {
		width: 44px;
		height: 44px;
		background-color: rgba(161,132,109,0.1);
		color: #a1846d;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.vm-model-preview-info {
		display: flex;
		flex-direction: column;
		gap: 3px;
		flex: 1;
		min-width: 0;
	}

	.vm-model-preview-brand {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.vm-model-preview-model {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1rem;
		color: #160b11;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vm-model-preview-select {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-shrink: 0;
		background: none;
		border: 1px solid rgba(22,11,17,0.15);
		padding: 7px 14px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(22,11,17,0.6);
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}

	.vm-model-preview-select:hover { background-color: #160b11; color: #ffffff; border-color: #160b11; }

	/* Summary row (step 3) */
	.vm-summary {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 20px;
	}

	.vm-summary-back {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: none;
		border: 1px solid rgba(22,11,17,0.12);
		color: rgba(22,11,17,0.45);
		cursor: pointer;
		flex-shrink: 0;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.vm-summary-back:hover { background-color: #160b11; color: #ffffff; border-color: #160b11; }

	.vm-summary-watch {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
		min-width: 0;
	}

	.vm-summary-icon {
		width: 38px;
		height: 38px;
		background-color: rgba(161,132,109,0.1);
		color: #a1846d;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.vm-summary-watch > div {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.vm-summary-brand {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.vm-summary-model {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1rem;
		color: #160b11;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Contact form (step 3) */
	.vm-form {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.vm-form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.vm-form-field {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.vm-form-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #3a2e33;
	}

	.vm-req { color: #a1846d; }

	.vm-form-input {
		width: 100%;
		box-sizing: border-box;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 11px 14px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		outline: none;
		transition: border-color 0.2s ease;
		-webkit-appearance: none;
	}

	.vm-form-input::placeholder { color: #b8b0a8; font-size: 0.825rem; }

	.vm-form-input:focus {
		border-color: rgba(22,11,17,0.18);
		border-bottom-color: #a1846d;
	}

	.vm-privacy {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		color: rgba(22,11,17,0.4);
		line-height: 1.55;
		margin: 0;
		padding-top: 6px;
		border-top: 1px solid rgba(22,11,17,0.06);
	}

	.vm-privacy a { color: #a1846d; text-decoration: none; border-bottom: 1px solid rgba(161,132,109,0.3); }
	.vm-privacy a:hover { color: #8a6f59; }

	/* CTA / next button */
	.vm-next-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		padding: 15px 28px;
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background-color 0.22s ease, transform 0.2s ease, box-shadow 0.22s ease, gap 0.22s ease;
		margin-top: 8px;
	}

	.vm-next-btn:hover:not(:disabled) {
		background-color: #8a6f59;
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(161,132,109,0.3);
		gap: 14px;
	}

	.vm-next-btn:active:not(:disabled) { transform: translateY(0); }
	.vm-next-btn:disabled { background-color: rgba(22,11,17,0.12); color: rgba(22,11,17,0.35); cursor: not-allowed; }

	.vm-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255,255,255,0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: vm-spin 0.65s linear infinite;
		flex-shrink: 0;
	}

	@keyframes vm-spin { to { transform: rotate(360deg); } }

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
		color: rgba(22, 11, 17, 0.55);
		line-height: 1.55;
	}

	/* Success state */
	.vm-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 16px;
		padding: 24px 0 8px;
	}

	.vm-success-icon {
		width: 56px;
		height: 56px;
		background-color: #a1846d;
		color: #ffffff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.vm-success-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.375rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
	}

	.vm-success-body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: rgba(22,11,17,0.6);
		line-height: 1.65;
		margin: 0;
		max-width: 360px;
	}

	/* Optional ref field (step 2) */
	.vm-ref-row {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 20px;
	}

	.vm-ref-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.4);
	}

	.vm-ref-optional {
		font-weight: 400;
		letter-spacing: 0.04em;
		text-transform: none;
		color: rgba(22, 11, 17, 0.3);
	}

	.vm-ref-input {
		background: none;
		border: none;
		outline: none;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9rem;
		font-weight: 400;
		color: #160b11;
		padding: 5px 0;
		caret-color: #a1846d;
		width: 100%;
	}

	.vm-ref-input::placeholder { color: rgba(22, 11, 17, 0.25); }

	.vm-ref-underline {
		height: 1px;
		background-color: rgba(22, 11, 17, 0.1);
	}

	/* Select wrapper (step 3) */
	.vm-select-wrap {
		position: relative;
	}

	.vm-select {
		appearance: none;
		-webkit-appearance: none;
		padding-right: 36px;
		cursor: pointer;
	}

	.vm-select-arrow {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: rgba(22, 11, 17, 0.4);
		display: flex;
		align-items: center;
	}

	/* Checkbox group (step 3) */
	.vm-checkbox-group {
		display: flex;
		gap: 24px;
		padding-top: 6px;
	}

	.vm-checkbox-label {
		display: flex;
		align-items: center;
		gap: 9px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		cursor: pointer;
		user-select: none;
	}

	.vm-checkbox {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.vm-checkbox-box {
		display: inline-block;
		width: 17px;
		height: 17px;
		border: 1.5px solid rgba(22, 11, 17, 0.25);
		flex-shrink: 0;
		position: relative;
		transition: border-color 0.18s ease, background-color 0.18s ease;
	}

	.vm-checkbox:checked + .vm-checkbox-box {
		border-color: #a1846d;
		background-color: #a1846d;
	}

	.vm-checkbox:checked + .vm-checkbox-box::after {
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

	.vm-checkbox:focus-visible + .vm-checkbox-box {
		box-shadow: 0 0 0 3px rgba(161, 132, 109, 0.22);
	}

	/* Textarea (step 4) */
	.vm-textarea {
		resize: vertical;
		min-height: 110px;
		line-height: 1.6;
	}

	.vm-optional-label {
		font-weight: 400;
		letter-spacing: 0.04em;
		text-transform: none;
		color: rgba(22, 11, 17, 0.35);
		font-size: 0.68rem;
	}

	/* Modal responsive */
	@media (max-width: 520px) {
		.vm-body { padding: 24px 20px 28px; }
		.vm-header { padding: 16px 20px 14px; }
		.vm-brand-input { font-size: 1.5rem; }
		.vm-brand-crumb-name { font-size: 1.35rem; }
		.vm-form-row { grid-template-columns: 1fr; }
	}

</style>

