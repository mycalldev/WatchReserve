<script>
	import { onMount, onDestroy } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import NewArrivals from '$lib/components/NewArrivals.svelte';
	import Reviews from '$lib/components/Reviews.svelte';
	import ApiTrialModal from '$lib/components/ApiTrialModal.svelte';

	let { data } = $props();

	// ── API Feed widget ──────────────────────────────────────────────────────────
	const ROLEX_BASE = [
		{ id: 1, model: 'Submariner Date',  ref: '126610LN',    base: 12800 },
		{ id: 2, model: 'Daytona',          ref: '116500LN',    base: 28500 },
		{ id: 3, model: 'GMT-Master II',    ref: '126710BLNR',  base: 16200 },
		{ id: 4, model: 'Datejust 41',      ref: '126334',      base: 9400  },
		{ id: 5, model: 'Sky-Dweller',      ref: '326935',      base: 22000 }
	];

	function tickPrice(base) {
		const delta = base * 0.009 * (Math.random() * 2 - 1);
		return Math.round(base + delta);
	}

	function buildFeedRow(item) {
		const price = tickPrice(item.base);
		const change = parseFloat(((price - item.base) / item.base * 100).toFixed(2));
		return { ...item, price, change, flash: true };
	}

	let apiFeed = $state(ROLEX_BASE.map(buildFeedRow));
	let apiTime  = $state(new Date());
	let apiTimer;

	function formatFeedPrice(n) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency', currency: 'GBP',
			minimumFractionDigits: 0, maximumFractionDigits: 0
		}).format(n);
	}

	function formatFeedTime(d) {
		return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	}

	onMount(() => {
		apiTimer = setInterval(() => {
			const idx = Math.floor(Math.random() * apiFeed.length);
			apiFeed = apiFeed.map((row, i) =>
				i === idx ? buildFeedRow(ROLEX_BASE[i]) : { ...row, flash: false }
			);
			apiTime = new Date();
		}, 2000);
	});

	onDestroy(() => clearInterval(apiTimer));
</script>

<ApiTrialModal />

<section class="hero-section">
	<div class="hero-container">
		<div class="hero-content">
			<h1 class="hero-headline">
				Pre-Owned <em>Rare Luxury</em> Timepieces
			</h1>
			<p class="hero-subheadline">
				Explore investment-grade timepieces - sourced, authenticated, and delivered by a team who knows your time is valuable.
			</p>
			<div class="hero-actions">
				<Button>Browse All Watches</Button>
			</div>
		</div>
	</div>
</section>

<div class="homepage-badges-placeholder">
	<div class="placeholder-banner">Trust Pilot Banner</div>
	<div class="placeholder-banner">Finance</div>
	<div class="placeholder-banner">Secure Delivery</div>
</div>


<NewArrivals products={data.newArrivals} />

<section class="brands-section">
	<div class="brands-container">
		<div class="brand-card">
			<div class="brand-image-wrapper">
				<img
					src="/assets/lifestyle/Rolex_Explore_All.avif"
					alt="Rolex watch"
					class="brand-image"
				/>
			</div>
			<div class="brand-content">
				<h3 class="brand-name">Rolex</h3>
				<p class="brand-description">The world's most iconic watches</p>
			</div>
		</div>

		<div class="brand-card">
			<div class="brand-image-wrapper">
				<img
					src="/assets/lifestyle/PP_Explore_All.avif"
					alt="Patek Philippe watch"
					class="brand-image"
				/>
			</div>
			<div class="brand-content">
				<h3 class="brand-name">Patek Philippe</h3>
				<p class="brand-description">Timeless elegance, investment quality</p>
			</div>
		</div>

		<div class="brand-card">
			<div class="brand-image-wrapper">
				<img
					src="/assets/lifestyle/AP_Explore_All.avif"
					alt="Audemars Piguet watch"
					class="brand-image"
				/>
			</div>
			<div class="brand-content">
				<h3 class="brand-name">Audemars Piguet</h3>
				<p class="brand-description">Bold design for modern collectors</p>
			</div>
		</div>

		<div class="brand-card">
			<div class="brand-image-wrapper">
				<img
					src="/assets/lifestyle/Curated_Editions_Explore_All.avif"
					alt="Curated Editions watch"
					class="brand-image"
				/>
			</div>
			<div class="brand-content">
				<h3 class="brand-name">Curated Editions</h3>
				<p class="brand-description">Cartier, Richard Mille, and more</p>
			</div>
		</div>
	</div>
