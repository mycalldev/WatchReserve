<script>
	import { onMount, onDestroy } from 'svelte';

	const STORAGE_KEY = 'wr_api_modal_dismissed_until';
	const SUPPRESS_HOURS = 24;

	let visible = $state(false);
	let animateIn = $state(false);
	let submitted = $state(false);
	let submitting = $state(false);

	let name = $state('');
	let email = $state('');

	let triggered = false;
	let timeoutId;

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
		// double rAF ensures the element is in the DOM before the class is applied
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				animateIn = true;
			})
		);
	}

	function dismiss() {
		animateIn = false;
		setTimeout(() => (visible = false), 360);
		try {
			localStorage.setItem(STORAGE_KEY, String(Date.now() + SUPPRESS_HOURS * 3600 * 1000));
		} catch { /* ignore */ }
	}

	function handleKeydown(e) {
		if (e.key === 'Escape' && visible) dismiss();
	}

	function removeListeners() {
		if (typeof window === 'undefined') return;
		window.removeEventListener('mousemove', show);
		window.removeEventListener('scroll', show);
		window.removeEventListener('touchstart', show);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!name.trim() || !email.trim()) return;
		submitting = true;
		// Replace with your real API / email service call
		await new Promise((r) => setTimeout(r, 900));
		submitting = false;
		submitted = true;
		setTimeout(() => dismiss(), 3200);
	}

	onMount(() => {
		if (isDismissed()) return;

		// Trigger on first interaction
		window.addEventListener('mousemove', show, { once: true, passive: true });
		window.addEventListener('scroll', show, { once: true, passive: true });
		window.addEventListener('touchstart', show, { once: true, passive: true });

		// Fallback: show after 4s even with no interaction
		timeoutId = setTimeout(show, 4000);
	});

	onDestroy(() => {
		clearTimeout(timeoutId);
		removeListeners();
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
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>

		<!-- Dark header panel -->
		<div class="modal-header">
			<div class="modal-badge">
				<span class="badge-dot" aria-hidden="true"></span>
				Limited Access
			</div>

			<h2 class="modal-title" id="modal-title">
				7-Day Free Trial of the<br /><em>Watch Reserve API</em>
			</h2>

			<p class="modal-sub">
				Real-time luxury watch market data. Access live pricing, historical trends, and 40,000+ references — free for 7 days.
			</p>
		</div>

		<!-- White form panel -->
		<div class="modal-body">
			{#if submitted}
				<div class="success-state" role="status">
					<div class="success-icon">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					</div>
					<p class="success-title">You're on the list!</p>
					<p class="success-msg">We'll send your API credentials within 24 hours.</p>
				</div>
			{:else}
				<form class="modal-form" onsubmit={handleSubmit} novalidate>
					<div class="field">
						<label for="modal-name" class="field-label">Full Name</label>
						<input
							id="modal-name"
							type="text"
							class="field-input"
							placeholder="Jane Smith"
							bind:value={name}
							required
							autocomplete="name"
						/>
					</div>

					<div class="field">
						<label for="modal-email" class="field-label">Email Address</label>
						<input
							id="modal-email"
							type="email"
							class="field-input"
							placeholder="jane@example.com"
							bind:value={email}
							required
							autocomplete="email"
						/>
					</div>

					<button type="submit" class="submit-btn" disabled={submitting || !name.trim() || !email.trim()}>
						{#if submitting}
							<span class="spinner" aria-hidden="true"></span>
							Activating…
						{:else}
							Start Free Trial
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						{/if}
					</button>
				</form>
			{/if}

			<!-- Feature pills -->
			<div class="feature-pills">
				<span class="pill">Live Pricing</span>
				<span class="pill">40,000+ References</span>
				<span class="pill">REST &amp; GraphQL</span>
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
	}

	.backdrop.visible { opacity: 1; }

	/* ── MODAL ── */
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -46%) scale(0.97);
		z-index: 1101;
		width: min(94vw, 500px);
		border-radius: 20px;
		overflow: hidden;
		opacity: 0;
		box-shadow:
			0 0 0 1px rgba(255, 255, 255, 0.06),
			0 8px 32px rgba(0, 0, 0, 0.28),
			0 32px 80px rgba(0, 0, 0, 0.32);
		transition:
			opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.modal.visible {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	/* ── CLOSE BUTTON ── */
	.close-btn {
		position: absolute;
		top: 14px;
		right: 14px;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
		z-index: 10;
	}

	.close-btn:hover {
		background-color: rgba(255, 255, 255, 0.18);
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.25);
	}

	/* ── HEADER PANEL (dark) ── */
	.modal-header {
		position: relative;
		background: linear-gradient(145deg, #160b11 0%, #2d1320 55%, #1e0c17 100%);
		padding: 36px 36px 32px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		overflow: hidden;
	}

	/* decorative circle accent */
	.modal-header::before {
		content: '';
		position: absolute;
		top: -60px;
		right: -60px;
		width: 220px;
		height: 220px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(161, 132, 109, 0.12) 0%, transparent 70%);
		pointer-events: none;
	}

	.modal-header::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(161, 132, 109, 0.4), transparent);
	}

	/* ── BADGE ── */
	.modal-badge {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background-color: rgba(161, 132, 109, 0.14);
		border: 1px solid rgba(161, 132, 109, 0.3);
		color: #c9a882;
		padding: 5px 13px;
		border-radius: 100px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		align-self: flex-start;
		position: relative;
		z-index: 1;
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
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.5rem, 4.5vw, 1.9rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0;
		line-height: 1.22;
		letter-spacing: -0.025em;
		position: relative;
		z-index: 1;
	}

	.modal-title em {
		font-style: italic;
		color: #b99578;
	}

	/* ── SUBTITLE ── */
	.modal-sub {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.55);
		margin: 0;
		line-height: 1.6;
		position: relative;
		z-index: 1;
	}

	/* ── BODY PANEL (white) ── */
	.modal-body {
		background-color: #ffffff;
		padding: 32px 36px 36px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	/* ── FORM ── */
	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.field-label {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #999;
	}

	.field-input {
		width: 100%;
		padding: 13px 16px;
		border: 1.5px solid #e8e3e1;
		border-radius: 10px;
		background-color: #fdfcfc;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9375rem;
		color: #160b11;
		outline: none;
		transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
		box-sizing: border-box;
	}

	.field-input::placeholder { color: #c8c0bc; }

	.field-input:focus {
		border-color: #a1846d;
		box-shadow: 0 0 0 3.5px rgba(161, 132, 109, 0.12);
		background-color: #ffffff;
	}

	/* ── SUBMIT ── */
	.submit-btn {
		width: 100%;
		height: 52px;
		background: linear-gradient(135deg, #a1846d 0%, #8d7060 100%);
		color: #ffffff;
		border: none;
		border-radius: 10px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9375rem;
		font-weight: 600;
		letter-spacing: 0.025em;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease;
		box-shadow: 0 2px 8px rgba(161, 132, 109, 0.25), 0 1px 2px rgba(0, 0, 0, 0.08);
		margin-top: 4px;
	}

	.submit-btn:hover:not(:disabled) {
		opacity: 0.92;
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(161, 132, 109, 0.38), 0 2px 6px rgba(0, 0, 0, 0.1);
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

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	/* ── SUCCESS ── */
	.success-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 12px;
		padding: 8px 0 4px;
	}

	.success-icon {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(22, 163, 74, 0.06) 100%);
		border: 1.5px solid rgba(22, 163, 74, 0.22);
		color: #16a34a;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 4px;
	}

	.success-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.3rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.01em;
	}

	.success-msg {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.875rem;
		color: #888;
		margin: 0;
		line-height: 1.55;
	}

	/* ── FEATURE PILLS ── */
	.feature-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		justify-content: center;
		border-top: 1px solid #f0ebe8;
		padding-top: 20px;
	}

	.pill {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.72rem;
		font-weight: 500;
		color: #a1846d;
		background-color: rgba(161, 132, 109, 0.08);
		border: 1px solid rgba(161, 132, 109, 0.18);
		padding: 5px 13px;
		border-radius: 100px;
		letter-spacing: 0.02em;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 480px) {
		.modal { width: min(96vw, 500px); border-radius: 18px; }
		.modal-header { padding: 28px 24px 26px; }
		.modal-body { padding: 26px 24px 30px; }
	}
</style>
