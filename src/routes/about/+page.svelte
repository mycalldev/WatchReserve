<script>
	// Self-contained About page. No component imports required.
</script>

<!-- ── 1. HERO ───────────────────────────────────────────────────────── -->
<section class="au-hero">
	<div class="au-hero-overlay" aria-hidden="true"></div>
	<div class="au-hero-content">
		<p class="au-eyebrow">About Watch Reserve</p>
		<h1 class="au-hero-title">Who We Are</h1>
		<p class="au-hero-sub">
			A London-based dealer of rare pre-owned timepieces, with a tech-first approach to authenticity, provenance, and trust.
		</p>
	</div>
</section>

<!-- ── 2. MISSION / INTRO ────────────────────────────────────────────── -->
<section class="au-intro">
	<div class="au-intro-inner">
		<div class="au-intro-text">
			<p class="au-section-eyebrow">Our Mission</p>
			<h2 class="au-section-title">A new standard for pre-owned luxury</h2>
			<p>
				Watch Reserve was born from a single belief: that buying a pre-owned timepiece should feel as exceptional, and as certain, as the watch itself.
			</p>
			<p>
				What began as a quiet pursuit among collectors has become a trusted destination for clients across the UK and around the world, from first-time buyers to seasoned collectors building considered references.
			</p>
			<p>
				We don't just sell watches. We guide, advise, and stand behind every piece we source, with the technology and documentation to back it up.
			</p>
		</div>
		<div class="au-intro-image">
			<img
				src="/assets/hero/backandfront.jpg"
				alt="Close-up of a luxury watch, front and caseback"
				loading="lazy"
			/>
		</div>
	</div>
</section>

<!-- ── 3. TECH-FIRST ─────────────────────────────────────────────────── -->
<section class="au-tech">
	<div class="au-tech-inner">
		<div class="au-tech-image">
			<img
				src="/assets/hero/platinum_rolex.jpg"
				alt="Platinum Rolex timepiece"
				loading="lazy"
			/>
		</div>
		<div class="au-tech-text">
			<p class="au-section-eyebrow">Tech First</p>
			<h2 class="au-section-title">Authenticity you can verify</h2>
			<p>
				Watch Reserve is a <strong>tech-first company</strong>. In a market where trust has historically rested on a handshake, we believe the next generation of collectors deserve verifiable, data-backed assurance on every piece.
			</p>
			<p>
				We are actively investing in the technical innovations that can be leveraged to authenticate timepieces and trace their validity: digital fingerprinting, archive-grade photography, serial cross-referencing, and provenance records that follow a watch through every owner.
			</p>
			<p>
				The result is a buying experience where craftsmanship meets certainty.
			</p>
		</div>
	</div>
</section>


<!-- ── 5. ARCHIVE / PAPERWORK ────────────────────────────────────────── -->
<section class="au-archive">
	<div class="au-archive-inner">
		<div class="au-archive-text">
			<p class="au-section-eyebrow">The Archive</p>
			<h2 class="au-section-title">Documentation matters</h2>
			<p>
				Original boxes, booklets, warranty cards, and service records aren't a nice-to-have. They're a critical part of a genuine pre-owned timepiece, and a meaningful driver of long-term value.
			</p>
			<p>
				Watch Reserve preserves these alongside every piece, digitised and indexed, so collectors can verify what they're buying and trace its history at a glance.
			</p>
		</div>

		<div class="au-archive-grid">
			<img
				src="/assets/hero/Submariner-book.jpg"
				alt="Rolex Submariner with its original booklet"
				loading="lazy"
			/>
			<img
				src="/assets/hero/GMT-Master%20II%20Book.jpg"
				alt="Rolex GMT-Master II with its original booklet"
				loading="lazy"
			/>
			<img
				src="/assets/hero/Rolex_cards.jpg"
				alt="Rolex warranty cards laid out on leather"
				loading="lazy"
			/>
		</div>
	</div>
</section>

<!-- ── 7. CTA ────────────────────────────────────────────────────────── -->
<section class="au-cta">
	<img src="/assets/hero/GMTMasterII_hero.jpg" alt="" class="au-cta-bg" aria-hidden="true" loading="lazy" />
	<div class="au-cta-overlay" aria-hidden="true"></div>
	<div class="au-cta-inner">
		<h2 class="au-cta-title">Your next timepiece is waiting.</h2>
		<p class="au-cta-sub">
			Browse the collection or speak with our team about sourcing a specific reference.
		</p>
		<div class="au-cta-buttons">
			<a class="au-btn au-btn--primary" href="/shop">
				Explore the Collection
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</a>
			<a class="au-btn au-btn--secondary" href="/contact">Contact Us</a>
		</div>
	</div>
</section>

