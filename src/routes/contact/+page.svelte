<script>
	import LuxuryForm from '$lib/components/LuxuryForm.svelte';
</script>

<svelte:head>
	<title>Contact — Watch Reserve</title>
	<meta name="description" content="Contact the Watch Reserve team. Enquire about a timepiece, book a private viewing, or speak to a specialist." />
</svelte:head>

<div class="contact-hero">
	<img
		src="/assets/hero/Sky-Dweller-Blue.jpg"
		alt="Rolex Sky-Dweller in blue"
		class="contact-hero-img"
		fetchpriority="high"
	/>
	<div class="contact-hero-overlay" aria-hidden="true"></div>
	<div class="contact-hero-content">
		<h1 class="contact-hero-title">Contact Us</h1>
		<p class="contact-hero-sub">Speak to the Watch Reserve team</p>
	</div>
</div>

<section class="contact-page">
	<div class="contact-container">
		<div class="contact-info">
			<h1 class="contact-title">
				Contact the <em>Watch Reserve</em> Team
			</h1>
			<p class="contact-intro">
				Whether you're looking to enquire about a specific timepiece, book a viewing, or speak to a
				specialist, we're here to help. Complete the form below and our team will get back to you shortly.
			</p>

			<div class="contact-details">
				<div class="contact-detail-item">
					<svg
						class="contact-icon"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<polyline
							points="22,6 12,13 2,6"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<a href="mailto:info@watchreserve.co.uk" class="contact-link"
						>info@watchreserve.co.uk</a
					>
				</div>

				<div class="contact-detail-item">
					<svg
						class="contact-icon"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<a href="tel:+447850250984" class="contact-link">0208 150 1987</a>
				</div>

				<div class="contact-detail-item">
					<svg
						class="contact-icon"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<circle
							cx="12"
							cy="10"
							r="3"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span class="contact-text">25 Cabot Square, Canary Wharf, London E14 4QA</span>
				</div>
			</div>
		</div>

		<div class="contact-form-wrapper">
			<LuxuryForm />
		</div>
	</div>
</section>

<style>
	/* ── Hero ── */
	.contact-hero {
		position: relative;
		width: 100%;
		height: 420px;
		overflow: hidden;
	}

	.contact-hero-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
		display: block;
	}

	.contact-hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, rgba(22, 11, 17, 0.35) 0%, rgba(22, 11, 17, 0.55) 100%);
	}

	.contact-hero-content {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 12px;
		padding: 0 24px;
	}

	.contact-hero-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}

	.contact-hero-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.875rem, 1.5vw, 1rem);
		font-weight: 400;
		color: rgba(255, 255, 255, 0.75);
		margin: 0;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	/* ── Page ── */
	.contact-page {
		width: 100%;
		background-color: #ffffff;
		padding: 80px 40px;
		box-sizing: border-box;
	}

	.contact-container {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: start;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.contact-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.2;
		letter-spacing: -0.03em;
	}

	.contact-title em {
		font-style: italic;
		font-weight: 400;
	}

	.contact-intro {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		line-height: 1.7;
		color: #4a4a4a;
		margin: 0;
		font-weight: 400;
	}

	.contact-details {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 8px;
	}

	.contact-detail-item {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.contact-icon {
		flex-shrink: 0;
		color: #160b11;
		width: 20px;
		height: 20px;
	}

	.contact-link,
	.contact-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 1rem;
		color: #160b11;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.contact-link:hover {
		color: #a1846d;
	}

	.contact-form-wrapper {
		width: 100%;
	}

	@media (max-width: 968px) {
		.contact-hero { height: 320px; }

		.contact-container {
			grid-template-columns: 1fr;
			gap: 60px;
		}

		.contact-page {
			padding: 60px 30px;
		}
	}

	@media (max-width: 768px) {
		.contact-hero { height: 260px; }

		.contact-page {
			padding: 50px 20px;
		}

		.contact-container {
			gap: 50px;
		}

		.contact-info {
			gap: 24px;
		}

		.contact-details {
			gap: 18px;
		}
	}

	@media (max-width: 480px) {
		.contact-page {
			padding: 40px 15px;
		}

		.contact-container {
			gap: 40px;
		}
	}
</style>


