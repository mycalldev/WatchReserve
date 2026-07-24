<script>
	const reviews = [
		{
			id: 1,
			name: 'Jayesh',
			rating: 5,
			title: 'Exceptional Service. Shout out to Jean-Luc!',
			text: 'Jean-Luc made my purchasing journey an absolute breeze. His communication was exceptional and he was able to provide all the details I needed to put my mind at ease. Thanks Jean-Luc for helping me get my hands on my dream watch. I\'d definitely recommend Watch Reserve and will be using them for my next purchase.',
			date: '19th January 2026'
		},
		{
			id: 3,
			name: 'Gary Coles',
			rating: 5,
			title: 'Just purchased a Rolex Sea Dweller…',
			text: 'Just purchased a Rolex Sea Dweller through this company and absolutely delighted. Jean-Luc wasn\'t happy when he received the 2022 model I ordered and so sourced a 2024 at the same cost. I was kept informed at every point of sale and the watch arrived as described and on time. Would definitely recommend this company if you are looking for a luxury watch.',
			date: '31st January 2026'
		},
		{
			id: 4,
			name: 'Isabelle F.',
			rating: 5,
			text: 'Professional, knowledgeable, and genuinely passionate about timepieces. They took the time to understand what I was looking for and exceeded my expectations. Will definitely return.',
			date: 'October 2024'
		},
		{
			id: 5,
			name: 'Thomas R.',
			rating: 5,
			text: 'Sold my Audemars Piguet through Watch Reserve and received a fair valuation. The process was smooth, and the team was incredibly professional. Top-tier service all around.',
			date: 'October 2024'
		},
		{
			id: 6,
			name: 'Mr J Peracha',
			rating: 5,
			title: 'From the start Will was professional',
			text: 'From the start Will was professional, polite and efficient, great comms throughout. The watch (Patek 5230G) arrived exactly as described and at a competitive price, box and papers as described. First time I bought a used watch. Highly recommended and would happily deal with them again.',
			date: '13th February 2026'
		}
	];

	function renderStars(rating) {
		return Array.from({ length: 5 }, (_, i) => i < rating);
	}
</script>

<section class="reviews-section">
	<div class="reviews-container">
		<div class="reviews-header">
			<h2 class="reviews-title">Trusted <em>Reviews</em></h2>
			<p class="reviews-subtitle">
				Trusted by collectors and enthusiasts who value authenticity, expertise, and exceptional service.
			</p>
		</div>

		<div class="reviews-grid">
			{#each reviews.slice(0, 2) as review}
				<div class="review-card">
					<div class="review-rating">
						{#each renderStars(review.rating) as filled}
							<svg
								class="star-icon"
								class:filled
								width="20"
								height="20"
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
					{#if review.title}
					<p class="review-title">{review.title}</p>
				{/if}
				<p class="review-text">"{review.text}"</p>
					<div class="review-footer">
						<span class="review-name">{review.name}</span>
						<span class="review-date">{review.date}</span>
					</div>
				</div>
			{/each}
		</div>

		<div class="reviews-cta-wrap">
			<a href="/reviews" class="reviews-cta">
				Read All Reviews
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
			</a>
		</div>
	</div>
</section>

<style>
	.reviews-section {
		width: 100%;
		position: relative;
		background-image: url('/assets/hero/Day-Date-Gold.jpg');
		background-size: cover;
		background-position: center;
		padding: 100px 40px;
		box-sizing: border-box;
	}

	.reviews-section::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(22, 11, 17, 0.82);
	}

	.reviews-container {
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.reviews-header {
		text-align: center;
		margin-bottom: 60px;
	}

	.reviews-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 24px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.reviews-title em {
		font-style: normal;
		font-weight: 400;
	}

	.reviews-subtitle {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
	}

	.reviews-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
	}

	.review-card {
		background-color: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(161, 132, 109, 0.25);
		padding: 32px;
		border-radius: 0;
		display: flex;
		flex-direction: column;
		gap: 20px;
		transition: background-color 0.3s ease, border-color 0.3s ease;
	}

	.review-card:hover {
		background-color: rgba(255, 255, 255, 0.1);
		border-color: rgba(161, 132, 109, 0.5);
	}

	.review-rating {
		display: flex;
		gap: 4px;
	}

	.star-icon {
		color: #d0d0d0;
		transition: color 0.2s ease;
	}

	.star-icon.filled {
		color: #a1846d;
		fill: #a1846d;
	}

	.review-title {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.82rem;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin: 0 0 10px;
	}

	.review-text {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		margin: 0;
		flex-grow: 1;
	}

	.review-footer {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-top: 12px;
		border-top: 1px solid rgba(161, 132, 109, 0.25);
	}

	.review-name {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #ffffff;
		letter-spacing: 0.01em;
	}

	.review-date {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.4);
		letter-spacing: 0.01em;
	}

	.reviews-cta-wrap {
		display: flex;
		justify-content: center;
		margin-top: 48px;
	}

	.reviews-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 15px 36px;
		border: 1px solid rgba(255, 255, 255, 0.35);
		color: #ffffff;
		text-decoration: none;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transition: background-color 0.25s ease, border-color 0.25s ease, gap 0.25s ease;
	}

	.reviews-cta:hover {
		background-color: #a1846d;
		border-color: #a1846d;
		gap: 14px;
	}

	@media (max-width: 1024px) {
		.reviews-section {
			padding: 80px 30px;
		}

		.reviews-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 24px;
		}

		.reviews-header {
			margin-bottom: 50px;
		}
	}

	@media (max-width: 768px) {
		.reviews-section {
			padding: 60px 20px;
		}

		.reviews-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.reviews-header {
			margin-bottom: 40px;
		}

		.review-card {
			padding: 28px;
		}
	}

	@media (max-width: 480px) {
		.reviews-section {
			padding: 50px 15px;
		}

		.reviews-header {
			margin-bottom: 32px;
		}

		.review-card {
			padding: 24px;
			gap: 16px;
		}
	}
</style>

