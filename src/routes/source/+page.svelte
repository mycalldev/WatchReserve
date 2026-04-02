<script>
	import Button from '$lib/components/Button.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
</script>

<section class="source-hero-section">
	<div class="source-hero-container">
		<div class="source-hero-content">
			<h1 class="source-hero-heading">
				Let Us <em>Source</em> Your Next Timepiece
			</h1>
			<p class="source-hero-text">
				From hard-to-find classics to the latest releases, we tap into our global network to help you secure the perfect watch without delay or pressure.
			</p>
			<div class="source-hero-action">
				<Button className="source-cta-btn">Speak to Our Team</Button>
			</div>
		</div>
	</div>
</section>

<section class="steps-section">
	<div class="steps-container">
		<div class="steps-header">
			<p class="steps-eyebrow">The Process</p>
			<h2 class="steps-title">Why Use Our Sourcing Service?</h2>
			<p class="steps-subtitle">
				Three simple steps stand between you and your next investment-grade timepiece.
			</p>
		</div>

		<div class="steps-grid">
			<!-- Step 1 -->
			<div class="step">
				<div class="step-number-wrap">
					<span class="step-number">01</span>
					<div class="step-line" aria-hidden="true"></div>
				</div>
				<div class="step-content">
					<h3 class="step-heading">Global Network Access</h3>
					<p class="step-text">
						We connect with a worldwide network of reputable suppliers to locate rare and in-demand watches quickly — pieces that rarely surface on the open market.
					</p>
				</div>
			</div>

			<!-- Step 2 -->
			<div class="step">
				<div class="step-number-wrap">
					<span class="step-number">02</span>
					<div class="step-line" aria-hidden="true"></div>
				</div>
				<div class="step-content">
					<h3 class="step-heading">Fair, Transparent Pricing</h3>
					<p class="step-text">
						You'll receive upfront, honest pricing with no pressure to commit. We only move forward when the watch and the terms are right for you.
					</p>
				</div>
			</div>

			<!-- Step 3 -->
			<div class="step">
				<div class="step-number-wrap">
					<span class="step-number">03</span>
				</div>
				<div class="step-content">
					<h3 class="step-heading">White-Glove Delivery</h3>
					<p class="step-text">
						Backed by five-star reviews and years of expertise, we deliver your timepiece with insured, seamless service from first enquiry to your wrist.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="contact-section">
	<div class="contact-container">
		<div class="contact-info">
			<p class="contact-eyebrow">Get in Touch</p>
			<h2 class="contact-heading">Tell Us What You're Looking For</h2>
			<p class="contact-text">
				Describe the watch you're after and one of our sourcing specialists will be in touch within 24 hours. The more detail you can provide, the better we can match you with the right piece.
			</p>
		</div>
		<ContactForm />
	</div>
</section>

