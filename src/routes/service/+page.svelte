<script>
	let openFaq = $state(null);

	function toggleFaq(index) {
		openFaq = openFaq === index ? null : index;
	}

	const faqs = [
		{
			question: 'Can I finance a pre-owned watch?',
			answer:
				'Yes. We work with specialist finance partners who understand the luxury watch market. Subject to status, you can spread the cost of your purchase over agreed monthly instalments with competitive APR rates. Get in touch and we will walk you through your options.'
		},
		{
			question: 'What deposit is typically required?',
			answer:
				'Deposits vary depending on the value of the timepiece and the finance product selected. As a general guide, most products require a minimum 10–20% deposit. We will always present you with a clear breakdown before any agreement is signed.'
		},
		{
			question: 'Is finance available on all watches?',
			answer:
				'Finance is available on the majority of our inventory. Some limited-edition or consignment pieces may have restrictions. Speak to a member of our team and we will confirm eligibility before you proceed.'
		},
		{
			question: 'Does applying for finance affect my credit score?',
			answer:
				'An initial soft-search eligibility check will not affect your credit score. A full application may result in a hard search, which is standard practice across all regulated lenders. We will make this clear before any full application is submitted.'
		},
		{
			question: 'Can I part-exchange and use finance together?',
			answer:
				'Absolutely. Many clients use the value of their current watch as a deposit towards a new piece, with finance covering the balance. This is one of our most popular arrangements. Contact us to discuss how this could work for you.'
		}
	];
</script>

<svelte:head>
	<title>Our Services — Watch Reserve</title>
	<meta
		name="description"
		content="Watch Reserve services: expert valuations, professional watch servicing, insurance guidance, finance options, and warranty cover."
	/>
</svelte:head>

<!-- ─── HERO ───────────────────────────────────────────── -->
<section class="hero-section" aria-label="Services hero">
	<img
		src="/assets/hero/Meteorite-Prod.jpg"
		alt="Rolex GMT-Master II Meteorite dial — Watch Reserve Services"
		class="hero-bg-image"
		fetchpriority="high"
	/>
	<div class="hero-overlay"></div>
	<div class="hero-content-wrapper">
		<div class="hero-content">
			<h1 class="hero-headline">Services Built for <em>Serious</em> Collectors</h1>
			<p class="hero-subheadline">
				From expert valuations and professional servicing to bespoke finance. Every service is
				designed around the standard your timepiece deserves.
			</p>
		</div>
	</div>
</section>

<!-- ─── SERVICE ANCHORS ──────────────────────────────── -->
<nav class="service-nav" aria-label="Service sections">
	<div class="service-nav-inner">
		<a href="#valuation" class="service-nav-item">
			<span class="service-nav-icon">◈</span>
			Watch Valuation
		</a>
		<a href="#servicing" class="service-nav-item">
			<span class="service-nav-icon">◈</span>
			Watch Service
		</a>
		<a href="#insurance" class="service-nav-item">
			<span class="service-nav-icon">◈</span>
			Insurance
		</a>
		<a href="#finance" class="service-nav-item">
			<span class="service-nav-icon">◈</span>
			Finance
		</a>
		<a href="#warranty" class="service-nav-item">
			<span class="service-nav-icon">◈</span>
			Warranty
		</a>
	</div>
</nav>

<!-- ─── WATCH VALUATION ──────────────────────────────── -->
<section id="valuation" class="split-section split-section--dark">
	<div class="split-image-col">
		<img
			src="/assets/lifestyle/Rolex_Leg.avif"
			alt="Rolex timepiece — expert valuation"
			class="split-image"
			loading="lazy"
		/>
	</div>
	<div class="split-content-col split-content-col--brand">
		<span class="section-eyebrow">Watch Valuation</span>
		<h2 class="section-heading">Know Exactly <em>What It's Worth</em></h2>
		<p class="section-body">
			Whether you're considering a sale, looking to insure your collection, or simply curious about
			the current market, our valuations are grounded in real trading data and decades of industry
			knowledge.
		</p>
		<p class="section-body">
			We assess condition, provenance, box and papers, and market desirability to deliver a precise,
			honest figure — not a dealer's lowball offer.
		</p>
		<ul class="service-list">
			<li>Free initial appraisal — no obligation</li>
			<li>Full written valuations available for insurance purposes</li>
			<li>Part-exchange valuations accepted</li>
			<li>Remote and in-person appointments available</li>
		</ul>
		<a href="/contact" class="cta-btn">Request a Valuation →</a>
	</div>
