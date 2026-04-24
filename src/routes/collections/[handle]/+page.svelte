<script>
	let { data } = $props();
	const collection = $derived(data.collection);

	const localHeroImages = {
		'rolex':           '/assets/hero/rose_daytona.jpg',
		'audemars-piguet': '/assets/hero/AP_New_Hero.jpg',
		'patek-philippe':  '/assets/hero/PP_Category_Banner.jpg',
		'patek-phillipe':  '/assets/hero/PP_Category_Banner.jpg',
		'new-arrivals':    '/assets/hero/submariner_hero.jpg'
	};

	const heroImage = $derived(
		localHeroImages[collection.handle]
			? { url: localHeroImages[collection.handle], altText: collection.title }
			: collection.image
	);

	let sortOrder    = $state('default');
	let activeModel  = $state(null); // null = show all

	// Extract unique model names from 'model:*' tags across all products
	const modelOptions = $derived((() => {
		const seen = new Set();
		for (const p of collection.products) {
			for (const tag of (p.tags ?? [])) {
				if (tag.startsWith('model:')) {
					seen.add(tag.slice(6).trim());
				}
			}
		}
		return [...seen].sort((a, b) => a.localeCompare(b));
	})());

	// Filter by selected model, then sort
	const sortedProducts = $derived((() => {
		let result = [...collection.products];

		if (activeModel) {
			result = result.filter((p) =>
				(p.tags ?? []).some((t) => t === `model:${activeModel}`)
			);
		}

		if (sortOrder === 'price-asc')  return result.sort((a, b) => a.price - b.price);
		if (sortOrder === 'price-desc') return result.sort((a, b) => b.price - a.price);
		if (sortOrder === 'name-asc')   return result.sort((a, b) => a.title.localeCompare(b.title));
		return result;
	})());

	function formatPrice(amount, currencyCode) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: currencyCode || 'GBP',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<svelte:head>
	<title>{collection.title} — Watch Reserve</title>
	<meta
		name="description"
		content="{collection.description?.slice(0, 155) || `Browse our curated ${collection.title} collection.`}"
	/>
</svelte:head>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
	<div class="breadcrumb-inner">
		<a href="/">Home</a>
		<span class="sep" aria-hidden="true">/</span>
		<a href="/shop">Shop</a>
		<span class="sep" aria-hidden="true">/</span>
		<span aria-current="page">{collection.title}</span>
	</div>
</nav>

