<script>
	import Button from '$lib/components/Button.svelte';
	import Features from '$lib/components/Features.svelte';
</script>

<section class="about-hero-section">
	<div class="about-hero-container">
		<div class="about-hero-content">
			<h1 class="about-hero-heading">
				Built on <em>Trust.</em>
			</h1>
			<h2 class="about-hero-subheading">Driven by Expertise</h2>
			<p class="about-hero-text">
				Watch Reserve is a leading London-based watch dealer specialising in rare pre-owned timepieces,
				personalised support, and a seamless, white-glove experience.
			</p>
		</div>
		<div class="about-hero-image-wrapper">
			<img
				src="/assets/about/About_us_hero.avif"
				alt="Luxury watch on wrist"
				class="about-hero-image"
			/>
		</div>
	</div>
</section>

<Features />

<section class="our-story-section">
	<div class="our-story-container">
		<div class="our-story-content">
			<h2 class="our-story-heading">Our Story</h2>
			<p class="our-story-text">
				Watch Reserve was born from a single belief: that acquiring a luxury timepiece should be as exceptional
				as the watch itself.
			</p>
			<p class="our-story-text">
				What began as a personal pursuit has evolved into a trusted destination for collectors across the UK and
				around the world. Whether sourcing elusive icons or helping build considered collections, our service is
				rooted in deep market expertise and genuine care.
			</p>
			<p class="our-story-text">
				We don't just sell watches — we guide, advise, and support clients who value craftsmanship, precision,
				and time well invested.
			</p>
		</div>
		<div class="our-story-images">
			<div class="our-story-image-large">
				<img
					src="/assets/lifestyle/AP_Explore_All.avif"
					alt="Audemars Piguet watch"
					class="story-image"
				/>
			</div>
			<div class="our-story-image-small-top">
				<img src="/assets/lifestyle/PP_Dice.avif" alt="Patek Philippe watch" class="story-image" />
			</div>
			<div class="our-story-image-small-bottom">
				<img src="/assets/lifestyle/Rolex_wrist2.avif" alt="Rolex watch on wrist" class="story-image" />
			</div>
		</div>
	</div>
</section>

<style>
	.about-hero-section {
		position: relative;
		width: 100%;
		min-height: 80vh;
		display: flex;
		align-items: center;
		background-image: url('/assets/frames/about_us_frame.avif');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.about-hero-container {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 100%;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		align-items: stretch;
		box-sizing: border-box;
		min-height: 80vh;
	}

	.about-hero-content {
		display: flex;
		flex-direction: column;
		gap: 0;
		z-index: 3;
		margin: 0;
		padding: 0;
		justify-content: center;
		align-items: center;
		text-align: center;
		height: 100%;
	}

	.about-hero-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		font-weight: 700;
		color: #160b11;
		margin: 0;
		line-height: 1.15;
		letter-spacing: -0.02em;
		text-align: center;
	}

	.about-hero-heading em {
		font-style: italic;
		font-weight: 700;
	}

	.about-hero-subheading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		font-weight: 400;
		font-style: italic;
		color: #160b11;
		margin: 0;
		line-height: 1.2;
		letter-spacing: -0.01em;
		text-align: center;
	}

	.about-hero-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		color: #160b11;
		margin: 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		text-align: center;
		max-width: 600px;
	}

	.about-hero-image-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		margin: 0;
		padding: 0;
		z-index: 3;
		overflow: hidden;
	}

	.about-hero-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		margin: 0;
		padding: 0;
		border-radius: 0;
	}

	@media (max-width: 1024px) {
		.about-hero-container {
			padding: 0;
			gap: 0;
		}
	}

	@media (max-width: 768px) {
		.about-hero-section {
			min-height: 70vh;
		}

		.about-hero-container {
			grid-template-columns: 1fr;
			padding: 0;
			gap: 0;
		}

		.about-hero-content {
			order: 1;
			text-align: center;
			align-items: center;
			padding: 40px 30px;
		}

		.about-hero-heading,
		.about-hero-subheading,
		.about-hero-text {
			text-align: center;
		}

		.about-hero-text {
			max-width: 100%;
		}

		.about-hero-image-wrapper {
			order: 2;
		}
	}

	@media (max-width: 480px) {
		.about-hero-section {
			min-height: 60vh;
		}

		.about-hero-container {
			padding: 0;
			gap: 0;
		}

		.about-hero-heading {
			font-size: clamp(2rem, 6vw, 3.5rem);
		}

		.about-hero-subheading {
			font-size: clamp(1.25rem, 4vw, 2rem);
		}

		.about-hero-content {
			padding: 30px 20px;
		}
	}

	.our-story-section {
		position: relative;
		width: 100%;
		background-image: url('/assets/about/About_us_grid.avif');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		padding: 100px 40px;
		box-sizing: border-box;
	}

	.our-story-container {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 60px;
	}

	.our-story-content {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 900px;
	}

	.our-story-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
		text-align: left;
	}

	.our-story-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		color: #ffffff;
		margin: 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		text-align: left;
	}

	.our-story-images {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 0;
		width: 100%;
		height: 600px;
	}

	.our-story-image-large {
		grid-column: 1;
		grid-row: 1 / 3;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.our-story-image-small-top {
		grid-column: 2;
		grid-row: 1;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.our-story-image-small-bottom {
		grid-column: 2;
		grid-row: 2;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.story-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	@media (max-width: 1024px) {
		.our-story-section {
			padding: 80px 30px;
		}

		.our-story-container {
			gap: 50px;
		}

		.our-story-images {
			height: 500px;
		}
	}

	@media (max-width: 768px) {
		.our-story-section {
			padding: 60px 20px;
		}

		.our-story-container {
			gap: 40px;
		}

		.our-story-content {
			max-width: 100%;
		}

		.our-story-heading,
		.our-story-text {
			text-align: center;
		}

		.our-story-images {
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			height: auto;
		}

		.our-story-image-large {
			grid-column: 1;
			grid-row: 1;
			height: 400px;
		}

		.our-story-image-small-top {
			grid-column: 1;
			grid-row: 2;
			height: 300px;
		}

		.our-story-image-small-bottom {
			grid-column: 1;
			grid-row: 3;
			height: 300px;
		}
	}

	@media (max-width: 480px) {
		.our-story-section {
			padding: 50px 15px;
		}

		.our-story-container {
			gap: 30px;
		}

		.our-story-image-large {
			height: 300px;
		}

		.our-story-image-small-top,
		.our-story-image-small-bottom {
			height: 250px;
		}
	}
</style>