</section>

<!-- ─── WATCH SERVICE ─────────────────────────────────── -->
<section id="servicing" class="servicing-section">
	<div class="servicing-content-col">
		<span class="section-eyebrow section-eyebrow--dark">Watch Service</span>
		<h2 class="section-heading section-heading--dark">Precision Servicing, <em>Expertly Done</em></h2>
		<p class="section-body section-body--dark">
			A luxury watch is a mechanical instrument that rewards proper care. Our trusted network of
			specialist watchmakers carry out full services, movement overhauls, and cosmetic restorations
			to manufacturer standards.
		</p>

		<div class="service-pillars">
			<div class="pillar">
				<h3 class="pillar-title">Full Service</h3>
				<p class="pillar-body">
					Complete disassembly, ultrasonic cleaning, lubrication, and reassembly of the movement.
					Pressure testing and regulation included.
				</p>
			</div>
			<div class="pillar-divider"></div>
			<div class="pillar">
				<h3 class="pillar-title">Cosmetic Restoration</h3>
				<p class="pillar-body">
					Case and bracelet polishing, crown and pusher replacement, crystal refinishing —
					restoring your watch to showroom condition.
				</p>
			</div>
			<div class="pillar-divider"></div>
			<div class="pillar">
				<h3 class="pillar-title">Authentication</h3>
				<p class="pillar-body">
					Every watch we sell undergoes rigorous authentication. We can also authenticate pieces you
					already own and provide supporting documentation.
				</p>
			</div>
		</div>

		<a href="/contact" class="cta-btn cta-btn--dark">Book a Service →</a>
	</div>
	<div class="servicing-image-col">
		<div class="servicing-image-wrapper">
			<img
				src="/assets/lifestyle/Source_Hero.avif"
				alt="Expert watch service and authentication"
				class="servicing-image"
				loading="lazy"
			/>
			<div class="servicing-image-caption">
				Precision craftsmanship — every timepiece handled with care
			</div>
		</div>
	</div>
</section>

<!-- ─── INSURANCE ─────────────────────────────────────── -->
<section id="insurance" class="insurance-section">
	<div class="insurance-inner">
		<div class="insurance-header">
			<span class="section-eyebrow">Insurance</span>
			<h2 class="section-heading section-heading--dark">
				Protect What <em>Matters Most</em>
			</h2>
			<p class="section-body section-body--dark">
				Standard home contents policies frequently undervalue luxury timepieces or exclude them
				outright. We work alongside specialist insurers who understand the market and will ensure
				your collection is covered at the correct reinstatement value.
			</p>
		</div>

		<div class="insurance-cards">
			<div class="insurance-card">
				<div class="insurance-card-icon">◉</div>
				<h3 class="insurance-card-title">Specialist Cover</h3>
				<p class="insurance-card-body">
					Dedicated watch insurance through underwriters who specialise in high-value timepieces —
					not generalist home policies.
				</p>
			</div>
			<div class="insurance-card">
				<div class="insurance-card-icon">◉</div>
				<h3 class="insurance-card-title">Agreed Value Policies</h3>
				<p class="insurance-card-body">
					Insure at the correct current market value, not depreciated replacement cost. Especially
					important for watches that appreciate over time.
				</p>
			</div>
			<div class="insurance-card">
				<div class="insurance-card-icon">◉</div>
				<h3 class="insurance-card-title">Worldwide Cover</h3>
				<p class="insurance-card-body">
					Whether you're wearing your watch on holiday or travelling to a collector event, your
					piece is protected wherever you are.
				</p>
			</div>
			<div class="insurance-card">
				<div class="insurance-card-icon">◉</div>
				<h3 class="insurance-card-title">Theft & Accidental Damage</h3>
				<p class="insurance-card-body">
					Comprehensive cover including accidental damage, theft, mysterious disappearance, and
					transit — with no hidden exclusions.
				</p>
			</div>
		</div>

		<a href="/contact" class="cta-btn cta-btn--dark">Talk to Us About Insurance →</a>
	</div>
