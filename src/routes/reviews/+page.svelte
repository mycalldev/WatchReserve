<script>
	const reviews = [
		{
			id: 1,
			name: 'Oliver H.',
			rating: 5,
			text: 'Exceptional service from start to finish. The team at Watch Reserve helped me find the perfect Patek Philippe I\'d been searching for. Their expertise and attention to detail is unmatched.',
			date: 'December 2025'
		},
		{
			id: 2,
			name: 'Charlotte B.',
			rating: 5,
			text: 'I was impressed by their authentication process and the transparency throughout. The watch arrived exactly as described, and the packaging was impeccable. Highly recommend for serious collectors.',
			date: 'November 2025'
		},
		{
			id: 3,
			name: 'Edward W.',
			rating: 5,
			text: 'Outstanding experience sourcing a rare Rolex GMT. The team kept me informed at every step and delivered exactly what they promised. This is how luxury watch buying should be done.',
			date: 'November 2025'
		},
		{
			id: 4,
			name: 'Isabelle F.',
			rating: 5,
			text: 'Professional, knowledgeable, and genuinely passionate about timepieces. They took the time to understand what I was looking for and exceeded my expectations. Will definitely return.',
			date: 'October 2025'
		},
		{
			id: 5,
			name: 'Thomas R.',
			rating: 5,
			text: 'Sold my Audemars Piguet through Watch Reserve and received a fair valuation. The process was smooth, and the team was incredibly professional. Top-tier service all around.',
			date: 'October 2025'
		},
		{
			id: 6,
			name: 'Alexandra P.',
			rating: 5,
			text: 'As a first-time luxury watch buyer, I was nervous about making such a significant purchase. The team guided me through everything and made me feel completely confident. Thank you!',
			date: 'September 2025'
		}
	];

	function renderStars(rating) {
		return Array.from({ length: 5 }, (_, i) => i < rating);
	}
</script>

<svelte:head>
	<title>Client Reviews | Watch Reserve</title>
	<meta name="description" content="Read what our clients say about Watch Reserve. Trusted by collectors and enthusiasts across the UK." />
</svelte:head>

<div class="page-header">
	<img src="/assets/hero/Day-Date-Gold.jpg" alt="" class="page-header-bg" aria-hidden="true" fetchpriority="high" />
	<div class="page-header-overlay" aria-hidden="true"></div>
	<div class="page-header-content">
		<p class="page-eyebrow">Client Testimonials</p>
		<h1 class="page-title">Trusted <em>Reviews</em></h1>
		<p class="page-subtitle">What our clients say about their experience with Watch Reserve</p>
	</div>
</div>

<main class="reviews-page">
	<div class="reviews-container">

		<div class="reviews-intro">
			<p class="reviews-intro-text">
				Every review below is from a genuine client. We take pride in the relationships we build and the service we deliver, from first enquiry through to after-sale care.
			</p>
			<div class="reviews-score">
				<div class="score-stars">
					{#each Array(5) as _}
						<svg width="22" height="22" viewBox="0 0 24 24" fill="#a1846d" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
						</svg>
					{/each}
				</div>
				<span class="score-label">5.0 · Rated excellent by our clients</span>
			</div>
		</div>

		<div class="reviews-grid">
			{#each reviews as review (review.id)}
				<div class="review-card">
					<div class="review-rating">
						{#each renderStars(review.rating) as filled}
							<svg
								class="star-icon"
								class:filled
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						{/each}
					</div>
					<p class="review-text">"{review.text}"</p>
					<div class="review-footer">
						<span class="review-name">{review.name}</span>
						<span class="review-date">{review.date}</span>
					</div>
				</div>
			{/each}
		</div>

	</div>
</main>

<style>
	/* ── HERO ── */
	.page-header {
		position: relative;
		padding: 100px 40px 88px;
		text-align: center;
		overflow: hidden;
	}
	.page-header-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		z-index: 0;
	}
	.page-header-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(22, 11, 17, 0.78) 0%, rgba(22, 11, 17, 0.88) 100%);
		z-index: 1;
	}
	.page-header-content {
		position: relative;
		z-index: 2;
	}
	.page-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 16px 0;
		display: block;
	}
	.page-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 3.75rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 16px 0;
		letter-spacing: -0.02em;
		line-height: 1.12;
	}
	.page-title em {
		font-style: italic;
		color: #a1846d;
	}
	.page-subtitle {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.5);
		margin: 0;
		letter-spacing: 0.02em;
	}

	/* ── PAGE BODY ── */
	.reviews-page {
		background-color: #ffffff;
		min-height: 50vh;
	}
	.reviews-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 72px 40px 100px;
	}

	/* ── INTRO ── */
	.reviews-intro {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 40px;
		padding-bottom: 56px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		margin-bottom: 56px;
	}
	.reviews-intro-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		color: #3a2a31;
		line-height: 1.8;
		font-weight: 300;
		margin: 0;
		max-width: 580px;
	}
	.reviews-score {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}
	.score-stars {
		display: flex;
		gap: 4px;
	}
	.score-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #a1846d;
		white-space: nowrap;
	}

	/* ── GRID ── */
	.reviews-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	/* ── CARD ── */
	.review-card {
		background-color: #faf8f6;
		border: 1px solid rgba(161, 132, 109, 0.18);
		padding: 36px 32px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		transition: border-color 0.25s ease, box-shadow 0.25s ease;
	}
	.review-card:hover {
		border-color: rgba(161, 132, 109, 0.45);
		box-shadow: 0 8px 32px rgba(22, 11, 17, 0.07);
	}
	.review-rating {
		display: flex;
		gap: 4px;
	}
	.star-icon {
		color: #d0d0d0;
	}
	.star-icon.filled {
		color: #a1846d;
		fill: #a1846d;
	}
	.review-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9rem, 1vw, 1rem);
		color: #3a2a31;
		line-height: 1.75;
		font-weight: 300;
		margin: 0;
		flex-grow: 1;
	}
	.review-footer {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-top: 16px;
		border-top: 1px solid rgba(161, 132, 109, 0.2);
	}
	.review-name {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #160b11;
		letter-spacing: 0.01em;
	}
	.review-date {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		color: #999;
		letter-spacing: 0.01em;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 960px) {
		.reviews-intro {
			flex-direction: column;
			align-items: flex-start;
			gap: 28px;
		}
		.reviews-score { align-items: flex-start; }
		.reviews-grid { grid-template-columns: repeat(2, 1fr); }
	}
	@media (max-width: 640px) {
		.page-header { padding: 72px 24px 64px; }
		.reviews-container { padding: 48px 24px 72px; }
		.reviews-grid { grid-template-columns: 1fr; }
		.review-card { padding: 28px 24px; }
	}
	@media (max-width: 480px) {
		.reviews-container { padding: 40px 16px 64px; }
	}
</style>