<!-- Hero -->
<header class="collection-hero" class:has-image={!!heroImage}>
	{#if heroImage}
		<img src={heroImage.url} alt={heroImage.altText} class="hero-bg" aria-hidden="true" fetchpriority="high" />
		<div class="hero-overlay" aria-hidden="true"></div>
	{/if}

	<div class="hero-content">
		<p class="hero-eyebrow">The Collection</p>
		<h1 class="hero-title">{collection.title}</h1>
		{#if collection.description}
			<p class="hero-description">{collection.description}</p>
		{/if}
	</div>
</header>

<!-- Products -->
<main class="collection-main">
	<div class="collection-container">

		<!-- Controls -->
		<div class="collection-controls">
			<span class="result-count">
				{sortedProducts.length} timepiece{sortedProducts.length !== 1 ? 's' : ''}
				{#if activeModel}<span class="result-count-filter">in {activeModel}</span>{/if}
			</span>
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

		<!-- Model filter pills (only rendered when model tags exist) -->
		{#if modelOptions.length > 0}
			<div class="model-filter" role="group" aria-label="Filter by model">
				<span class="model-filter-label">Model</span>
				<div class="model-pills" role="radiogroup">
					<button
						type="button"
						class="model-pill"
						class:model-pill--active={activeModel === null}
						onclick={() => (activeModel = null)}
						aria-pressed={activeModel === null}
					>
						All
					</button>
					{#each modelOptions as model}
						<button
							type="button"
							class="model-pill"
							class:model-pill--active={activeModel === model}
							onclick={() => (activeModel = activeModel === model ? null : model)}
							aria-pressed={activeModel === model}
						>
							{model}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Grid -->
		{#if sortedProducts.length === 0}
			<div class="empty-state">
				<p class="empty-title">No timepieces found{activeModel ? ` for ${activeModel}` : ''}</p>
				{#if activeModel}
					<button type="button" class="empty-clear" onclick={() => (activeModel = null)}>
						Clear filter
					</button>
				{:else}
					<p class="empty-sub">Check back soon — new pieces are added regularly.</p>
				{/if}
			</div>
		{:else}
			<div class="products-grid">
				{#each sortedProducts as product (product.id)}
					{@const status = product.status?.trim() ?? null}
					{@const statusSlug = status ? status.toLowerCase().replace(/\s+/g, '-') : 'available'}
					<a href="/shop/{product.handle}" class="product-card">
						<div class="product-image-wrapper">
							{#if product.image}
								<img src={product.image} alt={product.imageAlt} class="product-image" loading="lazy" />
							{:else}
								<div class="product-image-placeholder" aria-hidden="true">
									<svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="12" cy="12" r="9" stroke="#a1846d" stroke-width="1.5" />
										<circle cx="12" cy="12" r="3" stroke="#a1846d" stroke-width="1.5" />
										<line x1="12" y1="3" x2="12" y2="6" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
										<line x1="12" y1="18" x2="12" y2="21" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
										<line x1="3" y1="12" x2="6" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
										<line x1="18" y1="12" x2="21" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
									</svg>
								</div>
							{/if}

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
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	/* ── BREADCRUMB ── */
	.breadcrumb {
		background-color: #faf8f6;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		padding: 12px 40px;
		box-sizing: border-box;
	}

	.breadcrumb-inner {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.breadcrumb a {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		color: #888;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.breadcrumb a:hover { color: #160b11; }

	.breadcrumb span[aria-current] {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		color: #160b11;
		font-weight: 500;
	}

	.sep { color: #ccc; font-size: 0.75rem; }

	/* ── HERO ── */
	.collection-hero {
		position: relative;
		width: 100%;
		min-height: 420px;
		display: flex;
		align-items: flex-end;
		background-color: #160b11;
		overflow: hidden;
		box-sizing: border-box;
	}

	.collection-hero.has-image { min-height: 520px; }

	.hero-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		z-index: 0;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(10, 4, 8, 0.88) 0%,
			rgba(10, 4, 8, 0.5) 50%,
			rgba(10, 4, 8, 0.2) 100%
		);
		z-index: 1;
	}

	.hero-content {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 80px 40px 60px;
		box-sizing: border-box;
	}

	.hero-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 14px 0;
	}

	.hero-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 6vw, 5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 20px 0;
		line-height: 1.1;
		letter-spacing: -0.025em;
	}

	.hero-description {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.95rem, 1.3vw, 1.0625rem);
		color: rgba(255, 255, 255, 0.7);
		margin: 0 0 28px 0;
		line-height: 1.7;
		max-width: 600px;
		font-weight: 300;
	}

	/* ── MAIN ── */
	.collection-main {
		width: 100%;
		background-color: #ffffff;
		min-height: 40vh;
	}

	.collection-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 48px 40px 100px;
		box-sizing: border-box;
	}

	/* ── CONTROLS ── */
	.collection-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40px;
		flex-wrap: wrap;
		gap: 16px;
	}

	.result-count {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #999;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.control-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #160b11;
	}

	.control-select {
		appearance: none;
		background-color: #ffffff;
		border: 1px solid rgba(22, 11, 17, 0.2);
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

	.control-select:hover, .control-select:focus {
		border-color: #a1846d;
		outline: none;
	}

	/* ── GRID ── */
	.products-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	/* ── CARD ── */
	.product-card {
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
		border-color: rgba(161, 132, 109, 0.25);
	}

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

	.product-meta-row { display: flex; align-items: center; min-height: 18px; }

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

	.product-card:hover .product-arrow { color: #a1846d; transform: translateX(3px); }

	/* ── MODEL FILTER ── */
	.model-filter {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 36px;
		padding-bottom: 24px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		flex-wrap: wrap;
	}

	.model-filter-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.4);
		flex-shrink: 0;
	}

	.model-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.model-pill {
		display: inline-flex;
		align-items: center;
		padding: 7px 16px;
		background-color: transparent;
		border: 1px solid rgba(22, 11, 17, 0.15);
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: rgba(22, 11, 17, 0.6);
		cursor: pointer;
		transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
		white-space: nowrap;
	}

	.model-pill:hover {
		border-color: #a1846d;
		color: #a1846d;
		background-color: rgba(161, 132, 109, 0.04);
	}

	.model-pill--active {
		background-color: #a1846d;
		border-color: #a1846d;
		color: #ffffff;
	}

	.model-pill--active:hover {
		background-color: #8a6f59;
		border-color: #8a6f59;
		color: #ffffff;
	}

	/* Result count filter suffix */
	.result-count-filter {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		color: #a1846d;
		font-weight: 500;
		margin-left: 4px;
	}

	/* ── EMPTY ── */
	.empty-state { text-align: center; padding: 100px 20px; }

	.empty-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.5rem;
		font-weight: 400;
		color: #160b11;
		margin: 0 0 12px 0;
	}

	.empty-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.95rem;
		color: #888;
		margin: 0;
	}

	.empty-clear {
		background: none;
		border: 1px solid #a1846d;
		color: #a1846d;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 10px 24px;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;
		margin-top: 8px;
	}

	.empty-clear:hover {
		background-color: #a1846d;
		color: #ffffff;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 1200px) {
		.products-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
	}

	@media (max-width: 900px) {
		.collection-container { padding: 40px 30px 80px; }
		.products-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
		.collection-hero { min-height: 340px; }
		.collection-hero.has-image { min-height: 420px; }
		.hero-content { padding: 60px 30px 48px; }
	}

	@media (max-width: 640px) {
		.breadcrumb { padding: 12px 16px; }
		.collection-container { padding: 28px 16px 60px; }
		.products-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
		.product-details { padding: 14px 14px 16px; }
		.collection-controls { flex-direction: column; align-items: flex-start; }
		.hero-content { padding: 48px 20px 40px; }
		.hero-description { display: none; }

		.model-filter {
			gap: 10px;
			margin-bottom: 28px;
			padding-bottom: 20px;
		}

		.model-pills {
			flex-wrap: nowrap;
			overflow-x: auto;
			padding-bottom: 4px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.model-pills::-webkit-scrollbar { display: none; }

		.model-pill { flex-shrink: 0; }
	}

	@media (max-width: 500px) {
		.products-grid { grid-template-columns: 1fr; gap: 16px; }
	}
</style>