</section>

<!-- ── API SECTION ── -->
<section class="api-section">
	<div class="api-widget-col">
		<div class="api-widget">

			<!-- Widget header -->
			<div class="widget-header">
				<div class="widget-header-left">
					<span class="widget-brand-dot" aria-hidden="true"></span>
					<span class="widget-title">ROLEX MARKET FEED</span>
				</div>
				<div class="widget-header-right">
					<span class="widget-live">
						<span class="api-pulse-dot" aria-hidden="true"></span>
						LIVE
					</span>
					<span class="widget-time" aria-live="polite" aria-label="Last updated">{formatFeedTime(apiTime)}</span>
				</div>
			</div>

			<!-- Column headers -->
			<div class="widget-col-headers">
				<span>Model</span>
				<span>Reference</span>
				<span class="align-right">Market Price</span>
				<span class="align-right">24h</span>
			</div>

			<!-- Live rows -->
			<div class="widget-rows" role="list" aria-label="Rolex live prices">
				{#each apiFeed as row (row.id)}
					<div class="widget-row" class:widget-row--flash={row.flash} role="listitem">
						<span class="widget-model">{row.model}</span>
						<code class="widget-ref">{row.ref}</code>
						<span class="widget-price">{formatFeedPrice(row.price)}</span>
						<span class="widget-change" class:positive={row.change >= 0} class:negative={row.change < 0}>
							{row.change >= 0 ? '▲' : '▼'} {Math.abs(row.change)}%
						</span>
					</div>
				{/each}
			</div>

			<!-- Widget footer -->
			<div class="widget-footer">
				<span class="widget-footer-label">Powered by Watch Reserve API</span>
				<span class="widget-footer-note">Indicative prices — demo data</span>
			</div>

		</div>
	</div>
	<div class="api-content-col">
		<div class="api-live-badge">
			<span class="api-pulse-dot" aria-hidden="true"></span>
			Live Market Data
		</div>
		<h2 class="api-heading">
			Market Intelligence,<br /><em>At Your Fingertips</em>
		</h2>
		<p class="api-body">
			The Watch Reserve Intelligence API delivers real-time pricing, 15 years of historical trends,
			and deep reference data across 40,000+ references — built for dealers, collectors, and
			platforms who demand accuracy.
		</p>
		<div class="api-features">
			<div class="api-feature">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
				Sub-second price updates from verified transactions
			</div>
			<div class="api-feature">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
				Dealer-grade authenticated data — no estimates
			</div>
			<div class="api-feature">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
				RESTful & GraphQL endpoints, full OpenAPI spec
			</div>
		</div>
		<a href="/api" class="api-cta">
			Explore the API
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
		</a>
	</div>
</section>

<section class="sell-source-section">
	<div class="sell-source-container">
		<div class="sell-source-image-wrapper">
			<img
				src="/assets/lifestyle/AP_wrist_jean1.avif"
				alt="Luxury watch on wrist"
				class="sell-source-image"
			/>
		</div>
		<div class="sell-source-content">
			<h2 class="sell-source-heading">
				Looking to Sell or<br />
				Source a Watch?
			</h2>
			<p class="sell-source-text">
				While our primary focus is helping you find the perfect timepiece, we also offer expert valuations and bespoke sourcing for collectors.
			</p>
			<div class="sell-source-links">
				<a href="/sell" class="sell-source-link">
					Sell Your Watch
					<span class="arrow">→</span>
				</a>
				<a href="/source" class="sell-source-link">
					Request a Watch
					<span class="arrow">→</span>
				</a>
				<a href="/contact" class="sell-source-link">
					Contact Us
					<span class="arrow">→</span>
				</a>
			</div>
		</div>
	</div>
</section>

<section class="luxury-section">
	<div class="luxury-container">
		<div class="luxury-image-wrapper">
			<img
				src="/assets/gifs/giffycanvas (12).gif"
				alt="Luxury watch"
				class="luxury-image"
			/>
		</div>
		<div class="luxury-content">
			<h2 class="luxury-headline">
				Luxury is <em>Personal</em>
			</h2>
			<p class="luxury-text">
				At Watch Reserve, we believe the experience should reflect the calibre of the watch. Whether you're building a collection or investing in your first timepiece, our service is personal, thoughtful, and rooted in genuine expertise.
			</p>
			<p class="luxury-text">
				We stock and source rare watches from the world's most iconic brands and we back every transaction with guidance you can trust.
			</p>
			<p class="luxury-text">
				This isn't just a purchase. It's your next signature piece, handled with care by people who understand its value.
			</p>
			<button class="about-btn">About Us</button>
		</div>
	</div>
</section>

<Reviews />

<style>
	.hero-section {
		position: relative;
		width: 100%;
		min-height: 80vh;
		display: flex;
		align-items: center;
		background-image: url('/assets/home/hero_section.avif');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.hero-section::before {
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

	.hero-container {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 100px 0;
	}

	.hero-content {
		max-width: 600px;
		width: 100%;
		padding-left: 40px;
	}

	.hero-headline {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 32px 0;
		line-height: 1.15;
		letter-spacing: -0.02em;
		text-align: left;
	}

	.hero-headline em {
		font-style: italic;
		font-weight: 400;
	}

	.hero-subheadline {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(1rem, 1.5vw, 1.125rem);
		color: #ffffff;
		margin: 0 0 48px 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		text-align: left;
		opacity: 0.95;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 24px;
		flex-wrap: wrap;
	}

	@media (max-width: 1024px) {
		.hero-container {
			padding: 80px 0;
		}

		.hero-content {
			max-width: 100%;
			padding-left: 30px;
		}
	}

	@media (max-width: 768px) {
		.hero-section {
			min-height: 70vh;
		}

		.hero-container {
			padding: 60px 0;
		}

		.hero-content {
			padding-left: 20px;
		}

		.hero-headline {
			margin: 0 0 24px 0;
		}

		.hero-subheadline {
			margin: 0 0 40px 0;
		}

		.hero-actions {
			flex-direction: column;
			align-items: flex-start;
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.hero-section {
			min-height: 60vh;
		}

		.hero-container {
			padding: 40px 0;
		}

		.hero-content {
			padding-left: 20px;
		}
	}

	.homepage-badges-placeholder {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin: 2rem 0;
	}
	.placeholder-banner {
		background: #f3f3f3;
		color: #333;
		border-radius: 8px;
		padding: 1.25rem 2rem;
		font-size: 1.1rem;
		font-weight: 600;
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
		text-align: center;
		min-width: 160px;
	}

	.luxury-section {
		width: 100%;
		margin: 0;
		padding: 0;
		display: flex;
		min-height: 600px;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	.luxury-container {
		display: flex;
		width: 100%;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.luxury-image-wrapper {
		width: 40%;
		background-color: #e5e5e5;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60px 40px;
		position: relative;
		box-sizing: border-box;
	}

	.luxury-image {
		width: 100%;
		max-width: 500px;
		height: auto;
		object-fit: contain;
		border-radius: 12px;
		display: block;
	}

	.luxury-content {
		width: 60%;
		background-color: #e5e5e5;
		padding: 80px 60px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
	}

	.luxury-headline {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 32px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.luxury-headline em {
		font-style: italic;
		font-weight: 400;
	}

	.luxury-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.125rem);
		color: #160b11;
		margin: 0 0 24px 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.luxury-text:last-of-type {
		margin-bottom: 40px;
	}

	.about-btn {
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		padding: 14px 32px;
		border-radius: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		letter-spacing: 0.01em;
		align-self: flex-start;
	}

	.about-btn:hover {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.about-btn:active {
		transform: translateY(0);
	}

	@media (max-width: 1024px) {
		.luxury-image-wrapper {
			padding: 50px 30px;
		}

		.luxury-content {
			padding: 60px 40px;
		}
	}

	@media (max-width: 768px) {
		.luxury-section {
			flex-direction: column;
			min-height: auto;
		}

		.luxury-container {
			flex-direction: column;
		}

		.luxury-image-wrapper {
			width: 100%;
			padding: 40px 20px;
			order: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
		}

		.luxury-image {
			width: auto;
			max-width: 100%;
			height: auto;
			margin: 0 auto;
			object-fit: contain;
			display: block;
		}

		.luxury-content {
			width: 100%;
			padding: 50px 30px;
			order: 2;
			box-sizing: border-box;
			text-align: start;
			align-items: flex-start;
		}

		.luxury-headline {
			margin: 0 0 24px 0;
			text-align: start;
		}

		.luxury-text {
			margin: 0 0 20px 0;
			text-align: start;
		}

		.luxury-text:last-of-type {
			margin-bottom: 32px;
		}

		.about-btn {
			width: 100%;
			max-width: 300px;
			align-self: center;
		}
	}

	@media (max-width: 480px) {
		.luxury-image-wrapper {
			padding: 30px 15px;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
		}

		.luxury-image {
			width: auto;
			max-width: 100%;
			height: auto;
			object-fit: contain;
			display: block;
			margin: 0 auto;
		}

		.luxury-content {
			padding: 40px 20px;
			box-sizing: border-box;
		}

		.luxury-text {
			font-size: 0.95rem;
		}
	}

	.sell-source-section {
		width: 100%;
		margin: 0;
		padding: 0;
		display: flex;
		min-height: 600px;
	}

	.sell-source-container {
		display: flex;
		width: 100%;
		margin: 0;
		padding: 0;
	}

	.sell-source-image-wrapper {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
	}

	.sell-source-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.sell-source-content {
		width: 50%;
		background-color: #422635;
		padding: 80px 60px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
	}

	.sell-source-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 32px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.sell-source-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.125rem);
		color: #ffffff;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		margin: 0 0 40px 0;
	}

	.sell-source-links {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.sell-source-link {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		color: #ffffff;
		text-decoration: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		font-weight: 400;
		letter-spacing: 0.01em;
		transition: all 0.3s ease;
	}

	.sell-source-link:hover {
		opacity: 0.8;
		gap: 16px;
	}

	.sell-source-link .arrow {
		font-size: 1.2em;
		transition: transform 0.3s ease;
	}

	.sell-source-link:hover .arrow {
		transform: translateX(4px);
	}

	@media (max-width: 1024px) {
		.sell-source-content {
			padding: 60px 40px;
		}
	}

	@media (max-width: 768px) {
		.sell-source-section {
			flex-direction: column;
			min-height: auto;
		}

		.sell-source-container {
			flex-direction: column;
		}

		.sell-source-image-wrapper {
			width: 100%;
			order: 2;
			min-height: 400px;
		}

		.sell-source-content {
			width: 100%;
			padding: 50px 30px;
			order: 1;
		}

		.sell-source-heading {
			margin: 0 0 24px 0;
		}

		.sell-source-text {
			margin: 0 0 32px 0;
		}

		.sell-source-links {
			gap: 20px;
		}
	}

	@media (max-width: 480px) {
		.sell-source-image-wrapper {
			min-height: 300px;
		}

		.sell-source-content {
			padding: 40px 20px;
		}

		.sell-source-text {
			font-size: 0.95rem;
		}
	}

	.brands-section {
		width: 100%;
		margin: 0;
		padding: 0;
		display: flex;
	}

	.brands-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		width: 100%;
		margin: 0;
		padding: 0;
	}

	.brand-card {
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.3s ease;
		min-height: 500px;
	}

	.brand-card:hover {
		transform: scale(1.02);
		z-index: 1;
	}

	.brand-image-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.brand-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.3s ease;
	}

	.brand-card:hover .brand-image {
		transform: scale(1.05);
	}

	.brand-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 30px 24px;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%);
	}

	.brand-name {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.5rem, 2.5vw, 2.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 8px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.brand-description {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(0.875rem, 1.2vw, 1.125rem);
		font-weight: 300;
		color: #ffffff;
		margin: 0;
		line-height: 1.4;
		letter-spacing: 0.01em;
		opacity: 0.95;
	}

	@media (max-width: 1024px) {
		.brands-container {
			grid-template-columns: repeat(2, 1fr);
		}

		.brand-content {
			padding: 24px 20px;
		}
	}

	@media (max-width: 768px) {
		.brands-container {
			grid-template-columns: 1fr;
		}

		.brand-card {
			min-height: 400px;
		}

		.brand-content {
			padding: 30px 24px;
		}
	}

	@media (max-width: 480px) {
		.brand-card {
			min-height: 350px;
		}

		.brand-content {
			padding: 24px 20px;
		}
	}

	.expertise-section {
		width: 100%;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		background-color: #160b11;
	}


	.expertise-content {
		width: 100%;
		background-color: #160b11;
		padding: 80px 60px;
		box-sizing: border-box;
		position: relative;
	}

	.expertise-content::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background-color: rgba(255, 255, 255, 0.3);
	}

	.expertise-container {
		max-width: 1400px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		gap: 60px;
		align-items: start;
	}

	.expertise-column {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.expertise-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.5rem, 2.5vw, 2rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	.expertise-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.1vw, 1.0625rem);
		color: #ffffff;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		margin: 0;
	}

	.expertise-divider {
		width: 1px;
		background-color: rgba(255, 255, 255, 0.3);
		height: 100%;
		min-height: 100px;
	}

	@media (max-width: 1024px) {
		.expertise-content {
			padding: 60px 40px;
		}

		.expertise-container {
			gap: 40px;
		}
	}

	@media (max-width: 768px) {
		.expertise-content {
			padding: 50px 30px;
		}

		.expertise-container {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.expertise-divider {
			display: none;
		}

		.expertise-column {
			gap: 16px;
		}
	}

	@media (max-width: 480px) {
		.expertise-content {
			padding: 40px 20px;
		}

		.expertise-container {
			gap: 32px;
		}
	}

	/* ── API SECTION ── */
	/* ── API SECTION — Light theme ── */
	.api-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 680px;
		background-color: #ffffff;
	}

	/* ── Widget column ── */
	.api-widget-col {
		padding: 64px 48px;
		box-sizing: border-box;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.api-widget {
		width: 100%;
		background-color: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid rgba(22, 11, 17, 0.1);
		box-shadow:
			0 4px 16px rgba(22, 11, 17, 0.06),
			0 16px 48px rgba(22, 11, 17, 0.08);
	}

	/* Widget header bar — kept dark as a branded terminal chrome */
	.widget-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #422635;
		padding: 14px 20px;
		gap: 12px;
	}

	.widget-header-left {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.widget-brand-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #c9a230;
		flex-shrink: 0;
	}

	.widget-title {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.75);
	}

	.widget-header-right {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.widget-live {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background-color: rgba(74, 222, 128, 0.15);
		border: 1px solid rgba(74, 222, 128, 0.3);
		color: #4ade80;
		padding: 3px 10px;
		border-radius: 100px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
	}

	.widget-time {
		font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.72rem;
		color: rgba(255, 255, 255, 0.4);
		font-variant-numeric: tabular-nums;
	}

	/* Column headers */
	.widget-col-headers {
		display: grid;
		grid-template-columns: 1fr 100px 100px 64px;
		padding: 10px 20px;
		background-color: #faf8f5;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		gap: 8px;
	}

	.widget-col-headers span {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #b0a09a;
	}

	.widget-col-headers .align-right {
		text-align: right;
	}

	/* Data rows */
	.widget-rows {
		display: flex;
		flex-direction: column;
	}

	.widget-row {
		display: grid;
		grid-template-columns: 1fr 100px 100px 64px;
		padding: 13px 20px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.05);
		gap: 8px;
		align-items: center;
		transition: background-color 0.2s ease;
	}

	.widget-row:last-child {
		border-bottom: none;
	}

	.widget-row:hover {
		background-color: rgba(66, 38, 53, 0.03);
	}

	.widget-row--flash {
		animation: widgetFlash 0.7s ease-out;
	}

	@keyframes widgetFlash {
		0%   { background-color: rgba(201, 162, 48, 0.12); }
		100% { background-color: transparent; }
	}

	.widget-model {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #160b11;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.widget-ref {
		font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.75rem;
		color: #8a7570;
		background-color: rgba(66, 38, 53, 0.06);
		padding: 2px 7px;
		border-radius: 4px;
		width: fit-content;
	}

	.widget-price {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		color: #160b11;
		text-align: right;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.01em;
	}

	.widget-change {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.widget-change.positive { color: #16a34a; }
	.widget-change.negative { color: #dc2626; }

	/* Widget footer */
	.widget-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 20px;
		background-color: #faf8f5;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		gap: 8px;
		flex-wrap: wrap;
	}

	.widget-footer-label {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.widget-footer-note {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.68rem;
		color: #c0b4ae;
	}

	/* ── Content column ── */
	.api-content-col {
		padding: 80px 64px 80px 64px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
		background-color: #faf8f5;
		border-left: 1px solid rgba(22, 11, 17, 0.08);
	}

	/* Live badge — adapted for light background */
	.api-live-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background-color: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #16a34a;
		padding: 6px 14px;
		border-radius: 100px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 28px;
		width: fit-content;
	}

	.api-pulse-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: #22c55e;
		flex-shrink: 0;
		position: relative;
	}

	.api-pulse-dot::after {
		content: '';
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		background-color: #22c55e;
		opacity: 0.35;
		animation: apiPulse 1.8s ease-in-out infinite;
	}

	@keyframes apiPulse {
		0%, 100% { transform: scale(1); opacity: 0.35; }
		50%       { transform: scale(2); opacity: 0; }
	}

	/* Heading */
	.api-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 3.5vw, 3.25rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 24px 0;
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.api-heading em {
		font-style: italic;
		color: #a1846d;
	}

	/* Body */
	.api-body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: clamp(0.9375rem, 1.1vw, 1.0625rem);
		color: rgba(22, 11, 17, 0.65);
		line-height: 1.75;
		font-weight: 300;
		margin: 0 0 40px 0;
	}

	/* Feature list */
	.api-features {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-bottom: 44px;
	}

	.api-feature {
		display: flex;
		align-items: center;
		gap: 12px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.9rem;
		color: rgba(22, 11, 17, 0.7);
		font-weight: 400;
		line-height: 1.5;
	}

	.api-feature svg {
		color: #a1846d;
		flex-shrink: 0;
	}

	/* CTA */
	.api-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background-color: #422635;
		color: #ffffff;
		text-decoration: none;
		padding: 14px 32px;
		border-radius: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		align-self: flex-start;
		transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease, gap 0.25s ease;
	}

	.api-cta:hover {
		background-color: #2e1924;
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(66, 38, 53, 0.3);
		gap: 14px;
	}

	/* ── Responsive ── */
	@media (max-width: 1200px) {
		.widget-col-headers,
		.widget-row {
			grid-template-columns: 1fr 90px 90px 58px;
		}
	}

	@media (max-width: 1100px) {
		.api-widget-col {
			padding: 48px 36px;
		}

		.api-content-col {
			padding: 64px 48px 64px 48px;
		}
	}

	@media (max-width: 900px) {
		.api-section {
			grid-template-columns: 1fr;
			min-height: auto;
		}

		.api-widget-col {
			padding: 56px 40px 0;
		}

		.api-content-col {
			padding: 56px 40px 64px;
			border-left: none;
			border-top: 1px solid rgba(22, 11, 17, 0.08);
		}
	}

	@media (max-width: 640px) {
		.api-widget-col {
			padding: 40px 24px 0;
		}

		.api-content-col {
			padding: 44px 24px 56px;
		}

		.widget-col-headers,
		.widget-row {
			grid-template-columns: 1fr 80px 58px;
		}

		.widget-ref {
			display: none;
		}
	}
</style>