</section>

<!-- ─── FINANCE FAQs ──────────────────────────────────── -->
<section id="finance" class="finance-section">
	<div class="finance-image-col">
		<div class="finance-image-wrapper">
			<img
				src="/assets/lifestyle/Multi_Watch.avif"
				alt="Collection of luxury watches available to finance"
				class="finance-image"
				loading="lazy"
			/>
			<div class="finance-image-badge">Finance Available</div>
		</div>
	</div>
	<div class="finance-content-col">
		<span class="section-eyebrow">Finance</span>
		<h2 class="section-heading section-heading--dark">Flexible Finance <em>Options</em></h2>
		<p class="section-body section-body--dark">
			Owning an exceptional timepiece should not be constrained by short-term budget. We offer a
			range of regulated finance options to help you acquire the watch you want, on terms that suit
			you.
		</p>

		<div class="faq-list" role="list">
			{#each faqs as faq, i}
				<div class="faq-item" role="listitem">
					<button
						class="faq-trigger"
						onclick={() => toggleFaq(i)}
						aria-expanded={openFaq === i}
						aria-controls="faq-answer-{i}"
					>
						<span class="faq-question">{faq.question}</span>
						<span class="faq-chevron" class:faq-chevron--open={openFaq === i}>›</span>
					</button>
					<div
						id="faq-answer-{i}"
						class="faq-answer"
						class:faq-answer--open={openFaq === i}
						role="region"
					>
						<p class="faq-answer-text">{faq.answer}</p>
					</div>
				</div>
			{/each}
		</div>

		<a href="/contact" class="cta-btn cta-btn--dark">Discuss Finance Options →</a>
	</div>
</section>

<!-- ─── WARRANTY ─────────────────────────────────────── -->
<section id="warranty" class="warranty-section">
	<div class="warranty-inner">
		<span class="section-eyebrow section-eyebrow--light">Warranty</span>
		<h2 class="section-heading section-heading--light warranty-heading">
			Our Promise to <em>You</em>
		</h2>
		<p class="section-body section-body--light warranty-body">
			Every watch sold by Watch Reserve is accompanied by our own warranty — giving you peace of
			mind long after the transaction is complete.
		</p>

		<div class="warranty-grid">
			<div class="warranty-item">
				<span class="warranty-number">12</span>
				<span class="warranty-unit">Month</span>
				<p class="warranty-desc">Mechanical warranty on every watch sold</p>
			</div>
			<div class="warranty-divider"></div>
			<div class="warranty-item">
				<span class="warranty-number">100%</span>
				<span class="warranty-unit">Authentic</span>
				<p class="warranty-desc">Full authentication certificate with every purchase</p>
			</div>
			<div class="warranty-divider"></div>
			<div class="warranty-item">
				<span class="warranty-number">0</span>
				<span class="warranty-unit">Hidden Fees</span>
				<p class="warranty-desc">Transparent pricing — what you see is what you pay</p>
			</div>
		</div>

		<div class="warranty-detail">
			<p>
				Our warranty covers any mechanical defect arising from the movement under normal use. In the
				event of an issue, we will arrange a specialist repair or — where appropriate — a full
				replacement. Our commitment to your satisfaction does not end at point of sale.
			</p>
			<p>
				Extended warranty packages and full service plans are available on request. Speak to a
				member of our team for full terms.
			</p>
		</div>

		<a href="/contact" class="cta-btn cta-btn--outline">Speak to Our Team →</a>
	</div>
</section>

<style>
	/* ── Shared typography & primitives ─────────────── */
	.section-eyebrow {
		display: block;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin-bottom: 18px;
	}

	.section-eyebrow--dark {
		color: #a1846d;
	}

	.section-eyebrow--light {
		color: #c9a88a;
	}

	.section-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3.25rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 28px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.section-heading em {
		font-style: italic;
	}

	.section-heading--dark {
		color: #160b11;
	}

	.section-heading--light {
		color: #ffffff;
	}

	.section-body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		font-size: clamp(0.95rem, 1.15vw, 1.0625rem);
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.75;
		font-weight: 300;
		letter-spacing: 0.01em;
		margin: 0 0 24px 0;
	}

	.section-body--dark {
		color: #3a2030;
	}

	.section-body--light {
		color: rgba(255, 255, 255, 0.82);
	}

	.cta-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background-color: #a1846d;
		color: #ffffff;
		text-decoration: none;
		padding: 14px 32px;
		border-radius: 6px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.03em;
		transition: all 0.25s ease;
		align-self: flex-start;
		margin-top: 8px;
	}

	.cta-btn:hover {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
	}

	.cta-btn--dark {
		background-color: #422635;
		color: #ffffff;
	}

	.cta-btn--dark:hover {
		background-color: #311b28;
	}

	.cta-btn--light {
		background-color: #a1846d;
	}

	.cta-btn--outline {
		background-color: transparent;
		border: 1.5px solid rgba(255, 255, 255, 0.5);
		color: #ffffff;
	}

	.cta-btn--outline:hover {
		background-color: rgba(255, 255, 255, 0.08);
		border-color: #ffffff;
		transform: translateY(-2px);
		box-shadow: none;
	}

	/* ── Hero ────────────────────────────────────────── */
	.hero-section {
		position: relative;
		width: 100%;
		min-height: 78vh;
		display: flex;
		align-items: flex-end;
		overflow: hidden;
	}

	.hero-bg-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
		z-index: 0;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(22, 11, 17, 0.85) 0%,
			rgba(22, 11, 17, 0.4) 50%,
			rgba(22, 11, 17, 0.1) 100%
		);
		z-index: 1;
	}

	.hero-content-wrapper {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 60px 80px;
	}

	.hero-headline {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5.5vw, 5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 24px 0;
		line-height: 1.1;
		letter-spacing: -0.02em;
		max-width: 780px;
	}

	.hero-headline em {
		font-style: italic;
	}

	.hero-subheadline {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: clamp(1rem, 1.5vw, 1.125rem);
		color: rgba(255, 255, 255, 0.8);
		margin: 0;
		line-height: 1.7;
		font-weight: 300;
		max-width: 560px;
	}

	@media (max-width: 768px) {
		.hero-content-wrapper {
			padding: 0 30px 60px;
		}

		.hero-section {
			min-height: 65vh;
		}
	}

	@media (max-width: 480px) {
		.hero-content-wrapper {
			padding: 0 20px 48px;
		}

		.hero-section {
			min-height: 55vh;
		}
	}

	/* ── Service navigation bar ──────────────────────── */
	.service-nav {
		background-color: #160b11;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.service-nav::-webkit-scrollbar {
		display: none;
	}

	.service-nav-inner {
		display: flex;
		align-items: stretch;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 40px;
		gap: 0;
	}

	.service-nav-item {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: rgba(255, 255, 255, 0.6);
		text-decoration: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 20px 24px;
		border-bottom: 2px solid transparent;
		transition: all 0.25s ease;
		white-space: nowrap;
	}

	.service-nav-item:hover {
		color: #ffffff;
		border-bottom-color: #a1846d;
	}

	.service-nav-icon {
		font-size: 0.625rem;
		color: #a1846d;
		opacity: 0.7;
	}

	@media (max-width: 768px) {
		.service-nav-inner {
			padding: 0 16px;
		}

		.service-nav-item {
			padding: 16px 16px;
			font-size: 0.75rem;
		}
	}

	/* ── Watch Valuation — split dark ────────────────── */
	.split-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 640px;
	}

	.split-image-col {
		position: relative;
		padding: 36px;
		background-color: #422635;
		box-sizing: border-box;
	}

	.split-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		border-radius: 8px;
		overflow: hidden;
		transition: transform 0.6s ease;
	}

	.split-image-col:hover .split-image {
		transform: scale(1.02);
	}

	.split-content-col {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 80px 60px;
	}

	.split-content-col--brand {
		background-color: #422635;
	}

	.service-list {
		list-style: none;
		margin: 0 0 36px 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.service-list li {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.85);
		font-weight: 300;
		letter-spacing: 0.01em;
		padding-left: 20px;
		position: relative;
		line-height: 1.6;
	}

	.service-list li::before {
		content: '—';
		position: absolute;
		left: 0;
		color: #a1846d;
		font-weight: 400;
	}

	@media (max-width: 900px) {
		.split-section {
			grid-template-columns: 1fr;
			min-height: auto;
		}

		.split-image-col {
			min-height: 380px;
			order: 1;
			padding: 24px;
		}

		.split-content-col {
			order: 2;
			padding: 56px 36px;
		}
	}

	@media (max-width: 480px) {
		.split-content-col {
			padding: 44px 24px;
		}
	}

	/* ── Watch Servicing ─────────────────────────────── */
	.servicing-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 680px;
		background-color: #f5f0eb;
	}

	.servicing-image-col {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 36px;
		background-color: #f5f0eb;
		box-sizing: border-box;
	}

	.servicing-image-wrapper {
		position: relative;
		flex: 1;
		border-radius: 8px;
		overflow: hidden;
		min-height: 0;
	}

	.servicing-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.6s ease;
	}

	.servicing-image-col:hover .servicing-image {
		transform: scale(1.02);
	}

	.servicing-image-caption {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(to top, rgba(22, 11, 17, 0.65) 0%, transparent 100%);
		color: rgba(255, 255, 255, 0.85);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.8125rem;
		font-style: italic;
		letter-spacing: 0.03em;
		padding: 40px 24px 18px;
		border-radius: 0 0 8px 8px;
	}

	.servicing-content-col {
		background-color: #f5f0eb;
		padding: 80px 60px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.service-pillars {
		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		gap: 32px;
		align-items: start;
		margin: 0 0 40px 0;
	}

	.pillar {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.pillar-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.01em;
	}

	.pillar-body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.875rem;
		color: #5a3a47;
		line-height: 1.65;
		font-weight: 300;
		margin: 0;
	}

	.pillar-divider {
		width: 1px;
		background-color: rgba(66, 38, 53, 0.25);
		align-self: stretch;
		min-height: 60px;
	}

	@media (max-width: 1100px) {
		.servicing-section {
			grid-template-columns: 1fr;
			min-height: auto;
		}

		.servicing-image-col {
			min-height: 460px;
			padding: 24px;
		}

		.servicing-image-wrapper {
			min-height: 380px;
		}

		.servicing-content-col {
			padding: 56px 36px;
		}

		.service-pillars {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.pillar-divider {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.servicing-content-col {
			padding: 44px 24px;
		}
	}

	/* ── Insurance ───────────────────────────────────── */
	.insurance-section {
		background-color: #faf8f5;
		padding: 100px 60px;
	}

	.insurance-inner {
		max-width: 1300px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.insurance-header {
		max-width: 680px;
		margin-bottom: 60px;
	}

	.insurance-cards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
		width: 100%;
		margin-bottom: 60px;
	}

	.insurance-card {
		background-color: #ffffff;
		padding: 40px 32px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		border-top: 2px solid #422635;
		border-radius: 6px;
		box-shadow: 0 2px 16px rgba(66, 38, 53, 0.07);
		transition: box-shadow 0.25s ease, transform 0.25s ease;
	}

	.insurance-card:hover {
		box-shadow: 0 6px 28px rgba(66, 38, 53, 0.13);
		transform: translateY(-2px);
	}

	.insurance-card-icon {
		font-size: 1.25rem;
		color: #a1846d;
		line-height: 1;
	}

	.insurance-card-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.25rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.01em;
		line-height: 1.3;
	}

	.insurance-card-body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.9rem;
		color: #5a3a47;
		line-height: 1.7;
		font-weight: 300;
		margin: 0;
	}

	@media (max-width: 1100px) {
		.insurance-cards {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.insurance-section {
			padding: 72px 36px;
		}

		.insurance-header {
			margin-bottom: 44px;
		}
	}

	@media (max-width: 600px) {
		.insurance-cards {
			grid-template-columns: 1fr;
		}

		.insurance-section {
			padding: 56px 24px;
		}
	}

	/* ── Finance FAQs ────────────────────────────────── */
	.finance-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 700px;
		background-color: #f5f0eb;
	}

	.finance-image-col {
		position: relative;
		padding: 36px;
		background-color: #f5f0eb;
		box-sizing: border-box;
	}

	.finance-image-wrapper {
		position: relative;
		height: 100%;
		border-radius: 8px;
		overflow: hidden;
	}

	.finance-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.6s ease;
	}

	.finance-image-col:hover .finance-image {
		transform: scale(1.02);
	}

	.finance-image-badge {
		position: absolute;
		top: 20px;
		left: 20px;
		background-color: #a1846d;
		color: #ffffff;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 8px 20px;
		border-radius: 3px;
	}

	.finance-content-col {
		padding: 80px 60px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.faq-list {
		width: 100%;
		margin: 0 0 40px 0;
		display: flex;
		flex-direction: column;
		border-top: 1px solid rgba(66, 38, 53, 0.18);
	}

	.faq-item {
		border-bottom: 1px solid rgba(66, 38, 53, 0.18);
	}

	.faq-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 20px 0;
		text-align: left;
		transition: opacity 0.2s ease;
	}

	.faq-trigger:hover {
		opacity: 0.7;
	}

	.faq-question {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		color: #160b11;
		letter-spacing: 0.01em;
		line-height: 1.5;
	}

	.faq-chevron {
		font-size: 1.4rem;
		color: #a1846d;
		transition: transform 0.3s ease;
		flex-shrink: 0;
		line-height: 1;
		display: inline-block;
		transform: rotate(90deg);
	}

	.faq-chevron--open {
		transform: rotate(-90deg);
	}

	.faq-answer {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.35s ease;
	}

	.faq-answer--open {
		grid-template-rows: 1fr;
	}

	.faq-answer > p {
		overflow: hidden;
	}

	.faq-answer-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.9rem;
		color: #5a3a47;
		line-height: 1.75;
		font-weight: 300;
		margin: 0;
		padding-bottom: 20px;
	}

	@media (max-width: 1000px) {
		.finance-section {
			grid-template-columns: 1fr;
			min-height: auto;
		}

		.finance-image-col {
			min-height: 420px;
			padding: 24px;
		}

		.finance-image-wrapper {
			min-height: 340px;
		}

		.finance-content-col {
			padding: 56px 36px;
		}
	}

	@media (max-width: 480px) {
		.finance-content-col {
			padding: 44px 24px;
		}
	}

	/* ── Warranty ────────────────────────────────────── */
	.warranty-section {
		background-color: #160b11;
		padding: 100px 60px;
		position: relative;
		overflow: hidden;
	}

	.warranty-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(to right, transparent, rgba(161, 132, 109, 0.4), transparent);
	}

	.warranty-inner {
		max-width: 960px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.warranty-heading {
		max-width: 600px;
	}

	.warranty-body {
		max-width: 560px;
		text-align: center;
		margin-bottom: 60px;
	}

	.warranty-grid {
		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		gap: 0;
		width: 100%;
		margin-bottom: 64px;
		align-items: start;
	}

	.warranty-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 0 40px;
	}

	.warranty-number {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(3rem, 6vw, 5rem);
		font-weight: 400;
		color: #a1846d;
		line-height: 1;
	}

	.warranty-unit {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 12px;
	}

	.warranty-desc {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.6;
		font-weight: 300;
		text-align: center;
		margin: 0;
	}

	.warranty-divider {
		width: 1px;
		background: rgba(255, 255, 255, 0.12);
		align-self: stretch;
		min-height: 100px;
	}

	.warranty-detail {
		max-width: 680px;
		margin-bottom: 48px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.warranty-detail p {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.65);
		line-height: 1.75;
		font-weight: 300;
		margin: 0;
	}

	@media (max-width: 768px) {
		.warranty-section {
			padding: 72px 36px;
		}

		.warranty-grid {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.warranty-divider {
			display: none;
		}

		.warranty-item {
			padding: 0;
		}
	}

	@media (max-width: 480px) {
		.warranty-section {
			padding: 56px 24px;
		}
	}
</style>
