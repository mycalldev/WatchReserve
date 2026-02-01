<script>
	import Button from '$lib/components/Button.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import SocialFollow from '$lib/components/SocialFollow.svelte';
	import ElevateCollection from '$lib/components/ElevateCollection.svelte';
	import FeaturedTimepieces from '$lib/components/FeaturedTimepieces.svelte';
</script>

<section class="hero-section">
	<div class="hero-container">
		<div class="hero-content">
			<h1 class="hero-headline">
				Pre-Owned <em>Rare Luxury</em> Timepieces
			</h1>
			<p class="hero-subheadline">
				Explore investment-grade timepieces - sourced, authenticated, and delivered by a team who knows your time is valuable.
			</p>
			<div class="hero-actions">
				<Button>Browse All Watches</Button>
				<LinkButton href="/source">Source a Watch</LinkButton>
			</div>
		</div>
	</div>
</section>

<SocialFollow />

<FeaturedTimepieces />

<section class="sell-source-section">
	<div class="sell-source-container">
		<div class="sell-source-image-wrapper">
			<img
				src="/assets/lifestyle/AP_wrist_jean1.avif"
				alt="Luxury watch on wrist"
				class="sell-source-image"
			/>
		</div>
		<div class="sell-source-content">
			<h2 class="sell-source-heading">
				Looking to Sell or<br />
				Source a Watch?
			</h2>
			<p class="sell-source-text">
				While our primary focus is helping you find the perfect timepiece, we also offer expert valuations and bespoke sourcing for collectors.
			</p>
			<div class="sell-source-links">
				<a href="/sell" class="sell-source-link">
					Sell Your Watch
					<span class="arrow">→</span>
				</a>
				<a href="/source" class="sell-source-link">
					Request a Watch
					<span class="arrow">→</span>
				</a>
				<a href="/contact" class="sell-source-link">
					Contact Us
					<span class="arrow">→</span>
				</a>
			</div>
		</div>
	</div>
</section>

<section class="luxury-section">
	<div class="luxury-container">
		<div class="luxury-image-wrapper">
			<img
				src="/assets/gifs/giffycanvas (12).gif"
				alt="Luxury watch"
				class="luxury-image"
			/>
		</div>
		<div class="luxury-content">
			<h2 class="luxury-headline">
				Luxury is <em>Personal</em>
			</h2>
			<p class="luxury-text">
				At Watch Reserve, we believe the experience should reflect the calibre of the watch. Whether you're building a collection or investing in your first timepiece, our service is personal, thoughtful, and rooted in genuine expertise.
			</p>
			<p class="luxury-text">
				We stock and source rare watches from the world's most iconic brands — and we back every transaction with guidance you can trust.
			</p>
			<p class="luxury-text">
				This isn't just a purchase. It's your next signature piece, handled with care by people who understand its value.
			</p>
			<button class="about-btn">About Us</button>
		</div>
	</div>
</section>

<section class="brands-section">
	<div class="brands-container">
		<div class="brand-card">
			<div class="brand-image-wrapper">
				<img
					src="/assets/lifestyle/Rolex_Explore_All.avif"
					alt="Rolex watch"
					class="brand-image"
				/>
			</div>
			<div class="brand-content">
				<h3 class="brand-name">Rolex</h3>
				<p class="brand-description">The world's most iconic watches</p>
			</div>
		</div>

		<div class="brand-card">
			<div class="brand-image-wrapper">
				<img
					src="/assets/lifestyle/PP_Explore_All.avif"
					alt="Patek Philippe watch"
					class="brand-image"
				/>
			</div>
			<div class="brand-content">
				<h3 class="brand-name">Patek Philippe</h3>
				<p class="brand-description">Timeless elegance, investment quality</p>
			</div>
		</div>

		<div class="brand-card">
			<div class="brand-image-wrapper">
				<img
					src="/assets/lifestyle/AP_Explore_All.avif"
					alt="Audemars Piguet watch"
					class="brand-image"
				/>
			</div>
			<div class="brand-content">
				<h3 class="brand-name">Audemars Piguet</h3>
				<p class="brand-description">Bold design for modern collectors</p>
			</div>
		</div>

		<div class="brand-card">
			<div class="brand-image-wrapper">
				<img
					src="/assets/lifestyle/Curated_Editions_Explore_All.avif"
					alt="Curated Editions watch"
					class="brand-image"
				/>
			</div>
			<div class="brand-content">
				<h3 class="brand-name">Curated Editions</h3>
				<p class="brand-description">Cartier, Richard Mille, and more</p>
			</div>
		</div>
	</div>
