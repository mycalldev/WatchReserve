<script>
	/**
	 * ProductViewCount
	 *
	 * Displays how many people have viewed this product in the last 24 hours.
	 * The `count` prop is driven by the Shopify metafield `custom.viewed`.
	 *
	 * TODO (future): replace static metafield value with a real-time analytics
	 * endpoint (e.g. a SvelteKit API route backed by Vercel KV, Upstash Redis,
	 * or a dedicated analytics service) so the count updates dynamically.
	 */

	let { count = null } = $props();

	// Coerce to a valid positive integer; null / 0 hides the component
	const views = $derived(() => {
		const n = parseInt(count, 10);
		return Number.isFinite(n) && n > 0 ? n : null;
	});
</script>

{#if views()}
	<div class="view-count" aria-live="polite">
		<div class="view-icon-wrap">
			<svg
				class="view-icon"
				width="15"
				height="15"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
				<circle cx="12" cy="12" r="3" />
			</svg>
		</div>

		<span class="view-text">
			<strong class="view-number">{views()}</strong>
			{views() === 1 ? 'person' : 'people'} viewed this in the last 24 hours
		</span>
	</div>
{/if}

<style>
	.view-count {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 11px 16px;
		background-color: #faf8f6;
		border: 1px solid rgba(22, 11, 17, 0.08);
		border-radius: 10px;
		width: 100%;
		box-sizing: border-box;
	}

	.view-icon-wrap {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: rgba(161, 132, 109, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.view-icon {
		color: #a1846d;
	}

	.view-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		color: #6b5c55;
		line-height: 1.45;
	}

	.view-number {
		font-weight: 700;
		color: #160b11;
		font-size: 0.875rem;
	}
</style>
