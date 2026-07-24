<script>
	import PartExchangeModal from '$lib/components/PartExchangeModal.svelte';

	let modalOpen = $state(false);
</script>

<!-- ── 1. THE SWAP VISUAL ────────────────────────────────────────────── -->
<section class="pe-swap-section">
	<div class="pe-swap-inner">
		<div class="pe-swap-head">
			<p class="pe-section-eyebrow">The Exchange</p>
			<h1 class="pe-section-title">One watch in. One watch out.</h1>
			<p class="pe-section-intro">
				A part exchange is the simplest path to the next piece in your collection. You give us the watch you own, we apply its value against one from our inventory, and you walk away with the watch you've always wanted.
			</p>
		</div>

		<div class="pe-swap-visual" aria-hidden="false">
			<figure class="pe-swap-card">
				<div class="pe-swap-img-wrap">
					<img
						src="/assets/hero/Rolex_cards.jpg"
						alt="A Rolex with its original cards and documentation"
						loading="lazy"
					/>
				</div>
				<figcaption class="pe-swap-cap">
					<span class="pe-swap-cap-label">The Watch You Have</span>
					<span class="pe-swap-cap-sub">We value yours fairly, against live market data.</span>
				</figcaption>
			</figure>

			<div class="pe-swap-icon" aria-hidden="true">
				<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M8 16h28l-6-6" />
					<path d="M40 32H12l6 6" />
				</svg>
			</div>

			<figure class="pe-swap-card">
				<div class="pe-swap-img-wrap">
					<img
						src="/assets/hero/Pepsi-Cards.jpg"
						alt="A Rolex GMT-Master II Pepsi with its original cards"
						loading="lazy"
					/>
				</div>
				<figcaption class="pe-swap-cap">
					<span class="pe-swap-cap-label">The Watch You Want</span>
					<span class="pe-swap-cap-sub">Any reference from our authenticated inventory.</span>
				</figcaption>
			</figure>
		</div>
	</div>
</section>

<!-- ── 2. HERO ───────────────────────────────────────────────────────── -->
<section class="pe-hero">
	<div class="pe-hero-inner">
		<p class="pe-eyebrow">Part Exchange</p>
		<h2 class="pe-hero-title">
			Trade the watch you have<br class="pe-desk-break" /> for the one you want.
		</h2>
		<p class="pe-hero-sub">
			A straightforward, transparent way to upgrade your collection. We'll value your existing timepiece against any watch in our inventory, with no obligation and no pressure to commit.
		</p>
		<button type="button" class="pe-hero-cta" onclick={() => (modalOpen = true)}>
			Start Your Exchange
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		</button>
	</div>
</section>

<!-- ── 3. HOW IT WORKS ───────────────────────────────────────────────── -->
<section class="pe-steps-section">
	<div class="pe-steps-inner">
		<p class="pe-section-eyebrow pe-center">How It Works</p>
		<h2 class="pe-section-title pe-center">A simple, three-step process</h2>

		<div class="pe-steps-grid">
			<article class="pe-step">
				<div class="pe-step-num">01</div>
				<h3 class="pe-step-title">Tell Us About Your Watch</h3>
				<p class="pe-step-text">
					Share the details and a few photos of the piece you'd like to exchange. Reference, condition, box, papers, service history. The more we know, the more accurate our valuation.
				</p>
			</article>

			<article class="pe-step">
				<div class="pe-step-num">02</div>
				<h3 class="pe-step-title">Receive a Fair Valuation</h3>
				<p class="pe-step-text">
					Our specialists benchmark your watch against live market data and recent sale comparables, then send you a transparent offer you can trust.
				</p>
			</article>

			<article class="pe-step">
				<div class="pe-step-num">03</div>
				<h3 class="pe-step-title">Choose Your Next Piece</h3>
				<p class="pe-step-text">
					Pick any watch from our inventory. We apply the value of your current piece against the new one, and you settle the difference either way.
				</p>
			</article>
		</div>
	</div>
</section>

