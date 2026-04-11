<script>
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	/** @type {{ title: string, vendor: string, reference: string | null, price: string | null, currencyCode: string, status: string | null }} */
	let { title = '', vendor = '', reference = null, price = null, currencyCode = 'GBP', status = null } = $props();

	// ── Drawer state ───────────────────────────────────────────────────────────
	let open = $state(false);

	function toggle() { open = !open; }

	// ── Form state ─────────────────────────────────────────────────────────────
	const defaultMessage = reference
		? `I am interested in the ${vendor} ${title} (Ref. ${reference}) and would like to learn more.`
		: `I am interested in the ${vendor} ${title} and would like to learn more.`;

	let formData = $state({
		fullName:         '',
		email:            '',
		phone:            '',
		interest:         'private-viewing',
		preferredContact: 'email',
		message:          defaultMessage
	});

	let isSubmitting  = $state(false);
	let submitSuccess = $state(false);
	let submitError   = $state(false);
	let touched       = $state({});

	const MESSAGE_MAX = 600;

	const interestOptions = [
		{ value: 'general-inquiry',       label: 'General Inquiry' },
		{ value: 'private-viewing',       label: 'Private Viewing' },
		{ value: 'servicing-maintenance', label: 'Servicing / Maintenance' },
		{ value: 'specific-collection',   label: 'Specific Collection' }
	];

	function markTouched(field) { touched[field] = true; }

	function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
	function isValidPhone(v) { return /^[\d\s\+\-\(\)]{7,}$/.test(v.trim()); }

	const fieldValid = $derived({
		fullName: formData.fullName.trim().length >= 2,
		email:    isValidEmail(formData.email),
		phone:    formData.preferredContact !== 'phone' || isValidPhone(formData.phone),
		interest: formData.interest !== ''
	});

	const messageLen = $derived(formData.message.length);

	const canSubmit = $derived(
		fieldValid.fullName && fieldValid.email && fieldValid.phone &&
		fieldValid.interest && messageLen <= MESSAGE_MAX
	);

	async function handleSubmit(e) {
		e.preventDefault();
		touched = { fullName: true, email: true, phone: true, interest: true };
		if (!canSubmit) return;

		isSubmitting  = true;
		submitError   = false;
		submitSuccess = false;

		try {
			const res = await fetch('/api/product-enquiry', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					productTitle:     title,
					productVendor:    vendor,
					productReference: reference,
					productStatus:    status,
					productPrice:     price,
					productCurrency:  currencyCode
				})
			});

			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data.success) throw new Error(data.error ?? 'Request failed');

			submitSuccess = true;
			formData = {
				fullName: '', email: '', phone: '',
				interest: 'private-viewing', preferredContact: 'email',
				message: defaultMessage
			};
			touched = {};
		} catch {
			submitError = true;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<!-- ── Drawer root ── -->
<div class="eq-root">

	<!-- Trigger bar -->
	<button
		class="eq-trigger"
		class:eq-trigger--open={open}
		onclick={toggle}
		type="button"
		aria-expanded={open}
		aria-controls="eq-panel"
	>
		<div class="eq-trigger-left">
			<span class="eq-trigger-icon" aria-hidden="true">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
					<polyline points="22,6 12,13 2,6"/>
				</svg>
			</span>
			<div class="eq-trigger-copy">
				<span class="eq-trigger-label">Enquire About This Watch</span>
				<span class="eq-trigger-sub">Speak with a specialist</span>
			</div>
		</div>
		<span class="eq-chevron" class:eq-chevron--open={open} aria-hidden="true">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M6 9l6 6 6-6"/>
			</svg>
		</span>
	</button>

	<!-- Collapsible panel -->
	{#if open}
		<div
			id="eq-panel"
			class="eq-panel"
			transition:slide={{ duration: 320, easing: cubicOut }}
		>
			<div class="eq-panel-inner">

				<!-- Product context pill -->
				<div class="eq-context">
					<span class="eq-context-eyebrow">Enquiring about</span>
					<div class="eq-context-details">
						<span class="eq-context-model">{vendor} {title}</span>
						{#if reference}
							<code class="eq-context-ref">Ref. {reference}</code>
						{/if}
					</div>
				</div>

				{#if submitSuccess}
					<div class="eq-success" role="status" aria-live="polite">
						<span class="eq-success-icon" aria-hidden="true">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 6L9 17l-5-5"/>
							</svg>
						</span>
						<div>
							<p class="eq-success-title">Enquiry sent</p>
							<p class="eq-success-body">Thank you — a Watch Reserve specialist will be in touch shortly.</p>
						</div>
					</div>
				{/if}

				<form class="eq-form" onsubmit={handleSubmit} novalidate>

					<!-- Row: Full Name + Email -->
					<div class="eq-row-2">

						<div class="eq-field" class:eq-field--error={touched.fullName && !fieldValid.fullName} class:eq-field--ok={touched.fullName && fieldValid.fullName}>
							<label for="eq-fullname" class="eq-label">
								Full Name <span class="eq-req" aria-hidden="true">*</span>
							</label>
							<div class="eq-input-wrap">
								<input
									id="eq-fullname"
									name="fullName"
									type="text"
									class="eq-input"
									placeholder="e.g. James Whitmore"
									autocomplete="name"
									bind:value={formData.fullName}
									onblur={() => markTouched('fullName')}
								/>
								{#if touched.fullName && fieldValid.fullName}
									<span class="eq-tick" aria-hidden="true">
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
									</span>
								{/if}
							</div>
							{#if touched.fullName && !fieldValid.fullName}
								<p class="eq-hint-err">Please enter your full name.</p>
							{/if}
						</div>

						<div class="eq-field" class:eq-field--error={touched.email && !fieldValid.email} class:eq-field--ok={touched.email && fieldValid.email}>
							<label for="eq-email" class="eq-label">
								Email <span class="eq-req" aria-hidden="true">*</span>
							</label>
							<div class="eq-input-wrap">
								<input
									id="eq-email"
									name="email"
									type="email"
									class="eq-input"
									placeholder="you@example.com"
									autocomplete="email"
									bind:value={formData.email}
									onblur={() => markTouched('email')}
								/>
								{#if touched.email && fieldValid.email}
									<span class="eq-tick" aria-hidden="true">
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
									</span>
								{/if}
							</div>
							{#if touched.email && !fieldValid.email}
								<p class="eq-hint-err">Please enter a valid email.</p>
							{/if}
						</div>

					</div>

					<!-- Interest -->
					<div class="eq-field" class:eq-field--error={touched.interest && !fieldValid.interest} class:eq-field--ok={touched.interest && fieldValid.interest}>
						<label for="eq-interest" class="eq-label">
							Area of Interest <span class="eq-req" aria-hidden="true">*</span>
						</label>
						<div class="eq-select-wrap">
							<select
								id="eq-interest"
								name="interest"
								class="eq-select"
								bind:value={formData.interest}
								onblur={() => markTouched('interest')}
								onchange={() => markTouched('interest')}
							>
								{#each interestOptions as opt}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
							<span class="eq-select-arrow" aria-hidden="true">
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
							</span>
						</div>
					</div>

					<!-- Preferred Contact -->
					<fieldset class="eq-fieldset">
						<legend class="eq-label">Preferred Contact Method</legend>
						<div class="eq-radio-group">

							<label class="eq-radio-tile" class:eq-radio-tile--active={formData.preferredContact === 'email'}>
								<input type="radio" name="preferredContact" value="email" class="eq-radio-native" bind:group={formData.preferredContact} />
								<span class="eq-radio-box" aria-hidden="true"></span>
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
								</svg>
								<span class="eq-radio-label">Email</span>
							</label>

							<label class="eq-radio-tile" class:eq-radio-tile--active={formData.preferredContact === 'phone'}>
								<input type="radio" name="preferredContact" value="phone" class="eq-radio-native" bind:group={formData.preferredContact} />
								<span class="eq-radio-box" aria-hidden="true"></span>
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
								</svg>
								<span class="eq-radio-label">Phone</span>
							</label>

						</div>
					</fieldset>

					<!-- Phone (conditional) -->
					{#if formData.preferredContact === 'phone'}
						<div
							class="eq-field eq-field--phone"
							class:eq-field--error={touched.phone && !fieldValid.phone}
							class:eq-field--ok={touched.phone && fieldValid.phone}
							transition:slide={{ duration: 240, easing: cubicOut }}
						>
							<label for="eq-phone" class="eq-label">
								Phone Number <span class="eq-req" aria-hidden="true">*</span>
							</label>
							<div class="eq-input-wrap">
								<input
									id="eq-phone"
									name="phone"
									type="tel"
									class="eq-input"
									placeholder="+44 7700 000000"
									autocomplete="tel"
									bind:value={formData.phone}
									onblur={() => markTouched('phone')}
								/>
								{#if touched.phone && fieldValid.phone && formData.phone}
									<span class="eq-tick" aria-hidden="true">
										<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
									</span>
								{/if}
							</div>
							{#if touched.phone && !fieldValid.phone}
								<p class="eq-hint-err">Please enter a valid phone number.</p>
							{/if}
						</div>
					{/if}

					<!-- Message -->
					<div class="eq-field">
						<div class="eq-label-row">
							<label for="eq-message" class="eq-label">
								Message <span class="eq-optional">Optional</span>
							</label>
							<span class="eq-counter" class:eq-counter--warn={messageLen > MESSAGE_MAX * 0.85} class:eq-counter--over={messageLen > MESSAGE_MAX}>
								{messageLen} / {MESSAGE_MAX}
							</span>
						</div>
						<textarea
							id="eq-message"
							name="message"
							class="eq-textarea"
							rows="4"
							bind:value={formData.message}
						></textarea>
					</div>

					<!-- Privacy -->
					<p class="eq-privacy">
						By submitting you agree to our
						<a href="/privacy-policy" class="eq-privacy-link">Privacy Policy</a>.
					</p>

					{#if submitError}
						<p class="eq-error-msg" role="alert">Something went wrong — please try again.</p>
					{/if}

					<!-- Submit -->
					<button type="submit" class="eq-submit" disabled={isSubmitting} aria-busy={isSubmitting}>
						{#if isSubmitting}
							<span class="eq-spinner" aria-hidden="true"></span>
							Sending…
						{:else}
							Send Enquiry
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M5 12h14M12 5l7 7-7 7"/>
							</svg>
						{/if}
					</button>

				</form>
			</div>
		</div>
	{/if}

</div>

<style>
	/* ── Root ── */
	.eq-root {
		border: 1px solid rgba(22, 11, 17, 0.12);
		overflow: hidden;
	}

	/* ── Trigger ── */
	.eq-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 18px 22px;
		background-color: #faf8f5;
		border: none;
		border-radius: 0;
		cursor: pointer;
		transition: background-color 0.2s ease;
		text-align: left;
	}

	.eq-trigger:hover { background-color: #f3ede8; }
	.eq-trigger--open { background-color: #422635; }

	.eq-trigger-left {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.eq-trigger-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: #a1846d;
		transition: color 0.2s ease;
	}

	.eq-trigger--open .eq-trigger-icon { color: rgba(255, 255, 255, 0.7); }

	.eq-trigger-copy {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.eq-trigger-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		color: #160b11;
		letter-spacing: 0.01em;
		transition: color 0.2s ease;
	}

	.eq-trigger--open .eq-trigger-label { color: #ffffff; }

	.eq-trigger-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		font-weight: 400;
		color: rgba(22, 11, 17, 0.5);
		transition: color 0.2s ease;
	}

	.eq-trigger--open .eq-trigger-sub { color: rgba(255, 255, 255, 0.55); }

	/* Chevron */
	.eq-chevron {
		display: flex;
		color: #a1846d;
		flex-shrink: 0;
		transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.2s ease;
	}

	.eq-chevron--open { transform: rotate(180deg); color: rgba(255, 255, 255, 0.7); }

	/* ── Panel ── */
	.eq-panel {
		border-top: 1px solid rgba(22, 11, 17, 0.08);
		background-color: #ffffff;
	}

	.eq-panel-inner {
		padding: 28px 24px 32px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	/* ── Product context badge ── */
	.eq-context {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 14px 18px;
		background-color: #f9f5f7;
		border-left: 3px solid #422635;
	}

	.eq-context-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.eq-context-details {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.eq-context-model {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 0.9375rem;
		color: #160b11;
		font-weight: 400;
	}

	.eq-context-ref {
		font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.75rem;
		color: #7a5c44;
		background-color: rgba(66, 38, 53, 0.08);
		padding: 2px 8px;
		border-radius: 3px;
		font-weight: 500;
	}

	/* ── Success banner ── */
	.eq-success {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		background-color: #f4f9f5;
		border: 1px solid rgba(34, 160, 90, 0.2);
		border-left: 3px solid #22a05a;
		padding: 16px 18px;
	}

	.eq-success-icon {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		background-color: #22a05a;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.eq-success-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 0.9375rem;
		color: #1a4a2e;
		margin: 0 0 3px;
	}

	.eq-success-body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.825rem;
		color: rgba(26, 74, 46, 0.8);
		margin: 0;
		line-height: 1.5;
	}

	/* ── Form ── */
	.eq-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	/* Two-col row */
	.eq-row-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	/* ── Field ── */
	.eq-field { display: flex; flex-direction: column; gap: 7px; }

	/* ── Label ── */
	.eq-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #3a2e33;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.eq-label-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.eq-req { color: #a1846d; font-size: 0.75rem; }

	.eq-optional {
		font-size: 0.6rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		color: #aaa;
		text-transform: uppercase;
	}

	/* ── Input ── */
	.eq-input-wrap { position: relative; }

	.eq-input {
		width: 100%;
		box-sizing: border-box;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 11px 36px 11px 13px;
		outline: none;
		transition: border-color 0.2s ease, background-color 0.2s ease;
		-webkit-appearance: none;
	}

	.eq-input::placeholder { color: #b8b0a8; font-size: 0.825rem; }

	.eq-input:focus {
		border-color: rgba(22,11,17,0.18);
		border-bottom-color: #a1846d;
		background-color: #fefcfb;
	}

	.eq-field--ok    .eq-input { border-bottom-color: #22a05a; }
	.eq-field--error .eq-input { border-bottom-color: #c94040; background-color: #fff8f8; }

	.eq-tick {
		position: absolute;
		right: 11px;
		top: 50%;
		transform: translateY(-50%);
		color: #22a05a;
		display: flex;
		pointer-events: none;
	}

	.eq-hint-err {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		color: #c94040;
		margin: 0;
	}

	/* ── Select ── */
	.eq-select-wrap { position: relative; }

	.eq-select {
		width: 100%;
		box-sizing: border-box;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 11px 40px 11px 13px;
		outline: none;
		cursor: pointer;
		-webkit-appearance: none;
		appearance: none;
		transition: border-color 0.2s ease;
	}

	.eq-select:focus {
		border-color: rgba(22,11,17,0.18);
		border-bottom-color: #a1846d;
	}

	.eq-select-arrow {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: #a1846d;
		pointer-events: none;
		display: flex;
		transition: transform 0.2s ease, color 0.2s ease;
	}

	.eq-select-wrap:focus-within .eq-select-arrow {
		transform: translateY(-50%) rotate(180deg);
		color: #a1846d;
	}

	/* ── Fieldset ── */
	.eq-fieldset {
		border: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	/* ── Radio tiles ── */
	.eq-radio-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.eq-radio-tile {
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

	.eq-radio-tile:hover { border-color: #a1846d; background-color: #fefcfb; }

	.eq-radio-tile--active {
		border-color: #a1846d;
		background-color: #fdf9f6;
		box-shadow: inset 3px 0 0 #a1846d;
	}

	.eq-radio-native {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.eq-radio-box {
		flex-shrink: 0;
		width: 14px;
		height: 14px;
		border: 2px solid #d8d0c8;
		position: relative;
		transition: border-color 0.2s ease, background-color 0.2s ease;
	}

	.eq-radio-tile--active .eq-radio-box {
		border-color: #a1846d;
		background-color: #a1846d;
	}

	.eq-radio-tile--active .eq-radio-box::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 4px;
		height: 4px;
		background-color: #ffffff;
	}

	.eq-radio-tile svg { color: #a1846d; flex-shrink: 0; transition: color 0.2s ease; }
	.eq-radio-tile--active svg { color: #a1846d; }

	.eq-radio-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.825rem;
		font-weight: 500;
		color: #3a2e33;
		transition: color 0.2s ease;
	}

	.eq-radio-tile--active .eq-radio-label { color: #160b11; font-weight: 600; }

	/* ── Textarea ── */
	.eq-textarea {
		width: 100%;
		box-sizing: border-box;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 12px 14px;
		outline: none;
		resize: vertical;
		min-height: 100px;
		line-height: 1.6;
		transition: border-color 0.2s ease, background-color 0.2s ease;
		-webkit-appearance: none;
	}

	.eq-textarea:focus {
		border-color: rgba(22,11,17,0.18);
		border-bottom-color: #a1846d;
		background-color: #fefcfb;
	}

	/* ── Counter ── */
	.eq-counter {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		color: #bbb;
		font-variant-numeric: tabular-nums;
		transition: color 0.2s ease;
	}

	.eq-counter--warn { color: #c9a230; }
	.eq-counter--over { color: #c94040; font-weight: 600; }

	/* ── Privacy ── */
	.eq-privacy {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		color: rgba(22, 11, 17, 0.42);
		line-height: 1.5;
		margin: 0;
		padding-top: 4px;
		border-top: 1px solid rgba(22, 11, 17, 0.06);
	}

	.eq-privacy-link {
		color: #a1846d;
		text-decoration: none;
		border-bottom: 1px solid rgba(161, 132, 109, 0.3);
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.eq-privacy-link:hover { color: #8a6f59; border-color: #8a6f59; }

	/* ── Error ── */
	.eq-error-msg {
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

	/* ── Submit ── */
	.eq-submit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		padding: 14px 28px;
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		border-radius: 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease, gap 0.25s ease;
	}

	.eq-submit:hover:not(:disabled) {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(161, 132, 109, 0.32);
		gap: 14px;
	}

	.eq-submit:active:not(:disabled) { transform: translateY(0); }

	.eq-submit:disabled { opacity: 0.55; cursor: not-allowed; }

	.eq-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: eq-spin 0.65s linear infinite;
		flex-shrink: 0;
	}

	@keyframes eq-spin { to { transform: rotate(360deg); } }

	/* ── Responsive ── */
	@media (max-width: 900px) {
		.eq-panel-inner { padding: 24px 20px 28px; }
	}

	@media (max-width: 640px) {
		.eq-trigger { padding: 16px 18px; }

		.eq-row-2 {
			grid-template-columns: 1fr;
		}

		.eq-radio-group { grid-template-columns: 1fr 1fr; }

		.eq-panel-inner { padding: 20px 16px 24px; gap: 18px; }
	}

	@media (max-width: 380px) {
		.eq-radio-group { grid-template-columns: 1fr; }
	}
</style>
