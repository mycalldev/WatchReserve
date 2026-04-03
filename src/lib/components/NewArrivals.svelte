<script>
	let { products = [] } = $props();

	let currentIndex = $state(0);

	const canGoNext = $derived(currentIndex < products.length - 1);
	const canGoPrev = $derived(currentIndex > 0);

	function nextSlide() {
		if (canGoNext) currentIndex += 1;
	}

	function prevSlide() {
		if (canGoPrev) currentIndex -= 1;
	}

	function formatPrice(amount, currencyCode) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: currencyCode || 'GBP',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

{#if products.length > 0}
<section class="arrivals-section">
	<div class="arrivals-container">

		<div class="arrivals-header">
			<div class="arrivals-title-group">
				<p class="arrivals-eyebrow">Just In</p>
				<h2 class="arrivals-title">New Arrivals</h2>
			</div>
			<div class="carousel-controls">
				<button
					class="carousel-btn"
					onclick={prevSlide}
					disabled={!canGoPrev}
					aria-label="Previous timepieces"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<button
					class="carousel-btn"
					onclick={nextSlide}
					disabled={!canGoNext}
					aria-label="Next timepieces"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</div>

		<div class="carousel-wrapper">
			<div class="carousel-track" style="--index: {currentIndex}">
				{#each products as product (product.id)}
					{@const status = product.status?.trim() ?? null}
					{@const statusSlug = status ? status.toLowerCase().replace(/\s+/g, '-') : 'available'}
					<a href="/shop/{product.handle}" class="product-card">
						<div class="product-image-wrapper">
							{#if product.image}
								<img src={product.image} alt={product.imageAlt ?? product.title} class="product-image" loading="lazy" />
							{:else}
								<div class="product-image-placeholder" aria-hidden="true">
									<svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="12" cy="12" r="9" stroke="#a1846d" stroke-width="1.5"/>
										<circle cx="12" cy="12" r="3" stroke="#a1846d" stroke-width="1.5"/>
										<line x1="12" y1="3" x2="12" y2="6" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round"/>
										<line x1="12" y1="18" x2="12" y2="21" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round"/>
										<line x1="3" y1="12" x2="6" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round"/>
										<line x1="18" y1="12" x2="21" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round"/>
									</svg>
								</div>
							{/if}

							<div class="status-badge status-{statusSlug}" aria-label="Status: {status ?? 'New Arrival'}">
								<span class="status-dot" aria-hidden="true"></span>
								{status ?? 'New Arrival'}
							</div>
						</div>

						<div class="product-details">
							{#if product.vendor}
								<p class="product-vendor">{product.vendor}</p>
							{/if}
							<p class="product-title">{product.title}</p>
							<div class="product-footer">
								{#if statusSlug !== 'sold'}
									<p class="product-price">{formatPrice(product.price, product.currencyCode)}</p>
								{/if}
								<span class="product-arrow" aria-hidden="true">→</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>

		<div class="arrivals-footer">
			<a href="/shop" class="view-all-link">
				View all New Arrivals
				<span class="view-all-arrow">→</span>
			</a>
		</div>

	</div>
</section>
{/if}

<style>
	/* ── SECTION ── */
	.arrivals-section {
		width: 100%;
		background-color: #faf8f5;
		padding: 100px 40px;
		box-sizing: border-box;
	}

	.arrivals-container {
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	/* ── HEADER ── */
	.arrivals-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 48px;
		flex-wrap: wrap;
		gap: 24px;
	}

	.arrivals-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #c9a230;
		margin: 0 0 10px 0;
	}

	.arrivals-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.03em;
		line-height: 1.15;
	}

	/* ── CONTROLS ── */
	.carousel-controls {
		display: flex;
		gap: 10px;
		flex-shrink: 0;
	}

	.carousel-btn {
		background-color: #160b11;
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.1);
		width: 48px;
		height: 48px;
		border-radius: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
		padding: 0;
		flex-shrink: 0;
	}

	.carousel-btn:hover:not(:disabled) {
		background-color: #c9a230;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(201, 162, 48, 0.3);
	}

	.carousel-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.carousel-btn:disabled {
		opacity: 0.2;
		cursor: not-allowed;
	}

	/* ── CAROUSEL ── */
	.carousel-wrapper {
		width: 100%;
		overflow: hidden;
	}

	.carousel-track {
		display: flex;
		gap: 24px;
		transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transform: translateX(calc(var(--index) * -1 * (25% + 6px)));
	}

	/* ── CARD ── */
	.product-card {
		flex: 0 0 calc(25% - 18px);
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		border-radius: 0;
		overflow: hidden;
		border: 1px solid rgba(22, 11, 17, 0.08);
		box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05);
		transition:
			transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			border-color 0.35s ease;
		text-decoration: none;
		color: inherit;
	}

	.product-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.09);
		border-color: rgba(201, 162, 48, 0.3);
	}

	/* ── IMAGE ── */
	.product-image-wrapper {
		width: 100%;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		background: linear-gradient(135deg, #f8f6f4 0%, #f0ece8 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		display: block;
	}

	.product-card:hover .product-image { transform: scale(1.07); }

	.product-image-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #f5f0ed 0%, #ede8e4 100%);
	}

	/* ── STATUS BADGE ── */
	.status-badge {
		position: absolute;
		top: 12px;
		left: 12px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 10px;
		border-radius: 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.7rem;
		font-weight: 500;
		color: #6b5c55;
		background-color: rgba(255,255,255,0.88);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		z-index: 2;
		pointer-events: none;
	}

	.status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
	.status-available .status-dot   { background-color: #22a05a; }
	.status-sold .status-dot        { background-color: #c94040; }
	.status-new-arrival .status-dot { background-color: #c9a230; }
	.status-reserved .status-dot    { background-color: #422635; }

	/* ── CARD DETAILS ── */
	.product-details {
		padding: 20px 20px 22px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.product-vendor {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.product-title {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.85rem, 1vw, 0.9375rem);
		line-height: 1.45;
		color: #3a2e33;
		margin: 4px 0 0 0;
		font-weight: 400;
		transition: color 0.25s ease;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.product-card:hover .product-title { color: #160b11; }

	.product-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 10px;
	}

	.product-price {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		font-weight: 600;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.02em;
	}

	.product-arrow {
		font-size: 1rem;
		color: #c8b8ae;
		transition: color 0.25s ease, transform 0.25s ease;
	}

	.product-card:hover .product-arrow { color: #c9a230; transform: translateX(3px); }

	/* ── FOOTER ── */
	.arrivals-footer {
		display: flex;
		justify-content: center;
		margin-top: 48px;
	}

	.view-all-link {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: 'Montserrat', sans-serif;
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
		color: #c9a230;
		border-color: #c9a230;
	}

	.view-all-arrow { transition: transform 0.25s ease; }
	.view-all-link:hover .view-all-arrow { transform: translateX(4px); }

	/* ── RESPONSIVE ── */
	@media (max-width: 1200px) {
		.carousel-track {
			transform: translateX(calc(var(--index) * -1 * (33.333% + 8px)));
		}
		.product-card { flex: 0 0 calc(33.333% - 16px); }
	}

	@media (max-width: 900px) {
		.arrivals-section { padding: 70px 30px; }
	}

	@media (max-width: 768px) {
		.arrivals-section { padding: 60px 20px; }
		.arrivals-header { margin-bottom: 36px; }
		.carousel-track {
			transform: translateX(calc(var(--index) * -1 * (50% + 10px)));
		}
		.product-card { flex: 0 0 calc(50% - 12px); }
	}

	@media (max-width: 480px) {
		.arrivals-section { padding: 50px 16px; }
		.arrivals-header { flex-direction: column; align-items: flex-start; gap: 20px; }
		.carousel-track {
			gap: 16px;
			transform: translateX(calc(var(--index) * -1 * (100% + 16px)));
		}
		.product-card { flex: 0 0 100%; }
	}
</style>
