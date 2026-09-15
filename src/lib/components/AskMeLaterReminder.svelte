<script>
	import { onMount } from 'svelte';
	import { consumeAskMeLater } from '$lib/askMeLater.js';

	let visible = $state(false);
	let animateIn = $state(false);
	let showTimeoutId;

	function dismiss() {
		animateIn = false;
		setTimeout(() => {
			visible = false;
		}, 420);
	}

	onMount(() => {
		if (!consumeAskMeLater()) return;

		visible = true;
		// Small delay so the slide-in reads as a deliberate greeting rather than
		// firing the instant the page paints.
		showTimeoutId = setTimeout(() => {
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					animateIn = true;
				})
			);
		}, 700);

		return () => clearTimeout(showTimeoutId);
	});
</script>

{#if visible}
	<div class="ask-later-panel" class:visible={animateIn} role="dialog" aria-label="Free valuation reminder">
		<button class="ask-later-close" onclick={dismiss} aria-label="Close">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>

		<p class="ask-later-eyebrow">Still Deciding?</p>
		<h3 class="ask-later-title">Your Free Valuation Is Ready When You Are</h3>
		<p class="ask-later-text">
			You asked us to check back — the form below takes two minutes, with no obligation to sell.
		</p>
		<a href="#start" class="ask-later-cta" onclick={dismiss}>Get My Free Valuation</a>
	</div>
{/if}

<style>
	.ask-later-panel {
		position: fixed;
		left: 20px;
		bottom: 20px;
		z-index: 1050;
		width: min(320px, calc(100vw - 40px));
		background: #ffffff;
		border-left: 4px solid #a1846d;
		box-shadow: 0 20px 50px rgba(22, 11, 17, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1);
		padding: 26px 26px 24px;
		transform: translateX(-130%);
		opacity: 0;
		transition:
			transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.5s ease;
	}

	.ask-later-panel.visible {
		transform: translateX(0);
		opacity: 1;
	}

	.ask-later-close {
		position: absolute;
		top: 12px;
		right: 12px;
		background: none;
		border: none;
		cursor: pointer;
		color: rgba(22, 11, 17, 0.4);
		padding: 4px;
		display: flex;
		transition: color 0.2s ease;
	}

	.ask-later-close:hover {
		color: #160b11;
	}

	.ask-later-eyebrow {
		margin: 0 0 8px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.ask-later-title {
		margin: 0 0 10px;
		padding-right: 18px;
		font-family: 'freight-display-pro', Georgia, 'Times New Roman', serif;
		font-size: 1.25rem;
		font-weight: 400;
		line-height: 1.25;
		color: #160b11;
	}

	.ask-later-text {
		margin: 0 0 18px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.86rem;
		font-weight: 300;
		line-height: 1.55;
		color: rgba(22, 11, 17, 0.65);
	}

	.ask-later-cta {
		display: inline-block;
		background: linear-gradient(135deg, #a1846d 0%, #8d7060 100%);
		color: #ffffff;
		text-decoration: none;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 12px 20px;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
	}

	.ask-later-cta:hover {
		opacity: 0.92;
		transform: translateY(-1px);
	}

	@media (max-width: 520px) {
		.ask-later-panel {
			left: 12px;
			right: 12px;
			bottom: 12px;
			width: auto;
		}
	}
</style>