<style>
	.source-hero-section {
		position: relative;
		width: 100%;
		min-height: 80vh;
		display: flex;
		align-items: center;
		background-image: url('/assets/lifestyle/Source_Hero.avif');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.source-hero-section::before {
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

	.source-hero-container {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 100px 0;
	}

	.source-hero-content {
		max-width: 600px;
		width: 100%;
		padding-left: 40px;
	}

	.source-hero-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 32px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
		text-align: left;
	}

	.source-hero-heading em {
		font-style: italic;
		font-weight: 400;
	}

	.source-hero-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1rem, 1.5vw, 1.25rem);
		color: #ffffff;
		margin: 0 0 48px 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		text-align: left;
		opacity: 0.95;
	}

	.source-hero-action {
		display: flex;
		align-items: center;
		gap: 24px;
		flex-wrap: wrap;
	}

	:global(.source-cta-btn) {
		background-color: #a1846d;
		color: #ffffff;
	}

	:global(.source-cta-btn:hover) {
		background-color: #8a6f59;
	}

	@media (max-width: 1024px) {
		.source-hero-container {
			padding: 80px 0;
		}

		.source-hero-content {
			max-width: 100%;
			padding-left: 30px;
		}
	}

	@media (max-width: 768px) {
		.source-hero-section {
			min-height: 70vh;
		}

		.source-hero-container {
			padding: 60px 0;
		}

		.source-hero-content {
			padding-left: 20px;
		}

		.source-hero-heading {
			margin: 0 0 24px 0;
		}

		.source-hero-text {
			margin: 0 0 40px 0;
		}

		.source-hero-action {
			flex-direction: column;
			align-items: flex-start;
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.source-hero-section {
			min-height: 60vh;
		}

		.source-hero-container {
			padding: 40px 0;
		}

		.source-hero-content {
			padding-left: 20px;
		}
	}

	/* ── STEPS SECTION ── */
	.steps-section {
		width: 100%;
		background-color: #ffffff;
		padding: 100px 40px;
		box-sizing: border-box;
	}

	.steps-container {
		max-width: 1100px;
		margin: 0 auto;
	}

	/* Header */
	.steps-header {
		text-align: center;
		margin-bottom: 80px;
	}

	.steps-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 16px 0;
	}

	.steps-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 20px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.steps-subtitle {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.0625rem);
		color: #6b5c55;
		margin: 0 auto;
		line-height: 1.65;
		max-width: 520px;
		font-weight: 300;
	}

	/* Grid */
	.steps-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0;
	}

	/* Individual step */
	.step {
		padding: 0 48px 0 0;
		box-sizing: border-box;
	}

	.step:last-child {
		padding-right: 0;
	}

	/* Number + connector line */
	.step-number-wrap {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-bottom: 28px;
	}

	.step-number {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 3rem;
		font-weight: 400;
		color: #a1846d;
		line-height: 1;
		letter-spacing: -0.03em;
		flex-shrink: 0;
	}

	.step-line {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, rgba(161, 132, 109, 0.4), rgba(161, 132, 109, 0.1));
	}

	/* Step copy */
	.step-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.1rem, 1.5vw, 1.3rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 14px 0;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	.step-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9rem, 1.1vw, 1rem);
		color: #6b5c55;
		line-height: 1.7;
		font-weight: 300;
		margin: 0;
		letter-spacing: 0.01em;
	}

	/* Responsive */
	@media (max-width: 900px) {
		.steps-section {
			padding: 80px 30px;
		}

		.steps-header {
			margin-bottom: 60px;
		}

		.steps-grid {
			grid-template-columns: 1fr;
			gap: 52px;
		}

		.step {
			padding: 0;
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 0 32px;
			align-items: start;
		}

		.step-number-wrap {
			flex-direction: column;
			align-items: center;
			gap: 12px;
			margin-bottom: 0;
		}

		.step-line {
			width: 1px;
			height: 100%;
			min-height: 60px;
			background: linear-gradient(180deg, rgba(161, 132, 109, 0.4), rgba(161, 132, 109, 0.1));
		}

		.step:last-child .step-line {
			display: none;
		}

		.step-content {
			padding-top: 6px;
		}
	}

	@media (max-width: 480px) {
		.steps-section {
			padding: 60px 20px;
		}

		.steps-header {
			margin-bottom: 48px;
		}

		.step {
			grid-template-columns: auto 1fr;
			gap: 0 24px;
		}

		.step-number {
			font-size: 2.25rem;
		}
	}

	/* ── CONTACT SECTION ── */
	.contact-section {
		width: 100%;
		background-color: #faf8f6;
		padding: 100px 40px;
		box-sizing: border-box;
		border-top: 1px solid rgba(161, 132, 109, 0.15);
	}

	.contact-container {
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: start;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.contact-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.contact-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.25;
		letter-spacing: -0.02em;
	}

	.contact-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9rem, 1.1vw, 1rem);
		color: #6b5c55;
		line-height: 1.7;
		font-weight: 300;
		margin: 0;
	}

	@media (max-width: 900px) {
		.contact-section {
			padding: 80px 30px;
		}

		.contact-container {
			grid-template-columns: 1fr;
			gap: 48px;
		}
	}

	@media (max-width: 480px) {
		.contact-section {
			padding: 60px 20px;
		}
	}
</style>

