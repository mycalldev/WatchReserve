<script>
	import { onMount, onDestroy } from 'svelte';
	import { trackEvent } from '$lib/ga.js';
	import { setAskMeLater } from '$lib/askMeLater.js';

	const STORAGE_KEY = 'wr_valuation_modal_dismissed_until';
	const SUPPRESS_HOURS = 24;

	let visible = $state(false);
	let animateIn = $state(false);
	let submitted = $state(false);
	let submitting = $state(false);

	let fullName = $state('');
	let email = $state('');
	let gdprConsent = $state(false);
	let honeypot = $state('');

	let triggered = false;
	let timeoutId;
	let lockedScrollY = 0;

	// Locking the background page while the popup is open stops scroll from
	// chaining into it on mobile — without this, a swipe inside the popup's
	// scrollable content can rubber-band the page behind it and make the
	// fixed-position popup appear to jump sideways mid-scroll (WebKit quirk).
	function lockBodyScroll() {
		if (typeof document === 'undefined') return;
		lockedScrollY = window.scrollY;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${lockedScrollY}px`;
		document.body.style.left = '0';
		document.body.style.right = '0';
		document.body.style.width = '100%';
	}

	function unlockBodyScroll() {
		if (typeof document === 'undefined') return;
		document.body.style.position = '';
		document.body.style.top = '';
		document.body.style.left = '';
		document.body.style.right = '';
		document.body.style.width = '';
		window.scrollTo(0, lockedScrollY);
	}

	function isDismissed() {
		try {
			const until = localStorage.getItem(STORAGE_KEY);
			if (!until) return false;
			return Date.now() < parseInt(until, 10);
		} catch {
			return false;
		}
	}

	function show() {
		if (triggered) return;
		if (isDismissed()) return;
		triggered = true;
		clearTimeout(timeoutId);
		removeListeners();
		visible = true;
		lockBodyScroll();
		// double rAF ensures the element is in the DOM before the class is applied
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				animateIn = true;
			})
		);
	}

	function dismiss() {
		animateIn = false;
		setTimeout(() => {
			visible = false;
			unlockBodyScroll();
		}, 360);
		try {
			localStorage.setItem(STORAGE_KEY, String(Date.now() + SUPPRESS_HOURS * 3600 * 1000));
		} catch {
			/* ignore */
		}
	}

	function askMeLater() {
		setAskMeLater();
		trackEvent('form_dismiss', { form_name: 'free_valuation_popup', action: 'ask_me_later' });
		dismiss();
	}

	function handleKeydown(e) {
		if (e.key === 'Escape' && visible) dismiss();
	}

	function removeListeners() {
		if (typeof window === 'undefined') return;
		window.removeEventListener('scroll', show);
	}

	let submitError = $state('');
	let fieldErrors = $state({ fullName: '', email: '' });
	let nameInputEl = $state();
	let emailInputEl = $state();

	function validate() {
		const errors = { fullName: '', email: '' };

		if (!fullName.trim()) {
			errors.fullName = 'Please enter your full name.';
		}

		if (!email.trim()) {
			errors.email = 'Please enter your email address.';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			errors.email = 'Please enter a valid email address.';
		}

		fieldErrors = errors;
		return !errors.fullName && !errors.email;
	}

	function clearFieldError(field) {
		if (fieldErrors[field]) fieldErrors = { ...fieldErrors, [field]: '' };
	}

	async function handleSubmit(e) {
		e.preventDefault();

		if (!validate()) {
			(fieldErrors.fullName ? nameInputEl : emailInputEl)?.focus();
			return;
		}

		// Honeypot: a real visitor never fills this hidden field. If it's filled,
		// quietly treat it as success without contacting the server as a genuine lead.
		if (honeypot.trim()) {
			submitted = true;
			setTimeout(() => dismiss(), 3200);
			return;
		}

		submitting = true;
		submitError = '';

		try {
			const res = await fetch('/api/free-valuation', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fullName: fullName.trim(),
					email: email.trim(),
					gdprConsent,
					website: honeypot.trim()
				})
			});
			const data = await res.json();
			if (!res.ok) {
				submitError = data?.error || 'Something went wrong. Please try again.';
			} else {
				submitted = true;
				trackEvent('form_submit', { form_name: 'free_valuation_popup' });
				setTimeout(() => dismiss(), 3200);
			}
		} catch {
			submitError = 'Something went wrong. Please try again.';
		} finally {
			submitting = false;
		}
	}

	onMount(() => {
		if (isDismissed()) return;

		// Trigger as soon as the user starts scrolling
		window.addEventListener('scroll', show, { once: true, passive: true });

		// Fallback: show after 6s even with no scroll
		timeoutId = setTimeout(show, 6000);
	});

	onDestroy(() => {
		clearTimeout(timeoutId);
		removeListeners();
		if (visible) unlockBodyScroll();
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible}
	<!-- Backdrop -->
	<div
		class="backdrop"
		class:visible={animateIn}
		onclick={dismiss}
		role="presentation"
		aria-hidden="true"
	></div>

	<!-- Modal -->
	<div
		class="modal"
		class:visible={animateIn}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<button class="close-btn" onclick={dismiss} aria-label="Close">
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>

		<div class="modal-inner">
			<!-- Dark header panel -->
			<div class="modal-header">
				<div class="modal-header-content">
					<div class="modal-badge">
						<span class="badge-dot" aria-hidden="true"></span>
						Limited Time Offer
					</div>

					<h2 class="modal-title" id="modal-title">
						Free Same Day<br /><em>Valuation.</em>
					</h2>

					<p class="modal-sub">
						For the Month of September we are offering a Free Valuation on your Time Piece. Submit
						your Name and Email below and we'll be in touch with a confirmation email.
					</p>
				</div>
			</div>

			<!-- White form panel -->
			<div class="modal-body">
				<div class="modal-body-content">
					{#if submitted}
						<div class="success-state" role="status">
							<div class="success-icon">
								<svg
									width="28"
									height="28"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</div>
							<p class="success-title">Request Received!</p>
							<p class="success-msg">
								A member of our team will be in touch shortly with your free valuation.
							</p>
						</div>
					{:else}
						<form class="modal-form" onsubmit={handleSubmit} novalidate>
							<!-- Honeypot (hidden from users and assistive tech) -->
							<input
								type="text"
								name="website"
								bind:value={honeypot}
								tabindex="-1"
								autocomplete="off"
								aria-hidden="true"
								class="honeypot"
							/>

							<div class="field" class:field--error={fieldErrors.fullName}>
								<label for="modal-name" class="field-label">Full Name</label>
								<input
									id="modal-name"
									bind:this={nameInputEl}
									type="text"
									class="field-input"
									placeholder="Full Name"
									bind:value={fullName}
									oninput={() => clearFieldError('fullName')}
									required
									autocomplete="name"
									aria-invalid={fieldErrors.fullName ? 'true' : 'false'}
									aria-describedby={fieldErrors.fullName ? 'modal-name-error' : undefined}
								/>
								{#if fieldErrors.fullName}
									<p class="field-error" id="modal-name-error">{fieldErrors.fullName}</p>
								{/if}
							</div>

							<div class="field" class:field--error={fieldErrors.email}>
								<label for="modal-email" class="field-label">Email Address</label>
								<input
									id="modal-email"
									bind:this={emailInputEl}
									type="email"
									class="field-input"
									placeholder="email@example.com"
									bind:value={email}
									oninput={() => clearFieldError('email')}
									required
									autocomplete="email"
									aria-invalid={fieldErrors.email ? 'true' : 'false'}
									aria-describedby={fieldErrors.email ? 'modal-email-error' : undefined}
								/>
								{#if fieldErrors.email}
									<p class="field-error" id="modal-email-error">{fieldErrors.email}</p>
								{/if}
							</div>

							{#if submitError}
								<p class="submit-error">{submitError}</p>
							{/if}

							<label class="gdpr-check">
								<input type="checkbox" bind:checked={gdprConsent} class="gdpr-check-input" />
								<span class="gdpr-check-box" aria-hidden="true"></span>
								<span class="gdpr-check-label"
									>I am happy to receive updates and offers from Watch Reserve by email.</span
								>
							</label>

							<button type="submit" class="submit-btn" disabled={submitting}>
								{#if submitting}
									<span class="spinner" aria-hidden="true"></span>
									Submitting…
								{:else}
									Receive My Free Valuation
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										aria-hidden="true"
									>
										<path d="M5 12h14M12 5l7 7-7 7" />
									</svg>
								{/if}
							</button>

							<button type="button" class="ask-later-btn" onclick={askMeLater}>Ask Me Later</button>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* ── BACKDROP ── */
	.backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(6, 2, 5, 0.72);
		z-index: 1100;
		opacity: 0;
		transition: opacity 0.4s ease;
		overscroll-behavior: contain;
		touch-action: none;
	}

	.backdrop.visible {
		opacity: 1;
	}

	/* ── MODAL (80% of viewport, so the backdrop stays visible around it) ── */
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 80vw;
		height: 80dvh;
		max-width: 1400px;
		max-height: 900px;
		z-index: 1101;
		opacity: 0;
		overflow: hidden;
		box-shadow:
			0 0 0 1px rgba(255, 255, 255, 0.06),
			0 20px 60px rgba(0, 0, 0, 0.35),
			0 40px 120px rgba(0, 0, 0, 0.3);
		transform: translate(-50%, -50%) scale(0.97);
		transition:
			opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform, opacity;
		-webkit-font-smoothing: antialiased;
	}

	.modal.visible {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	.modal-inner {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100%;
	}

	/* ── CLOSE BUTTON ── */
	.close-btn {
		position: absolute;
		top: 20px;
		right: 20px;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.92);
		border: 1px solid rgba(22, 11, 17, 0.08);
		color: #160b11;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			transform 0.2s ease;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
		z-index: 1102;
	}

	.close-btn:hover {
		background-color: #ffffff;
		transform: scale(1.06);
	}

	/* ── HEADER PANEL (dark) ── */
	.modal-header {
		position: relative;
		flex: 1 1 50%;
		order: 2;
		background: linear-gradient(145deg, #160b11 0%, #2a1a14 55%, #1c110d 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 64px 72px 64px 64px;
		overflow: hidden;
	}

	.modal-header-content {
		position: relative;
		z-index: 1;
		max-width: 480px;
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	/* decorative circle accent */
	.modal-header::before {
		content: '';
		position: absolute;
		top: -100px;
		right: -100px;
		width: 360px;
		height: 360px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(161, 132, 109, 0.14) 0%, transparent 70%);
		pointer-events: none;
	}

	.modal-header::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 1px;
		background: linear-gradient(180deg, transparent, rgba(161, 132, 109, 0.4), transparent);
	}

	/* ── BADGE ── */
	.modal-badge {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background-color: rgba(161, 132, 109, 0.14);
		border: 1px solid rgba(161, 132, 109, 0.3);
		color: #c9a882;
		padding: 6px 14px;
		border-radius: 0;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		align-self: flex-start;
	}

	.badge-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background-color: #a1846d;
		flex-shrink: 0;
		box-shadow: 0 0 6px rgba(161, 132, 109, 0.6);
	}

	/* ── TITLE ── */
	.modal-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.9rem, 3.2vw, 2.9rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0;
		line-height: 1.18;
		letter-spacing: -0.025em;
	}

	.modal-title em {
		font-style: normal;
		color: #c9a882;
	}

	/* ── SUBTITLE ── */
	.modal-sub {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.9375rem, 1.15vw, 1.1875rem);
		color: #ffffff;
		margin: 0;
		line-height: 1.65;
	}

	/* ── BODY PANEL (white) ── */
	.modal-body {
		flex: 1 1 50%;
		order: 1;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 48px;
		overflow-y: auto;
	}

	.modal-body-content {
		width: 100%;
		max-width: 420px;
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	/* ── FORM ── */
	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	/* Honeypot: visually and assistively hidden, but still in the DOM */
	.honeypot {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.field-label {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.75rem, 0.65vw, 0.8125rem);
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #999;
	}

	.field-input {
		width: 100%;
		padding: 14px 16px;
		border: 1.5px solid #e8e3e1;
		border-radius: 0;
		background-color: #fdfcfc;
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.9375rem, 0.8vw, 1.0625rem);
		color: #160b11;
		outline: none;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background-color 0.2s ease;
		box-sizing: border-box;
	}

	.field-input::placeholder {
		color: #c8c0bc;
	}

	.field-input:focus {
		border-color: #a1846d;
		box-shadow: 0 0 0 3.5px rgba(161, 132, 109, 0.12);
		background-color: #ffffff;
	}

	.field--error .field-input {
		border-color: #c94040;
	}

	.field--error .field-input:focus {
		border-color: #c94040;
		box-shadow: 0 0 0 3.5px rgba(201, 64, 64, 0.12);
	}

	.field-error {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8125rem;
		color: #c94040;
		margin: 0;
	}

	/* ── SUBMIT ── */
	.submit-btn {
		width: 100%;
		height: 54px;
		background: linear-gradient(135deg, #a1846d 0%, #8d7060 100%);
		color: #ffffff;
		border: none;
		border-radius: 0;
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.9375rem, 0.8vw, 1.0625rem);
		font-weight: 600;
		letter-spacing: 0.025em;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.25s ease;
		box-shadow:
			0 2px 8px rgba(161, 132, 109, 0.25),
			0 1px 2px rgba(0, 0, 0, 0.08);
		margin-top: 4px;
	}

	.submit-btn:hover:not(:disabled) {
		opacity: 0.92;
		transform: translateY(-1px);
		box-shadow:
			0 6px 20px rgba(161, 132, 109, 0.38),
			0 2px 6px rgba(0, 0, 0, 0.1);
	}

	.submit-btn:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 1px 4px rgba(161, 132, 109, 0.2);
	}

	.submit-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		box-shadow: none;
	}

	.ask-later-btn {
		width: 100%;
		background: none;
		border: none;
		cursor: pointer;
		margin-top: -6px;
		padding: 6px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		color: #8d7060;
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 0.2s ease;
	}

	.ask-later-btn:hover {
		color: #160b11;
	}

	.submit-error {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8125rem;
		color: #c94040;
		margin: 0;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ── SUCCESS ── */
	.success-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 16px;
		padding: 24px 0 8px;
	}

	.success-icon {
		width: 56px;
		height: 56px;
		background-color: #a1846d;
		color: #ffffff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.success-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.375rem, 1.6vw, 1.625rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
	}

	.success-msg {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.875rem, 0.8vw, 1rem);
		color: rgba(22, 11, 17, 0.6);
		line-height: 1.65;
		margin: 0;
		max-width: 360px;
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
		border: 1.5px solid #e8e3e1;
		background-color: #fdfcfc;
		position: relative;
		margin-top: 1px;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
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
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.875rem, 0.7vw, 0.9375rem);
		color: #555;
		line-height: 1.55;
	}

	/* ── RESPONSIVE ── */

	/* Tablet and below: stack the two panels instead of a side-by-side split.
	   The card is a bounded box (80vw × 80dvh), so panels size to their own
	   content and the whole stack scrolls if it's taller than the box. */
	@media (max-width: 900px) {
		.modal-inner {
			flex-direction: column;
			overflow-y: auto;
			height: 100%;
			overscroll-behavior: contain;
			-webkit-overflow-scrolling: touch;
		}

		.modal-header {
			flex: none;
			order: 1;
			justify-content: center;
			padding: 56px 32px 28px;
		}

		.modal-header-content {
			max-width: 100%;
			gap: 14px;
		}

		.modal-header::before {
			top: -80px;
			right: -80px;
			width: 260px;
			height: 260px;
		}

		.modal-header::after {
			top: auto;
			left: 0;
			right: 0;
			bottom: 0;
			width: auto;
			height: 1px;
			background: linear-gradient(90deg, transparent, rgba(161, 132, 109, 0.4), transparent);
		}

		.modal-title {
			font-size: clamp(1.6rem, 6vw, 2.25rem);
		}

		.modal-body {
			flex: none;
			order: 2;
			padding: 28px 32px 32px;
			overflow-y: visible;
		}

		.close-btn {
			top: 18px;
			right: 18px;
		}
	}

	@media (max-width: 600px) {
		.modal {
			width: 90vw;
			height: 90dvh;
		}

		.close-btn {
			top: 12px;
			right: 12px;
			width: 30px;
			height: 30px;
		}

		.modal-header {
			justify-content: flex-start;
			padding: 16px 50px 14px 18px;
		}

		.modal-header-content {
			gap: 10px;
		}

		.modal-title {
			font-size: clamp(1.3rem, 6vw, 1.7rem);
			line-height: 1.15;
		}

		.modal-sub {
			font-size: 0.82rem;
			line-height: 1.4;
		}

		.modal-body {
			padding: 16px 18px 18px;
		}

		.modal-body-content {
			gap: 16px;
		}

		.modal-form {
			gap: 13px;
		}

		.field-input {
			padding: 10px 12px;
		}

		.submit-btn {
			height: 44px;
			margin-top: 0;
		}

		.ask-later-btn {
			margin-top: 2px;
			padding: 4px;
		}

		.gdpr-check-label {
			font-size: 0.8rem;
			line-height: 1.4;
		}
	}
</style>
