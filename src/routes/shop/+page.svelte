<script>
	import WishlistButton from '$lib/components/WishlistButton.svelte';

	let { data } = $props();

	const products = data.products;

	const productTypes = $derived([
		'All',
		...new Set(products.map((p) => p.productType).filter(Boolean))
	]);

	// Featured brand titles to show in the tab bar
	const FEATURED_BRAND_TITLES = ['Rolex', 'Patek Philippe', 'Audemars Piguet'];

	// Build a title → handle map from the actual collection data on products
	const collectionHandleMap = $derived(() => {
		const map = new Map();
		for (const p of products) {
			for (const col of (p.collections ?? [])) {
				if (!map.has(col.title)) map.set(col.title, col.handle);
			}
		}
		return map;
	});

	// Only show brands that we have a known handle for
	const FEATURED_BRANDS = $derived(() =>
		FEATURED_BRAND_TITLES
			.filter((title) => collectionHandleMap().has(title))
			.map((title) => ({ label: title, handle: collectionHandleMap().get(title) }))
	);

	let selectedType = $state('All');
	let selectedBrand = $state('All');
	let sortOrder = $state('default');

	const filteredProducts = $derived(() => {
		let result = products;

		if (selectedBrand !== 'All') {
			result = result.filter((p) => p.collections?.some((c) => c.title === selectedBrand));
		}

		if (selectedType !== 'All') {
			result = result.filter((p) => p.productType === selectedType);
		}

		if (sortOrder === 'price-asc') {
			result = [...result].sort((a, b) => a.price - b.price);
		} else if (sortOrder === 'price-desc') {
			result = [...result].sort((a, b) => b.price - a.price);
		} else if (sortOrder === 'name-asc') {
			result = [...result].sort((a, b) => a.title.localeCompare(b.title));
		}

		return result;
	});


	function formatPrice(amount, currencyCode) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: currencyCode || 'GBP',
			minimumFractionDigits: 2
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Shop — Watch Reserve</title>
	<meta name="description" content="Browse our curated collection of luxury pre-owned timepieces." />
</svelte:head>

