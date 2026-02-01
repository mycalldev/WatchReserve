<script>
	import Button from '$lib/components/Button.svelte';
</script>

<section class="sell-hero-section">
	<div class="sell-hero-container">
		<div class="sell-hero-content">
			<h1 class="sell-hero-heading">
				A Trusted Way to Sell Your Luxury Watch
			</h1>
			<p class="sell-hero-text">
				Receive a fast, competitive offer from a team trusted by collectors across the UK and beyond — with a personalised service tailored to you.
			</p>
			<div class="sell-hero-action">
				<Button className="sell-cta-btn">Speak to Our Team</Button>
			</div>
		</div>
	</div>
</section>

<style>
	.sell-hero-section {
		position: relative;
		width: 100%;
		min-height: 80vh;
		display: flex;
		align-items: center;
		background-image: url('/assets/lifestyle/Sell_Hero1.avif');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.sell-hero-section::before {
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

	.sell-hero-container {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 100px 0;
	}

	.sell-hero-content {
		max-width: 600px;
		width: 100%;
		padding-left: 40px;
	}

	.sell-hero-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 32px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
		text-align: left;
	}

	.sell-hero-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(1rem, 1.5vw, 1.25rem);
		color: #ffffff;
		margin: 0 0 48px 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		text-align: left;
		opacity: 0.95;
	}

	.sell-hero-action {
		display: flex;
		align-items: center;
		gap: 24px;
		flex-wrap: wrap;
	}

	:global(.sell-cta-btn) {
		background-color: #a1846d;
		color: #ffffff;
	}

	:global(.sell-cta-btn:hover) {
		background-color: #8a6f59;
	}

	@media (max-width: 1024px) {
		.sell-hero-container {
			padding: 80px 0;
		}

		.sell-hero-content {
			max-width: 100%;
			padding-left: 30px;
		}
	}

	@media (max-width: 768px) {
		.sell-hero-section {
			min-height: 70vh;
			background-image: url('/assets/lifestyle/Sell_Hero.avif');
		}

		.sell-hero-container {
			padding: 60px 0;
		}

		.sell-hero-content {
			padding-left: 20px;
		}

		.sell-hero-heading {
			margin: 0 0 24px 0;
		}

		.sell-hero-text {
			margin: 0 0 40px 0;
		}

		.sell-hero-action {
			flex-direction: column;
			align-items: flex-start;
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.sell-hero-section {
			min-height: 60vh;
		}

		.sell-hero-container {
			padding: 40px 0;
		}

		.sell-hero-content {
			padding-left: 20px;
		}
	}
</style>

