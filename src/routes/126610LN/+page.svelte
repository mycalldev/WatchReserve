<script>
	const specs = [
		{ label: 'Reference', value: '126610LN' },
		{ label: 'Model', value: 'Submariner Date' },
		{ label: 'Case Size', value: '41mm' },
		{ label: 'Case Material', value: 'Oystersteel' },
		{ label: 'Bezel', value: 'Unidirectional Cerachrom, 60-minute graduated' },
		{ label: 'Dial', value: 'Black with Chromalight display' },
		{ label: 'Movement', value: 'Calibre 3235, self-winding' },
		{ label: 'Power Reserve', value: 'Approximately 70 hours' },
		{ label: 'Water Resistance', value: '300 metres (1,000 feet)' },
		{ label: 'Bracelet', value: 'Oyster with Glidelock extension' }
	];

	const reasons = [
		{
			title: 'Fully Authenticated',
			text: 'Every timepiece is inspected and verified by our in-house specialists before it is offered.'
		},
		{
			title: 'Transparent Provenance',
			text: 'Condition, service history, and completeness disclosed in full before you commit.'
		},
		{
			title: 'Discreet, Insured Delivery',
			text: 'Shipped securely, or collected in person at our Canary Wharf address.'
		},
		{
			title: 'Flexible Acquisition',
			text: 'Part exchange, deposit reservation, and finance options available on eligible pieces.'
		}
	];
</script>

<svelte:head>
	<title>Rolex Submariner Date 126610LN | Watch Reserve</title>
	<meta
		name="description"
		content="Buy the Rolex Submariner Date 126610LN, 41mm Oystersteel with black Cerachrom bezel and calibre 3235. Authenticated, insured delivery, finance available. Canary Wharf, London."
	/>
</svelte:head>

<!-- ── HERO ── -->
<div class="page-header">
	<img
		src="/assets/hero/submariner_hero.jpg"
		alt=""
		class="page-header-bg"
		aria-hidden="true"
		fetchpriority="high"
	/>
	<div class="page-header-overlay" aria-hidden="true"></div>
	<div class="page-header-content">
		<p class="page-eyebrow">Rolex · Submariner Date</p>
		<h1 class="page-title">The Submariner Date <em>126610LN</em></h1>
		<p class="page-subtitle">
			The reference that defines the modern diver. 41mm of Oystersteel, a black Cerachrom bezel, and
			the depth of the original tool watch that started it all.
		</p>
		<div class="hero-actions">
			<a href="/contact" class="btn btn--solid">Reserve This Timepiece</a>
			<a href="/contact" class="btn btn--outline">Enquire With a Specialist</a>
		</div>
	</div>
</div>

