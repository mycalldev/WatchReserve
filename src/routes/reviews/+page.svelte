<svelte:head>
	<title>Client Reviews | Watch Reserve</title>
	<meta name="description" content="Read what our clients say about Watch Reserve. Trusted by collectors and enthusiasts across the UK." />
	<script src="https://elfsightcdn.com/platform.js" async></script>
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
		<div class="elfsight-app-0a7397b7-94b3-46dd-914a-c7ea68ce7e0a" data-elfsight-app-lazy></div>
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
		font-family: 'acumin-pro', sans-serif;
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
		font-style: normal;
		color: #a1846d;
	}
	.page-subtitle {
		font-family: 'acumin-pro', sans-serif;
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

	/* ── RESPONSIVE ── */
	@media (max-width: 640px) {
		.page-header { padding: 72px 24px 64px; }
		.reviews-container { padding: 48px 24px 72px; }
	}
	@media (max-width: 480px) {
		.reviews-container { padding: 40px 16px 64px; }
	}
</style>
