<script>
	let { products = [], vendor = '' } = $props();

	let currentIndex = $state(0);
	let trackRef = $state(null);

	// How many cards visible depends on viewport — computed per slide step
	const visibleCount = $derived(() => {
		if (typeof window === 'undefined') return 4;
		if (window.innerWidth < 480) return 1;
		if (window.innerWidth < 768) return 2;
		if (window.innerWidth < 1200) return 3;
		return 4;
	});

	const maxIndex = $derived(Math.max(0, products.length - 4));

	const canGoPrev = $derived(currentIndex > 0);
	const canGoNext = $derived(currentIndex < products.length - 1);

	function next() {
		if (canGoNext) currentIndex = Math.min(currentIndex + 1, products.length - 1);
	}

	function prev() {
		if (canGoPrev) currentIndex = Math.max(currentIndex - 1, 0);
	}

	function formatPrice(amount, currencyCode) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: currencyCode || 'GBP',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	// Build the vendor shop URL — links to shop filtered by vendor tag
	const vendorShopUrl = $derived(
		vendor ? `/shop?vendor=${encodeURIComponent(vendor)}` : '/shop'
	);
</script>

{#if products.length > 0}
<section class="moreof-section" aria-label="More from {vendor}">
	<div class="moreof-container">

		<!-- Header -->
		<div class="moreof-header">
			<div class="moreof-title-group">
				<p class="moreof-eyebrow">You May Also Like</p>
				<h2 class="moreof-title">More from <em>{vendor}</em></h2>
			</div>
			<div class="moreof-controls" aria-label="Carousel controls">
				<button
					class="ctrl-btn"
					onclick={prev}
					disabled={!canGoPrev}
					aria-label="Previous {vendor} watches"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M15 18L9 12L15 6" />
					</svg>
				</button>
				<button
					class="ctrl-btn"
					onclick={next}
					disabled={!canGoNext}
					aria-label="Next {vendor} watches"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M9 18L15 12L9 6" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Carousel -->
		<div class="moreof-viewport" role="region" aria-label="{vendor} timepieces carousel">
			<div
				class="moreof-track"
				bind:this={trackRef}
				style="--index: {currentIndex}"
				role="list"
			>
				{#each products as product (product.id)}
					{@const status = product.status?.trim() ?? null}
					{@const statusSlug = status ? status.toLowerCase().replace(/\s+/g, '-') : 'available'}
					<a
						href="/shop/{product.handle}"
						class="mo-card"
						role="listitem"
						aria-label="{product.title} — {formatPrice(product.price, product.currencyCode)}"
					>
						<div class="mo-image-wrap">
							{#if product.image}
								<img
									src={product.image}
									alt={product.imageAlt ?? product.title}
									class="mo-image"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<div class="mo-image-placeholder" aria-hidden="true">
									<svg width="40" height="40" viewBox="0 0 24 24" fill="none">
										<circle cx="12" cy="12" r="9" stroke="#a1846d" stroke-width="1.5"/>
										<circle cx="12" cy="12" r="3" stroke="#a1846d" stroke-width="1.5"/>
										<line x1="12" y1="3" x2="12" y2="6" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round"/>
										<line x1="12" y1="18" x2="12" y2="21" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round"/>
										<line x1="3" y1="12" x2="6" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round"/>
										<line x1="18" y1="12" x2="21" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round"/>
									</svg>
								</div>
							{/if}

							<span class="mo-badge status-{statusSlug}" aria-label="Status: {status ?? 'Available'}">
								<span class="mo-dot" aria-hidden="true"></span>
								{status ?? 'Available'}
							</span>
						</div>

						<div class="mo-body">
							{#if product.vendor}
								<p class="mo-vendor">{product.vendor}</p>
							{/if}
							<p class="mo-title">{product.title}</p>
							<div class="mo-footer">
								<span class="mo-price">{formatPrice(product.price, product.currencyCode)}</span>
								<span class="mo-arrow" aria-hidden="true">→</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- Progress dots -->
		{#if products.length > 1}
			<div class="moreof-dots" role="tablist" aria-label="Carousel position">
				{#each products as _, i}
					<button
						class="dot"
						class:dot--active={i === currentIndex}
						onclick={() => (currentIndex = i)}
						role="tab"
						aria-label="Go to item {i + 1}"
						aria-selected={i === currentIndex}
					></button>
				{/each}
			</div>
		{/if}

		<!-- Footer link -->
		<div class="moreof-footer">
			<a href={vendorShopUrl} class="view-all-link">
				View all {vendor} timepieces
				<span class="view-all-arrow" aria-hidden="true">→</span>
			</a>
		</div>

	</div>
</section>
{/if}

<style>
	/* ── Section ─────────────────────────────────────── */
	.moreof-section {
		width: 100%;
		background-color: #fafaf9;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		padding: 80px 40px;
		box-sizing: border-box;
	}

	.moreof-container {
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	/* ── Header ──────────────────────────────────────── */
	.moreof-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 44px;
		flex-wrap: wrap;
		gap: 20px;
	}

	.moreof-eyebrow {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 10px 0;
	}

	.moreof-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 3.5vw, 2.75rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.03em;
		line-height: 1.15;
	}

	.moreof-title em {
		font-style: italic;
		color: #422635;
	}

	/* ── Controls ────────────────────────────────────── */
	.moreof-controls {
		display: flex;
		gap: 10px;
		flex-shrink: 0;
	}

	.ctrl-btn {
		width: 46px;
		height: 46px;
		border-radius: 50%;
		background-color: #160b11;
		color: #ffffff;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
		flex-shrink: 0;
	}

	.ctrl-btn:hover:not(:disabled) {
		background-color: #422635;
		transform: translateY(-2px);
		box-shadow: 0 4px 14px rgba(66, 38, 53, 0.3);
	}

	.ctrl-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.ctrl-btn:disabled {
		opacity: 0.2;
		cursor: not-allowed;
	}

	/* ── Carousel viewport ───────────────────────────── */
	.moreof-viewport {
		width: 100%;
		overflow: hidden;
	}

	.moreof-track {
		display: flex;
		gap: 24px;
		transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transform: translateX(calc(var(--index) * -1 * (25% + 6px)));
	}

	/* ── Card ────────────────────────────────────────── */
	.mo-card {
		flex: 0 0 calc(25% - 18px);
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		border-radius: 14px;
		overflow: hidden;
		border: 1px solid rgba(22, 11, 17, 0.08);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.05);
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			border-color 0.35s ease;
	}

	.mo-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 20px 48px rgba(0, 0, 0, 0.1);
		border-color: rgba(161, 132, 109, 0.3);
	}

	/* ── Image ───────────────────────────────────────── */
	.mo-image-wrap {
		width: 100%;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		background: linear-gradient(135deg, #f8f6f4 0%, #f0ece8 100%);
		position: relative;
		flex-shrink: 0;
	}

	.mo-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.mo-card:hover .mo-image {
		transform: scale(1.07);
	}

	.mo-image-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* ── Status badge ────────────────────────────────── */
	.mo-badge {
		position: absolute;
		top: 12px;
		left: 12px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 10px;
		border-radius: 100px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.7rem;
		font-weight: 500;
		color: #160b11;
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(22, 11, 17, 0.1);
		z-index: 2;
		pointer-events: none;
	}

	.mo-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.status-available .mo-dot    { background-color: #22a05a; }
	.status-sold .mo-dot         { background-color: #c94040; }
	.status-new-arrival .mo-dot  { background-color: #c9a230; }
	.status-reserved .mo-dot     { background-color: #422635; }

	/* ── Card body ───────────────────────────────────── */
	.mo-body {
		padding: 18px 20px 20px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.mo-vendor {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.mo-title {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: clamp(0.85rem, 1vw, 0.9375rem);
		line-height: 1.45;
		color: #3a2e33;
		margin: 4px 0 0 0;
		font-weight: 400;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 0.25s ease;
	}

	.mo-card:hover .mo-title {
		color: #160b11;
	}

	.mo-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 10px;
	}

	.mo-price {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		font-weight: 600;
		color: #160b11;
		letter-spacing: -0.02em;
	}

	.mo-arrow {
		font-size: 1rem;
		color: #c8b8ae;
		transition: color 0.25s ease, transform 0.25s ease;
	}

	.mo-card:hover .mo-arrow {
		color: #a1846d;
		transform: translateX(3px);
	}

	/* ── Progress dots ───────────────────────────────── */
	.moreof-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: 32px;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: rgba(22, 11, 17, 0.15);
		border: none;
		padding: 0;
		cursor: pointer;
		transition: background-color 0.25s ease, transform 0.25s ease, width 0.25s ease;
	}

	.dot--active {
		background-color: #422635;
		width: 20px;
		border-radius: 3px;
	}

	/* ── Footer link ─────────────────────────────────── */
	.moreof-footer {
		display: flex;
		justify-content: center;
		margin-top: 40px;
	}

	.view-all-link {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		color: #160b11;
		text-decoration: none;
		padding-bottom: 3px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.25);
		transition: gap 0.25s ease, border-color 0.25s ease, color 0.25s ease;
	}

	.view-all-link:hover {
		gap: 16px;
		color: #422635;
		border-color: #422635;
	}

	.view-all-arrow {
		transition: transform 0.25s ease;
	}

	.view-all-link:hover .view-all-arrow {
		transform: translateX(4px);
	}

	/* ── Responsive ──────────────────────────────────── */
	@media (max-width: 1200px) {
		.moreof-track {
			transform: translateX(calc(var(--index) * -1 * (33.333% + 8px)));
		}
		.mo-card {
			flex: 0 0 calc(33.333% - 16px);
		}
	}

	@media (max-width: 900px) {
		.moreof-section {
			padding: 64px 30px;
		}
	}

	@media (max-width: 768px) {
		.moreof-section {
			padding: 56px 20px;
		}
		.moreof-header {
			margin-bottom: 32px;
		}
		.moreof-track {
			gap: 16px;
			transform: translateX(calc(var(--index) * -1 * (50% + 8px)));
		}
		.mo-card {
			flex: 0 0 calc(50% - 8px);
		}
	}

	@media (max-width: 480px) {
		.moreof-section {
			padding: 48px 16px;
		}
		.moreof-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
			margin-bottom: 28px;
		}
		.moreof-track {
			gap: 14px;
			transform: translateX(calc(var(--index) * -1 * (85vw + 14px)));
		}
		.mo-card {
			flex: 0 0 85vw;
		}
		/* On mobile, show dots but hide prev/next since swipe is natural */
		.moreof-controls {
			display: flex;
		}
	}
</style>
