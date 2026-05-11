<script>
	import { trackEvent } from '$lib/ga.js';

	let { source = 'Contact Page' } = $props();

	let formData = $state({
		fullName:        '',
		email:           '',
		phone:           '',
		interest:        '',
		preferredContact: 'email',
		message:         ''
	});

	let isSubmitting = $state(false);
	let submitSuccess = $state(false);
	let submitError   = $state(false);
	let touched       = $state({});
	let wrapRef       = $state(null);
	let gdprConsent   = $state(false);

	const MESSAGE_MAX = 600;

	const interestOptions = [
		{ value: '',                       label: 'Select an interest…' },
		{ value: 'general-inquiry',        label: 'General Inquiry' },
		{ value: 'private-viewing',        label: 'Private Viewing' },
		{ value: 'servicing-maintenance',  label: 'Servicing / Maintenance' },
		{ value: 'specific-collection',    label: 'Specific Collection' }
	];

	function markTouched(field) {
		touched[field] = true;
	}

	function isValidEmail(v) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
	}

	function isValidPhone(v) {
		return /^[\d\s\+\-\(\)]{7,}$/.test(v.trim());
	}

	const fieldValid = $derived({
		fullName: formData.fullName.trim().length >= 2,
		email:    isValidEmail(formData.email),
		phone:    formData.preferredContact !== 'phone' || isValidPhone(formData.phone),
		interest: formData.interest !== ''
	});

	const messageLen = $derived(formData.message.length);

	const canSubmit = $derived(
		fieldValid.fullName &&
		fieldValid.email &&
		fieldValid.phone &&
		fieldValid.interest &&
		messageLen <= MESSAGE_MAX
	);

	async function handleSubmit(e) {
		e.preventDefault();
		touched = { fullName: true, email: true, phone: true, interest: true };
		if (!canSubmit) return;

		isSubmitting = true;
		submitError  = false;
		submitSuccess = false;

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...formData, source, gdprConsent })
			});

			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data.success) {
				throw new Error(data.error ?? 'Request failed');
			}

			submitSuccess = true;
			trackEvent('form_submit', { form_name: 'luxury_contact', source });
			formData = { fullName: '', email: '', phone: '', interest: '', preferredContact: 'email', message: '' };
			touched = {};
			setTimeout(() => wrapRef?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
		} catch {
			submitError = true;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="lf-wrap" bind:this={wrapRef}>

	<!-- Form header accent -->
	<div class="lf-head">
		<span class="lf-eyebrow">Enquiry Form</span>
		<div class="lf-rule"></div>
	</div>

	{#if submitSuccess}
		<div class="lf-success" role="status" aria-live="polite">
			<div class="lf-success-icon" aria-hidden="true">
				<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="20 6 9 17 4 12"/>
				</svg>
			</div>
			<h3 class="lf-success-title">Enquiry Received</h3>
			<p class="lf-success-body">Thank you. A member of the Watch Reserve team will be in touch shortly.</p>
			<button type="button" class="lf-success-btn" onclick={() => { submitSuccess = false; }}>
				Send Another Enquiry
			</button>
		</div>
	{:else}

	<form class="lf-form" onsubmit={handleSubmit} novalidate>

		<!-- ── Row 1: Full Name + Email ── -->
		<div class="lf-row lf-row--2col">

			<div class="lf-field" class:lf-field--error={touched.fullName && !fieldValid.fullName} class:lf-field--ok={touched.fullName && fieldValid.fullName}>
				<label for="lf-fullname" class="lf-label">
					Full Name <span class="lf-required" aria-hidden="true">*</span>
				</label>
				<div class="lf-input-wrap">
					<input
						id="lf-fullname"
						name="fullName"
						type="text"
						class="lf-input"
						placeholder="e.g. James Whitmore"
						autocomplete="name"
						required
						bind:value={formData.fullName}
						onblur={() => markTouched('fullName')}
					/>
					{#if touched.fullName && fieldValid.fullName}
						<span class="lf-tick" aria-hidden="true">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
						</span>
					{/if}
				</div>
				{#if touched.fullName && !fieldValid.fullName}
					<p class="lf-hint-error">Please enter your full name.</p>
				{/if}
			</div>

			<div class="lf-field" class:lf-field--error={touched.email && !fieldValid.email} class:lf-field--ok={touched.email && fieldValid.email}>
				<label for="lf-email" class="lf-label">
					Email Address <span class="lf-required" aria-hidden="true">*</span>
				</label>
				<div class="lf-input-wrap">
					<input
						id="lf-email"
						name="email"
						type="email"
						class="lf-input"
						placeholder="email@example.com"
						autocomplete="email"
						required
						bind:value={formData.email}
						onblur={() => markTouched('email')}
					/>
					{#if touched.email && fieldValid.email}
						<span class="lf-tick" aria-hidden="true">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
						</span>
					{/if}
				</div>
				{#if touched.email && !fieldValid.email}
					<p class="lf-hint-error">Please enter a valid email address.</p>
				{/if}
			</div>

		</div>

		<!-- ── Interest dropdown ── -->
		<div class="lf-field" class:lf-field--error={touched.interest && !fieldValid.interest} class:lf-field--ok={touched.interest && fieldValid.interest}>
			<label for="lf-interest" class="lf-label">
				Area of Interest <span class="lf-required" aria-hidden="true">*</span>
			</label>
			<div class="lf-select-wrap">
				<select
					id="lf-interest"
					name="interest"
					class="lf-select"
					required
					bind:value={formData.interest}
					onblur={() => markTouched('interest')}
					onchange={() => markTouched('interest')}
				>
					{#each interestOptions as opt}
						<option value={opt.value} disabled={opt.value === ''} selected={opt.value === ''}>
							{opt.label}
						</option>
					{/each}
				</select>
				<span class="lf-select-arrow" aria-hidden="true">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
				</span>
			</div>
			{#if touched.interest && !fieldValid.interest}
				<p class="lf-hint-error">Please select an area of interest.</p>
			{/if}
		</div>

		<!-- ── Preferred Contact Method ── -->
		<fieldset class="lf-fieldset">
			<legend class="lf-label">Preferred Contact Method</legend>
			<div class="lf-radio-group" role="radiogroup">

				<label class="lf-radio-tile" class:lf-radio-tile--active={formData.preferredContact === 'email'}>
					<input
						type="radio"
						name="preferredContact"
						value="email"
						class="lf-radio-input"
						bind:group={formData.preferredContact}
						aria-label="Preferred contact: Email"
					/>
					<span class="lf-radio-indicator" aria-hidden="true"></span>
					<span class="lf-radio-icon" aria-hidden="true">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
							<polyline points="22,6 12,13 2,6"/>
						</svg>
					</span>
					<span class="lf-radio-label">Email</span>
				</label>

				<label class="lf-radio-tile" class:lf-radio-tile--active={formData.preferredContact === 'phone'}>
					<input
						type="radio"
						name="preferredContact"
						value="phone"
						class="lf-radio-input"
						bind:group={formData.preferredContact}
						aria-label="Preferred contact: Phone"
					/>
					<span class="lf-radio-indicator" aria-hidden="true"></span>
					<span class="lf-radio-icon" aria-hidden="true">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
						</svg>
					</span>
					<span class="lf-radio-label">Phone</span>
				</label>

			</div>
		</fieldset>

		<!-- ── Phone number (conditional) ── -->
		{#if formData.preferredContact === 'phone'}
			<div
				class="lf-field lf-field--phone"
				class:lf-field--error={touched.phone && !fieldValid.phone}
				class:lf-field--ok={touched.phone && fieldValid.phone}
			>
				<label for="lf-phone" class="lf-label">
					Phone Number <span class="lf-required" aria-hidden="true">*</span>
				</label>
				<div class="lf-input-wrap">
					<input
						id="lf-phone"
						name="phone"
						type="tel"
						class="lf-input"
						placeholder="+44 7700 000000"
						autocomplete="tel"
						bind:value={formData.phone}
						onblur={() => markTouched('phone')}
					/>
					{#if touched.phone && fieldValid.phone && formData.phone}
						<span class="lf-tick" aria-hidden="true">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
						</span>
					{/if}
				</div>
				{#if touched.phone && !fieldValid.phone}
					<p class="lf-hint-error">Please enter a valid phone number.</p>
				{/if}
			</div>
		{/if}

		<!-- ── Message ── -->
		<div class="lf-field">
			<div class="lf-label-row">
				<label for="lf-message" class="lf-label">
					Message
					<span class="lf-optional">Optional</span>
				</label>
				<span class="lf-counter" class:lf-counter--warn={messageLen > MESSAGE_MAX * 0.85} class:lf-counter--over={messageLen > MESSAGE_MAX}>
					{messageLen} / {MESSAGE_MAX}
				</span>
			</div>
			<textarea
				id="lf-message"
				name="message"
				class="lf-textarea"
				rows="5"
				placeholder="Tell us a little more about your enquiry — a specific reference, condition preference, or any questions you may have…"
				maxlength={MESSAGE_MAX + 50}
				bind:value={formData.message}
			></textarea>
		</div>

		<!-- ── Divider + privacy ── -->
		<div class="lf-privacy">
			By submitting this form you agree to our
			<a href="/privacy-policy" class="lf-privacy-link">Privacy Policy</a>
			and consent to being contacted by Watch Reserve.
		</div>

		<label class="gdpr-check">
			<input type="checkbox" bind:checked={gdprConsent} class="gdpr-check-input" />
			<span class="gdpr-check-box" aria-hidden="true"></span>
			<span class="gdpr-check-label">I am happy to receive updates and offers from Watch Reserve by email.</span>
		</label>

		<!-- ── Error banner ── -->
		{#if submitError}
			<div class="lf-error-banner" role="alert">
				Something went wrong. Please try again or contact us directly.
			</div>
		{/if}

		<!-- ── Submit ── -->
		<button
			type="submit"
			class="lf-submit"
			disabled={isSubmitting}
			aria-busy={isSubmitting}
		>
			{#if isSubmitting}
				<span class="lf-submit-spinner" aria-hidden="true"></span>
				Sending…
			{:else}
				Send Enquiry
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
			{/if}
		</button>

	</form>
	{/if}
</div>

<style>
	/* ── Wrapper ── */
	.lf-wrap {
		width: 100%;
	}

	/* ── Form header ── */
	.lf-head {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 36px;
	}

	.lf-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		white-space: nowrap;
	}

	.lf-rule {
		flex: 1;
		height: 1px;
		background: linear-gradient(to right, rgba(22,11,17,0.15), transparent);
	}

	/* ── Form layout ── */
	.lf-form {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.lf-row { display: contents; }

	.lf-row--2col {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	/* ── Field ── */
	.lf-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	/* ── Label ── */
	.lf-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #3a2e33;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.lf-required { color: #a1846d; font-size: 0.8rem; }

	.lf-optional {
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		color: #aaa;
		text-transform: uppercase;
		margin-left: 2px;
	}

	.lf-label-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* ── Input wrapper (for tick icon) ── */
	.lf-input-wrap {
		position: relative;
	}

	/* ── Text input ── */
	.lf-input {
		width: 100%;
		box-sizing: border-box;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 400;
		color: #160b11;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 13px 40px 13px 16px;
		outline: none;
		transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
		-webkit-appearance: none;
	}

	.lf-input::placeholder { color: #b8b0a8; }

	.lf-input:focus {
		border-color: rgba(22,11,17,0.2);
		border-bottom-color: #a1846d;
		background-color: #fefcfb;
		box-shadow: 0 2px 0 0 rgba(161, 132, 109, 0.12);
	}

	/* Field states */
	.lf-field--ok  .lf-input  { border-bottom-color: #22a05a; }
	.lf-field--error .lf-input { border-bottom-color: #c94040; background-color: #fff8f8; }

	/* Tick icon */
	.lf-tick {
		position: absolute;
		right: 13px;
		top: 50%;
		transform: translateY(-50%);
		color: #22a05a;
		display: flex;
		pointer-events: none;
	}

	/* Error hint */
	.lf-hint-error {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		color: #c94040;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	/* ── Select ── */
	.lf-select-wrap {
		position: relative;
	}

	.lf-select {
		width: 100%;
		box-sizing: border-box;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 400;
		color: #160b11;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 13px 44px 13px 16px;
		outline: none;
		cursor: pointer;
		-webkit-appearance: none;
		appearance: none;
		transition: border-color 0.2s ease, background-color 0.2s ease;
	}

	.lf-select:focus {
		border-color: rgba(22,11,17,0.2);
		border-bottom-color: #a1846d;
		background-color: #fefcfb;
	}

	.lf-field--ok .lf-select    { border-bottom-color: #22a05a; }
	.lf-field--error .lf-select { border-bottom-color: #c94040; background-color: #fff8f8; }

	.lf-select option[value=""] { color: #b8b0a8; }

	.lf-select-arrow {
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: #a1846d;
		pointer-events: none;
		display: flex;
		transition: transform 0.2s ease;
	}

	.lf-select-wrap:focus-within .lf-select-arrow {
		transform: translateY(-50%) rotate(180deg);
		color: #a1846d;
	}

	/* ── Fieldset reset ── */
	.lf-fieldset {
		border: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.lf-fieldset .lf-label { margin-bottom: 4px; }

	/* ── Radio tiles ── */
	.lf-radio-group {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.lf-radio-tile {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 20px;
		border: 1.5px solid #d8d0c8;
		background-color: #ffffff;
		cursor: pointer;
		transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
		user-select: none;
	}

	.lf-radio-tile:hover {
		border-color: #a1846d;
		background-color: #fefcfb;
	}

	.lf-radio-tile--active {
		border-color: #a1846d;
		background-color: #fdf9f6;
		box-shadow: inset 3px 0 0 #a1846d;
	}

	/* Hide native radio */
	.lf-radio-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	/* Custom radio indicator (small square) */
	.lf-radio-indicator {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
		border: 2px solid #d8d0c8;
		position: relative;
		transition: border-color 0.2s ease, background-color 0.2s ease;
	}

	.lf-radio-tile--active .lf-radio-indicator {
		border-color: #a1846d;
		background-color: #a1846d;
	}

	.lf-radio-tile--active .lf-radio-indicator::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 5px;
		height: 5px;
		background-color: #ffffff;
	}

	.lf-radio-icon {
		color: #a1846d;
		display: flex;
		flex-shrink: 0;
		transition: color 0.2s ease;
	}

	.lf-radio-tile--active .lf-radio-icon { color: #a1846d; }

	.lf-radio-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #3a2e33;
		transition: color 0.2s ease;
	}

	.lf-radio-tile--active .lf-radio-label { color: #160b11; font-weight: 600; }

	/* ── Phone field slide-in ── */
	.lf-field--phone {
		animation: slideDown 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	@keyframes slideDown {
		from { opacity: 0; transform: translateY(-10px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	/* ── Textarea ── */
	.lf-textarea {
		width: 100%;
		box-sizing: border-box;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 400;
		color: #160b11;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 14px 16px;
		outline: none;
		resize: vertical;
		min-height: 130px;
		line-height: 1.65;
		transition: border-color 0.2s ease, background-color 0.2s ease;
		-webkit-appearance: none;
	}

	.lf-textarea::placeholder { color: #b8b0a8; }

	.lf-textarea:focus {
		border-color: rgba(22,11,17,0.2);
		border-bottom-color: #a1846d;
		background-color: #fefcfb;
	}

	/* ── Character counter ── */
	.lf-counter {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		color: #bbb;
		font-variant-numeric: tabular-nums;
		transition: color 0.2s ease;
	}

	.lf-counter--warn { color: #c9a230; }
	.lf-counter--over { color: #c94040; font-weight: 600; }

	/* ── Privacy notice ── */
	.lf-privacy {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		color: rgba(22, 11, 17, 0.45);
		line-height: 1.6;
		padding-top: 4px;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
	}

	.lf-privacy-link {
		color: #a1846d;
		text-decoration: none;
		border-bottom: 1px solid rgba(161, 132, 109, 0.35);
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.lf-privacy-link:hover { color: #8a6f59; border-color: #8a6f59; }

	/* ── Error banner ── */
	.lf-error-banner {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #8b2635;
		background-color: #fff5f5;
		border: 1px solid rgba(139, 38, 53, 0.2);
		border-left: 3px solid #c94040;
		padding: 12px 16px;
		line-height: 1.5;
	}

	/* ── Success state ── */
	.lf-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 16px;
		padding: 48px 24px;
		animation: slideDown 0.3s ease;
	}

	.lf-success-icon {
		flex-shrink: 0;
		width: 64px;
		height: 64px;
		background-color: #a1846d;
		color: #ffffff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lf-success-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.5rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.01em;
	}

	.lf-success-body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		color: rgba(22, 11, 17, 0.6);
		margin: 0;
		line-height: 1.65;
		max-width: 360px;
	}

	.lf-success-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
		padding: 12px 28px;
		background: none;
		border: 1px solid rgba(22, 11, 17, 0.2);
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #160b11;
		cursor: pointer;
		transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
	}

	.lf-success-btn:hover {
		background-color: #160b11;
		border-color: #160b11;
		color: #ffffff;
	}

	/* ── Submit button ── */
	.lf-submit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		padding: 16px 32px;
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		border-radius: 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease, gap 0.25s ease;
		margin-top: 4px;
	}

	.lf-submit:hover:not(:disabled) {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(161, 132, 109, 0.32);
		gap: 14px;
	}

	.lf-submit:active:not(:disabled) { transform: translateY(0); }

	.lf-submit:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.lf-submit-spinner {
		width: 15px;
		height: 15px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 0.65s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	/* ── Responsive ── */
	@media (max-width: 640px) {
		.lf-row--2col {
			grid-template-columns: 1fr;
			display: flex;
			flex-direction: column;
		}

		.lf-radio-group {
			grid-template-columns: 1fr 1fr;
		}

		.lf-submit { font-size: 0.8125rem; }
	}

	@media (max-width: 400px) {
		.lf-radio-group { grid-template-columns: 1fr; }
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
		font-size: 0.875rem;
		color: rgba(22, 11, 17, 0.75);
		line-height: 1.55;
	}
</style>
