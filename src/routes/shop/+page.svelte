<script>
	let { data } = $props();

	const products = data.products;

	const productTypes = $derived([
		'All',
		...new Set(products.map((p) => p.productType).filter(Boolean))
	]);

	let selectedType = $state('All');
	let sortOrder = $state('default');

	const filteredProducts = $derived(() => {
		let result = selectedType === 'All' ? products : products.filter((p) => p.productType === selectedType);

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
		<h1 class="shop-title">The Collection</h1>
		<p class="shop-subtitle">Curated luxury timepieces, authenticated and ready to wear</p>
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
					<a href="/shop/{product.handle}" class="product-card">
						<div class="product-image-wrapper">
							{#if product.image}
								<img src={product.image} alt={product.imageAlt} class="product-image" />
							{:else}
								<div class="product-image-placeholder">
									<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="12" cy="12" r="9" stroke="#a1846d" stroke-width="1.5" />
										<circle cx="12" cy="12" r="3" stroke="#a1846d" stroke-width="1.5" />
										<line x1="12" y1="3" x2="12" y2="6" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
										<line x1="12" y1="18" x2="12" y2="21" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
										<line x1="3" y1="12" x2="6" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
										<line x1="18" y1="12" x2="21" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
									</svg>
								</div>
							{/if}
						</div>
						<div class="product-details">
							{#if product.vendor}
								<p class="product-vendor">{product.vendor}</p>
							{/if}
							<p class="product-title">{product.title}</p>
							<p class="product-price">{formatPrice(product.price, product.currencyCode)}</p>
						</div>
					</a>
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
		background-color: #160b11;
		padding: 80px 40px 70px;
		text-align: center;
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
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.9rem, 1.5vw, 1.05rem);
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
		letter-spacing: 0.03em;
	}

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
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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

	.products-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 28px;
	}

	.product-card {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid rgba(22, 11, 17, 0.08);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.04);
		transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		cursor: pointer;
		text-decoration: none;
		color: inherit;
		position: relative;
	}

	.product-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 16px;
		background: linear-gradient(135deg, rgba(161, 132, 109, 0.03), rgba(22, 11, 17, 0.01));
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
		z-index: 0;
	}

	.product-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 16px 48px rgba(0, 0, 0, 0.06);
		border-color: rgba(22, 11, 17, 0.12);
	}

	.product-card:hover::before {
		opacity: 1;
	}

	.product-image-wrapper {
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		will-change: transform;
	}

	.product-card:hover .product-image {
		transform: scale(1.08);
	}

	.product-image-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #f5f0ed 0%, #ede8e4 100%);
	}

	.product-details {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
		background-color: #ffffff;
		position: relative;
		z-index: 1;
	}

	.product-vendor {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.product-title {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.875rem, 1.1vw, 1rem);
		line-height: 1.5;
		color: #4a4a4a;
		margin: 0;
		font-weight: 400;
		transition: color 0.3s ease;
	}

	.product-card:hover .product-title {
		color: #160b11;
	}

	.product-price {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(1.05rem, 1.3vw, 1.25rem);
		font-weight: 600;
		color: #160b11;
		margin: 6px 0 0 0;
		letter-spacing: -0.02em;
		line-height: 1.3;
	}

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
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.95rem;
		color: #888;
		margin: 0;
	}

	@media (max-width: 1200px) {
		.products-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}
	}

	@media (max-width: 900px) {
		.shop-container {
			padding: 40px 30px 80px;
		}

		.products-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 20px;
		}
	}

	@media (max-width: 640px) {
		.shop-header {
			padding: 60px 20px 50px;
		}

		.shop-container {
			padding: 32px 20px 60px;
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
			gap: 16px;
		}

		.product-details {
			padding: 18px;
		}
	}

	@media (max-width: 400px) {
		.products-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