<!-- ── 4. CTA ────────────────────────────────────────────────────────── -->
<section class="pe-cta-section">
	<div class="pe-cta-inner">
		<h2 class="pe-cta-title">Speak with a specialist today.</h2>
		<p class="pe-cta-sub">
			Complete our quick exchange form or give us a call. Our team is ready to answer any questions and walk you through the next steps.
		</p>
		<div class="pe-cta-buttons">
			<button type="button" class="pe-btn pe-btn--primary" onclick={() => (modalOpen = true)}>
				Start the Form
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</button>
			<a class="pe-btn pe-btn--secondary" href="tel:02081501987">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
				</svg>
				Call 0208 150 1987
			</a>
		</div>
	</div>
</section>

<PartExchangeModal bind:open={modalOpen} />

<style>
	/* ── SHARED ──────────────────────────────────────────────────────── */
	.pe-eyebrow,
	.pe-section-eyebrow {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 18px 0;
	}

	.pe-section-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 3.6vw, 2.75rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 24px 0;
		line-height: 1.2;
		letter-spacing: -0.015em;
	}

	.pe-center {
		text-align: center;
	}

	/* ── 2. HERO ─────────────────────────────────────────────────────── */
	.pe-hero {
		width: 100%;
		background-color: #ffffff;
		padding: 120px 40px 100px;
		text-align: center;
	}

	.pe-hero-inner {
		max-width: 820px;
		margin: 0 auto;
	}

	.pe-hero-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.25rem, 5vw, 3.75rem);
		font-weight: 400;
		color: #160b11;
		line-height: 1.15;
		letter-spacing: -0.02em;
		margin: 0 0 24px 0;
	}

	.pe-hero-sub {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		color: #3a2a31;
		line-height: 1.75;
		font-weight: 300;
		margin: 0 0 36px 0;
	}

	.pe-hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 16px 34px;
		background-color: #160b11;
		color: #ffffff;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		text-decoration: none;
		border: 1px solid #160b11;
		cursor: pointer;
		line-height: 1;
		transition: background-color 0.25s ease, border-color 0.25s ease;
	}

	.pe-hero-cta:hover {
		background-color: #a1846d;
		border-color: #a1846d;
	}

	/* ── 1. SWAP VISUAL ──────────────────────────────────────────────── */
	.pe-swap-section {
		width: 100%;
		background-color: #faf8f6;
		padding: 120px 40px;
	}

	.pe-swap-inner {
		max-width: 1200px;
		margin: 0 auto;
	}

	.pe-swap-head {
		max-width: 720px;
		margin: 0 auto 72px;
		text-align: center;
	}

	.pe-section-intro {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		line-height: 1.8;
		color: #3a2a31;
		font-weight: 300;
		margin: 0;
	}

	.pe-swap-visual {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 40px;
		align-items: center;
	}

	.pe-swap-card {
		margin: 0;
		display: flex;
		flex-direction: column;
	}

	.pe-swap-img-wrap {
		width: 100%;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		border: 1px solid rgba(161, 132, 109, 0.2);
		box-shadow: 0 18px 50px rgba(22, 11, 17, 0.1), 0 4px 16px rgba(22, 11, 17, 0.06);
		transition: transform 0.4s ease, box-shadow 0.4s ease;
	}

	.pe-swap-card:hover .pe-swap-img-wrap {
		transform: translateY(-4px);
		box-shadow: 0 24px 60px rgba(22, 11, 17, 0.14), 0 6px 20px rgba(22, 11, 17, 0.08);
	}

	.pe-swap-img-wrap img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.pe-swap-cap {
		margin-top: 22px;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.pe-swap-cap-label {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: 1.25rem;
		color: #160b11;
		letter-spacing: -0.01em;
	}

	.pe-swap-cap-sub {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.85rem;
		color: #6b5c55;
		font-weight: 300;
		line-height: 1.5;
	}

	.pe-swap-icon {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background-color: #faf8f6;
		border: 1px solid rgba(161, 132, 109, 0.35);
		color: #a1846d;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.pe-swap-icon svg {
		width: 34px;
		height: 34px;
	}

	/* ── 3. HOW IT WORKS ─────────────────────────────────────────────── */
	.pe-steps-section {
		width: 100%;
		background-color: #faf8f6;
		padding: 120px 40px;
		border-top: 1px solid rgba(161, 132, 109, 0.15);
		border-bottom: 1px solid rgba(161, 132, 109, 0.15);
	}

	.pe-steps-inner {
		max-width: 1200px;
		margin: 0 auto;
	}

	.pe-steps-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 28px;
		margin-top: 56px;
	}

	.pe-step {
		padding: 36px 28px;
		background-color: #ffffff;
		border: 1px solid rgba(161, 132, 109, 0.18);
		display: flex;
		flex-direction: column;
		gap: 14px;
		transition: border-color 0.25s ease, transform 0.25s ease;
	}

	.pe-step:hover {
		border-color: rgba(161, 132, 109, 0.45);
		transform: translateY(-2px);
	}

	.pe-step-num {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: 1rem;
		color: #a1846d;
		letter-spacing: 0.1em;
	}

	.pe-step-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: 1.25rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.3;
	}

	.pe-step-text {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.9rem;
		line-height: 1.7;
		color: #6b5c55;
		font-weight: 300;
		margin: 0;
	}

	/* ── 4. CTA ──────────────────────────────────────────────────────── */
	.pe-cta-section {
		position: relative;
		width: 100%;
		background-color: #160b11;
		background-image: linear-gradient(
				rgba(22, 11, 17, 0.78),
				rgba(22, 11, 17, 0.82)
			),
			url('/assets/hero/Day-Date-Gold.jpg');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		padding: 120px 40px;
		color: #ffffff;
		text-align: center;
	}

	.pe-cta-inner {
		position: relative;
		z-index: 1;
		max-width: 720px;
		margin: 0 auto;
	}

	.pe-cta-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.875rem, 3.5vw, 2.625rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 20px 0;
		line-height: 1.25;
		letter-spacing: -0.015em;
	}

	.pe-cta-sub {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		color: rgba(255, 255, 255, 0.72);
		line-height: 1.7;
		font-weight: 300;
		margin: 0 0 40px 0;
	}

	.pe-cta-buttons {
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.pe-btn {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 16px 32px;
		text-decoration: none;
		cursor: pointer;
		line-height: 1;
		transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
	}

	.pe-btn--primary {
		background-color: #a1846d;
		color: #ffffff;
		border: 1px solid #a1846d;
	}

	.pe-btn--primary:hover {
		background-color: #8d7159;
		border-color: #8d7159;
	}

	.pe-btn--secondary {
		background-color: transparent;
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.45);
	}

	.pe-btn--secondary:hover {
		border-color: #ffffff;
		background-color: rgba(255, 255, 255, 0.06);
	}

	/* ── RESPONSIVE ──────────────────────────────────────────────────── */
	@media (max-width: 960px) {
		.pe-hero {
			padding: 90px 28px 80px;
		}

		.pe-swap-section,
		.pe-steps-section,
		.pe-cta-section {
			padding: 90px 28px;
		}

		.pe-swap-visual {
			grid-template-columns: 1fr;
			gap: 28px;
		}

		.pe-swap-icon {
			transform: rotate(90deg);
			margin: 0 auto;
		}

		.pe-steps-grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}
	}

	@media (max-width: 600px) {
		.pe-desk-break {
			display: none;
		}

		.pe-hero {
			padding: 72px 20px 64px;
		}

		.pe-swap-section,
		.pe-steps-section,
		.pe-cta-section {
			padding: 72px 20px;
		}

		.pe-swap-head {
			margin-bottom: 56px;
		}

		.pe-steps-grid {
			grid-template-columns: 1fr;
		}

		.pe-btn {
			padding: 14px 26px;
			font-size: 0.72rem;
		}
	}
</style>
