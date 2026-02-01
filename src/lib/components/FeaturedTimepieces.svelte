<script>
	// Placeholder data - will be replaced with Shopify data
	const timepieces = $state([
		{
			id: 1,
			image: '/assets/watches/1.avif',
			brand: 'Patek Philippe',
			model: 'Nautilus',
			reference: '5980/1A',
			material: 'Stainless steel',
			year: '2009',
			price: 80000.0
		},
		{
			id: 2,
			image: '/assets/watches/2.avif',
			brand: 'Rolex',
			model: 'Day-Date',
			reference: '228236',
			material: 'Platinum',
			year: '2025',
			price: 60000.0
		},
		{
			id: 3,
			image: '/assets/watches/3.avif',
			brand: 'Rolex',
			model: 'Day-Date',
			reference: '228345RBR',
			material: 'Rose gold',
			year: '2025',
			price: 58700.0
		},
		{
			id: 4,
			image: '/assets/watches/1.avif',
			brand: 'Audemars Piguet',
			model: 'Royal Oak',
			reference: '15400SR',
			material: 'Rose gold & Stainless steel',
			year: '2017',
			price: 30000.0
		},
		{
			id: 5,
			image: '/assets/watches/2.avif',
			brand: 'Rolex',
			model: 'GMT-Master',
			reference: '126710BLNR',
			material: 'Steel',
			year: '2022',
			price: 16500.0
		}
	]);

	let currentIndex = $state(0);

	function nextSlide() {
		// Move by one item at a time
		if (currentIndex < timepieces.length - 1) {
			currentIndex = currentIndex + 1;
		}
	}

	function prevSlide() {
		if (currentIndex > 0) {
			currentIndex = currentIndex - 1;
		}
	}

	let canGoNext = $derived(currentIndex < timepieces.length - 1);
	let canGoPrev = $derived(currentIndex > 0);

	function formatPrice(price) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP',
			minimumFractionDigits: 2
		}).format(price);
	}
</script>

