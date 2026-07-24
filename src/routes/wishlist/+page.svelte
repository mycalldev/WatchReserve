<script>
	import { onMount } from 'svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte.js';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

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
	<title>Wishlist — Watch Reserve</title>
	<meta name="description" content="Your saved timepieces on Watch Reserve." />
</svelte:head>

<!-- Page header -->
<div class="page-header">
	<div class="page-header-content">
		<p class="page-eyebrow">Saved Timepieces</p>
		<h1 class="page-title">Your Wishlist</h1>
		{#if mounted && wishlist.count > 0}
			<p class="page-subtitle">{wishlist.count} timepiece{wishlist.count !== 1 ? 's' : ''} saved</p>
		{/if}
	</div>
</div>

<main class="wishlist-page">
	<div class="wishlist-container">
		{#if !mounted}
			<!-- Skeleton while hydrating -->
			<div class="skeleton-grid">
				{#each { length: 4 } as _}
					<div class="skeleton-card">
						<div class="skeleton-img"></div>
						<div class="skeleton-body">
							<div class="skeleton-line short"></div>
							<div class="skeleton-line"></div>
							<div class="skeleton-line medium"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if wishlist.items.length === 0}
			<div class="empty-state">
				<div class="empty-icon" aria-hidden="true">
					<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
				</div>
				<h2 class="empty-title">Your wishlist is empty</h2>
				<p class="empty-text">Save timepieces you love and come back to them anytime.</p>
				<a href="/shop" class="browse-link">
					Browse the Collection
					<span aria-hidden="true">→</span>
				</a>
			</div>
		{:else}
			<div class="wishlist-grid">
				{#each wishlist.items as product (product.id)}
					{@const status = product.status?.trim() ?? null}
					{@const statusSlug = status ? status.toLowerCase().replace(/\s+/g, '-') : 'available'}
					<div class="wishlist-card">
						<!-- Image -->
						<a href="/shop/{product.handle}" class="card-img-link" tabindex="-1" aria-hidden="true">
							<div class="card-img-wrap">
								{#if product.image}
									<img
										src={product.image}
										alt={product.imageAlt ?? product.title}
										class="card-img"
										loading="lazy"
									/>
								{:else}
									<div class="card-img-placeholder" aria-hidden="true">
										<svg width="40" height="40" viewBox="0 0 24 24" fill="none">
											<circle cx="12" cy="12" r="9" stroke="#a1846d" stroke-width="1.5" />
											<circle cx="12" cy="12" r="3" stroke="#a1846d" stroke-width="1.5" />
											<line x1="12" y1="3" x2="12" y2="6" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
											<line x1="12" y1="18" x2="12" y2="21" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
											<line x1="3" y1="12" x2="6" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
											<line x1="18" y1="12" x2="21" y2="12" stroke="#a1846d" stroke-width="1.5" stroke-linecap="round" />
										</svg>
									</div>
								{/if}

								{#if status}
									<div class="status-badge status-{statusSlug}" aria-label="Status: {status}">
										<span class="status-dot" aria-hidden="true"></span>
										{status}
									</div>
								{/if}
							</div>
						</a>

						<!-- Body -->
						<div class="card-body">
							<div class="card-body-top">
								{#if product.vendor}
									<p class="card-vendor">{product.vendor}</p>
								{/if}
								<button
									class="remove-btn"
									onclick={() => wishlist.remove(product.id)}
									aria-label="Remove {product.title} from wishlist"
									title="Remove from wishlist"
									type="button"
								>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</button>
							</div>

							<a href="/shop/{product.handle}" class="card-title-link">
								<p class="card-title">{product.title}</p>
							</a>

							<div class="card-price-row">
								{#if statusSlug !== 'sold' && product.price}
									<p class="card-price">{formatPrice(product.price, product.currencyCode)}</p>
								{:else if statusSlug === 'sold'}
									<p class="card-sold">Sold</p>
								{/if}
							</div>

							<a href="/shop/{product.handle}" class="view-btn">
								View Timepiece
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
							</a>
						</div>
					</div>
				{/each}
			</div>

			<div class="wishlist-footer">
				<a href="/shop" class="continue-link">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					Continue Browsing
				</a>
			</div>
		{/if}
	</div>
</main>

<style>
	/* ── PAGE HEADER ── */
	.page-header {
		background: linear-gradient(160deg, #1e0e19 0%, #160b11 60%, #1a0d16 100%);
		border-bottom: 1px solid rgba(161, 132, 109, 0.2);
		padding: 72px 40px 64px;
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.page-header::before {
		content: '';
		position: absolute;
		top: -80px;
		left: 50%;
		transform: translateX(-50%);
		width: 500px;
		height: 300px;
		background: radial-gradient(ellipse, rgba(161, 132, 109, 0.08) 0%, transparent 70%);
		pointer-events: none;
	}

	.page-header-content {
		position: relative;
		z-index: 1;
	}

	.page-eyebrow {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 14px 0;
	}

	.page-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0;
		letter-spacing: -0.02em;
		line-height: 1.15;
	}

	.page-subtitle {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.45);
		margin: 14px 0 0 0;
		letter-spacing: 0.02em;
	}

	/* ── MAIN ── */
	.wishlist-page {
		background-color: #ffffff;
		min-height: 50vh;
	}

	.wishlist-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 64px 40px 100px;
	}

	/* ── SKELETON ── */
	.skeleton-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	.skeleton-card {
		border: 1px solid rgba(22, 11, 17, 0.07);
	}

	.skeleton-img {
		aspect-ratio: 1 / 1;
		background: linear-gradient(90deg, #f0ece8 25%, #e8e3df 50%, #f0ece8 75%);
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite;
	}

	.skeleton-body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.skeleton-line {
		height: 12px;
		background: linear-gradient(90deg, #f0ece8 25%, #e8e3df 50%, #f0ece8 75%);
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite;
	}

	.skeleton-line.short { width: 40%; }
	.skeleton-line.medium { width: 60%; }

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	/* ── EMPTY STATE ── */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 80px 20px 60px;
		gap: 16px;
	}

	.empty-icon {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: rgba(161, 132, 109, 0.08);
		border: 1px solid rgba(161, 132, 109, 0.18);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #a1846d;
		margin-bottom: 8px;
	}

	.empty-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.02em;
	}

	.empty-text {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.9375rem;
		color: #888;
		margin: 0;
		max-width: 380px;
		line-height: 1.6;
	}

	.browse-link {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 8px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.9rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: #ffffff;
		background: linear-gradient(135deg, #a1846d 0%, #8d7060 100%);
		text-decoration: none;
		padding: 13px 28px;
		transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
		box-shadow: 0 2px 10px rgba(161, 132, 109, 0.3);
	}

	.browse-link:hover {
		opacity: 0.9;
		transform: translateY(-1px);
		box-shadow: 0 5px 18px rgba(161, 132, 109, 0.4);
	}

	/* ── WISHLIST GRID ── */
	.wishlist-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	/* ── CARD ── */
	.wishlist-card {
		display: flex;
		flex-direction: column;
		border: 1px solid rgba(22, 11, 17, 0.08);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.05);
		background-color: #ffffff;
		transition:
			transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			border-color 0.3s ease;
	}

	.wishlist-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07), 0 16px 40px rgba(0, 0, 0, 0.09);
		border-color: rgba(161, 132, 109, 0.22);
	}

	/* ── CARD IMAGE ── */
	.card-img-link {
		display: block;
		text-decoration: none;
		overflow: hidden;
	}

	.card-img-wrap {
		aspect-ratio: 1 / 1;
		background: linear-gradient(135deg, #f8f6f4 0%, #f0ece8 100%);
		overflow: hidden;
		position: relative;
	}

	.card-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.wishlist-card:hover .card-img {
		transform: scale(1.06);
	}

	.card-img-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
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
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.7rem;
		font-weight: 500;
		color: #6b5c55;
		background-color: rgba(255, 255, 255, 0.88);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		z-index: 2;
		pointer-events: none;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.status-available .status-dot { background-color: #22a05a; }
	.status-sold .status-dot { background-color: #c94040; }
	.status-new-arrival .status-dot { background-color: #c9a230; }
	.status-reserved .status-dot { background-color: #422635; }

	/* ── CARD BODY ── */
	.card-body {
		padding: 18px 20px 22px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		flex: 1;
	}

	.card-body-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 20px;
	}

	.card-vendor {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.remove-btn {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		background: none;
		border: 1px solid rgba(22, 11, 17, 0.12);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(22, 11, 17, 0.3);
		transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
		margin-left: 8px;
	}

	.remove-btn:hover {
		color: #c94040;
		border-color: rgba(201, 64, 64, 0.3);
		background-color: rgba(201, 64, 64, 0.05);
	}

	.card-title-link {
		text-decoration: none;
		color: inherit;
	}

	.card-title {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.85rem, 1vw, 0.9375rem);
		line-height: 1.45;
		color: #3a2e33;
		margin: 2px 0 0 0;
		font-weight: 400;
		transition: color 0.2s ease;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-title-link:hover .card-title {
		color: #160b11;
	}

	.card-price-row {
		margin-top: 2px;
	}

	.card-price {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		font-weight: 600;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.02em;
	}

	.card-sold {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		color: #c94040;
		font-weight: 700;
		margin: 0;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.view-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		margin-top: auto;
		padding-top: 14px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #a1846d;
		text-decoration: none;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		transition: gap 0.2s ease, color 0.2s ease;
	}

	.view-btn:hover {
		gap: 11px;
		color: #8d7060;
	}

	/* ── FOOTER ── */
	.wishlist-footer {
		display: flex;
		justify-content: center;
		margin-top: 60px;
	}

	.continue-link {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #160b11;
		text-decoration: none;
		padding-bottom: 3px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.2);
		transition: gap 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}

	.continue-link:hover {
		gap: 14px;
		color: #a1846d;
		border-color: #a1846d;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 1200px) {
		.wishlist-grid,
		.skeleton-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 900px) {
		.wishlist-container {
			padding: 48px 30px 80px;
		}

		.wishlist-grid,
		.skeleton-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 18px;
		}
	}

	@media (max-width: 640px) {
		.page-header {
			padding: 56px 24px 48px;
		}

		.wishlist-container {
			padding: 36px 16px 64px;
		}

		.wishlist-grid,
		.skeleton-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 14px;
		}

		.card-body {
			padding: 14px 14px 16px;
		}
	}

	@media (max-width: 400px) {
		.wishlist-grid,
		.skeleton-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
