<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const { product } = data;

	let activeImageIndex = $state(0);
	let selectedVariantId = $state(product.variants[0]?.id ?? '');
	let quantity = $state(1);
	let adding = $state(false);
	let added = $state(false);
	let thumbsRef = $state(null);

	const selectedVariant = $derived(
		product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0]
	);

	const isAvailable = $derived(selectedVariant?.availableForSale ?? false);

	function formatPrice(amount, currency) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: currency || 'GBP',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	function setImage(index) {
		activeImageIndex = index;
		if (thumbsRef) {
			const thumb = thumbsRef.querySelectorAll('.thumb')[index];
			thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
		}
	}

	function prevImage() {
		if (activeImageIndex > 0) setImage(activeImageIndex - 1);
	}

	function nextImage() {
		if (activeImageIndex < product.images.length - 1) setImage(activeImageIndex + 1);
	}

	function handleKeydown(e) {
		if (e.key === 'ArrowLeft') prevImage();
		if (e.key === 'ArrowRight') nextImage();
	}

	const DETAIL_TAGS = ['reference', 'year', 'material', 'condition', 'movement', 'case-size', 'box', 'papers'];

	const productDetails = $derived(
		product.tags
			.map((tag) => {
				const [key, ...rest] = tag.split(':');
				if (DETAIL_TAGS.includes(key.toLowerCase().trim())) {
					return { key: key.trim(), value: rest.join(':').trim() };
				}
				return null;
			})
			.filter(Boolean)
	);

	const { metafieldsByGroup } = data;

	function formatMetafieldValue(value, typeName) {
		if (value === null || value === undefined || value === '') return null;

		try {
			switch (typeName) {
				case 'boolean':
					return value === 'true' ? 'Yes' : 'No';
				case 'date':
					return new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value));
				case 'date_time':
					return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
				case 'number_decimal':
					return parseFloat(value).toLocaleString('en-GB');
				case 'number_integer':
					return parseInt(value, 10).toLocaleString('en-GB');
				case 'url':
					return value;
				case 'json': {
					const parsed = JSON.parse(value);
					if (Array.isArray(parsed)) return parsed.join(', ');
					return JSON.stringify(parsed, null, 2);
				}
				case 'list.single_line_text_field':
				case 'list.color':
				case 'list.number_integer':
				case 'list.number_decimal': {
					const items = JSON.parse(value);
					return Array.isArray(items) ? items.join(', ') : value;
				}
				case 'weight': {
					const w = JSON.parse(value);
					return `${w.value} ${w.unit}`;
				}
				case 'dimension': {
					const d = JSON.parse(value);
					return `${d.value} ${d.unit}`;
				}
				case 'volume': {
					const v = JSON.parse(value);
					return `${v.value} ${v.unit}`;
				}
				case 'rating': {
					const r = JSON.parse(value);
					return `${r.value} / ${r.scale_max}`;
				}
				default:
					return value;
			}
		} catch {
			return value;
		}
	}

	function isUrlType(typeName) {
		return typeName === 'url';
	}
</script>

<svelte:head>
	<title>{product.title} — Watch Reserve</title>
	<meta name="description" content="{product.vendor} {product.title}. {product.description?.slice(0, 150)}" />
</svelte:head>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
	<div class="breadcrumb-inner">
		<a href="/">Home</a>
		<span class="sep" aria-hidden="true">/</span>
		<a href="/shop">Shop</a>
		<span class="sep" aria-hidden="true">/</span>
		<span aria-current="page">{product.title}</span>
	</div>
</nav>