<main class="landing">
	<!-- ── INTRODUCTION ── -->
	<section class="intro">
		<p class="section-eyebrow">Introduction</p>
		<p class="intro-lead">
			Few watches carry the weight of the Rolex Submariner. Since 1953 it has been the benchmark by
			which every dive watch is measured, worn on the wrists of explorers, professionals, and
			collectors who value substance over spectacle.
		</p>
		<p class="intro-body">
			The 126610LN is the latest chapter in that story: subtly enlarged to 41mm, powered by Rolex's
			most advanced movement to date, and finished to a standard that rewards a lifetime of wear.
			This is not a watch that asks for attention. It earns it.
		</p>
	</section>

	<!-- ── FEATURE ── -->
	<section class="feature">
		<div class="feature-media">
			<img src="/assets/hero/Submariner-book.jpg" alt="Rolex Submariner Date 126610LN" />
		</div>
		<div class="feature-content">
			<p class="section-eyebrow">The Reference</p>
			<h2 class="section-heading">A Purist's Submariner</h2>
			<p>
				Introduced in 2020, the 126610LN replaced the long-serving 116610LN and brought the classic
				black Submariner Date into the current generation. The "LN" denotes <em>lunette noire</em>,
				the black Cerachrom bezel that remains impervious to fading and scratching.
			</p>
			<p>
				Cased in Oystersteel, matched to a black lacquer dial and the redesigned Oyster bracelet
				with the Glidelock extension, it is understated, robust, and endlessly versatile.
			</p>
		</div>
	</section>

	<!-- ── SPECIFICATIONS ── -->
	<section class="specs">
		<p class="section-eyebrow">Specifications</p>
		<h2 class="section-heading">Key Specifications</h2>
		<dl class="spec-grid">
			{#each specs as spec}
				<div class="spec-row">
					<dt>{spec.label}</dt>
					<dd>{spec.value}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<!-- ── MOVEMENT ── -->
	<section class="movement">
		<p class="section-eyebrow">Craftsmanship & Movement</p>
		<h2 class="section-heading section-heading--light">Engineered Beyond Daily Life</h2>
		<p>
			At the heart of the 126610LN is the calibre 3235, a movement that reflects fifteen registered
			patents. The Chronergy escapement improves efficiency and resists magnetic interference, while
			the blue Parachrom hairspring offers stability against shocks and temperature swings.
		</p>
		<p>
			The result is a roughly 70-hour power reserve and chronometric precision certified as a
			Superlative Chronometer, accurate to within -2/+2 seconds per day. Every detail, from the
			Cerachrom bezel to the Triplock winding crown, is engineered to perform far beyond the demands
			of daily life.
		</p>
	</section>

	<!-- ── WHY WATCH RESERVE ── -->
	<section class="reasons">
		<p class="section-eyebrow">Why Watch Reserve</p>
		<h2 class="section-heading">Bought With Confidence</h2>
		<div class="reasons-grid">
			{#each reasons as reason}
				<div class="reason-card">
					<h3>{reason.title}</h3>
					<p>{reason.text}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ── CLOSING CTA ── -->
	<section class="closing">
		<h2 class="closing-heading">Acquire the 126610LN</h2>
		<p class="closing-body">
			A defining Rolex, held to the standard it deserves. Speak with our team to reserve this piece
			or arrange a private viewing.
		</p>
		<div class="hero-actions">
			<a href="/contact" class="btn btn--solid">Reserve This Timepiece</a>
			<a href="/service#finance" class="btn btn--outline">Apply For Finance</a>
		</div>
	</section>
</main>

<style>
	/* ── HERO ── */
	.page-header {
		position: relative;
		padding: 120px 40px 108px;
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
		background: linear-gradient(180deg, rgba(22, 11, 17, 0.72) 0%, rgba(22, 11, 17, 0.9) 100%);
		z-index: 1;
	}
	.page-header-content {
		position: relative;
		z-index: 2;
		max-width: 760px;
		margin: 0 auto;
	}
	.page-eyebrow {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 16px 0;
	}
	.page-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 3.75rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 20px 0;
		letter-spacing: -0.02em;
		line-height: 1.12;
	}
	.page-title em {
		font-style: normal;
		color: #a1846d;
	}
	.page-subtitle {
		font-family: 'acumin-pro', sans-serif;
		font-size: 1rem;
		line-height: 1.8;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.72);
		margin: 0 0 32px 0;
	}

	.hero-actions {
		display: flex;
		gap: 14px;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* ── BUTTONS ── */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 54px;
		padding: 0 32px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		border-radius: 0;
		cursor: pointer;
		transition:
			background-color 0.22s ease,
			color 0.22s ease,
			border-color 0.22s ease,
			transform 0.2s ease;
	}
	.btn--solid {
		background-color: #a1846d;
		color: #ffffff;
		border: 1.5px solid #a1846d;
	}
	.btn--solid:hover {
		background-color: #8a6f59;
		border-color: #8a6f59;
		transform: translateY(-1px);
	}
	.btn--outline {
		background-color: transparent;
		color: #a1846d;
		border: 1.5px solid #a1846d;
	}
	.btn--outline:hover {
		background-color: rgba(161, 132, 109, 0.08);
		border-color: #8a6f59;
		color: #8a6f59;
		transform: translateY(-1px);
	}

	/* ── SHARED ── */
	.landing {
		background-color: #ffffff;
	}
	.section-eyebrow {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 16px 0;
	}
	.section-heading {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 400;
		color: #160b11;
		letter-spacing: -0.01em;
		line-height: 1.2;
		margin: 0 0 24px 0;
	}
	.section-heading--light {
		color: #ffffff;
	}

	/* ── INTRO ── */
	.intro {
		max-width: 760px;
		margin: 0 auto;
		padding: 96px 40px 72px;
		text-align: center;
	}
	.intro-lead {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.25rem, 2vw, 1.5rem);
		line-height: 1.6;
		color: #160b11;
		margin: 0 0 24px 0;
	}
	.intro-body {
		font-family: 'acumin-pro', sans-serif;
		font-size: 1rem;
		line-height: 1.85;
		font-weight: 300;
		color: #3a2a31;
		margin: 0;
	}

	/* ── FEATURE ── */
	.feature {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		gap: 64px;
		max-width: 1200px;
		margin: 0 auto;
		padding: 72px 40px;
	}
	.feature-media img {
		width: 100%;
		height: auto;
		display: block;
	}
	.feature-content p {
		font-family: 'acumin-pro', sans-serif;
		font-size: 1rem;
		line-height: 1.85;
		font-weight: 300;
		color: #3a2a31;
		margin: 0 0 18px 0;
	}
	.feature-content em {
		font-style: normal;
		color: #a1846d;
	}

	/* ── SPECS ── */
	.specs {
		max-width: 900px;
		margin: 0 auto;
		padding: 72px 40px;
		text-align: center;
	}
	.spec-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0 48px;
		margin: 8px 0 0;
		text-align: left;
	}
	.spec-row {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 18px 0;
		border-bottom: 1px solid rgba(22, 11, 17, 0.08);
	}
	.spec-row dt {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #a1846d;
	}
	.spec-row dd {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.9rem;
		font-weight: 300;
		color: #160b11;
		margin: 0;
		text-align: right;
	}

	/* ── MOVEMENT ── */
	.movement {
		background-color: #160b11;
		padding: 96px 40px;
		text-align: center;
	}
	.movement .section-eyebrow {
		color: #a1846d;
	}
	.movement p {
		font-family: 'acumin-pro', sans-serif;
		font-size: 1rem;
		line-height: 1.85;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.72);
		max-width: 720px;
		margin: 0 auto 18px;
	}

	/* ── REASONS ── */
	.reasons {
		max-width: 1200px;
		margin: 0 auto;
		padding: 96px 40px;
		text-align: center;
	}
	.reasons-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
		margin-top: 40px;
	}
	.reason-card {
		background-color: #faf8f6;
		border: 1px solid rgba(161, 132, 109, 0.18);
		padding: 36px 28px;
		text-align: left;
	}
	.reason-card h3 {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.95rem;
		font-weight: 600;
		color: #160b11;
		margin: 0 0 12px 0;
		letter-spacing: 0.01em;
	}
	.reason-card p {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.875rem;
		line-height: 1.7;
		font-weight: 300;
		color: #3a2a31;
		margin: 0;
	}

	/* ── CLOSING ── */
	.closing {
		background-color: #faf8f6;
		padding: 96px 40px;
		text-align: center;
		border-top: 1px solid rgba(161, 132, 109, 0.18);
	}
	.closing-heading {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 18px 0;
	}
	.closing-body {
		font-family: 'acumin-pro', sans-serif;
		font-size: 1rem;
		line-height: 1.8;
		font-weight: 300;
		color: #3a2a31;
		max-width: 560px;
		margin: 0 auto 32px;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 960px) {
		.feature {
			grid-template-columns: 1fr;
			gap: 40px;
		}
		.reasons-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 640px) {
		.page-header {
			padding: 88px 24px 80px;
		}
		.intro,
		.feature,
		.specs,
		.movement,
		.reasons,
		.closing {
			padding-left: 24px;
			padding-right: 24px;
		}
		.spec-grid {
			grid-template-columns: 1fr;
			gap: 0;
		}
		.reasons-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