<main class="shop-page">
	<div class="shop-header">
		<img
			src="/assets/hero/daytona_hero.jpg"
			alt="Rolex Daytona on slate"
			class="shop-header-img"
			fetchpriority="high"
		/>
		<div class="shop-header-overlay" aria-hidden="true"></div>
		<div class="shop-header-content">
			<h1 class="shop-title">The Collection</h1>
			<p class="shop-subtitle">Curated luxury timepieces, authenticated and ready to wear</p>
		</div>
	</div>

	<!-- Brand filter bar -->
	<div class="brand-bar">
		<div class="brand-bar-inner">
			<button
				class="brand-pill"
				class:active={selectedBrand === 'All'}
				onclick={() => (selectedBrand = 'All')}
			>
				All
			</button>
			{#each FEATURED_BRANDS() as brand}
				<a href="/collections/{brand.handle}" class="brand-pill brand-pill-link">
					{brand.label}
				</a>
			{/each}
			<a href="/curated-editions" class="brand-pill brand-pill-link">
				Curated Editions
			</a>
		</div>
	</div>

	<div class="shop-container">
		<div class="shop-controls">
			<span class="product-count">{filteredProducts().length} timepiece{filteredProducts().length !== 1 ? 's' : ''}</span>

			<div class="controls-right">
				{#if productTypes.length > 1}
					<div class="control-group">
						<label for="filter-type" class="control-label">Filter</label>
						<select id="filter-type" class="control-select" bind:value={selectedType}>
							{#each productTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>
				{/if}

				<div class="control-group">
					<label for="sort-order" class="control-label">Sort by</label>
					<select id="sort-order" class="control-select" bind:value={sortOrder}>
						<option value="default">Featured</option>
						<option value="price-asc">Price: Low to High</option>
						<option value="price-desc">Price: High to Low</option>
						<option value="name-asc">Name: A to Z</option>
					</select>
				</div>
			</div>
		</div>

		{#if filteredProducts().length === 0}
			<div class="empty-state">
				<p class="empty-title">No timepieces found</p>
				<p class="empty-subtitle">Try adjusting your filters.</p>
			</div>
		{:else}
			<div class="products-grid">
				{#each filteredProducts() as product (product.id)}
					{@const status = product.status?.trim() ?? null}
					{@const statusSlug = status ? status.toLowerCase().replace(/\s+/g, '-') : 'available'}
					<div class="product-card-wrap">
					<a href="/shop/{product.handle}" class="product-card">
						<div class="product-image-wrapper">
							{#if product.image}
								<img src={product.image} alt={product.imageAlt} class="product-image" loading="lazy" />
							{:else}
								<div class="product-image-placeholder">
									<svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
										<circle cx="12" cy="12" r="9" stroke="#a1846d" stroke-width="1.5" />
										<circle cx="12" cy="12" r="3" stroke="#a1846d" stroke-width="1.5" />
										<line x1="12" y1="3" x2="12" y2="6" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
										<line x1="12" y1="18" x2="12" y2="21" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
										<line x1="3" y1="12" x2="6" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
										<line x1="18" y1="12" x2="21" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
									</svg>
								</div>
							{/if}

							<!-- Status badge -->
							<div class="status-badge status-{statusSlug}" aria-label="Status: {status ?? 'Available'}">
								<span class="status-dot" aria-hidden="true"></span>
								{status ?? 'Available'}
							</div>
						</div>

						<div class="product-details">
							<div class="product-meta-row">
								{#if product.vendor}
									<p class="product-vendor">{product.vendor}</p>
								{/if}
							</div>
							<p class="product-title">{product.title}</p>
							<div class="product-footer">
								{#if statusSlug !== 'sold'}
									<p class="product-price">{formatPrice(product.price, product.currencyCode)}</p>
								{/if}
								<span class="product-arrow" aria-hidden="true">→</span>
							</div>
						</div>
					</a>
					<WishlistButton {product} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	.shop-page {
		width: 100%;
		background-color: #ffffff;
		min-height: 60vh;
	}

	.shop-header {
		position: relative;
		width: 100%;
		height: clamp(300px, 42vh, 480px);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.shop-header-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 35%;
		display: block;
	}

	.shop-header-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgba(22, 11, 17, 0.45) 0%,
			rgba(22, 11, 17, 0.65) 100%
		);
	}

	.shop-header-content {
		position: relative;
		z-index: 1;
		padding: 0 40px;
	}

	.shop-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 16px 0;
		letter-spacing: -0.02em;
		line-height: 1.15;
	}

	.shop-subtitle {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9rem, 1.5vw, 1.05rem);
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
		letter-spacing: 0.03em;
	}

	/* ── BRAND BAR ── */
	.brand-bar {
		background-color: #ffffff;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
	}

	.brand-bar-inner {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 40px;
		display: flex;
		align-items: center;
		gap: 6px;
		overflow-x: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.brand-bar-inner::-webkit-scrollbar { display: none; }

	.brand-pill {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		padding: 12px 22px;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #888;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.2s ease, border-color 0.2s ease;
		margin-bottom: -1px;
	}

	.brand-pill:hover {
		color: #160b11;
	}

	.brand-pill.active {
		color: #160b11;
		font-weight: 600;
		border-bottom-color: #a1846d;
	}

	.brand-pill-link {
		text-decoration: none;
	}

	.brand-pill-link:hover {
		color: #160b11;
		border-bottom-color: rgba(161, 132, 109, 0.4);
	}

	/* ── CONTAINER ── */
	.shop-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 48px 40px 100px;
	}

	.shop-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40px;
		flex-wrap: wrap;
		gap: 16px;
	}

	.product-count {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9rem;
		color: #888;
		letter-spacing: 0.02em;
	}

	.controls-right {
		display: flex;
		gap: 20px;
		align-items: center;
		flex-wrap: wrap;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.control-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #160b11;
	}

	.control-select {
		appearance: none;
		background-color: #ffffff;
		border: 1px solid rgba(22, 11, 17, 0.2);
		border-radius: 6px;
		padding: 9px 36px 9px 14px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		cursor: pointer;
		transition: border-color 0.2s ease;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23160b11' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 12px center;
	}

	.control-select:hover,
	.control-select:focus {
		border-color: #a1846d;
		outline: none;
	}

	/* ── GRID ── */
	.products-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	/* ── CARD WRAPPER ── */
	.product-card-wrap {
		position: relative;
	}

	/* ── CARD ── */
	.product-card {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		border-radius: 0;
		overflow: hidden;
		border: 1px solid rgba(22, 11, 17, 0.08);
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.04),
			0 4px 16px rgba(0, 0, 0, 0.05);
		transition:
			transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			border-color 0.35s ease;
		text-decoration: none;
		color: inherit;
		position: relative;
	}

	.product-card:hover {
		transform: translateY(-5px);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.06),
			0 16px 40px rgba(0, 0, 0, 0.09);
		border-color: rgba(161, 132, 109, 0.25);
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
		will-change: transform;
		display: block;
	}

	.product-card:hover .product-image {
		transform: scale(1.07);
	}

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
		letter-spacing: 0.02em;
		color: #6b5c55;
		background-color: rgba(255, 255, 255, 0.88);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		z-index: 2;
		pointer-events: none;
		user-select: none;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.status-available .status-dot    { background-color: #22a05a; }
	.status-sold .status-dot         { background-color: #c94040; }
	.status-new-arrival .status-dot  { background-color: #c9a230; }
	.status-reserved .status-dot     { background-color: #422635; }

	/* ── DETAILS ── */
	.product-details {
		padding: 20px 20px 22px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
		background-color: #ffffff;
	}

	.product-meta-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 18px;
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

	.product-card:hover .product-title {
		color: #160b11;
	}

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
		line-height: 1;
	}

	.product-arrow {
		font-size: 1rem;
		color: #c8b8ae;
		transition: color 0.25s ease, transform 0.25s ease;
		display: inline-block;
	}

	.product-card:hover .product-arrow {
		color: #a1846d;
		transform: translateX(3px);
	}

	/* ── EMPTY STATE ── */
	.empty-state {
		text-align: center;
		padding: 100px 20px;
	}

	.empty-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.5rem;
		font-weight: 400;
		color: #160b11;
		margin: 0 0 12px 0;
	}

	.empty-subtitle {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.95rem;
		color: #888;
		margin: 0;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 1200px) {
		.products-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 20px;
		}
	}

	@media (max-width: 900px) {
		.shop-container {
			padding: 40px 30px 80px;
		}

		.products-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 18px;
		}
	}

	@media (max-width: 640px) {
		.shop-header {
			height: clamp(220px, 45vw, 320px);
		}

		.brand-bar-inner {
			padding: 0 16px;
		}

		.brand-pill {
			padding: 12px 16px;
			font-size: 0.8125rem;
		}

		.shop-container {
			padding: 32px 16px 60px;
		}

		.shop-controls {
			flex-direction: column;
			align-items: flex-start;
		}

		.controls-right {
			width: 100%;
			justify-content: flex-start;
		}

		.products-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 14px;
		}

		.product-details {
			padding: 14px 14px 16px;
		}

		.product-footer {
			margin-top: 8px;
		}
	}

	@media (max-width: 380px) {
		.products-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}
	}
</style>