<section class="featured-timepieces-section">
	<div class="featured-container">
		<h2 class="featured-title">Featured Timepieces</h2>

		<div class="timepieces-wrapper">
			<div class="timepieces-carousel" style="--current-index: {currentIndex}">
				{#each timepieces as timepiece (timepiece.id)}
					<div class="timepiece-card">
						<div class="timepiece-image-wrapper">
							<img src={timepiece.image} alt="{timepiece.brand} {timepiece.model}" class="timepiece-image" />
						</div>
						<div class="timepiece-details">
							<p class="timepiece-info">
								{timepiece.brand} {timepiece.model}, {timepiece.reference}, {timepiece.material}, {timepiece.year}
							</p>
							<p class="timepiece-price">{formatPrice(timepiece.price)}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="carousel-controls">
			<button
				class="carousel-btn carousel-btn-prev"
				onclick={prevSlide}
				disabled={!canGoPrev}
				aria-label="Previous timepieces"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M15 18L9 12L15 6"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<button
				class="carousel-btn carousel-btn-next"
				onclick={nextSlide}
				disabled={!canGoNext}
				aria-label="Next timepieces"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9 18L15 12L9 6"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>
	</div>
</section>

<style>
	.featured-timepieces-section {
		width: 100%;
		background-color: #ffffff;
		padding: 100px 40px;
		margin: 0;
		box-sizing: border-box;
	}

	.featured-container {
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	.featured-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.25rem, 4.5vw, 3.5rem);
		font-weight: 400;
		color: #160b11;
		text-align: center;
		margin: 0 0 80px 0;
		letter-spacing: -0.03em;
		line-height: 1.2;
	}

	.timepieces-wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;
		margin-bottom: 50px;
	}

	.timepieces-carousel {
		display: flex;
		gap: 28px;
		transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		width: 100%;
		transform: translateX(calc(var(--current-index) * -1 * (25% + 7px)));
	}

	.timepiece-card {
		flex: 0 0 calc((100% - 84px) / 4);
		background-color: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid rgba(22, 11, 17, 0.08);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.04);
		transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		cursor: pointer;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.timepiece-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 16px;
		background: linear-gradient(135deg, rgba(161, 132, 109, 0.03), rgba(22, 11, 17, 0.01));
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
		z-index: -1;
	}

	.timepiece-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 16px 48px rgba(0, 0, 0, 0.06);
		border-color: rgba(22, 11, 17, 0.12);
	}

	.timepiece-card:hover::before {
		opacity: 1;
	}

	.timepiece-image-wrapper {
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.timepiece-image-wrapper::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.02) 100%);
		pointer-events: none;
	}

	.timepiece-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		will-change: transform;
	}

	.timepiece-card:hover .timepiece-image {
		transform: scale(1.08);
	}

	.timepiece-details {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex: 1;
		background-color: #ffffff;
	}

	.timepiece-info {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.875rem, 1.1vw, 1rem);
		line-height: 1.6;
		color: #4a4a4a;
		margin: 0;
		font-weight: 400;
		letter-spacing: 0.01em;
		transition: color 0.3s ease;
	}

	.timepiece-card:hover .timepiece-info {
		color: #160b11;
	}

	.timepiece-price {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(1.125rem, 1.4vw, 1.375rem);
		font-weight: 600;
		color: #160b11;
		margin: 4px 0 0 0;
		letter-spacing: -0.02em;
		line-height: 1.3;
	}

	.carousel-controls {
		display: flex;
		justify-content: flex-end;
		gap: 14px;
		align-items: center;
	}

	.carousel-btn {
		background-color: #160b11;
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.1);
		width: 52px;
		height: 52px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		padding: 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
	}

	.carousel-btn::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		transform: translate(-50%, -50%);
		transition: width 0.4s ease, height 0.4s ease;
	}

	.carousel-btn:hover:not(:disabled)::before {
		width: 100%;
		height: 100%;
	}

	.carousel-btn:hover:not(:disabled) {
		background-color: #a1846d;
		transform: translateY(-2px) scale(1.05);
		box-shadow: 0 4px 16px rgba(161, 132, 109, 0.3);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.carousel-btn:active:not(:disabled) {
		transform: translateY(0) scale(1);
	}

	.carousel-btn:disabled {
		opacity: 0.25;
		cursor: not-allowed;
		box-shadow: none;
	}

	.carousel-btn svg {
		width: 22px;
		height: 22px;
		position: relative;
		z-index: 1;
		transition: transform 0.3s ease;
	}

	.carousel-btn:hover:not(:disabled) svg {
		transform: scale(1.1);
	}

	@media (max-width: 1200px) {
		.timepieces-carousel {
			gap: 24px;
			transform: translateX(calc(var(--current-index) * -1 * (33.333% + 8px)));
		}

		.timepiece-card {
			flex: 0 0 calc((100% - 48px) / 3);
		}
	}

	@media (max-width: 768px) {
		.featured-timepieces-section {
			padding: 70px 20px;
		}

		.featured-title {
			margin-bottom: 50px;
		}

		.timepieces-wrapper {
			margin-bottom: 40px;
		}

		.timepieces-carousel {
			gap: 20px;
			transform: translateX(calc(var(--current-index) * -1 * (50% + 10px)));
		}

		.timepiece-card {
			flex: 0 0 calc((100% - 20px) / 2);
		}

		.timepiece-details {
			padding: 20px;
		}

		.carousel-controls {
			justify-content: center;
		}
	}

	@media (max-width: 480px) {
		.featured-timepieces-section {
			padding: 50px 15px;
		}

		.featured-title {
			margin-bottom: 40px;
		}

		.timepieces-carousel {
			gap: 16px;
			transform: translateX(calc(var(--current-index) * -100%));
		}

		.timepiece-card {
			flex: 0 0 100%;
		}

		.timepiece-details {
			padding: 18px;
		}

		.carousel-btn {
			width: 48px;
			height: 48px;
		}

		.carousel-btn svg {
			width: 20px;
			height: 20px;
		}
	}
</style>

