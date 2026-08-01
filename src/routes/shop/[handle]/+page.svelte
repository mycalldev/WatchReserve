<script>
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte.js';
	import { cart } from '$lib/stores/cart.svelte.js';
	import ProductViewCount from '$lib/components/ProductViewCount.svelte';
	import MoreOf from '$lib/components/MoreOf.svelte';
	import ProductEnquiryDrawer from '$lib/components/ProductEnquiryDrawer.svelte';
	import ActionSlideOver from '$lib/components/ActionSlideOver.svelte';

	let { data, form } = $props();
	const product = $derived(data.product);
	const relatedProducts = $derived(data.relatedProducts);

	let activeImageIndex = $state(0);
	let selectedVariantId = $state(product.variants[0]?.id ?? '');
	let quantity = $state(1);
	let adding = $state(false);
	let added = $state(false);
	let thumbsRef = $state(null);
	let locallyReserved = $state(false);

	// Reset local state whenever the product changes (same-route navigation)
	$effect(() => {
		void product.id;
		activeImageIndex = 0;
		selectedVariantId = product.variants[0]?.id ?? '';
		quantity = 1;
		adding = false;
		added = false;
		locallyReserved = false;
		slideOverOpen = false;
	});

	// ── Slide-over state ────────────────────────────────────────────────────────
	/** @type {'cart' | 'part-exchange' | 'deposit' | null} */
	let slideOverType = $state(null);
	let slideOverOpen = $state(false);
	let slideOverCheckoutUrl = $state(null);

	function openDrawer(type) {
		slideOverType = type;
		slideOverOpen = true;
	}

	// ── Finance disclaimer modal ────────────────────────────────────────────────
	const FINANCE_URL = 'https://ideal4finance.com/loan-apply/thewrsltd-';
	let financeModalOpen = $state(false);

	function openFinanceModal() {
		financeModalOpen = true;
	}

	function continueToFinance() {
		window.open(FINANCE_URL, '_blank', 'noopener,noreferrer');
		financeModalOpen = false;
	}

	function closeDrawer() {
		slideOverOpen = false;
	}

	// Allow the cart panel's "Also available" links to switch drawer type
	onMount(() => {
		try {
			const reserved = JSON.parse(localStorage.getItem('wr_reserved') ?? '{}');
			if (reserved[product.id]) locallyReserved = true;
		} catch {}

		function handleOpenDrawer(e) {
			openDrawer(e.detail);
		}
		document.addEventListener('open-drawer', handleOpenDrawer);

		return () => {
			document.removeEventListener('open-drawer', handleOpenDrawer);
		};
	});

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
			if (thumb) {
				const scrollLeft = thumb.offsetLeft - thumbsRef.offsetWidth / 2 + thumb.offsetWidth / 2;
				thumbsRef.scrollTo({ left: scrollLeft, behavior: 'smooth' });
			}
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

	const DETAIL_TAGS = [
		'reference',
		'year',
		'material',
		'condition',
		'movement',
		'case-size',
		'box',
		'papers'
	];

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

	// Extract status from metafields (custom.status), fallback to null
	const productStatus = $derived(() => {
		const m = product.metafields?.find((f) => f && f.namespace === 'custom' && f.key === 'status');
		return m?.value?.trim() ?? null;
	});

	const statusSlug = $derived(() => {
		if (locallyReserved) return 'reserved';
		return productStatus() ? productStatus().toLowerCase().replace(/\s+/g, '-') : null;
	});

	const effectiveStatusLabel = $derived(() => (locallyReserved ? 'Reserved' : productStatus()));

	const isBlockedByStatus = $derived(() => {
		const slug = statusSlug();
		return slug === 'sold' || slug === 'reserved';
	});

	const statusCtaLabel = $derived(() => {
		const slug = statusSlug();
		if (slug === 'sold') return 'Sold';
		if (slug === 'reserved') return 'Reserved';
		return null;
	});

	// Extract view count from metafields (custom.viewed), fallback to null
	const viewedCount = $derived(() => {
		const m = product.metafields?.find((f) => f && f.namespace === 'custom' && f.key === 'viewed');
		return m?.value ?? null;
	});

	function formatMetafieldValue(value, typeName) {
		if (value === null || value === undefined || value === '') return null;

		try {
			switch (typeName) {
				case 'boolean':
					return value === 'true' ? 'Yes' : 'No';
				case 'date':
					return new Intl.DateTimeFormat('en-GB', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					}).format(new Date(value));
				case 'date_time':
					return new Intl.DateTimeFormat('en-GB', {
						dateStyle: 'medium',
						timeStyle: 'short'
					}).format(new Date(value));
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

	// Derive the Shopify collection handle from the vendor name
	// e.g. "Audemars Piguet" → "audemars-piguet"
	const vendorHandle = $derived(
		product.vendor
			? product.vendor
					.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '')
			: null
	);

	const vendorUrl = $derived(vendorHandle ? `/collections/${vendorHandle}` : '/shop');

	// Extract reference number from tags (e.g. "reference:126610LN")
	const productReference = $derived(
		productDetails.find((d) => d.key.toLowerCase() === 'reference')?.value ?? null
	);

	// ── PRODUCT SPECIFICATIONS TABS ──
	const SPEC_TABS = [
		{
			id: 'watch',
			label: 'Watch',
			fields: [
				{ key: 'reference', label: 'Reference' },
				{ key: 'brand', label: 'Brand' },
				{ key: 'model', label: 'Model' },
				{ key: 'year', label: 'Year' },
				{ key: 'condition', label: 'Condition' },
				{ key: 'functions', label: 'Functions' }
			]
		},
		{
			id: 'calibre',
			label: 'Calibre',
			fields: [
				{ key: 'movement_calibre', label: 'Movement Calibre' },
				{ key: 'power_reserve', label: 'Power Reserve' }
			]
		},
		{
			id: 'case',
			label: 'Case',
			fields: [
				{ key: 'dial', label: 'Dial Colour' },
				{ key: 'diameter', label: 'Diameter' },
				{ key: 'case_material', label: 'Material' },
				{ key: 'water_resistance', label: 'Water Resistance' }
			]
		},
		{
			id: 'bracelet',
			label: 'Bracelet',
			fields: [
				{ key: 'clasp_material', label: 'Clasp Material' },
				{ key: 'clasp_type', label: 'Clasp Type' },
				{ key: 'colour', label: 'Colour' },
				{ key: 'bracelet_material', label: 'Material' }
			]
		}
	];

	let activeSpecTab = $state('watch');

	// Build a lookup map from metafield key → value.
	// Brand and Model fall back to Shopify vendor/title if metafields aren't set.
	const metafieldMap = $derived(
		product.metafields.reduce(
			(acc, mf) => {
				if (mf?.key && mf.value != null && mf.value !== '') {
					acc[mf.key] = mf.value;
				}
				return acc;
			},
			{
				brand: product.vendor ?? '',
				model: product.title ?? ''
			}
		)
	);

	const currentTabFields = $derived(
		(SPEC_TABS.find((t) => t.id === activeSpecTab)?.fields ?? [])
			.map((f) => ({ ...f, value: metafieldMap[f.key] ?? null }))
			.filter((f) => f.value)
	);

	// Match an image by alt text equal to the active tab id, fall back to first image
	const activeTabImage = $derived(
		product.images.find((img) => img.altText?.toLowerCase().trim() === activeSpecTab) ??
			product.images[0] ??
			null
	);

	// Build a normalised product object for the wishlist store
	const wishlistProduct = $derived({
		id: product.id,
		handle: product.handle,
		title: product.title,
		vendor: product.vendor ?? null,
		price: selectedVariant?.price ?? product.minPrice ?? 0,
		currencyCode: selectedVariant?.currencyCode ?? product.currencyCode ?? 'GBP',
		image: product.images[0]?.url ?? null,
		imageAlt: product.images[0]?.altText ?? null,
		status: productStatus()
	});

	const isSaved = $derived(wishlist.isInWishlist(product.id));
</script>

<svelte:head>
	<title>{product.title} — Watch Reserve</title>
	<meta
		name="description"
		content="{product.vendor && product.vendor !== 'My Store'
			? product.vendor + ' '
			: ''}{product.title}. {product.description?.slice(0, 150)}"
	/>
	{#if data.canonical}
		<link rel="canonical" href={data.canonical} />
	{/if}
</svelte:head>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
	<div class="breadcrumb-inner">
		<a href="/">Home</a>
		<span class="sep" aria-hidden="true">/</span>
		<a href="/shop">Shop</a>
		{#if product.vendor && product.vendor !== 'My Store'}
			<span class="sep" aria-hidden="true">/</span>
			<a href={vendorUrl} class="breadcrumb-vendor">{product.vendor}</a>
		{/if}
	</div>
</nav>

<main class="product-page">
	<div class="product-layout">
		<!-- ── IMAGE GALLERY ── -->
		<div
			class="gallery"
			role="region"
			aria-label="Product images"
			onkeydown={handleKeydown}
			tabindex="0"
		>
			<div class="main-image-wrap">
				{#each product.images as img, i}
					<div
						class="main-image-slide"
						class:active={i === activeImageIndex}
						aria-hidden={i !== activeImageIndex}
					>
						<img
							src={img.url}
							alt={img.altText}
							class="main-image"
							loading={i === 0 ? 'eager' : 'lazy'}
						/>
					</div>
				{/each}

				{#if product.images.length > 1}
					<button
						class="gallery-arrow gallery-arrow-prev"
						onclick={prevImage}
						disabled={activeImageIndex === 0}
						aria-label="Previous image"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M15 18L9 12L15 6" />
						</svg>
					</button>
					<button
						class="gallery-arrow gallery-arrow-next"
						onclick={nextImage}
						disabled={activeImageIndex === product.images.length - 1}
						aria-label="Next image"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
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

			<!-- Enquiry drawer -->
			<ProductEnquiryDrawer
				title={product.title}
				vendor={product.vendor ?? ''}
				reference={productReference}
				price={selectedVariant?.price ?? product.minPrice ?? null}
				currencyCode={selectedVariant?.currencyCode ?? product.currencyCode ?? 'GBP'}
				status={productStatus()}
			/>
		</div>

		<!-- ── PRODUCT DETAILS ── -->
		<div class="details">
			<div class="details-top-row">
				{#if product.vendor && product.vendor !== 'My Store'}
					<p class="vendor">{product.vendor}</p>
				{/if}
			</div>

			<h1 class="title">{product.title}</h1>

			{#if productStatus()?.toLowerCase() !== 'sold'}
				<div class="price-row">
					<span class="price"
						>{formatPrice(
							selectedVariant?.price ?? product.minPrice,
							selectedVariant?.currencyCode ?? product.currencyCode
						)}</span
					>
					{#if selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price}
						<span class="compare-price"
							>{formatPrice(selectedVariant.compareAtPrice, selectedVariant.currencyCode)}</span
						>
					{/if}
				</div>
			{/if}

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

			<!-- Status -->
			{#if effectiveStatusLabel()}
				<div
					class="status-badge status-{statusSlug()}"
					aria-label="Status: {effectiveStatusLabel()}"
				>
					<span class="status-dot" aria-hidden="true"></span>
					{effectiveStatusLabel()}
				</div>
			{:else}
				<div class="status-badge status-available" aria-label="Status: Available">
					<span class="status-dot" aria-hidden="true"></span>
					Available
				</div>
			{/if}

			<!-- View count -->
			<ProductViewCount count={viewedCount()} />

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
							slideOverCheckoutUrl = result.data.checkoutUrl ?? null;
							if (result.data.totalQuantity != null) cart.set(result.data.totalQuantity);
							openDrawer('cart');
							setTimeout(() => (added = false), 3000);
						}
					};
				}}
			>
				<input type="hidden" name="variantId" value={selectedVariantId} />
				<input type="hidden" name="quantity" value={quantity} />

				<button
					type="submit"
					class="add-btn"
					disabled={!isAvailable || isBlockedByStatus() || adding}
				>
					{#if adding}
						<span class="spinner" aria-hidden="true"></span>
						Adding…
					{:else if added}
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
						Added to Cart
					{:else if statusCtaLabel()}
						{statusCtaLabel()}
					{:else}
						{isAvailable ? 'Add to Cart' : 'Unavailable'}
					{/if}
				</button>
			</form>

			<!-- Secondary action buttons -->
			<div class="action-stack">
				<div class="action-row-2">
					<button
						type="button"
						class="btn-action-dark"
						onclick={() => openDrawer('part-exchange')}
						disabled={isBlockedByStatus()}
					>
						<svg
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
							<path d="M3 7h18m0 0l-4-4m4 4l-4 4M21 17H3m0 0l4-4m-4 4l4 4" />
						</svg>
						Part Exchange
					</button>
					<button
						type="button"
						class="btn-action-dark"
						onclick={() => openDrawer('deposit')}
						disabled={isBlockedByStatus()}
					>
						<svg
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
							<rect x="1" y="4" width="22" height="16" rx="0" ry="0" /><line
								x1="1"
								y1="10"
								x2="23"
								y2="10"
							/>
						</svg>
						Deposit
					</button>
					<button type="button" class="btn-action-outline" onclick={openFinanceModal}>
						<svg
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
							<rect x="4" y="2" width="16" height="20" rx="0" ry="0" /><line
								x1="8"
								y1="6"
								x2="16"
								y2="6"
							/><line x1="8" y1="10" x2="8" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line
								x1="16"
								y1="10"
								x2="16"
								y2="10"
							/><line x1="8" y1="14" x2="8" y2="14" /><line x1="12" y1="14" x2="12" y2="14" /><line
								x1="16"
								y1="14"
								x2="16"
								y2="18"
							/><line x1="8" y1="18" x2="12" y2="18" />
						</svg>
						Apply For Finance
					</button>
				</div>
			</div>

			<!-- Google Reviews social proof -->
			<div class="product-trustpilot">
				<div class="elfsight-app-3792420a-7204-4b4b-b884-4ed4c4b7956f" data-elfsight-app-lazy></div>
			</div>

			<!-- Wishlist -->
			<button
				class="btn-wishlist"
				class:saved={isSaved}
				onclick={() => wishlist.toggle(wishlistProduct)}
				type="button"
				aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill={isSaved ? 'currentColor' : 'none'}
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path
						d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
					/>
				</svg>
				{isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
			</button>

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
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						/>
					</svg>
					Authenticated & Verified
				</div>
				<div class="trust-item">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
					</svg>
					Insured Delivery
				</div>
				<div class="trust-item">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path
							d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
						/>
					</svg>
					Secure Payment
				</div>
			</div>
		</div>
	</div>
</main>

<!-- ── PRODUCT SPECIFICATIONS ── -->
<section class="specs-section" aria-label="Product Specifications">
	<div class="specs-container">
		<div class="specs-top">
			<div class="specs-top-text">
				<p class="specs-eyebrow">Technical Detail</p>
				<h2 class="specs-heading">Product <em>Specifications</em></h2>
			</div>

			<!-- Tabs -->
			<div class="specs-tabs" role="tablist" aria-label="Specification categories">
				{#each SPEC_TABS as tab}
					<button
						role="tab"
						aria-selected={activeSpecTab === tab.id}
						aria-controls="specs-panel"
						class="specs-tab"
						class:active={activeSpecTab === tab.id}
						onclick={() => (activeSpecTab = tab.id)}
					>
						{tab.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Body -->
		<div class="specs-body" id="specs-panel" role="tabpanel">
			<!-- Spec fields -->
			<dl class="specs-list">
				{#if currentTabFields.length > 0}
					{#each currentTabFields as field}
						<div class="spec-row">
							<dt class="spec-label">{field.label}</dt>
							<dd class="spec-value">{field.value}</dd>
						</div>
					{/each}
				{:else}
					<p class="specs-empty">No {activeSpecTab} specifications available for this timepiece.</p>
				{/if}
			</dl>

			<!-- Image -->
			{#if activeTabImage}
				<div class="specs-image-col">
					<img
						src={activeTabImage.url}
						alt={activeTabImage.altText ?? product.title}
						class="specs-img"
					/>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- ── RELATED PRODUCTS ── -->
<MoreOf products={relatedProducts} vendor={product.vendor} />

<!-- ── ACTION SLIDE-OVER ── -->
<ActionSlideOver
	open={slideOverOpen}
	type={slideOverType ?? 'cart'}
	{product}
	{selectedVariant}
	checkoutUrl={slideOverCheckoutUrl}
	onclose={closeDrawer}
	ondepositsuccess={() => (locallyReserved = true)}
/>

<!-- ── FINANCE DISCLAIMER MODAL ── -->
{#if financeModalOpen}
	<div
		class="finance-modal-overlay"
		role="button"
		tabindex="0"
		aria-label="Close"
		onclick={() => (financeModalOpen = false)}
		onkeydown={(e) => (e.key === 'Escape' || e.key === 'Enter') && (financeModalOpen = false)}
	>
		<div
			class="finance-modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="finance-modal-title"
			onclick={(e) => e.stopPropagation()}
			onkeydown={() => {}}
		>
			<h3 id="finance-modal-title" class="finance-modal-title">Before you continue</h3>
			<p class="finance-modal-text">
				Watch Reserve Ltd is an Introducer Appointed Representative of Ideal Sales Solutions Ltd,
				t/a Ideal4Finance. Ideal Sales Solutions Ltd is a credit broker and not a lender (FRN
				703401). Finance available subject to status. The rate offered is always provisional and
				will depend upon your personal circumstances, the loan amount and the term.
			</p>
			<button type="button" class="finance-modal-continue" onclick={continueToFinance}>
				Continue to Application
			</button>
		</div>
	</div>
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
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8125rem;
		color: #999;
	}

	.breadcrumb-inner a {
		color: #999;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.breadcrumb-inner a:hover {
		color: #160b11;
	}

	.breadcrumb-inner span[aria-current] {
		color: #160b11;
		font-weight: 500;
	}

	.breadcrumb-vendor {
		color: #422635 !important;
		font-weight: 600;
	}

	.breadcrumb-vendor:hover {
		color: #160b11 !important;
	}

	.sep {
		color: #ccc;
	}

	/* ── LAYOUT ── */
	.product-page {
		background-color: #ffffff;
		padding: 40px 40px 100px;
		box-sizing: border-box;
		width: 100%;
		max-width: 100%;
		overflow-x: clip;
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
		border-radius: 0;
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
		border-radius: 0;
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

	.gallery-arrow-prev {
		left: 16px;
	}
	.gallery-arrow-next {
		right: 16px;
	}

	.image-counter {
		position: absolute;
		bottom: 16px;
		right: 16px;
		background-color: rgba(22, 11, 17, 0.55);
		color: #ffffff;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		padding: 4px 10px;
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

	.thumbnails::-webkit-scrollbar {
		display: none;
	}

	.gallery :global(.eq-root) {
		margin-top: 24px;
		width: 100%;
	}

	.thumb {
		flex-shrink: 0;
		width: 72px;
		height: 72px;
		border-radius: 0;
		overflow: hidden;
		border: 2px solid transparent;
		cursor: pointer;
		padding: 0;
		background: none;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease;
	}

	.thumb:hover {
		transform: translateY(-2px);
	}

	.thumb.active {
		border-color: #160b11;
	}

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

	.details-top-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
	}

	.vendor {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	/* ── STATUS BADGE (product page) ── */
	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 12px;
		border-radius: 0;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 400;
		letter-spacing: 0.01em;
		color: #6b5c55;
		background-color: #f5f2f0;
		flex-shrink: 0;
	}

	.status-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.status-available .status-dot {
		background-color: #22a05a;
	}
	.status-sold .status-dot {
		background-color: #c94040;
	}
	.status-new-arrival .status-dot {
		background-color: #c9a230;
	}
	.status-reserved .status-dot {
		background-color: #422635;
	}

	.title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
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
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.5rem, 2.5vw, 2.25rem);
		font-weight: 400;
		color: #160b11;
		letter-spacing: -0.02em;
	}

	.compare-price {
		font-family: 'acumin-pro', sans-serif;
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

	.meta-row:last-child {
		border-bottom: none;
	}
	.meta-row:nth-child(even) {
		background-color: #fafaf9;
	}

	.meta-key {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #999;
	}

	.meta-value {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.9rem;
		color: #160b11;
		font-weight: 400;
	}

	/* ── VARIANT PILLS ── */
	.field-label {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
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
		border-radius: 0;
		border: 1px solid rgba(22, 11, 17, 0.2);
		background: none;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.variant-pill:hover:not(:disabled) {
		border-color: #160b11;
	}

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

	/* ── PURCHASE ROW ── */
	.add-btn {
		width: 100%;
		height: 52px;
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		border-radius: 0;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition: all 0.25s ease;
	}

	.add-btn:hover:not(:disabled) {
		background-color: #8a6f59;
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(161, 132, 109, 0.35);
	}

	.add-btn:active:not(:disabled) {
		transform: translateY(0);
	}
	.add-btn:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.checkout-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #a1846d;
		text-decoration: none;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		border-bottom: 1px solid rgba(161, 132, 109, 0.3);
		padding-bottom: 2px;
		transition:
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.checkout-link:hover {
		color: #8a6f59;
		border-color: #8a6f59;
	}

	/* ── SECONDARY ACTION BUTTONS ── */
	.action-stack {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 2px;
	}

	.action-row-2 {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}

	/* Tighten label spacing so all three fit on one row */
	.action-row-2 .btn-action-dark,
	.action-row-2 .btn-action-outline {
		gap: 6px;
		padding-left: 6px;
		padding-right: 6px;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
	}

	.btn-action-dark,
	.btn-action-outline {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		height: 52px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
		cursor: pointer;
		border-radius: 0;
		transition:
			background-color 0.22s ease,
			color 0.22s ease,
			transform 0.2s ease,
			box-shadow 0.22s ease;
		white-space: nowrap;
	}

	/* Accent outline — Part Exchange, Deposit & Apply for Finance */
	.btn-action-dark,
	.btn-action-outline {
		background-color: transparent;
		color: #a1846d;
		border: 1.5px solid #a1846d;
	}

	.btn-action-dark:hover:not(:disabled),
	.btn-action-outline:hover:not(:disabled) {
		background-color: rgba(161, 132, 109, 0.06);
		border-color: #8a6f59;
		color: #8a6f59;
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(161, 132, 109, 0.2);
	}

	.btn-action-dark:active:not(:disabled),
	.btn-action-outline:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn-action-dark svg,
	.btn-action-outline svg {
		color: #a1846d;
		transition: color 0.2s ease;
	}

	.btn-action-dark:hover:not(:disabled) svg,
	.btn-action-outline:hover:not(:disabled) svg {
		color: #8a6f59;
	}

	.btn-action-dark:disabled,
	.btn-action-outline:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		border-color: #c9c1b8;
		color: #c9c1b8;
	}

	.btn-action-dark:disabled svg,
	.btn-action-outline:disabled svg {
		color: #c9c1b8;
	}

	/* ── FINANCE DISCLAIMER MODAL ── */
	.finance-modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(22, 11, 17, 0.55);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
	}
	.finance-modal {
		background: #ffffff;
		max-width: 460px;
		width: 100%;
		padding: 40px 36px;
		box-shadow: 0 24px 64px rgba(22, 11, 17, 0.28);
		text-align: center;
	}
	.finance-modal-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: 1.375rem;
		font-weight: 400;
		color: #160b11;
		margin: 0 0 18px;
	}
	.finance-modal-text {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.75rem;
		line-height: 1.7;
		font-weight: 300;
		color: #6b5f58;
		margin: 0 0 28px;
	}
	.finance-modal-continue {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 52px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #ffffff;
		background-color: #160b11;
		border: 1.5px solid #160b11;
		border-radius: 0;
		cursor: pointer;
		transition:
			background-color 0.22s ease,
			color 0.22s ease;
	}
	.finance-modal-continue:hover {
		background-color: #a1846d;
		border-color: #a1846d;
	}

	/* ── GOOGLE REVIEWS SOCIAL PROOF ── */
	.product-trustpilot {
		width: 100%;
		margin: 4px 0 8px;
		display: flex;
		justify-content: center;
	}

	.product-trustpilot :global([class^='elfsight-app-']) {
		width: 100%;
	}

	/* ── WISHLIST BUTTON ── */
	.btn-wishlist {
		width: 100%;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		background-color: transparent;
		color: rgba(22, 11, 17, 0.5);
		border: 1.5px solid rgba(22, 11, 17, 0.15);
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			color 0.2s ease,
			border-color 0.2s ease,
			background-color 0.2s ease,
			transform 0.2s ease;
		margin-top: 2px;
	}

	.btn-wishlist:hover {
		color: #a1846d;
		border-color: rgba(161, 132, 109, 0.5);
		background-color: rgba(161, 132, 109, 0.04);
		transform: translateY(-1px);
	}

	.btn-wishlist.saved {
		color: #a1846d;
		border-color: rgba(161, 132, 109, 0.45);
		background-color: rgba(161, 132, 109, 0.05);
	}

	.btn-wishlist.saved:hover {
		color: #c94040;
		border-color: rgba(201, 64, 64, 0.4);
		background-color: rgba(201, 64, 64, 0.04);
	}

	.form-error {
		font-family: 'acumin-pro', sans-serif;
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
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: 1.125rem;
		font-weight: 400;
		color: #160b11;
		margin: 0 0 16px 0;
		letter-spacing: -0.01em;
	}

	.description-body {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.9375rem;
		color: #555;
		line-height: 1.75;
	}

	:global(.description-body p) {
		margin: 0 0 14px 0;
	}
	:global(.description-body p:last-child) {
		margin-bottom: 0;
	}
	:global(.description-body ul, .description-body ol) {
		padding-left: 20px;
		margin: 0 0 14px 0;
	}
	:global(.description-body li) {
		margin-bottom: 6px;
	}

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
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8125rem;
		font-weight: 500;
		color: #555;
	}

	.trust-item svg {
		color: #a1846d;
		flex-shrink: 0;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 1100px) {
		.product-layout {
			gap: 56px;
		}
	}

	@media (max-width: 900px) {
		.breadcrumb {
			padding: 12px 20px;
		}

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
	}

	@media (max-width: 640px) {
		.breadcrumb {
			padding: 12px 16px;
		}

		.product-page {
			padding: 24px 16px 56px;
		}

		.meta-row {
			grid-template-columns: 100px 1fr;
			gap: 10px;
		}

		.add-btn {
			width: 100%;
			height: auto;
			padding-top: 18px;
			padding-bottom: 18px;
			font-size: 0.8125rem;
		}

		.trust-strip {
			flex-direction: column;
			gap: 12px;
		}

		.action-row-2 {
			grid-template-columns: 1fr;
		}

		.btn-action-dark,
		.btn-action-outline,
		.action-row-2 .btn-action-dark,
		.action-row-2 .btn-action-outline {
			height: auto;
			padding-top: 16px;
			padding-bottom: 16px;
			font-size: 0.8125rem;
			letter-spacing: 0.1em;
			gap: 8px;
		}
	}

	@media (max-width: 480px) {
		.product-page {
			padding: 20px 14px 48px;
		}
		.breadcrumb {
			padding: 10px 14px;
		}
		.main-image-wrap {
			border-radius: 0;
		}
		.thumb {
			width: 60px;
			height: 60px;
		}
	}

	/* ── PRODUCT SPECIFICATIONS ── */
	.specs-section {
		background-color: #faf8f5;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		padding: 80px 40px 88px;
	}

	.specs-container {
		max-width: 1300px;
		margin: 0 auto;
	}

	.specs-top {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 40px;
		padding-bottom: 48px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.08);
		margin-bottom: 56px;
	}

	.specs-top-text {
		flex-shrink: 0;
	}

	.specs-eyebrow {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 12px 0;
		display: block;
	}

	.specs-heading {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 2.5vw, 2.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.specs-heading em {
		font-style: normal;
		color: #a1846d;
	}

	/* Tabs */
	.specs-tabs {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.specs-tab {
		background: transparent;
		border: 1px solid rgba(22, 11, 17, 0.18);
		padding: 10px 24px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.4);
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.specs-tab:hover {
		border-color: #a1846d;
		color: #a1846d;
	}

	.specs-tab.active {
		background-color: #a1846d;
		border-color: #a1846d;
		color: #ffffff;
	}

	/* Body */
	.specs-body {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 72px;
		align-items: start;
	}

	/* Spec rows */
	.specs-list {
		margin: 0;
		display: flex;
		flex-direction: column;
	}

	.spec-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 24px;
		padding: 18px 0;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
	}

	.spec-row:first-child {
		border-top: 1px solid rgba(22, 11, 17, 0.07);
	}

	.spec-label {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.4);
		flex-shrink: 0;
	}

	.spec-value {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.9375rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.5;
		text-align: right;
	}

	.specs-empty {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.875rem;
		color: rgba(22, 11, 17, 0.35);
		font-style: normal;
		margin: 0;
		padding: 20px 0;
	}

	/* Image column */
	.specs-image-col {
		position: sticky;
		top: 100px;
	}

	.specs-img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: contain;
		border: 1px solid rgba(22, 11, 17, 0.08);
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.specs-body {
			grid-template-columns: 1fr 260px;
			gap: 48px;
		}
	}

	@media (max-width: 768px) {
		.specs-section {
			padding: 56px 20px 64px;
		}

		.specs-top {
			flex-direction: column;
			align-items: flex-start;
			gap: 28px;
		}

		.specs-tabs {
			justify-content: flex-start;
		}

		.specs-body {
			grid-template-columns: 1fr;
			gap: 40px;
		}
	}

	@media (max-width: 480px) {
		.specs-section {
			padding: 44px 16px 52px;
		}
		.specs-tab {
			padding: 9px 16px;
			font-size: 0.68rem;
		}
	}
</style>
