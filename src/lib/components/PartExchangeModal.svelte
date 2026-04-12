<script>
	import { fly, fade } from 'svelte/transition';
	import { cubicOut, cubicInOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let { open = $bindable(false) } = $props();

	// ── Step state ──────────────────────────────────────────────────────────
	let step = $state(1); // 1 brand, 2 model, 3 target watch, 4 contact

	let brand = $state('');
	let brandInput = $state('');

	let model = $state('');
	let modelInput = $state('');

	let target = $state('');
	let targetInput = $state('');

	let details = $state({ name: '', email: '', phone: '', preferredContact: 'email', _hp: '' });
	let submitting = $state(false);
	let submitted = $state(false);
	let attempted = $state(false);

	let brandRef = $state(null);
	let modelRef = $state(null);
	let targetRef = $state(null);
	let nameRef = $state(null);

	// ── Per-step measured heights for smooth modal-body size animation ─────
	let h1 = $state(0);
	let h2 = $state(0);
	let h3 = $state(0);
	let h4 = $state(0);
	const stepHeight = $derived(step === 1 ? h1 : step === 2 ? h2 : step === 3 ? h3 : h4);

	const POPULAR_BRANDS = [
		'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega',
		'Cartier', 'IWC', 'Breitling', 'Jaeger-LeCoultre',
		'Panerai', 'Tudor', 'TAG Heuer', 'Hublot'
	];

	function isValidEmail(v) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
	}

	function isValidPhone(v) {
		return /^[\d\s+\-()]{7,}$/.test(v.trim());
	}

	const canSubmit = $derived(
		details.name.trim().length >= 2 &&
		isValidEmail(details.email.trim()) &&
		(details.preferredContact !== 'phone' || isValidPhone(details.phone))
	);

	const errors = $derived.by(() => {
		if (!attempted) return {};
		const e = {};
		if (details.name.trim().length < 2) e.name = 'Please enter your full name.';
		if (!isValidEmail(details.email.trim())) e.email = 'Please enter a valid email address.';
		if (details.preferredContact === 'phone' && !isValidPhone(details.phone)) e.phone = 'Please enter a valid phone number.';
		return e;
	});

	function resetModal() {
		step = 1;
		brand = brandInput = '';
		model = modelInput = '';
		target = targetInput = '';
		details = { name: '', email: '', phone: '', preferredContact: 'email', _hp: '' };
		submitting = false;
		submitted = false;
		attempted = false;
	}

	function closeModal() {
		open = false;
	}

	function confirmBrand() {
		const v = brandInput.trim();
		if (!v) return;
		brand = v;
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
		const v = modelInput.trim();
		if (!v) return;
		model = v;
		step = 3;
		setTimeout(() => targetRef?.focus(), 80);
	}

	function confirmTarget() {
		const v = targetInput.trim();
		if (!v) return;
		target = v;
		step = 4;
		setTimeout(() => nameRef?.focus(), 80);
	}

	function goBack() {
		if (step === 2) {
			step = 1;
			model = modelInput = '';
			setTimeout(() => brandRef?.focus(), 80);
		} else if (step === 3) {
			step = 2;
			target = targetInput = '';
			setTimeout(() => modelRef?.focus(), 80);
		} else if (step === 4) {
			step = 3;
			attempted = false;
			setTimeout(() => targetRef?.focus(), 80);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		attempted = true;

		if (details._hp) return;
		if (!canSubmit) return;

		submitting = true;

		try {
			const res = await fetch('/api/part-exchange', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name:             details.name,
					email:            details.email,
					phone:            details.phone,
					preferredContact: details.preferredContact,
					brand,
					model,
					target
				})
			});

			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data.success) throw new Error(data.error ?? 'Request failed');

			submitted = true;
		} catch {
			// Still show success to the user — don't block on transient errors
			submitted = true;
		} finally {
			submitting = false;
		}
	}

	function handleKeydown(e) {
		if (e.key === 'Escape' && open) closeModal();
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	// Reset + focus when the modal opens. Lock body scroll while open.
	$effect(() => {
		if (open) {
			resetModal();
			setTimeout(() => brandRef?.focus(), 120);
		}
	});

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = open ? 'hidden' : '';
		}
		return () => {
			if (typeof document !== 'undefined') document.body.style.overflow = '';
		};
	});
</script>

