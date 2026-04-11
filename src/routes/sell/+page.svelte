<script>
	import { fly, fade } from 'svelte/transition';
	import { cubicOut, cubicInOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	// ── Valuation modal state ────────────────────────────────────────────────────
	let modalOpen  = $state(false);
	let step       = $state(1); // 1 = brand, 2 = model, 3 = details

	let brand      = $state('');
	let brandInput = $state('');
	let model      = $state('');
	let modelInput = $state('');

	let details    = $state({ name: '', email: '', phone: '' });
	let submitting = $state(false);
	let submitted  = $state(false);

	let brandRef   = $state(null);
	let modelRef   = $state(null);

	// Per-step measured heights — used to animate the modal body between steps.
	let h1 = $state(0);
	let h2 = $state(0);
	let h3 = $state(0);
	const stepHeight = $derived(step === 1 ? h1 : step === 2 ? h2 : h3);

	const POPULAR_BRANDS = [
		'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega',
		'Cartier', 'IWC', 'Breitling', 'Jaeger-LeCoultre',
		'Panerai', 'Tudor', 'TAG Heuer', 'Hublot'
	];

	function openModal() {
		modalOpen = true;
		step = 1;
		brand = brandInput = model = modelInput = '';
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

	function goBack() {
		if (step === 2) { step = 1; model = modelInput = ''; setTimeout(() => brandRef?.focus(), 80); }
		if (step === 3) { step = 2; setTimeout(() => modelRef?.focus(), 80); }
	}

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
		await new Promise(r => setTimeout(r, 1200));
		submitting = false;
		submitted = true;
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
	let cfErrors  = $state({});
	let cfSubmitting = $state(false);
	let cfSubmitted  = $state(false);
	let cfAttempted  = $state(false);

	function validateCf() {
		const e = {};
		if (cf.name.trim().length < 2)                          e.name       = 'Please enter your full name.';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cf.email))      e.email      = 'Please enter a valid email address.';
		if (cf.phone.replace(/\D/g, '').length < 7)             e.phone      = 'Please enter a valid phone number.';
		if (!cf.brand.trim())                                    e.brand      = 'Please enter the watch brand.';
		if (!cf.model.trim())                                    e.model      = 'Please enter the watch model.';
		if (!cf.condition)                                       e.condition  = 'Please select the condition.';
		if (!cf.boxPapers)                                       e.boxPapers  = 'Please select an option.';
		return e;
	}

	async function handleCfSubmit(e) {
		e.preventDefault();
		cfAttempted = true;
		if (cf._hp) return;
		cfErrors = validateCf();
		if (Object.keys(cfErrors).length > 0) return;
		cfSubmitting = true;
		await new Promise(r => setTimeout(r, 1200));
		cfSubmitting = false;
		cfSubmitted = true;
	}

	$effect(() => {
		if (cfAttempted) cfErrors = validateCf();
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
			Enter your watch brand and model for an instant market valuation powered by live pricing data.
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
			<div class="vm-progress-bar" style="width: {step === 1 ? 33 : step === 2 ? 66 : 100}%"></div>
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
				<p class="vm-step-label">Step 1 of 3</p>
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
				<p class="vm-step-label">Step 2 of 3</p>

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

				<button
					type="button"
					class="vm-next-btn"
					onclick={confirmModel}
					disabled={!modelInput.trim()}
				>
					Continue
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</button>
			</div>

		<!-- ── STEP 3: CONTACT DETAILS ── -->
		{:else if step === 3}
			<div
				class="vm-body"
				bind:clientHeight={h3}
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
					<p class="vm-step-label">Step 3 of 3</p>

					<!-- Watch summary -->
					<div class="vm-summary">
						<button type="button" class="vm-summary-back" onclick={goBack} aria-label="Change model">
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
								<input id="vm-email" type="email" class="vm-form-input" placeholder="you@example.com" autocomplete="email" bind:value={details.email} />
							</div>
							<div class="vm-form-field">
								<label for="vm-phone" class="vm-form-label">Phone <span class="vm-req">*</span></label>
								<input id="vm-phone" type="tel" class="vm-form-input" placeholder="+44 7700 000000" autocomplete="tel" bind:value={details.phone} />
							</div>
						</div>

						<p class="vm-privacy">
							By submitting you agree to our <a href="/privacy-policy">Privacy Policy</a>. We will never share your details with third parties.
						</p>

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
					<form class="cf-form" onsubmit={handleCfSubmit} novalidate>
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

						<!-- Row 1: Name + Email -->
						<div class="cf-row">
							<div class="cf-field" class:cf-field--error={cfErrors.name}>
								<label class="cf-label" for="cf-name">Full Name <span class="cf-req" aria-hidden="true">*</span></label>
								<input
									id="cf-name"
									type="text"
									class="cf-input"
									bind:value={cf.name}
									placeholder="John Smith"
									autocomplete="name"
									aria-required="true"
									aria-describedby={cfErrors.name ? 'cf-name-err' : undefined}
								/>
								{#if cfErrors.name}<p class="cf-error" id="cf-name-err" role="alert">{cfErrors.name}</p>{/if}
							</div>
							<div class="cf-field" class:cf-field--error={cfErrors.email}>
								<label class="cf-label" for="cf-email">Email <span class="cf-req" aria-hidden="true">*</span></label>
								<input
									id="cf-email"
									type="email"
									class="cf-input"
									bind:value={cf.email}
									placeholder="you@example.com"
									autocomplete="email"
									aria-required="true"
									aria-describedby={cfErrors.email ? 'cf-email-err' : undefined}
								/>
								{#if cfErrors.email}<p class="cf-error" id="cf-email-err" role="alert">{cfErrors.email}</p>{/if}
							</div>
						</div>

						<!-- Row 2: Phone + Brand -->
						<div class="cf-row">
							<div class="cf-field" class:cf-field--error={cfErrors.phone}>
								<label class="cf-label" for="cf-phone">Phone Number <span class="cf-req" aria-hidden="true">*</span></label>
								<input
									id="cf-phone"
									type="tel"
									class="cf-input"
									bind:value={cf.phone}
									placeholder="+44 7700 000000"
									autocomplete="tel"
									aria-required="true"
									aria-describedby={cfErrors.phone ? 'cf-phone-err' : undefined}
								/>
								{#if cfErrors.phone}<p class="cf-error" id="cf-phone-err" role="alert">{cfErrors.phone}</p>{/if}
							</div>
							<div class="cf-field" class:cf-field--error={cfErrors.brand}>
								<label class="cf-label" for="cf-brand">Brand <span class="cf-req" aria-hidden="true">*</span></label>
								<input
									id="cf-brand"
									type="text"
									class="cf-input"
									bind:value={cf.brand}
									placeholder="e.g. Rolex"
									aria-required="true"
									aria-describedby={cfErrors.brand ? 'cf-brand-err' : undefined}
								/>
								{#if cfErrors.brand}<p class="cf-error" id="cf-brand-err" role="alert">{cfErrors.brand}</p>{/if}
							</div>
						</div>

						<!-- Row 3: Model + Reference -->
						<div class="cf-row">
							<div class="cf-field" class:cf-field--error={cfErrors.model}>
								<label class="cf-label" for="cf-model">Model <span class="cf-req" aria-hidden="true">*</span></label>
								<input
									id="cf-model"
									type="text"
									class="cf-input"
									bind:value={cf.model}
									placeholder="e.g. Submariner Date"
									aria-required="true"
									aria-describedby={cfErrors.model ? 'cf-model-err' : undefined}
								/>
								{#if cfErrors.model}<p class="cf-error" id="cf-model-err" role="alert">{cfErrors.model}</p>{/if}
							</div>
							<div class="cf-field">
								<label class="cf-label" for="cf-ref">Reference Number</label>
								<input
									id="cf-ref"
									type="text"
									class="cf-input"
									bind:value={cf.reference}
									placeholder="e.g. 126610LN"
								/>
							</div>
						</div>

						<!-- Row 4: Condition + Asking Price -->
						<div class="cf-row">
							<div class="cf-field" class:cf-field--error={cfErrors.condition}>
								<label class="cf-label" for="cf-condition">Condition <span class="cf-req" aria-hidden="true">*</span></label>
								<div class="cf-select-wrap">
									<select
										id="cf-condition"
										class="cf-select"
										bind:value={cf.condition}
										aria-required="true"
										aria-describedby={cfErrors.condition ? 'cf-condition-err' : undefined}
									>
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
								{#if cfErrors.condition}<p class="cf-error" id="cf-condition-err" role="alert">{cfErrors.condition}</p>{/if}
							</div>
							<div class="cf-field">
								<label class="cf-label" for="cf-price">Asking Price</label>
								<input
									id="cf-price"
									type="text"
									class="cf-input"
									bind:value={cf.askingPrice}
									placeholder="e.g. £12,500"
								/>
							</div>
						</div>

						<!-- Box & Papers -->
						<div class="cf-field cf-field--full" class:cf-field--error={cfErrors.boxPapers}>
							<span class="cf-label">Box &amp; Papers? <span class="cf-req" aria-hidden="true">*</span></span>
							<div class="cf-radio-group" role="radiogroup" aria-required="true" aria-describedby={cfErrors.boxPapers ? 'cf-bp-err' : undefined}>
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
							{#if cfErrors.boxPapers}<p class="cf-error" id="cf-bp-err" role="alert">{cfErrors.boxPapers}</p>{/if}
						</div>

						<!-- Submit -->
						<div class="cf-submit-row">
							<button type="submit" class="cf-submit-btn" disabled={cfSubmitting} aria-busy={cfSubmitting}>
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
							<p class="cf-submit-note">Fully confidential &mdash; your details will never be shared.</p>
						</div>
					</form>
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

	/* ── Consignment Form ── */
	.cf-wrap {
		border-top: 1px solid rgba(22, 11, 17, 0.08);
		padding-top: 48px;
	}

	.cf-head-row {
		margin-bottom: 36px;
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

	.cf-form {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.cf-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px 32px;
	}

	.cf-field {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.cf-field--full {
		grid-column: 1 / -1;
	}

	.cf-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.6);
	}

	.cf-req {
		color: #a1846d;
	}

	.cf-input,
	.cf-select {
		width: 100%;
		box-sizing: border-box;
		padding: 11px 14px;
		background: #faf9f8;
		border: 1px solid rgba(22, 11, 17, 0.14);
		border-radius: 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
		outline: none;
		appearance: none;
		-webkit-appearance: none;
	}

	.cf-input::placeholder { color: rgba(22, 11, 17, 0.3); }

	.cf-input:focus,
	.cf-select:focus {
		border-color: #a1846d;
		box-shadow: 0 0 0 3px rgba(161, 132, 109, 0.12);
		background: #fff;
	}

	.cf-field--error .cf-input,
	.cf-field--error .cf-select {
		border-color: #c0392b;
	}

	.cf-select-wrap {
		position: relative;
	}

	.cf-select-wrap .cf-select {
		padding-right: 36px;
		cursor: pointer;
	}

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

	.cf-error {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		color: #c0392b;
		margin: 0;
		font-weight: 400;
	}

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

	.cf-radio:checked + .cf-radio-box {
		border-color: #a1846d;
	}

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

	.cf-submit-row {
		display: flex;
		align-items: center;
		gap: 24px;
		flex-wrap: wrap;
		padding-top: 8px;
	}

	.cf-submit-btn {
		display: inline-flex;
		align-items: center;
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
		white-space: nowrap;
		flex-shrink: 0;
	}

	.cf-submit-btn:hover:not(:disabled) {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(161, 132, 109, 0.28);
		gap: 14px;
	}

	.cf-submit-btn:active:not(:disabled) { transform: translateY(0); }

	.cf-submit-btn:disabled {
		opacity: 0.6;
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

	.cf-submit-note {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		color: rgba(22, 11, 17, 0.4);
		margin: 0;
		font-weight: 300;
		line-height: 1.5;
	}

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
		.consign-pillars {
			grid-template-columns: 1fr;
			gap: 32px;
		}
		.consign-body { padding: 60px 30px 72px; }
		.consign-banner-content { padding: 36px 30px; }
	}

	@media (max-width: 480px) {
		.consign-banner { height: clamp(260px, 60vw, 380px); }
		.consign-body { padding: 48px 20px 60px; }
		.consign-banner-content { padding: 28px 20px; }
		.cf-submit-row { flex-direction: column; align-items: flex-start; gap: 14px; }
		.cf-submit-btn { width: 100%; justify-content: center; }
	}

	@media (max-width: 640px) {
		.cf-row { grid-template-columns: 1fr; gap: 20px; }
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

	/* Modal responsive */
	@media (max-width: 520px) {
		.vm-body { padding: 24px 20px 28px; }
		.vm-header { padding: 16px 20px 14px; }
		.vm-brand-input { font-size: 1.5rem; }
		.vm-brand-crumb-name { font-size: 1.35rem; }
		.vm-form-row { grid-template-columns: 1fr; }
	}

</style>

