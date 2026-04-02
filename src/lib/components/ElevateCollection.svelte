<script>
	import Button from '$lib/components/Button.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
</script>

<section class="elevate-section">
	<div class="elevate-container">
		<div class="elevate-content">
			<h2 class="elevate-headline">
				Ready to <em>Elevate</em> Your Collection?
			</h2>
			<p class="elevate-subheadline">
				Begin your luxury watch journey with trusted specialists.
			</p>
			<div class="elevate-actions">
				<Button>Browse All Watches</Button>
				<LinkButton href="/contact">Contact Us</LinkButton>
			</div>
		</div>
	</div>
</section>

<style>
	.elevate-section {
		position: relative;
		width: 100%;
		min-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: url('/assets/bg1.avif');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		padding: 80px 20px;
		margin: 0;
		box-sizing: border-box;
	}

	.elevate-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			rgba(75, 0, 50, 0.3) 0%,
			rgba(50, 0, 30, 0.4) 100%
		);
		z-index: 1;
	}

	.elevate-container {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.elevate-content {
		text-align: center;
		width: 100%;
		margin: 0 auto;
	}

	.elevate-headline {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 auto 24px;
		line-height: 1.2;
		letter-spacing: -0.02em;
		text-align: center;
	}

	.elevate-headline em {
		font-style: italic;
		font-weight: 400;
	}

	.elevate-subheadline {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1rem, 2vw, 1.25rem);
		color: #ffffff;
		margin: 0 auto 48px;
		line-height: 1.6;
		font-weight: 300;
		letter-spacing: 0.01em;
		text-align: center;
	}

	.elevate-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
		flex-wrap: wrap;
	}

	@media (max-width: 1024px) {
		.elevate-section {
			min-height: 450px;
			padding: 60px 20px;
		}
	}

	@media (max-width: 768px) {
		.elevate-section {
			min-height: 400px;
			padding: 50px 20px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.elevate-container {
			width: 100%;
			max-width: 100%;
			margin: 0 auto;
			padding: 0;
		}

		.elevate-content {
			text-align: center;
			width: 100%;
			margin: 0 auto;
			padding: 0;
		}

		.elevate-headline {
			margin: 0 auto 20px;
			text-align: center;
			width: 100%;
		}

		.elevate-subheadline {
			margin: 0 auto 40px;
			text-align: center;
			width: 100%;
		}

		.elevate-actions {
			flex-direction: column;
			width: 100%;
			align-items: center;
			justify-content: center;
			margin: 0 auto;
		}
	}

	@media (max-width: 480px) {
		.elevate-section {
			min-height: 350px;
			padding: 40px 15px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.elevate-container {
			width: 100%;
			max-width: 100%;
			margin: 0 auto;
			padding: 0;
		}

		.elevate-content {
			text-align: center;
			width: 100%;
			margin: 0 auto;
			padding: 0;
		}

		.elevate-headline {
			margin: 0 auto 16px;
			text-align: center;
			width: 100%;
		}

		.elevate-subheadline {
			margin: 0 auto 32px;
			text-align: center;
			width: 100%;
		}

		.elevate-actions {
			align-items: center;
			justify-content: center;
			width: 100%;
			margin: 0 auto;
		}
	}
</style>