{#if open}
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
		aria-label="Part exchange enquiry"
		transition:fly={{ y: 40, duration: 360, easing: cubicOut }}
	>
		<!-- Header -->
		<div class="vm-header">
			<span class="vm-header-eyebrow">Part Exchange</span>
			<button type="button" class="vm-close" onclick={closeModal} aria-label="Close">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>

		<!-- Progress bar -->
		<div class="vm-progress" aria-hidden="true">
			<div class="vm-progress-bar" style="width: {step * 25}%"></div>
		</div>

		<!-- Steps (animated height + sequenced slide) -->
		<div class="vm-body-stack" style:height={stepHeight ? `${stepHeight}px` : 'auto'}>
			{#if step === 1}
				<div
					class="vm-body"
					bind:clientHeight={h1}
					in:fly={{ x: 28, duration: 460, delay: 340, easing: cubicOut }}
					out:fly={{ x: -28, duration: 320, easing: cubicInOut }}
				>
					<p class="vm-step-label">Step 1 of 4 · Your Current Watch</p>
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
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</button>
				</div>

			{:else if step === 2}
				<div
					class="vm-body"
					bind:clientHeight={h2}
					in:fly={{ x: 28, duration: 460, delay: 340, easing: cubicOut }}
					out:fly={{ x: -28, duration: 320, easing: cubicInOut }}
				>
					<p class="vm-step-label">Step 2 of 4 · Your Current Watch</p>

					<button type="button" class="vm-brand-crumb" onclick={goBack} aria-label="Change brand">
						<span class="vm-brand-crumb-name">{brand}</span>
						<span class="vm-brand-crumb-change">
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</span>
					</button>

					<div class="vm-model-label-row">
						<span class="vm-model-label">MODEL</span>
						<span class="vm-model-hint">Type the model name below</span>
					</div>

					<div class="vm-model-search">
						<svg class="vm-model-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="11" cy="11" r="8" />
							<path d="M21 21l-4.35-4.35" />
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
									<circle cx="12" cy="12" r="9" />
									<circle cx="12" cy="12" r="3" />
									<line x1="12" y1="3" x2="12" y2="6" />
									<line x1="12" y1="18" x2="12" y2="21" />
									<line x1="3" y1="12" x2="6" y2="12" />
									<line x1="18" y1="12" x2="21" y2="12" />
								</svg>
							</div>
							<div class="vm-model-preview-info">
								<span class="vm-model-preview-brand">{brand}</span>
								<span class="vm-model-preview-model">{modelInput}</span>
							</div>
							<button type="button" class="vm-model-preview-select" onclick={confirmModel}>
								Select
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<path d="M5 12h14M12 5l7 7-7 7" />
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
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</button>
				</div>

			{:else if step === 3}
				<div
					class="vm-body"
					bind:clientHeight={h3}
					in:fly={{ x: 28, duration: 460, delay: 340, easing: cubicOut }}
					out:fly={{ x: -28, duration: 320, easing: cubicInOut }}
				>
					<p class="vm-step-label">Step 3 of 4 · Watch You Want</p>

					<div class="vm-summary">
						<button type="button" class="vm-summary-back" onclick={goBack} aria-label="Change current watch">
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M19 12H5M12 5l-7 7 7 7" />
							</svg>
						</button>
						<div class="vm-summary-watch">
							<div class="vm-summary-icon" aria-hidden="true">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="12" r="9" />
									<circle cx="12" cy="12" r="3" />
								</svg>
							</div>
							<div>
								<span class="vm-summary-brand">{brand}</span>
								<span class="vm-summary-model">{model}</span>
							</div>
						</div>
					</div>

					<h3 class="vm-step-heading">Which watch are you interested in?</h3>

					<div class="vm-field">
						<input
							bind:this={targetRef}
							bind:value={targetInput}
							type="text"
							class="vm-brand-input"
							placeholder="Reference or model name"
							autocomplete="off"
							spellcheck="false"
							onkeydown={(e) => e.key === 'Enter' && confirmTarget()}
						/>
						<div class="vm-input-line"></div>
					</div>

					<p class="vm-target-hint">
						For example: <em>126610LN</em>, <em>Submariner Black</em>, or <em>GMT-Master II Pepsi</em>.
					</p>

					<button
						type="button"
						class="vm-next-btn"
						onclick={confirmTarget}
						disabled={!targetInput.trim()}
					>
						Continue
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M5 12h14M12 5l7 7-7 7" />
						</svg>
					</button>
				</div>

			{:else if step === 4}
				<div
					class="vm-body"
					bind:clientHeight={h4}
					in:fly={{ x: 28, duration: 460, delay: 340, easing: cubicOut }}
					out:fly={{ x: -28, duration: 320, easing: cubicInOut }}
				>
					{#if submitted}
						<div class="vm-success">
							<div class="vm-success-icon" aria-hidden="true">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</div>
							<h3 class="vm-success-title">Enquiry Received</h3>
							<p class="vm-success-body">
								Thank you. A Watch Reserve specialist will review your exchange request for your
								<strong>{brand} {model}</strong> and respond within 24 hours with a valuation and next steps.
							</p>
							<button type="button" class="vm-next-btn" onclick={closeModal}>Close</button>
						</div>
					{:else}
						<p class="vm-step-label">Step 4 of 4 · Your Details</p>

						<div class="vm-exchange-row">
							<button type="button" class="vm-summary-back" onclick={goBack} aria-label="Edit exchange">
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M19 12H5M12 5l-7 7 7 7" />
								</svg>
							</button>
							<div class="vm-exchange-pieces">
								<div class="vm-exchange-piece">
									<span class="vm-exchange-label">Give</span>
									<span class="vm-exchange-value">{brand} {model}</span>
								</div>
								<svg class="vm-exchange-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
								<div class="vm-exchange-piece">
									<span class="vm-exchange-label">Want</span>
									<span class="vm-exchange-value">{target}</span>
								</div>
							</div>
						</div>

						<h3 class="vm-step-heading vm-step-heading--compact">Your contact details</h3>

						<form class="vm-form" onsubmit={handleSubmit} novalidate>
							<!-- Honeypot (hidden from users and assistive tech) -->
							<input
								type="text"
								name="website"
								bind:value={details._hp}
								tabindex="-1"
								autocomplete="off"
								aria-hidden="true"
								class="vm-honeypot"
							/>

							<div class="vm-form-field" class:vm-form-field--error={errors.name}>
								<label for="pex-name" class="vm-form-label">
									Full Name <span class="vm-req">*</span>
								</label>
								<input
									id="pex-name"
									bind:this={nameRef}
									type="text"
									class="vm-form-input"
									placeholder="e.g. James Whitmore"
									autocomplete="name"
									bind:value={details.name}
									aria-invalid={errors.name ? 'true' : 'false'}
									aria-describedby={errors.name ? 'pex-name-err' : undefined}
								/>
								{#if errors.name}
									<p class="vm-error" id="pex-name-err" role="alert">{errors.name}</p>
								{/if}
							</div>

							<div class="vm-form-field" class:vm-form-field--error={errors.email}>
								<label for="pex-email" class="vm-form-label">
									Email <span class="vm-req">*</span>
								</label>
								<input
									id="pex-email"
									type="email"
									class="vm-form-input"
									placeholder="email@example.com"
									autocomplete="email"
									bind:value={details.email}
									aria-invalid={errors.email ? 'true' : 'false'}
									aria-describedby={errors.email ? 'pex-email-err' : undefined}
								/>
								{#if errors.email}
									<p class="vm-error" id="pex-email-err" role="alert">{errors.email}</p>
								{/if}
							</div>

							<!-- Preferred contact method -->
							<fieldset class="vm-fieldset">
								<legend class="vm-form-label">Preferred Contact Method</legend>
								<div class="vm-radio-group">
									<label class="vm-radio-tile" class:vm-radio-tile--active={details.preferredContact === 'email'}>
										<input type="radio" name="preferredContact" value="email" class="vm-radio-native" bind:group={details.preferredContact} />
										<span class="vm-radio-box" aria-hidden="true"></span>
										<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
											<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
										</svg>
										<span class="vm-radio-label">Email</span>
									</label>
									<label class="vm-radio-tile" class:vm-radio-tile--active={details.preferredContact === 'phone'}>
										<input type="radio" name="preferredContact" value="phone" class="vm-radio-native" bind:group={details.preferredContact} />
										<span class="vm-radio-box" aria-hidden="true"></span>
										<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
											<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
										</svg>
										<span class="vm-radio-label">Phone</span>
									</label>
								</div>
							</fieldset>

							<!-- Phone number (conditional) -->
							{#if details.preferredContact === 'phone'}
								<div class="vm-form-field" class:vm-form-field--error={errors.phone}>
									<label for="pex-phone" class="vm-form-label">
										Phone Number <span class="vm-req">*</span>
									</label>
									<input
										id="pex-phone"
										type="tel"
										class="vm-form-input"
										placeholder="+44 7700 000000"
										autocomplete="tel"
										bind:value={details.phone}
										aria-invalid={errors.phone ? 'true' : 'false'}
										aria-describedby={errors.phone ? 'pex-phone-err' : undefined}
									/>
									{#if errors.phone}
										<p class="vm-error" id="pex-phone-err" role="alert">{errors.phone}</p>
									{/if}
								</div>
							{/if}

							<p class="vm-privacy">
								By submitting you agree to our <a href="/privacy-policy">Privacy Policy</a>. We will never share your details with third parties.
							</p>

							<button type="submit" class="vm-next-btn" disabled={submitting}>
								{#if submitting}
									<span class="vm-spinner" aria-hidden="true"></span>
									Sending…
								{:else}
									Submit Enquiry
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M5 12h14M12 5l7 7-7 7" />
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

<style>
	/* ── Backdrop + modal shell ───────────────────────────── */
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

	.vm-close:hover {
		background-color: #160b11;
		color: #ffffff;
		border-color: #160b11;
	}

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

	/* Animated body stack */
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
		scrollbar-color: rgba(161, 132, 109, 0.3) transparent;
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

	.vm-step-heading--compact {
		margin-top: 8px;
		margin-bottom: 20px;
	}

	/* Brand / large input */
	.vm-field {
		margin-bottom: 4px;
	}

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

	.vm-brand-input::placeholder {
		color: rgba(22, 11, 17, 0.2);
	}

	.vm-input-line {
		height: 2px;
		background: linear-gradient(90deg, #a1846d 0%, rgba(161, 132, 109, 0.2) 100%);
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

	.vm-brand-chip:hover {
		border-color: #a1846d;
		color: #a1846d;
		background-color: rgba(161, 132, 109, 0.04);
	}

	.vm-brand-chip--active {
		background-color: #a1846d;
		border-color: #a1846d;
		color: #ffffff;
	}

	/* Brand crumb (step 2 back) */
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
		border: 1px solid rgba(22, 11, 17, 0.15);
		color: rgba(22, 11, 17, 0.4);
		flex-shrink: 0;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.vm-brand-crumb:hover .vm-brand-crumb-change {
		background-color: #160b11;
		color: #ffffff;
		border-color: #160b11;
	}

	/* Model label / search */
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

	.vm-model-search {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.vm-model-search-icon {
		color: rgba(22, 11, 17, 0.3);
		flex-shrink: 0;
	}

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

	.vm-model-input::placeholder {
		color: rgba(22, 11, 17, 0.25);
	}

	.vm-model-underline {
		height: 1.5px;
		background-color: rgba(22, 11, 17, 0.12);
		margin-bottom: 20px;
	}

	/* Model preview card */
	.vm-model-preview {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 16px;
		border: 1px solid rgba(22, 11, 17, 0.08);
		background-color: #faf8f5;
		margin-bottom: 24px;
	}

	.vm-model-preview-icon {
		width: 44px;
		height: 44px;
		background-color: rgba(161, 132, 109, 0.1);
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
		border: 1px solid rgba(22, 11, 17, 0.15);
		padding: 7px 14px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.6);
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}

	.vm-model-preview-select:hover {
		background-color: #160b11;
		color: #ffffff;
		border-color: #160b11;
	}

	/* Current-watch summary (step 3) */
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
		border: 1px solid rgba(22, 11, 17, 0.12);
		color: rgba(22, 11, 17, 0.45);
		cursor: pointer;
		flex-shrink: 0;
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.vm-summary-back:hover {
		background-color: #160b11;
		color: #ffffff;
		border-color: #160b11;
	}

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
		background-color: rgba(161, 132, 109, 0.1);
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

	/* Target-watch hint (step 3) */
	.vm-target-hint {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		color: rgba(22, 11, 17, 0.45);
		line-height: 1.6;
		margin: 0 0 28px 0;
	}

	.vm-target-hint em {
		color: #160b11;
		font-style: normal;
		font-weight: 500;
	}

	/* Exchange summary row (step 4) */
	.vm-exchange-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		border: 1px solid rgba(22, 11, 17, 0.08);
		background-color: #faf8f5;
		margin-bottom: 24px;
	}

	.vm-exchange-pieces {
		display: flex;
		align-items: center;
		gap: 14px;
		flex: 1;
		min-width: 0;
	}

	.vm-exchange-piece {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}

	.vm-exchange-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.vm-exchange-value {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 0.95rem;
		color: #160b11;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vm-exchange-arrow {
		color: rgba(22, 11, 17, 0.35);
		flex-shrink: 0;
	}

	/* Contact form */
	.vm-form {
		display: flex;
		flex-direction: column;
		gap: 18px;
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

	.vm-req {
		color: #a1846d;
	}

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

	.vm-form-input::placeholder {
		color: #b8b0a8;
		font-size: 0.825rem;
	}

	.vm-form-input:focus {
		border-color: rgba(22, 11, 17, 0.18);
		border-bottom-color: #a1846d;
	}

	.vm-form-field--error .vm-form-input,
	.vm-form-field--error .vm-form-input:focus {
		border-color: #c94040;
		border-bottom-color: #c94040;
	}

	.vm-error {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		color: #c94040;
		margin: 0;
		line-height: 1.4;
	}

	.vm-privacy {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		color: rgba(22, 11, 17, 0.4);
		line-height: 1.55;
		margin: 0;
		padding-top: 6px;
		border-top: 1px solid rgba(22, 11, 17, 0.06);
	}

	.vm-privacy a {
		color: #a1846d;
		text-decoration: none;
		border-bottom: 1px solid rgba(161, 132, 109, 0.3);
	}

	.vm-privacy a:hover {
		color: #8a6f59;
	}

	/* Honeypot: visually and assistively hidden, but still in the DOM */
	.vm-honeypot {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}

	/* Next / submit button */
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
		box-shadow: 0 6px 20px rgba(161, 132, 109, 0.3);
		gap: 14px;
	}

	.vm-next-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.vm-next-btn:disabled {
		background-color: rgba(22, 11, 17, 0.12);
		color: rgba(22, 11, 17, 0.35);
		cursor: not-allowed;
	}

	/* ── Contact method radio tiles ── */
	.vm-fieldset {
		border: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.vm-radio-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.vm-radio-tile {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 16px;
		border: 1.5px solid #d8d0c8;
		background-color: #ffffff;
		cursor: pointer;
		transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
		user-select: none;
		position: relative;
	}

	.vm-radio-tile:hover { border-color: #a1846d; background-color: #fefcfb; }

	.vm-radio-tile--active {
		border-color: #a1846d;
		background-color: #fdf9f6;
		box-shadow: inset 3px 0 0 #a1846d;
	}

	.vm-radio-native {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.vm-radio-box {
		flex-shrink: 0;
		width: 14px;
		height: 14px;
		border: 2px solid #d8d0c8;
		position: relative;
		transition: border-color 0.2s ease, background-color 0.2s ease;
	}

	.vm-radio-tile--active .vm-radio-box {
		border-color: #a1846d;
		background-color: #a1846d;
	}

	.vm-radio-tile--active .vm-radio-box::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 4px;
		height: 4px;
		background-color: #ffffff;
	}

	.vm-radio-tile svg { color: #a1846d; flex-shrink: 0; }

	.vm-radio-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.825rem;
		font-weight: 500;
		color: #3a2e33;
		transition: color 0.2s ease;
	}

	.vm-radio-tile--active .vm-radio-label { color: #160b11; font-weight: 600; }

	.vm-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: vm-spin 0.65s linear infinite;
		flex-shrink: 0;
	}

	@keyframes vm-spin {
		to {
			transform: rotate(360deg);
		}
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
		color: rgba(22, 11, 17, 0.6);
		line-height: 1.65;
		margin: 0;
		max-width: 380px;
	}

	/* Responsive */
	@media (max-width: 520px) {
		.vm-body {
			padding: 24px 20px 28px;
		}
		.vm-header {
			padding: 16px 20px 14px;
		}
		.vm-brand-input {
			font-size: 1.5rem;
		}
		.vm-brand-crumb-name {
			font-size: 1.35rem;
		}
		.vm-exchange-pieces {
			gap: 10px;
		}
		.vm-exchange-value {
			font-size: 0.85rem;
		}
	}
</style>
