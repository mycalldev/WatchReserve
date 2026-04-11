<script>
	let firstName = $state('');
	let email = $state('');
	let collection = $state('');
	let submitted = $state(false);

	function handleSubmit(e) {
		e.preventDefault();
		if (email.trim()) {
			submitted = true;
		}
	}

</script>

<svelte:head>
	<title>Watch Reserve Intelligence | Coming Soon</title>
	<meta name="description" content="An enriched intelligence platform built exclusively for watch collectors. Join the waitlist for early access." />
</svelte:head>

<main class="wi-page">

	<!-- ── HERO ── -->
	<section class="wi-hero">
		<img src="/assets/hero/API_Hero.jpg" alt="" class="wi-hero-bg" aria-hidden="true" fetchpriority="high" />
		<div class="wi-hero-overlay" aria-hidden="true"></div>
		<div class="wi-hero-inner">
			<div class="wi-coming-pill">
				<span class="wi-pulse" aria-hidden="true"></span>
				Coming Soon · Join the Waitlist
			</div>
			<h1 class="wi-hero-title">Intelligence Built for<br /><em>Serious Collectors</em></h1>
			<p class="wi-hero-sub">
				Watch Reserve Intelligence is a new kind of platform. We go far beyond price data to give collectors the depth of insight their passion deserves. Real-time valuations, rarity scores, provenance trails, portfolio tracking and more. Exclusively for members.
			</p>
			<a href="#waitlist" class="wi-btn-primary">
				Join the Waitlist
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
			</a>
		</div>
	</section>

	<!-- ── AUTHENTICATION & TECHNOLOGY ── -->
	<section class="wi-auth">
		<div class="wi-auth-inner">
			<div class="wi-auth-text">
				<p class="wi-eyebrow">The Future of Authenticity</p>
				<h2 class="wi-section-title">Huge strides are being made to secure the watch of tomorrow</h2>
				<p class="wi-auth-body">
					Watch Reserve is at the forefront of this shift. We are actively investing in the technologies that will define authentication for the next generation of collectors. We are building the infrastructure so that when you buy a watch, every question about its history, its parts, and its identity can be answered with certainty.
				</p>
			</div>
			<div class="wi-auth-images">
				<div class="wi-auth-img wi-auth-img--main">
					<img src="/assets/hero/Submariner-book.jpg" alt="Rolex Submariner with original documentation" loading="lazy" />
				</div>
			</div>
		</div>
	</section>

	<!-- ── WAITLIST BANNER ── -->
	<section class="wi-banner" id="waitlist">
		<img src="/assets/hero/Join_API_Banner.jpg" alt="" class="wi-banner-bg" aria-hidden="true" loading="lazy" />
		<div class="wi-banner-overlay" aria-hidden="true"></div>
		<div class="wi-banner-inner">
			<div class="wi-banner-content">
				<p class="wi-eyebrow wi-eyebrow--light">Early Access</p>
				<h2 class="wi-banner-title">Be first in.</h2>
				<p class="wi-banner-sub">
					We are opening Watch Reserve Intelligence to a limited group of early members first. Join the waitlist and we will reach out personally when access is ready. No automated emails, no spam.
				</p>

				{#if submitted}
					<div class="wi-success">
						<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
						</svg>
						<div>
							<p class="wi-success-title">You're on the list{firstName ? `, ${firstName}` : ''}.</p>
							<p class="wi-success-sub">We'll be in touch personally when early access opens.</p>
						</div>
					</div>
				{:else}
					<form class="wi-banner-form" onsubmit={handleSubmit}>
						<div class="wi-banner-fields">
							<input
								type="text"
								class="wi-banner-input"
								placeholder="First name"
								bind:value={firstName}
								autocomplete="given-name"
								aria-label="First name"
							/>
							<input
								type="email"
								class="wi-banner-input"
								placeholder="Email address"
								bind:value={email}
								required
								autocomplete="email"
								aria-label="Email address"
							/>
						</div>
						<button type="submit" class="wi-banner-btn">
							Join the Waitlist
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
						</button>
						<p class="wi-banner-note">Early members receive exclusive access and founding member benefits.</p>
					</form>
				{/if}
			</div>
		</div>
	</section>

	<!-- ── IMAGE STRIP ── -->
	<div class="wi-image-strip" aria-hidden="true">
		<img src="/assets/hero/rose_daytona.jpg" alt="" />
		<img src="/assets/hero/Sky-Dweller-Blue.jpg" alt="" />
		<img src="/assets/hero/Day-Date-Gold.jpg" alt="" />
		<img src="/assets/hero/GMT-Master II Book.jpg" alt="" />
	</div>

</main>

<style>
	.wi-page {
		width: 100%;
		background-color: #ffffff;
	}

	/* ── SHARED ── */
	.wi-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 18px 0;
		display: block;
	}

	.wi-eyebrow--light { color: #c9a97d; }

	.wi-section-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 3.5vw, 2.875rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 28px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.wi-title-light { color: #ffffff; }

	/* ── HERO ── */
	.wi-hero {
		position: relative;
		min-height: 80vh;
		display: flex;
		align-items: center;
		padding: 120px 40px 100px;
		overflow: hidden;
	}

	.wi-hero-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 35%;
		display: block;
	}

	.wi-hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			105deg,
			rgba(22, 11, 17, 0.92) 0%,
			rgba(22, 11, 17, 0.78) 50%,
			rgba(22, 11, 17, 0.5) 100%
		);
	}

	.wi-hero-inner {
		position: relative;
		z-index: 1;
		max-width: 820px;
		margin: 0 auto;
		text-align: center;
	}

	.wi-coming-pill {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background-color: rgba(161, 132, 109, 0.15);
		border: 1px solid rgba(161, 132, 109, 0.4);
		color: #c9a97d;
		padding: 8px 20px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		margin-bottom: 32px;
	}

	.wi-pulse {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: #c9a97d;
		flex-shrink: 0;
		position: relative;
	}

	.wi-pulse::after {
		content: '';
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		background-color: #c9a97d;
		opacity: 0.3;
		animation: wiPulse 2s ease-in-out infinite;
	}

	@keyframes wiPulse {
		0%, 100% { transform: scale(1); opacity: 0.3; }
		50% { transform: scale(1.8); opacity: 0; }
	}

	.wi-hero-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 6vw, 4.75rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 28px 0;
		line-height: 1.1;
		letter-spacing: -0.025em;
	}

	.wi-hero-title em {
		font-style: italic;
		color: #a1846d;
	}

	.wi-hero-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1rem, 1.3vw, 1.125rem);
		color: rgba(255, 255, 255, 0.72);
		margin: 0 auto 44px;
		max-width: 680px;
		line-height: 1.8;
		font-weight: 300;
	}

	.wi-btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background-color: #a1846d;
		color: #ffffff;
		text-decoration: none;
		padding: 16px 36px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		transition: background-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease, gap 0.25s ease;
	}

	.wi-btn-primary:hover {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 8px 28px rgba(161, 132, 109, 0.35);
		gap: 14px;
	}

	/* ── AUTHENTICATION & TECHNOLOGY ── */
	.wi-auth {
		padding: 72px 40px;
		background-color: #ffffff;
		border-bottom: 1px solid rgba(161, 132, 109, 0.12);
	}

	.wi-auth-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 72px;
		align-items: center;
	}

	.wi-auth-body {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		color: #3a2a31;
		line-height: 1.85;
		font-weight: 300;
		margin: 0;
	}

	.wi-auth-images {
		width: 100%;
		max-width: 480px;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border: 1px solid rgba(161, 132, 109, 0.2);
	}

	.wi-auth-img {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.wi-auth-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
	}


	/* ── IMAGE STRIP ── */
	.wi-image-strip {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		height: 260px;
		overflow: hidden;
	}

	.wi-image-strip img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: grayscale(20%);
		transition: filter 0.4s ease, transform 0.4s ease;
	}

	.wi-image-strip img:hover {
		filter: grayscale(0%);
		transform: scale(1.03);
	}

	/* ── WAITLIST BANNER ── */
	.wi-banner {
		position: relative;
		overflow: hidden;
		min-height: 560px;
		display: flex;
		align-items: center;
		padding: 100px 40px;
	}

	.wi-banner-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: right center;
		display: block;
	}

	.wi-banner-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to right,
			rgba(22, 11, 17, 0.97) 0%,
			rgba(22, 11, 17, 0.92) 35%,
			rgba(22, 11, 17, 0.6) 60%,
			rgba(22, 11, 17, 0.1) 100%
		);
	}

	.wi-banner-inner {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
	}

	.wi-banner-content {
		max-width: 480px;
	}

	.wi-banner-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 4.5vw, 3.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 20px 0;
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.wi-banner-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9rem, 1.1vw, 1rem);
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.8;
		font-weight: 300;
		margin: 0 0 36px 0;
	}

	.wi-banner-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.wi-banner-fields {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.wi-banner-input {
		width: 100%;
		padding: 14px 18px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		background-color: rgba(255, 255, 255, 0.07);
		color: #ffffff;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		outline: none;
		border-radius: 0;
		transition: border-color 0.2s ease, background-color 0.2s ease;
		box-sizing: border-box;
	}

	.wi-banner-input::placeholder { color: rgba(255, 255, 255, 0.35); }

	.wi-banner-input:focus {
		border-color: #a1846d;
		background-color: rgba(255, 255, 255, 0.1);
	}

	.wi-banner-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		padding: 15px 32px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.03em;
		cursor: pointer;
		align-self: flex-start;
		transition: background-color 0.25s ease, transform 0.2s ease, gap 0.25s ease;
		margin-top: 4px;
	}

	.wi-banner-btn:hover {
		background-color: #8a6f59;
		transform: translateY(-2px);
		gap: 14px;
	}

	.wi-banner-note {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.35);
		margin: 0;
	}

	.wi-success {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		color: #a1846d;
	}

	.wi-success svg { flex-shrink: 0; margin-top: 2px; }

	.wi-success-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.375rem;
		color: #ffffff;
		margin: 0 0 8px 0;
		font-weight: 400;
	}

	.wi-success-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
		font-weight: 300;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 960px) {
		.wi-auth-inner {
			grid-template-columns: 1fr;
			gap: 56px;
		}

		.wi-auth-images {
			max-width: 100%;
		}

		.wi-image-strip { height: 200px; }
	}

	@media (max-width: 640px) {
		.wi-hero { padding: 90px 24px 80px; min-height: 70vh; }

		.wi-auth { padding: 72px 24px; }

		.wi-banner { padding: 72px 24px; min-height: auto; }

		.wi-banner-overlay {
			background: rgba(22, 11, 17, 0.88);
		}

		.wi-banner-content { max-width: 100%; }

		.wi-auth-images {
			max-width: 100%;
			aspect-ratio: 16 / 9;
		}

		.wi-image-strip {
			grid-template-columns: repeat(2, 1fr);
			height: 200px;
		}
	}

	@media (max-width: 480px) {
		.wi-hero { padding: 72px 20px 64px; }

		.wi-auth,
		.wi-for-collectors { padding: 56px 20px; }

		.wi-banner { padding: 56px 20px; }

		.wi-banner-btn { align-self: stretch; justify-content: center; }

		.wi-image-strip { display: none; }
	}
</style>
