<script>
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'wr_cookie_consent';

	let visible = $state(false);
	let animateIn = $state(false);

	function hasConsented() {
		try {
			return !!localStorage.getItem(STORAGE_KEY);
		} catch {
			return false;
		}
	}

	function saveConsent(value) {
		try {
			localStorage.setItem(STORAGE_KEY, value);
		} catch { /* ignore */ }
	}

	function dismiss(choice) {
		saveConsent(choice);
		animateIn = false;
		setTimeout(() => (visible = false), 380);
	}

	onMount(() => {
		if (hasConsented()) return;
		visible = true;
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				animateIn = true;
			})
		);
	});
</script>

{#if visible}
	<div
		class="cookie-bar"
		class:visible={animateIn}
		role="region"
		aria-label="Cookie consent"
	>
		<div class="cookie-inner">
			<div class="cookie-icon" aria-hidden="true">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
					<circle cx="12" cy="12" r="1" fill="currentColor" />
					<circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
					<circle cx="15.5" cy="8.5" r="1" fill="currentColor" />
					<circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
				</svg>
			</div>

			<div class="cookie-content">
				<p class="cookie-title">We use cookies</p>
				<p class="cookie-text">
					We use cookies to enhance your experience, analyse site traffic, and personalise content.
					By continuing, you agree to our
					<a href="/privacy-policy" class="cookie-link">Privacy Policy</a>.
				</p>
			</div>

			<div class="cookie-actions">
				<button class="btn-decline" onclick={() => dismiss('declined')}>
					Decline
				</button>
				<button class="btn-accept" onclick={() => dismiss('accepted')}>
					Accept All
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.cookie-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1200;
		background: linear-gradient(180deg, #1e0e19 0%, #160b11 100%);
		border-top: 1px solid rgba(161, 132, 109, 0.35);
		box-shadow:
			0 -4px 24px rgba(0, 0, 0, 0.4),
			0 -1px 0 rgba(161, 132, 109, 0.15);
		transform: translateY(100%);
		opacity: 0;
		transition:
			transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform, opacity;
		-webkit-font-smoothing: antialiased;
	}

	.cookie-bar.visible {
		transform: translateY(0);
		opacity: 1;
	}

	.cookie-inner {
		max-width: 1280px;
		margin: 0 auto;
		padding: 18px 32px;
		display: flex;
		align-items: center;
		gap: 20px;
	}

	/* ── ICON ── */
	.cookie-icon {
		flex-shrink: 0;
		color: #a1846d;
		opacity: 0.85;
		display: flex;
		align-items: center;
	}

	/* ── CONTENT ── */
	.cookie-content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.cookie-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		font-weight: 700;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.9);
		margin: 0;
	}

	.cookie-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.45);
		margin: 0;
		line-height: 1.55;
	}

	.cookie-link {
		color: #b99578;
		text-decoration: none;
		border-bottom: 1px solid rgba(185, 149, 120, 0.35);
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.cookie-link:hover {
		color: #a1846d;
		border-bottom-color: rgba(161, 132, 109, 0.7);
	}

	/* ── ACTIONS ── */
	.cookie-actions {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	.btn-decline {
		height: 40px;
		padding: 0 20px;
		background: transparent;
		color: rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.15);
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
		white-space: nowrap;
	}

	.btn-decline:hover {
		color: rgba(255, 255, 255, 0.75);
		border-color: rgba(255, 255, 255, 0.3);
		background-color: rgba(255, 255, 255, 0.06);
	}

	.btn-accept {
		height: 40px;
		padding: 0 22px;
		background: linear-gradient(135deg, #a1846d 0%, #8d7060 100%);
		color: #ffffff;
		border: none;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		box-shadow: 0 2px 10px rgba(161, 132, 109, 0.3);
		transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease;
		white-space: nowrap;
	}

	.btn-accept:hover {
		opacity: 0.9;
		transform: translateY(-1px);
		box-shadow: 0 5px 18px rgba(161, 132, 109, 0.42);
	}

	.btn-accept:active {
		transform: translateY(0);
		box-shadow: 0 1px 5px rgba(161, 132, 109, 0.22);
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 768px) {
		.cookie-inner {
			padding: 16px 20px;
			gap: 16px;
		}

		.cookie-icon {
			display: none;
		}
	}

	@media (max-width: 560px) {
		.cookie-inner {
			flex-direction: column;
			align-items: flex-start;
			gap: 14px;
			padding: 18px 20px 20px;
		}

		.cookie-actions {
			width: 100%;
			justify-content: flex-end;
		}
	}
</style>