<main class="product-page">
	<div class="product-layout">

		<!-- ── IMAGE GALLERY ── -->
		<div class="gallery" role="region" aria-label="Product images" onkeydown={handleKeydown} tabindex="0">
			<div class="main-image-wrap">
				{#each product.images as img, i}
					<div class="main-image-slide" class:active={i === activeImageIndex} aria-hidden={i !== activeImageIndex}>
						<img
							src={img.url}
							alt={img.altText}
							class="main-image"
							loading={i === 0 ? 'eager' : 'lazy'}
						/>
					</div>
				{/each}

				{#if product.images.length > 1}
					<button class="gallery-arrow gallery-arrow-prev" onclick={prevImage} disabled={activeImageIndex === 0} aria-label="Previous image">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M15 18L9 12L15 6" />
						</svg>
					</button>
					<button class="gallery-arrow gallery-arrow-next" onclick={nextImage} disabled={activeImageIndex === product.images.length - 1} aria-label="Next image">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M9 18L15 12L9 6" />
						</svg>
					</button>

					<div class="image-counter" aria-live="polite">
						{activeImageIndex + 1} / {product.images.length}
					</div>
				{/if}
			</div>

			{#if product.images.length > 1}
				<div class="thumbnails" bind:this={thumbsRef} role="list" aria-label="Image thumbnails">
					{#each product.images as img, i}
						<button
							class="thumb"
							class:active={i === activeImageIndex}
							onclick={() => setImage(i)}
							aria-label="View image {i + 1}"
							aria-pressed={i === activeImageIndex}
							role="listitem"
						>
							<img src={img.url} alt={img.altText} loading="lazy" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- ── PRODUCT DETAILS ── -->
		<div class="details">
			{#if product.vendor}
				<p class="vendor">{product.vendor}</p>
			{/if}

			<h1 class="title">{product.title}</h1>

			<div class="price-row">
				<span class="price">{formatPrice(selectedVariant?.price ?? product.minPrice, selectedVariant?.currencyCode ?? product.currencyCode)}</span>
				{#if selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price}
					<span class="compare-price">{formatPrice(selectedVariant.compareAtPrice, selectedVariant.currencyCode)}</span>
				{/if}
			</div>

			<!-- Product meta details from tags -->
			{#if productDetails.length > 0}
				<div class="meta-table">
					{#each productDetails as detail}
						<div class="meta-row">
							<span class="meta-key">{detail.key}</span>
							<span class="meta-value">{detail.value}</span>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Variant selector -->
			{#if product.variants.length > 1}
				<div class="variant-group">
					<p class="field-label">Option</p>
					<div class="variant-pills">
						{#each product.variants as variant}
							<button
								class="variant-pill"
								class:selected={variant.id === selectedVariantId}
								class:unavailable={!variant.availableForSale}
								onclick={() => (selectedVariantId = variant.id)}
								disabled={!variant.availableForSale}
								aria-pressed={variant.id === selectedVariantId}
							>
								{variant.title}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Availability -->
			<div class="availability" class:in-stock={isAvailable} class:out-of-stock={!isAvailable}>
				<span class="availability-dot" aria-hidden="true"></span>
				{isAvailable ? 'Available' : 'Currently Unavailable'}
			</div>

			<!-- Add to cart form -->
			<form
				method="POST"
				action="?/addToCart"
				use:enhance={() => {
					adding = true;
					added = false;
					return async ({ result, update }) => {
						await update({ reset: false });
						adding = false;
						if (result.type === 'success' && result.data?.success) {
							added = true;
							setTimeout(() => (added = false), 3000);
						}
					};
				}}
			>
				<input type="hidden" name="variantId" value={selectedVariantId} />
				<input type="hidden" name="quantity" value={quantity} />

				<div class="purchase-row">
					<div class="qty-control">
						<button type="button" class="qty-btn" onclick={() => quantity > 1 && quantity--} aria-label="Decrease quantity" disabled={quantity <= 1}>−</button>
						<span class="qty-value" aria-live="polite">{quantity}</span>
						<button type="button" class="qty-btn" onclick={() => quantity++} aria-label="Increase quantity">+</button>
					</div>

					<button type="submit" class="add-btn" disabled={!isAvailable || adding}>
						{#if adding}
							<span class="spinner" aria-hidden="true"></span>
							Adding…
						{:else if added}
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<polyline points="20 6 9 17 4 12" />
							</svg>
							Added to Cart
						{:else}
							{isAvailable ? 'Add to Cart' : 'Unavailable'}
						{/if}
					</button>
				</div>
			</form>

			{#if form?.success && form?.checkoutUrl}
				<a href={form.checkoutUrl} class="checkout-link" target="_blank" rel="noopener">
					Proceed to Checkout
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M7 17L17 7M7 7h10v10" />
					</svg>
				</a>
			{/if}

			{#if form?.success === false}
				<p class="form-error" role="alert">{form.error}</p>
			{/if}

			<!-- Description -->
			{#if product.descriptionHtml}
				<div class="description-section">
					<h2 class="description-heading">About This Timepiece</h2>
					<div class="description-body">
						{@html product.descriptionHtml}
					</div>
				</div>
			{/if}

			<!-- Trust signals -->
			<div class="trust-strip">
				<div class="trust-item">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
					Authenticated & Verified
				</div>
				<div class="trust-item">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
					</svg>
					Insured Delivery
				</div>
				<div class="trust-item">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
					</svg>
					Secure Payment
				</div>
			</div>

			<!-- Tags -->
			{#if product.tags.length > 0}
				<div class="tags">
					{#each product.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</main>

<!-- ── METAFIELDS PANELS ── -->
{#if metafieldsByGroup.product.length > 0}
	<section class="metafields-section">
		<div class="metafields-container">

			<!-- Product Specifications -->
			{#if metafieldsByGroup.product.length > 0}
				<div class="metafields-panel">
					<div class="panel-header">
						<div class="panel-icon" aria-hidden="true">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="3" />
								<path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
							</svg>
						</div>
						<div>
							<h2 class="panel-title">Specifications</h2>
							<p class="panel-subtitle">Detailed product data from our records</p>
						</div>
					</div>

					<dl class="mf-grid">
						{#each metafieldsByGroup.product as mf}
							{@const display = formatMetafieldValue(mf.value, mf.typeName)}
							{#if display !== null}
								<div class="mf-item">
									<dt class="mf-label">
										{mf.name}
										{#if mf.description}
											<span class="mf-hint" title={mf.description}>?</span>
										{/if}
									</dt>
									<dd class="mf-value">
										{#if isUrlType(mf.typeName)}
											<a href={display} class="mf-link" target="_blank" rel="noopener">{display}</a>
										{:else}
											{display}
										{/if}
									</dd>
								</div>
							{/if}
						{/each}
					</dl>
				</div>
			{/if}

		</div>
	</section>
{/if}

<style>
	/* ── BREADCRUMB ── */
	.breadcrumb {
		background-color: #fafaf9;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		padding: 14px 40px;
		overflow-x: hidden;
		box-sizing: border-box;
		width: 100%;
	}

	.breadcrumb-inner {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8125rem;
		color: #999;
	}

	.breadcrumb-inner a {
		color: #999;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.breadcrumb-inner a:hover { color: #160b11; }

	.breadcrumb-inner span[aria-current] {
		color: #160b11;
		font-weight: 500;
	}

	.sep { color: #ccc; }

	/* ── LAYOUT ── */
	.product-page {
		background-color: #ffffff;
		padding: 56px 40px 100px;
		box-sizing: border-box;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
	}

	.product-layout {
		max-width: 1300px;
		width: 100%;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: start;
		box-sizing: border-box;
	}

	.product-layout > * {
		min-width: 0;
		max-width: 100%;
	}

	/* ── GALLERY ── */
	.gallery {
		position: sticky;
		top: 100px;
		outline: none;
	}

	.main-image-wrap {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		background: linear-gradient(135deg, #f8f6f5 0%, #f0ece9 100%);
		border-radius: 20px;
		overflow: hidden;
		border: 1px solid rgba(22, 11, 17, 0.07);
	}

	.main-image-slide {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		pointer-events: none;
	}

	.main-image-slide.active {
		opacity: 1;
		pointer-events: auto;
	}

	.main-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.gallery-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.92);
		border: 1px solid rgba(22, 11, 17, 0.1);
		color: #160b11;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.25s ease;
		backdrop-filter: blur(8px);
		z-index: 2;
	}

	.gallery-arrow:hover:not(:disabled) {
		background-color: #160b11;
		color: #ffffff;
		border-color: #160b11;
		transform: translateY(-50%) scale(1.05);
	}

	.gallery-arrow:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.gallery-arrow-prev { left: 16px; }
	.gallery-arrow-next { right: 16px; }

	.image-counter {
		position: absolute;
		bottom: 16px;
		right: 16px;
		background-color: rgba(22, 11, 17, 0.55);
		color: #ffffff;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		padding: 4px 10px;
		border-radius: 100px;
		backdrop-filter: blur(4px);
	}

	.thumbnails {
		display: flex;
		gap: 10px;
		margin-top: 14px;
		overflow-x: auto;
		padding-bottom: 4px;
		scrollbar-width: none;
	}

	.thumbnails::-webkit-scrollbar { display: none; }

	.thumb {
		flex-shrink: 0;
		width: 72px;
		height: 72px;
		border-radius: 10px;
		overflow: hidden;
		border: 2px solid transparent;
		cursor: pointer;
		padding: 0;
		background: none;
		transition: border-color 0.2s ease, transform 0.2s ease;
	}

	.thumb:hover { transform: translateY(-2px); }

	.thumb.active { border-color: #160b11; }

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* ── DETAILS PANEL ── */
	.details {
		display: flex;
		flex-direction: column;
		gap: 28px;
		padding-top: 8px;
	}

	.vendor {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 3vw, 2.75rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.price-row {
		display: flex;
		align-items: baseline;
		gap: 14px;
	}

	.price {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.5rem, 2.5vw, 2.25rem);
		font-weight: 400;
		color: #160b11;
		letter-spacing: -0.02em;
	}

	.compare-price {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 1.1rem;
		color: #aaa;
		text-decoration: line-through;
	}

	/* ── META TABLE ── */
	.meta-table {
		display: flex;
		flex-direction: column;
		border: 1px solid rgba(22, 11, 17, 0.08);
		border-radius: 12px;
		overflow: hidden;
	}

	.meta-row {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 16px;
		padding: 13px 20px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.06);
	}

	.meta-row:last-child { border-bottom: none; }
	.meta-row:nth-child(even) { background-color: #fafaf9; }

	.meta-key {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #999;
	}

	.meta-value {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9rem;
		color: #160b11;
		font-weight: 400;
	}

	/* ── VARIANT PILLS ── */
	.field-label {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #999;
		margin: 0 0 10px 0;
	}

	.variant-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.variant-pill {
		padding: 8px 18px;
		border-radius: 6px;
		border: 1px solid rgba(22, 11, 17, 0.2);
		background: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.variant-pill:hover:not(:disabled) { border-color: #160b11; }

	.variant-pill.selected {
		background-color: #160b11;
		border-color: #160b11;
		color: #ffffff;
	}

	.variant-pill.unavailable {
		opacity: 0.35;
		cursor: not-allowed;
		text-decoration: line-through;
	}

	/* ── AVAILABILITY ── */
	.availability {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.availability.in-stock { color: #16a34a; }
	.availability.out-of-stock { color: #dc2626; }

	.availability-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.in-stock .availability-dot { background-color: #16a34a; }
	.out-of-stock .availability-dot { background-color: #dc2626; }

	/* ── PURCHASE ROW ── */
	.purchase-row {
		display: flex;
		gap: 14px;
		align-items: center;
	}

	.qty-control {
		display: flex;
		align-items: center;
		border: 1px solid rgba(22, 11, 17, 0.18);
		border-radius: 10px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.qty-btn {
		width: 44px;
		height: 52px;
		background: none;
		border: none;
		font-size: 1.2rem;
		color: #160b11;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s ease;
	}

	.qty-btn:hover:not(:disabled) { background-color: rgba(22, 11, 17, 0.05); }
	.qty-btn:disabled { opacity: 0.3; cursor: default; }

	.qty-value {
		min-width: 36px;
		text-align: center;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		color: #160b11;
		border-left: 1px solid rgba(22, 11, 17, 0.1);
		border-right: 1px solid rgba(22, 11, 17, 0.1);
		padding: 0 4px;
		line-height: 52px;
	}

	.add-btn {
		flex: 1;
		height: 52px;
		background-color: #160b11;
		color: #ffffff;
		border: none;
		border-radius: 10px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition: all 0.25s ease;
	}

	.add-btn:hover:not(:disabled) {
		background-color: #2a1420;
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(22, 11, 17, 0.25);
	}

	.add-btn:active:not(:disabled) { transform: translateY(0); }
	.add-btn:disabled { background-color: #ccc; cursor: not-allowed; }

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255,255,255,0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	.checkout-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #a1846d;
		text-decoration: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		border-bottom: 1px solid rgba(161, 132, 109, 0.3);
		padding-bottom: 2px;
		transition: border-color 0.2s ease, color 0.2s ease;
	}

	.checkout-link:hover { color: #8a6f59; border-color: #8a6f59; }

	.form-error {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.875rem;
		color: #dc2626;
		margin: 0;
		background-color: rgba(220, 38, 38, 0.06);
		padding: 10px 14px;
		border-radius: 8px;
		border: 1px solid rgba(220, 38, 38, 0.15);
	}

	/* ── DESCRIPTION ── */
	.description-section {
		border-top: 1px solid rgba(22, 11, 17, 0.08);
		padding-top: 28px;
	}

	.description-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.125rem;
		font-weight: 400;
		color: #160b11;
		margin: 0 0 16px 0;
		letter-spacing: -0.01em;
	}

	.description-body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9375rem;
		color: #555;
		line-height: 1.75;
	}

	:global(.description-body p) { margin: 0 0 14px 0; }
	:global(.description-body p:last-child) { margin-bottom: 0; }
	:global(.description-body ul, .description-body ol) { padding-left: 20px; margin: 0 0 14px 0; }
	:global(.description-body li) { margin-bottom: 6px; }

	/* ── TRUST STRIP ── */
	.trust-strip {
		display: flex;
		gap: 24px;
		padding: 20px 0;
		border-top: 1px solid rgba(22, 11, 17, 0.08);
		border-bottom: 1px solid rgba(22, 11, 17, 0.08);
		flex-wrap: wrap;
	}

	.trust-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8125rem;
		font-weight: 500;
		color: #555;
	}

	.trust-item svg { color: #a1846d; flex-shrink: 0; }

	/* ── TAGS ── */
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.75rem;
		color: #888;
		background-color: rgba(22, 11, 17, 0.05);
		padding: 4px 12px;
		border-radius: 100px;
		border: 1px solid rgba(22, 11, 17, 0.08);
	}

	/* ── METAFIELDS SECTION ── */
	.metafields-section {
		background-color: #fafaf9;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		padding: 72px 40px;
		overflow-x: hidden;
		box-sizing: border-box;
		width: 100%;
	}

	.metafields-container {
		max-width: 1300px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(520px, 1fr));
		gap: 40px;
		align-items: start;
	}

	.metafields-panel {
		background-color: #ffffff;
		border: 1px solid rgba(22, 11, 17, 0.08);
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
	}

	.panel-header {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 28px 32px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		background: linear-gradient(135deg, #160b11 0%, #2a1420 100%);
	}

	.panel-icon {
		width: 42px;
		height: 42px;
		background-color: rgba(161, 132, 109, 0.2);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #a1846d;
		flex-shrink: 0;
	}

	.panel-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.1875rem;
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 3px 0;
		letter-spacing: -0.01em;
	}

	.panel-subtitle {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.5);
		margin: 0;
	}

	.mf-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: 8px 0;
		margin: 0;
	}

	.mf-item {
		padding: 16px 32px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.05);
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.mf-item:nth-child(odd) { border-right: 1px solid rgba(22, 11, 17, 0.05); }
	.mf-item:nth-last-child(-n+2) { border-bottom: none; }
	.mf-item:hover { background-color: rgba(161, 132, 109, 0.03); }

	.mf-label {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: #a1846d;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.mf-hint {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background-color: rgba(22, 11, 17, 0.08);
		color: #999;
		font-size: 0.65rem;
		font-weight: 700;
		cursor: help;
		flex-shrink: 0;
	}

	.mf-value {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9375rem;
		color: #160b11;
		font-weight: 400;
		line-height: 1.5;
		margin: 0;
		word-break: break-word;
	}

	.mf-link {
		color: #a1846d;
		text-decoration: none;
		border-bottom: 1px solid rgba(161, 132, 109, 0.3);
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.mf-link:hover { color: #8a6f59; border-color: #8a6f59; }

	/* ── RESPONSIVE ── */
	@media (max-width: 1100px) {
		.product-layout { gap: 56px; }
		.metafields-container { grid-template-columns: 1fr; }
	}

	@media (max-width: 900px) {
		.breadcrumb { padding: 12px 20px; }

		.product-page {
			padding: 36px 20px 72px;
		}

		.product-layout {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.gallery {
			position: static;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.main-image-wrap {
			width: min(100%, 520px);
		}

		.thumbnails {
			width: min(100%, 520px);
			justify-content: center;
		}

		.metafields-section { padding: 48px 20px; }
	}

	@media (max-width: 768px) {
		.mf-grid { grid-template-columns: 1fr; }
		.mf-item:nth-child(odd) { border-right: none; }
		.mf-item:nth-last-child(-n+2) { border-bottom: 1px solid rgba(22, 11, 17, 0.05); }
		.mf-item:last-child { border-bottom: none; }
		.panel-header { padding: 20px; }
		.mf-item { padding: 12px 20px; }
	}

	@media (max-width: 640px) {
		.breadcrumb { padding: 12px 16px; }

		.product-page { padding: 24px 16px 56px; }

		.meta-row {
			grid-template-columns: 100px 1fr;
			gap: 10px;
		}

		.purchase-row {
			flex-direction: column;
			align-items: stretch;
		}

		.qty-control { width: 100%; justify-content: space-between; }
		.qty-btn { flex: 1; }
		.qty-value { flex: 2; }

		.add-btn {
			width: 100%;
			height: 56px;
			font-size: 1rem;
		}

		.trust-strip { flex-direction: column; gap: 12px; }
	}

	@media (max-width: 480px) {
		.product-page { padding: 20px 14px 48px; }
		.breadcrumb { padding: 10px 14px; }
		.metafields-section { padding: 32px 14px; }
		.panel-header { padding: 16px 14px; }
		.mf-item { padding: 12px 14px; }
		.main-image-wrap { border-radius: 14px; }
		.thumb { width: 60px; height: 60px; }
	}
</style>