</section>

<ElevateCollection />

<style>
	.hero-section {
		position: relative;
		width: 100%;
		min-height: 80vh;
		display: flex;
		align-items: center;
		background-image: url('/assets/home/hero_section.avif');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.hero-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.7) 0%,
			rgba(0, 0, 0, 0.4) 50%,
			rgba(0, 0, 0, 0.1) 100%
		);
		z-index: 1;
	}

	.hero-container {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 100px 0;
	}

	.hero-content {
		max-width: 600px;
		width: 100%;
		padding-left: 40px;
	}

	.hero-headline {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 32px 0;
		line-height: 1.15;
		letter-spacing: -0.02em;
		text-align: left;
	}

	.hero-headline em {
		font-style: italic;
		font-weight: 400;
	}

	.hero-subheadline {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(1rem, 1.5vw, 1.125rem);
		color: #ffffff;
		margin: 0 0 48px 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		text-align: left;
		opacity: 0.95;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 24px;
		flex-wrap: wrap;
	}

	@media (max-width: 1024px) {
		.hero-container {
			padding: 80px 0;
		}

		.hero-content {
			max-width: 100%;
			padding-left: 30px;
		}
	}

	@media (max-width: 768px) {
		.hero-section {
			min-height: 70vh;
		}

		.hero-container {
			padding: 60px 0;
		}

		.hero-content {
			padding-left: 20px;
		}

		.hero-headline {
			margin: 0 0 24px 0;
		}

		.hero-subheadline {
			margin: 0 0 40px 0;
		}

		.hero-actions {
			flex-direction: column;
			align-items: flex-start;
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.hero-section {
			min-height: 60vh;
		}

		.hero-container {
			padding: 40px 0;
		}

		.hero-content {
			padding-left: 20px;
		}
	}

	.luxury-section {
		width: 100%;
		margin: 0;
		padding: 0;
		display: flex;
		min-height: 600px;
	}

	.luxury-container {
		display: flex;
		width: 100%;
		margin: 0;
		padding: 0;
	}

	.luxury-image-wrapper {
		width: 40%;
		background-color: #e5e5e5;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60px 40px;
		position: relative;
		box-sizing: border-box;
	}

	.luxury-image {
		width: 100%;
		max-width: 500px;
		height: auto;
		object-fit: contain;
		border-radius: 12px;
		display: block;
	}

	.luxury-content {
		width: 60%;
		background-color: #e5e5e5;
		padding: 80px 60px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.luxury-headline {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 32px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.luxury-headline em {
		font-style: italic;
		font-weight: 400;
	}

	.luxury-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.125rem);
		color: #160b11;
		margin: 0 0 24px 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.luxury-text:last-of-type {
		margin-bottom: 40px;
	}

	.about-btn {
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		padding: 14px 32px;
		border-radius: 8px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		letter-spacing: 0.01em;
		align-self: flex-start;
	}

	.about-btn:hover {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.about-btn:active {
		transform: translateY(0);
	}

	@media (max-width: 1024px) {
		.luxury-image-wrapper {
			padding: 50px 30px;
		}

		.luxury-content {
			padding: 60px 40px;
		}
	}

	@media (max-width: 768px) {
		.luxury-section {
			flex-direction: column;
			min-height: auto;
		}

		.luxury-container {
			flex-direction: column;
		}

		.luxury-image-wrapper {
			width: 100%;
			padding: 40px 20px;
			order: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
		}

		.luxury-image {
			width: auto;
			max-width: 100%;
			height: auto;
			margin: 0 auto;
			object-fit: contain;
			display: block;
		}

		.luxury-content {
			width: 100%;
			padding: 50px 30px;
			order: 2;
		}

		.luxury-headline {
			margin: 0 0 24px 0;
		}

		.luxury-text {
			margin: 0 0 20px 0;
		}

		.luxury-text:last-of-type {
			margin-bottom: 32px;
		}

		.about-btn {
			width: 100%;
			max-width: 300px;
		}
	}

	@media (max-width: 480px) {
		.luxury-image-wrapper {
			padding: 30px 15px;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
		}

		.luxury-image {
			width: auto;
			max-width: 100%;
			height: auto;
			object-fit: contain;
			display: block;
			margin: 0 auto;
		}

		.luxury-content {
			padding: 40px 20px;
		}

		.luxury-text {
			font-size: 0.95rem;
		}
	}

	.sell-source-section {
		width: 100%;
		margin: 0;
		padding: 0;
		display: flex;
		min-height: 600px;
	}

	.sell-source-container {
		display: flex;
		width: 100%;
		margin: 0;
		padding: 0;
	}

	.sell-source-image-wrapper {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
	}

	.sell-source-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.sell-source-content {
		width: 50%;
		background-color: #422635;
		padding: 80px 60px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
	}

	.sell-source-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 32px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.sell-source-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.125rem);
		color: #ffffff;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		margin: 0 0 40px 0;
	}

	.sell-source-links {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.sell-source-link {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		color: #ffffff;
		text-decoration: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		font-weight: 400;
		letter-spacing: 0.01em;
		transition: all 0.3s ease;
	}

	.sell-source-link:hover {
		opacity: 0.8;
		gap: 16px;
	}

	.sell-source-link .arrow {
		font-size: 1.2em;
		transition: transform 0.3s ease;
	}

	.sell-source-link:hover .arrow {
		transform: translateX(4px);
	}

	@media (max-width: 1024px) {
		.sell-source-content {
			padding: 60px 40px;
		}
	}

	@media (max-width: 768px) {
		.sell-source-section {
			flex-direction: column;
			min-height: auto;
		}

		.sell-source-container {
			flex-direction: column;
		}

		.sell-source-image-wrapper {
			width: 100%;
			order: 2;
			min-height: 400px;
		}

		.sell-source-content {
			width: 100%;
			padding: 50px 30px;
			order: 1;
		}

		.sell-source-heading {
			margin: 0 0 24px 0;
		}

		.sell-source-text {
			margin: 0 0 32px 0;
		}

		.sell-source-links {
			gap: 20px;
		}
	}

	@media (max-width: 480px) {
		.sell-source-image-wrapper {
			min-height: 300px;
		}

		.sell-source-content {
			padding: 40px 20px;
		}

		.sell-source-text {
			font-size: 0.95rem;
		}
	}

	.brands-section {
		width: 100%;
		margin: 0;
		padding: 0;
		display: flex;
	}

	.brands-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		width: 100%;
		margin: 0;
		padding: 0;
	}

	.brand-card {
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.3s ease;
		min-height: 500px;
	}

	.brand-card:hover {
		transform: scale(1.02);
		z-index: 1;
	}

	.brand-image-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.brand-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.3s ease;
	}

	.brand-card:hover .brand-image {
		transform: scale(1.05);
	}

	.brand-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 30px 24px;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%);
	}

	.brand-name {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.5rem, 2.5vw, 2.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 8px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.brand-description {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(0.875rem, 1.2vw, 1.125rem);
		font-weight: 300;
		color: #ffffff;
		margin: 0;
		line-height: 1.4;
		letter-spacing: 0.01em;
		opacity: 0.95;
	}

	@media (max-width: 1024px) {
		.brands-container {
			grid-template-columns: repeat(2, 1fr);
		}

		.brand-content {
			padding: 24px 20px;
		}
	}

	@media (max-width: 768px) {
		.brands-container {
			grid-template-columns: 1fr;
		}

		.brand-card {
			min-height: 400px;
		}

		.brand-content {
			padding: 30px 24px;
		}
	}

	@media (max-width: 480px) {
		.brand-card {
			min-height: 350px;
		}

		.brand-content {
			padding: 24px 20px;
		}
	}
</style>