<style>
	/* ── SHARED PRIMITIVES ───────────────────────────────────────────── */
	.au-eyebrow,
	.au-section-eyebrow {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 18px 0;
	}

	.au-section-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 3.6vw, 2.75rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 28px 0;
		line-height: 1.2;
		letter-spacing: -0.015em;
	}

	.au-center {
		text-align: center;
	}

	/* ── 1. HERO ─────────────────────────────────────────────────────── */
	.au-hero {
		position: relative;
		width: 100%;
		min-height: 78vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image: url('/assets/hero/Pepsi-Cards.jpg');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
	}

	.au-hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(22, 11, 17, 0.55) 0%,
			rgba(22, 11, 17, 0.72) 100%
		);
		z-index: 1;
	}

	.au-hero-content {
		position: relative;
		z-index: 2;
		max-width: 820px;
		padding: 120px 40px;
		text-align: center;
		color: #ffffff;
	}

	.au-hero-content .au-eyebrow {
		color: #c9a97d;
	}

	.au-hero-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 6vw, 4.75rem);
		font-weight: 400;
		color: #ffffff;
		line-height: 1.1;
		letter-spacing: -0.025em;
		margin: 0 0 28px 0;
	}

	.au-hero-sub {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.82);
		font-weight: 300;
		max-width: 620px;
		margin: 0 auto;
	}

	/* ── 2. MISSION / INTRO ──────────────────────────────────────────── */
	.au-intro {
		width: 100%;
		background-color: #ffffff;
		padding: 120px 40px;
	}

	.au-intro-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: center;
	}

	.au-intro-text p {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		line-height: 1.8;
		color: #3a2a31;
		font-weight: 300;
		margin: 0 0 18px 0;
	}

	.au-intro-text p:last-child {
		margin-bottom: 0;
	}

	.au-intro-image {
		position: relative;
		aspect-ratio: 4 / 5;
		overflow: hidden;
		border: 1px solid rgba(161, 132, 109, 0.2);
	}

	.au-intro-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* ── 3. TECH-FIRST ───────────────────────────────────────────────── */
	.au-tech {
		width: 100%;
		background-color: #faf8f6;
		padding: 120px 40px;
		border-top: 1px solid rgba(161, 132, 109, 0.15);
		border-bottom: 1px solid rgba(161, 132, 109, 0.15);
	}

	.au-tech-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: center;
	}

	.au-tech-image {
		aspect-ratio: 4 / 5;
		overflow: hidden;
		border: 1px solid rgba(161, 132, 109, 0.25);
	}

	.au-tech-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.au-tech-text p {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		line-height: 1.8;
		color: #3a2a31;
		font-weight: 300;
		margin: 0 0 18px 0;
	}

	.au-tech-text p:last-child {
		margin-bottom: 0;
	}

	.au-tech-text strong {
		color: #160b11;
		font-weight: 600;
	}


	/* ── 5. ARCHIVE ──────────────────────────────────────────────────── */
	.au-archive {
		width: 100%;
		background-color: #faf8f6;
		padding: 120px 40px;
		border-top: 1px solid rgba(161, 132, 109, 0.15);
	}

	.au-archive-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1.2fr;
		gap: 80px;
		align-items: center;
	}

	.au-archive-text p {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		line-height: 1.8;
		color: #3a2a31;
		font-weight: 300;
		margin: 0 0 18px 0;
	}

	.au-archive-text p:last-child {
		margin-bottom: 0;
	}

	.au-archive-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 16px;
	}

	.au-archive-grid img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		border: 1px solid rgba(161, 132, 109, 0.2);
	}

	.au-archive-grid img:first-child {
		grid-row: 1 / span 2;
		aspect-ratio: auto;
	}

	/* ── 7. CTA ──────────────────────────────────────────────────────── */
	.au-cta {
		position: relative;
		width: 100%;
		background-color: #160b11;
		padding: 120px 40px;
		color: #ffffff;
		text-align: center;
		overflow: hidden;
	}

	.au-cta-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		z-index: 0;
	}

	.au-cta-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, rgba(10, 4, 8, 0.7) 0%, rgba(10, 4, 8, 0.75) 100%);
		z-index: 1;
	}

	.au-cta-inner {
		position: relative;
		z-index: 2;
		max-width: 720px;
		margin: 0 auto;
	}

	.au-cta-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.875rem, 3.5vw, 2.625rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 20px 0;
		line-height: 1.25;
		letter-spacing: -0.015em;
	}

	.au-cta-sub {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		color: rgba(255, 255, 255, 0.72);
		line-height: 1.7;
		font-weight: 300;
		margin: 0 0 40px 0;
	}

	.au-cta-buttons {
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.au-btn {
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
		transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
	}

	.au-btn--primary {
		background-color: #a1846d;
		color: #ffffff;
		border: 1px solid #a1846d;
	}

	.au-btn--primary:hover {
		background-color: #8d7159;
		border-color: #8d7159;
	}

	.au-btn--secondary {
		background-color: transparent;
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.45);
	}

	.au-btn--secondary:hover {
		border-color: #ffffff;
		background-color: rgba(255, 255, 255, 0.06);
	}

	/* ── RESPONSIVE ──────────────────────────────────────────────────── */
	@media (max-width: 960px) {
		.au-intro-inner,
		.au-tech-inner,
		.au-archive-inner {
			grid-template-columns: 1fr;
			gap: 56px;
		}

		.au-tech-inner .au-tech-image {
			order: -1;
		}

.au-archive-grid {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto;
		}

		.au-archive-grid img:first-child {
			grid-row: auto;
			grid-column: 1 / span 2;
			aspect-ratio: 16 / 10;
		}
	}

	@media (max-width: 640px) {
		.au-hero {
			min-height: 68vh;
		}

		.au-hero-content {
			padding: 90px 24px;
		}

		.au-intro,
		.au-tech,
		.au-archive,
		.au-cta {
			padding: 80px 20px;
		}

		.au-archive-grid {
			grid-template-columns: 1fr;
		}

		.au-archive-grid img:first-child {
			grid-column: auto;
			aspect-ratio: 16 / 10;
		}

		.au-btn {
			padding: 14px 26px;
			font-size: 0.72rem;
		}
	}
</style>
