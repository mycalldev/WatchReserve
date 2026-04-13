<script>
	const reviews = [
		{
			id: 1,
			name: 'Oliver H.',
			rating: 5,
			text: 'Exceptional service from start to finish. The team at Watch Reserve helped me find the perfect Patek Philippe I\'d been searching for. Their expertise and attention to detail is unmatched.',
			date: 'December 2024'
		},
		{
			id: 2,
			name: 'Charlotte B.',
			rating: 5,
			text: 'I was impressed by their authentication process and the transparency throughout. The watch arrived exactly as described, and the packaging was impeccable. Highly recommend for serious collectors.',
			date: 'November 2024'
		},
		{
			id: 3,
			name: 'Edward W.',
			rating: 5,
			text: 'Outstanding experience sourcing a rare Rolex GMT. The team kept me informed at every step and delivered exactly what they promised. This is how luxury watch buying should be done.',
			date: 'November 2024'
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
			name: 'Alexandra P.',
			rating: 5,
			text: 'As a first-time luxury watch buyer, I was nervous about making such a significant purchase. The team guided me through everything and made me feel completely confident. Thank you!',
			date: 'September 2024'
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
			{#each reviews.slice(0, 3) as review}
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
					<p class="review-text">"{review.text}"</p>
					<div class="review-footer">
						<span class="review-name">{review.name}</span>
						<span class="review-date">{review.date}</span>
					</div>
				</div>
			{/each}
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
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 24px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.reviews-title em {
		font-style: italic;
		font-weight: 400;
	}

	.reviews-subtitle {
		font-family: 'Montserrat', sans-serif;
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

	.review-text {
		font-family: 'Montserrat', sans-serif;
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
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #ffffff;
		letter-spacing: 0.01em;
	}

	.review-date {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.4);
		letter-spacing: 0.01em;
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

