<script>
	const features = [
		{
			id: 1,
			title: 'Unmatched Access',
			description:
				'We offer exclusive access to rare, investment-worthy timepieces through our global network of collectors and trusted partners.'
		},
		{
			id: 2,
			title: 'Expert-Led Service',
			description:
				'Work directly with seasoned specialists who understand both the market and the value of personalised care – no middlemen, no call centres.'
		},
		{
			id: 3,
			title: 'Based in Canary Wharf',
			description:
				'With a London base and global clientele, we offer both in-person appointments and fully secure remote transactions tailored to your needs.'
		}
	];
</script>

<section class="features-section">
	<div class="features-container">
		{#each features as feature}
			<div class="feature-card">
				<div class="feature-icon">
					<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="24" cy="24" r="23" stroke="#a1846d" stroke-width="2" />
						<path
							d="M16 24L22 30L32 18"
							stroke="#8a6f59"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<h3 class="feature-title">{feature.title}</h3>
				<p class="feature-description">{feature.description}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.features-section {
		width: 100%;
		background-color: #f5f5f5;
		padding: 80px 40px;
		box-sizing: border-box;
	}

	.features-container {
		max-width: 1400px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 60px;
		align-items: start;
	}

	.feature-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
	}

	.feature-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.feature-icon svg {
		width: 48px;
		height: 48px;
	}

	.feature-title {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.875rem, 1.2vw, 1rem);
		font-weight: 700;
		color: #160b11;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0;
		line-height: 1.3;
	}

	.feature-description {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9375rem, 1.1vw, 1.0625rem);
		color: #160b11;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		margin: 0;
		text-align: left;
	}

	@media (max-width: 1024px) {
		.features-section {
			padding: 60px 30px;
		}

		.features-container {
			gap: 40px;
		}
	}

	@media (max-width: 768px) {
		.features-section {
			padding: 50px 20px;
		}

		.features-container {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.feature-card {
			align-items: center;
			text-align: center;
		}

		.feature-description {
			text-align: center;
		}
	}

	@media (max-width: 480px) {
		.features-section {
			padding: 40px 15px;
		}

		.features-container {
			gap: 32px;
		}

		.feature-icon svg {
			width: 40px;
			height: 40px;
		}
	}
</style>

