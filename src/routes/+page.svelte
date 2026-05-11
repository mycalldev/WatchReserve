<script>
	import Button from '$lib/components/Button.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import NewArrivals from '$lib/components/NewArrivals.svelte';

	import ApiTrialModal from '$lib/components/ApiTrialModal.svelte';
	import { onMount, onDestroy } from 'svelte';

	let { data } = $props();

	const heroSlides = [
		'/assets/hero/rose_daytona.jpg',
		'/assets/hero/patek_slider.jpg',
		'/assets/hero/API_Hero.jpg'
	];

	let activeSlide = $state(0);
	let sliderInterval;

	onMount(() => {
		sliderInterval = setInterval(() => {
			activeSlide = (activeSlide + 1) % heroSlides.length;
		}, 3000);
	});

	onDestroy(() => {
		clearInterval(sliderInterval);
	});
</script>

<svelte:head>
	<script src="https://elfsightcdn.com/platform.js" async></script>
</svelte:head>

<ApiTrialModal />

<section class="hero-section">
	<!-- Slider images -->
	{#each heroSlides as src, i}
		<img
			{src}
			alt=""
			aria-hidden="true"
			class="hero-slide-img"
			class:hero-slide-img--active={i === activeSlide}
			fetchpriority={i === 0 ? 'high' : 'low'}
			loading={i === 0 ? 'eager' : 'lazy'}
		/>
	{/each}

	<!-- Overlay -->
	<div class="hero-overlay" aria-hidden="true"></div>

	<div class="hero-container">
		<div class="hero-content">
			<h1 class="hero-headline">
				Pre-Owned Rare Luxury Timepieces
			</h1>
			<p class="hero-subheadline">
				Explore investment-grade timepieces - sourced, authenticated, and delivered by a team who knows your time is valuable.
			</p>
			<div class="hero-actions">
				<Button href="/shop">Browse All Watches</Button>
			</div>
		</div>
	</div>

	<!-- Slide indicators -->
	<div class="hero-dots" aria-hidden="true">
		{#each heroSlides as _, i}
			<button
				class="hero-dot"
				class:hero-dot--active={i === activeSlide}
				onclick={() => { activeSlide = i; clearInterval(sliderInterval); sliderInterval = setInterval(() => { activeSlide = (activeSlide + 1) % heroSlides.length; }, 3000); }}
				tabindex="-1"
			></button>
		{/each}
	</div>
</section>

<!-- ── TRUSTPILOT BAR ── -->
<div class="tp-bar">
	<div class="tp-bar-inner">
		<div class="tp-main">
			<img src="/assets/trustpilot.png" alt="Trustpilot" class="tp-logo" />
			<div class="tp-divider" aria-hidden="true"></div>
			<div class="tp-rating">
				<div class="tp-stars" aria-label="4.8 out of 5 stars">
					<!-- 4 full stars -->
					{#each [1,2,3,4] as _}
						<span class="tp-star tp-star--full" aria-hidden="true">
							<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
						</span>
					{/each}
					<!-- 80% filled star via SVG linearGradient -->
					<span class="tp-star" aria-hidden="true">
						<svg viewBox="0 0 24 24" width="20" height="20">
							<defs>
								<linearGradient id="tp-partial-fill">
									<stop offset="80%" stop-color="#00b67a"/>
									<stop offset="80%" stop-color="#e0e0e0"/>
								</linearGradient>
							</defs>
							<path fill="url(#tp-partial-fill)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
					</span>
				</div>
				<p class="tp-score"><strong>4.8</strong> out of 5</p>
			</div>
			<div class="tp-divider" aria-hidden="true"></div>
			<p class="tp-label"><strong>Excellent</strong> — Rated by our customers</p>
		</div>
	</div>
</div>


<NewArrivals products={data.newArrivals} />

<!-- ── TRUST BANNER ── -->
<div class="trust-bar">
	<div class="trust-bar-inner">
		<div class="trust-item">
			<span class="trust-icon" aria-hidden="true">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
					<rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
				</svg>
			</span>
			<span class="trust-text">Insured Next Day Delivery</span>
		</div>

		<div class="trust-sep" aria-hidden="true"></div>

		<div class="trust-item">
			<span class="trust-icon" aria-hidden="true">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 7h18m0 0l-4-4m4 4l-4 4M21 17H3m0 0l4-4m-4 4l4 4"/>
				</svg>
			</span>
			<span class="trust-text">Part Exchange Available</span>
		</div>

		<div class="trust-sep" aria-hidden="true"></div>

		<div class="trust-item">
			<span class="trust-icon" aria-hidden="true">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
				</svg>
			</span>
			<span class="trust-text">Finance Available</span>
		</div>
	</div>
</div>

<section class="brands-section">
	<div class="brands-container">
		<a href="/collections/rolex" class="brand-card">
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
		</a>

		<a href="/collections/patek-philippe" class="brand-card">
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
		</a>

		<a href="/collections/audemars-piguet" class="brand-card">
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
		</a>

		<a href="/collections/curated-editions" class="brand-card">
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
		</a>
	</div>
</section>

<!-- ── API SECTION ── -->
<section class="api-section">
	<div class="api-widget-col">
		<div class="api-widget">

			<div class="widget-coming-badge">
				<span class="widget-brand-dot" aria-hidden="true"></span>
				Coming Soon
			</div>

			<h3 class="widget-coming-title">Watch Reserve Intelligence</h3>
			<p class="widget-coming-sub">
				A new kind of data layer — built exclusively for collectors who want to know more than just the price.
			</p>

			<ul class="widget-preview-list" aria-label="Upcoming data features">
				<li class="widget-preview-item">
					<span class="widget-preview-icon" aria-hidden="true">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
					</span>
					<span class="widget-preview-label">Real-Time Market Valuations</span>
					<span class="widget-preview-lock" aria-hidden="true">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
					</span>
				</li>
				<li class="widget-preview-item">
					<span class="widget-preview-icon" aria-hidden="true">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
					</span>
					<span class="widget-preview-label">Price History & Trend Analysis</span>
					<span class="widget-preview-lock" aria-hidden="true">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
					</span>
				</li>
				<li class="widget-preview-item">
					<span class="widget-preview-icon" aria-hidden="true">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
					</span>
					<span class="widget-preview-label">Rarity & Collector Demand Scores</span>
					<span class="widget-preview-lock" aria-hidden="true">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
					</span>
				</li>
				<li class="widget-preview-item">
					<span class="widget-preview-icon" aria-hidden="true">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
					</span>
					<span class="widget-preview-label">Provenance & Authentication Data</span>
					<span class="widget-preview-lock" aria-hidden="true">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
					</span>
				</li>
				<li class="widget-preview-item">
					<span class="widget-preview-icon" aria-hidden="true">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
					</span>
					<span class="widget-preview-label">Collection Portfolio Tracking</span>
					<span class="widget-preview-lock" aria-hidden="true">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
					</span>
				</li>
			</ul>

			<div class="widget-footer">
				<span class="widget-footer-label">Watch Reserve Intelligence</span>
				<span class="widget-footer-note">Members only · Joining soon</span>
			</div>

		</div>
	</div>
	<div class="api-content-col">
		<div class="api-live-badge">
			<span class="api-pulse-dot" aria-hidden="true"></span>
			Coming Soon
		</div>
		<h2 class="api-heading">
			Built for<br /><em>Collectors</em>
		</h2>
		<p class="api-body">
			The Watch Reserve Intelligence platform is coming. We're building something beyond pricing data: a complete collector intelligence layer covering rarity, provenance, market trends, and portfolio value, exclusively for members.
		</p>
		<a href="/api" class="api-cta">
			Join the Waiting List
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
		</a>
	</div>
</section>

<section class="sell-source-section">
	<div class="sell-source-container">
		<div class="sell-source-image-wrapper">
			<img
				src="/assets/lifestyle/Mulit_Watch2.avif"
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
				Whether you're looking to sell, part-exchange, or acquire a specific reference - our team is here to assist you.
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
				<a href="/part-exchange" class="sell-source-link">
					Part Exchange
					<span class="arrow">→</span>
				</a>
			</div>
		</div>
	</div>
</section>

<!-- ── ABOUT WATCH RESERVE ── -->
<section class="about-wr-section">
	<div class="about-wr-inner">

		<!-- Left: image -->
		<div class="about-wr-image">
			<img src="/assets/hero/Pepsi-Cards.jpg" alt="Rolex Pepsi GMT-Master II" loading="lazy" />
		</div>

		<!-- Centre: heading + copy + CTA -->
		<div class="about-wr-left">
			<h2 class="about-wr-heading">About Watch Reserve</h2>
			<p class="about-wr-body">
				Watch Reserve is a London-based boutique specialising in the acquisition, sale, and sourcing
				of pre-owned luxury timepieces. Operating from Canary Wharf, our team brings deep market
				knowledge and a genuine passion for horology to every transaction. Whether you are buying,
				selling, or looking to part-exchange, we offer a discreet, five-star service tailored to
				serious collectors and first-time buyers alike. We stock an exceptional range of timepieces
				from Rolex, Patek Philippe, Audemars Piguet, Richard Mille, Cartier, and more — all
				rigorously authenticated and fairly priced using live market data.
			</p>
			<a href="/about" class="about-wr-cta">
				Learn More About Us
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12h14M12 5l7 7-7 7"/>
				</svg>
			</a>
		</div>

		<!-- Right: feature list -->
		<div class="about-wr-right">
			<ul class="about-wr-features" aria-label="Our promises">
				<li class="about-wr-feature">
					<span class="about-wr-feature-icon" aria-hidden="true">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
						</svg>
					</span>
					<span>Insured Priority Delivery</span>
				</li>
				<li class="about-wr-feature">
					<span class="about-wr-feature-icon" aria-hidden="true">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
						</svg>
					</span>
					<span>24 Month Warranty</span>
				</li>
				<li class="about-wr-feature">
					<span class="about-wr-feature-icon" aria-hidden="true">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<path d="M6 19h12M6 14h7M9 19V11a4 4 0 0 1 4-4"/>
						</svg>
					</span>
					<span>Price Promise</span>
				</li>
				<li class="about-wr-feature">
					<span class="about-wr-feature-icon" aria-hidden="true">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
							<path d="M3 7h18m0 0l-4-4m4 4l-4 4M21 17H3m0 0l4-4m-4 4l4 4"/>
						</svg>
					</span>
					<span>Part Exchange</span>
				</li>
			</ul>
		</div>

	</div>
</section>


<!-- ── YOUTUBE SOCIAL PROOF ─────────────────────────────────────────── -->
<section class="yt-proof-section">
	<div class="yt-proof-inner">
		<div class="yt-proof-image-wrap">
			<div class="elfsight-app-11c56141-8a09-473f-82c0-2b8015f4a811" data-elfsight-app-lazy></div>
		</div>
		<div class="yt-proof-content">
			<p class="yt-proof-eyebrow">On YouTube</p>
			<h2 class="yt-proof-heading">Behind the collection</h2>
			<p class="yt-proof-text">
				Follow Watch Reserve on YouTube for an inside look at the collection. From condition walkthroughs and on-the-wrist reviews to the stories behind each reference, we share the detail that makes every piece worth owning.
			</p>
			<a
				href="https://www.youtube.com/@TheWatchReserve"
				target="_blank"
				rel="noopener noreferrer"
				class="yt-proof-cta"
				aria-label="Visit the Watch Reserve YouTube channel"
			>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
				</svg>
				Visit Our Channel
			</a>
		</div>
	</div>
</section>


<section class="reviews-section">
	<div class="elfsight-app-deaa2cf4-ebad-4bfa-83c3-47476e08ab47" data-elfsight-app-lazy></div>
</section>

<!-- ── INSTAGRAM SOCIAL PROOF ─────────────────────────────────────────── -->
<section class="ig-proof-section">
	<div class="ig-proof-inner">
		<div class="ig-proof-content">
			<p class="ig-proof-eyebrow">On Instagram</p>
			<h2 class="ig-proof-heading">Follow the collection</h2>
			<p class="ig-proof-text">
				Stay up to date with new arrivals, behind-the-scenes moments, and the stories behind every reference. Follow Watch Reserve on Instagram for a closer look at what makes each timepiece worth owning.
			</p>
			<a
				href="https://www.instagram.com/watchreserve.co/"
				target="_blank"
				rel="noopener noreferrer"
				class="ig-proof-cta"
				aria-label="Follow Watch Reserve on Instagram"
			>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<rect x="2" y="2" width="20" height="20" rx="5" />
					<circle cx="12" cy="12" r="4" />
					<circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
				</svg>
				Follow on Instagram
			</a>
		</div>
		<div class="ig-proof-embed-wrap">
			<div class="elfsight-app-faa54c63-89cb-4bbe-aa82-ff1ab0c58360" data-elfsight-app-lazy></div>
		</div>
	</div>
</section>


<style>
	.hero-section {
		position: relative;
		width: 100%;
		min-height: 80vh;
		display: flex;
		align-items: center;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.hero-slide-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		opacity: 0;
		transition: opacity 1s ease;
		z-index: 0;
	}

	.hero-slide-img--active {
		opacity: 1;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.7) 0%,
			rgba(0, 0, 0, 0.4) 50%,
			rgba(0, 0, 0, 0.1) 100%
		);
		z-index: 1;
	}

	.hero-dots {
		position: absolute;
		bottom: 28px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 10px;
		z-index: 3;
	}

	.hero-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.4);
		border: none;
		padding: 0;
		cursor: pointer;
		transition: background-color 0.3s ease, transform 0.3s ease;
	}

	.hero-dot--active {
		background-color: #ffffff;
		transform: scale(1.25);
	}

	.hero-container {
		position: relative;
		z-index: 2;
		width: 100%;
		pointer-events: none;
		max-width: 1400px;
		margin: 0 auto;
		padding: 100px 0;
	}

	.hero-content {
		max-width: 600px;
		width: 100%;
		padding-left: 40px;
		box-sizing: border-box;
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
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1rem, 1.5vw, 1.125rem);
		color: #ffffff;
		margin: 0 0 48px 0;
		line-height: 1.7;
		font-weight: 400;
		letter-spacing: 0.01em;
		text-align: left;
		opacity: 0.95;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 24px;
		flex-wrap: wrap;
		pointer-events: all;
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
			padding-right: 20px;
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
		}

		.hero-actions :global(.button) {
			box-sizing: border-box;
			max-width: 240px;
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
			padding-right: 20px;
		}
	}

	/* ── TRUSTPILOT BAR ── */
	.tp-bar {
		width: 100%;
		background: #ffffff;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		padding: 18px 40px;
		box-sizing: border-box;
	}

	.tp-bar-inner {
		max-width: 1240px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
	}

	.tp-main {
		display: flex;
		align-items: center;
		gap: 28px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.tp-logo {
		height: 28px;
		width: auto;
		display: block;
		flex-shrink: 0;
	}

	.tp-divider {
		width: 1px;
		height: 28px;
		background: rgba(22, 11, 17, 0.1);
		flex-shrink: 0;
	}

	.tp-rating {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.tp-stars {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	.tp-star--full {
		color: #00b67a;
	}


	.tp-score {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		margin: 0;
		white-space: nowrap;
	}

	.tp-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: rgba(22, 11, 17, 0.6);
		margin: 0;
		white-space: nowrap;
	}

	.tp-label strong {
		color: #160b11;
		font-weight: 600;
	}

	@media (max-width: 640px) {
		.tp-bar { padding: 16px 20px; }
		.tp-divider { display: none; }
		.tp-main { gap: 14px; }
		.tp-label { display: none; }
		.tp-logo { height: 22px; }
	}

	/* ── TRUST BANNER ── */
	.trust-bar {
		width: 100%;
		background: #ffffff;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		padding: 18px 40px;
		box-sizing: border-box;
	}

	.trust-bar-inner {
		max-width: 1240px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
	}

	.trust-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 40px;
		flex: 1;
		justify-content: center;
	}

	.trust-icon {
		color: #a1846d;
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.trust-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #160b11;
		white-space: nowrap;
	}

	.trust-text sup {
		font-size: 0.6em;
		vertical-align: super;
	}

	.trust-sep {
		display: none;
	}

	@media (max-width: 768px) {
		.trust-bar { padding: 16px 20px; }
		.trust-item { padding: 0 20px; }
		.trust-text { font-size: 0.72rem; letter-spacing: 0.04em; }
	}

	@media (max-width: 540px) {
		.trust-bar-inner { flex-direction: column; gap: 14px; }
		.trust-sep { display: none; }
		.trust-item { padding: 0; width: 100%; justify-content: center; }
	}


	/* ── ABOUT WATCH RESERVE ── */
	.about-wr-section {
		width: 100%;
		background: #ffffff;
		padding: 64px 60px;
		box-sizing: border-box;
		border-top: 1px solid rgba(22, 11, 17, 0.06);
	}

	.about-wr-inner {
		max-width: 1240px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1.2fr 1fr;
		gap: 64px;
		align-items: center;
	}

	.about-wr-image {
		aspect-ratio: 4 / 5;
		overflow: hidden;
		border: 1px solid rgba(161, 132, 109, 0.2);
	}

	.about-wr-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.about-wr-right {
		padding-left: 0;
		border-left: 1px solid rgba(22, 11, 17, 0.08);
		padding-left: 40px;
	}

	.about-wr-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.8rem, 3vw, 2.6rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 28px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.about-wr-body {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.875rem, 1.1vw, 0.9375rem);
		color: rgba(22, 11, 17, 0.65);
		line-height: 1.8;
		font-weight: 300;
		margin: 0 0 40px 0;
	}

	.about-wr-features {
		list-style: none;
		margin: 0 0 40px 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
		border-top: 1px solid rgba(22, 11, 17, 0.08);
	}

	.about-wr-feature {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px 0;
		border-bottom: 1px solid rgba(22, 11, 17, 0.08);
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #160b11;
		letter-spacing: 0.01em;
	}

	.about-wr-feature-icon {
		width: 40px;
		height: 40px;
		border: 1px solid rgba(161, 132, 109, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #a1846d;
		flex-shrink: 0;
		background: rgba(161, 132, 109, 0.04);
	}

	.about-wr-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
		text-decoration: none;
		transition: gap 0.2s ease, color 0.2s ease;
	}

	.about-wr-cta:hover { gap: 14px; color: #8a6f59; }

	@media (max-width: 1024px) {
		.about-wr-section { padding: 52px 40px; }
		.about-wr-inner { grid-template-columns: 1fr 1fr; gap: 40px; }
		.about-wr-image { display: none; }
		.about-wr-right { padding-left: 32px; }
	}

	@media (max-width: 768px) {
		.about-wr-section { padding: 48px 28px; }
		.about-wr-inner { grid-template-columns: 1fr; gap: 40px; }
		.about-wr-right { padding-left: 0; border-left: none; padding-top: 0; border-top: 1px solid rgba(22, 11, 17, 0.08); padding-top: 40px; }
	}

	@media (max-width: 480px) {
		.about-wr-section { padding: 40px 20px; }
	}

	/* ── YouTube social proof ─────────────────────────────── */
	.yt-proof-section {
		width: 100%;
		background-color: #faf8f6;
		padding: 100px 40px;
		border-top: 1px solid rgba(161, 132, 109, 0.15);
		border-bottom: 1px solid rgba(161, 132, 109, 0.15);
		box-sizing: border-box;
	}

	.yt-proof-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 72px;
		align-items: center;
	}

	.yt-proof-image-wrap {
		position: relative;
		width: 100%;
		background-color: #ffffff;
		border: 1px solid rgba(22, 11, 17, 0.08);
		box-shadow: 0 18px 48px rgba(22, 11, 17, 0.1), 0 4px 16px rgba(22, 11, 17, 0.06);
		overflow: hidden;
	}

	.yt-proof-image-wrap :global([class^='elfsight-app-']) {
		width: 100%;
	}

	.yt-proof-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.yt-proof-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.yt-proof-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.875rem, 3.2vw, 2.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.2;
		letter-spacing: -0.015em;
	}

	.yt-proof-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.95rem, 1.05vw, 1.0625rem);
		line-height: 1.75;
		color: #3a2a31;
		font-weight: 300;
		margin: 0;
	}

	.yt-proof-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 12px;
		padding: 14px 26px;
		background-color: #160b11;
		color: #ffffff;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		border: 1px solid #160b11;
		align-self: flex-start;
		transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
	}

	.yt-proof-cta:hover {
		background-color: #c9252c;
		border-color: #c9252c;
	}

	.yt-proof-cta svg {
		flex-shrink: 0;
	}

	@media (max-width: 960px) {
		.yt-proof-section { padding: 80px 32px; }
		.yt-proof-inner {
			grid-template-columns: 1fr;
			gap: 48px;
		}
	}

	@media (max-width: 600px) {
		.yt-proof-section { padding: 64px 20px; }
		.yt-proof-inner { gap: 36px; }
	}

	/* ── Instagram social proof (Elfsight widget) ─────────────── */
	.ig-proof-section {
		width: 100%;
		background-color: #ffffff;
		padding: 100px 40px;
		border-bottom: 1px solid rgba(161, 132, 109, 0.15);
		box-sizing: border-box;
	}

	.ig-proof-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1.2fr;
		gap: 72px;
		align-items: center;
	}

	.ig-proof-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.ig-proof-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.ig-proof-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.875rem, 3.2vw, 2.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.2;
		letter-spacing: -0.015em;
	}

	.ig-proof-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.95rem, 1.05vw, 1.0625rem);
		line-height: 1.75;
		color: #3a2a31;
		font-weight: 300;
		margin: 0;
	}

	.ig-proof-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 12px;
		padding: 14px 26px;
		background-color: #160b11;
		color: #ffffff;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		border: 1px solid #160b11;
		align-self: flex-start;
		transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
	}

	.ig-proof-cta:hover {
		background-color: #a1846d;
		border-color: #a1846d;
	}

	.ig-proof-cta svg { flex-shrink: 0; }

	.ig-proof-embed-wrap {
		position: relative;
		width: 100%;
		background-color: #faf8f6;
		border: 1px solid rgba(22, 11, 17, 0.08);
		box-shadow: 0 18px 48px rgba(22, 11, 17, 0.1), 0 4px 16px rgba(22, 11, 17, 0.06);
		overflow: hidden;
	}

	.ig-proof-embed-wrap :global([class^='elfsight-app-']) {
		width: 100%;
	}

	@media (max-width: 960px) {
		.ig-proof-section { padding: 80px 32px; }
		.ig-proof-inner {
			grid-template-columns: 1fr;
			gap: 48px;
		}
		.ig-proof-embed-wrap { order: -1; }
	}

	@media (max-width: 600px) {
		.ig-proof-section { padding: 64px 20px; }
		.ig-proof-inner { gap: 36px; }
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
		font-family: 'Montserrat', sans-serif;
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
		border-top: 1px solid rgba(255, 255, 255, 0.15);
	}

	.sell-source-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #ffffff;
		text-decoration: none;
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.875rem, 1.1vw, 1rem);
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 20px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
		transition: padding-left 0.3s ease, color 0.3s ease;
	}

	.sell-source-link:hover {
		padding-left: 8px;
		color: #a1846d;
	}

	.sell-source-link .arrow {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		flex-shrink: 0;
		font-size: 0.9em;
		transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
	}

	.sell-source-link:hover .arrow {
		background-color: #a1846d;
		border-color: #a1846d;
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
			gap: 0;
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
		min-height: 500px;
		text-decoration: none;
		color: inherit;
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
		font-family: 'Montserrat', sans-serif;
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

	/* ── REVIEWS SECTION ── */
	.reviews-section {
		width: 100%;
		background-color: #ffffff;
		padding: 80px 40px;
		box-sizing: border-box;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
	}

	@media (max-width: 768px) {
		.reviews-section { padding: 60px 20px; }
	}

	@media (max-width: 480px) {
		.reviews-section { padding: 48px 16px; }
	}

	/* ── API SECTION ── */
	.api-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 0;
		background-color: #ffffff;
	}

	/* ── Widget column ── */
	.api-widget-col {
		padding: 72px 48px;
		box-sizing: border-box;
		background-color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.api-widget {
		width: 100%;
		background-color: #ffffff;
		overflow: hidden;
		border: 1px solid rgba(22, 11, 17, 0.1);
		box-shadow:
			0 4px 16px rgba(22, 11, 17, 0.06),
			0 16px 48px rgba(22, 11, 17, 0.08);
		display: flex;
		flex-direction: column;
		padding: 36px 32px 28px;
		gap: 0;
	}

	.widget-coming-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background-color: rgba(161, 132, 109, 0.1);
		border: 1px solid rgba(161, 132, 109, 0.3);
		color: #a1846d;
		padding: 5px 14px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		width: fit-content;
		margin-bottom: 22px;
	}

	.widget-brand-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: #a1846d;
		flex-shrink: 0;
		animation: apiPulse 2s ease-in-out infinite;
	}

	.widget-coming-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.25rem, 2vw, 1.625rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 12px 0;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	.widget-coming-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #6b5c55;
		line-height: 1.7;
		font-weight: 300;
		margin: 0 0 28px 0;
	}

	.widget-preview-list {
		list-style: none;
		margin: 0 0 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
	}

	.widget-preview-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 13px 0;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
	}

	.widget-preview-icon {
		color: #a1846d;
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	.widget-preview-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.85rem;
		font-weight: 400;
		color: #160b11;
		flex: 1;
	}

	.widget-preview-lock {
		color: rgba(22, 11, 17, 0.2);
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	/* Widget footer */
	.widget-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 0 0;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 4px;
	}

	.widget-footer-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.widget-footer-note {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		color: #c0b4ae;
	}

	/* ── Content column ── */
	.api-content-col {
		padding: 72px 64px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
		background-color: #ffffff;
	}

	.api-live-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background-color: rgba(161, 132, 109, 0.08);
		border: 1px solid rgba(161, 132, 109, 0.25);
		color: #a1846d;
		padding: 6px 14px;
		font-family: 'Montserrat', sans-serif;
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
		background-color: #a1846d;
		flex-shrink: 0;
		position: relative;
	}

	.api-pulse-dot::after {
		content: '';
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		background-color: #a1846d;
		opacity: 0.35;
		animation: apiPulse 1.8s ease-in-out infinite;
	}

	@keyframes apiPulse {
		0%, 100% { transform: scale(1); opacity: 0.35; }
		50%       { transform: scale(2); opacity: 0; }
	}

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

	.api-body {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9375rem, 1.1vw, 1.0625rem);
		color: rgba(22, 11, 17, 0.65);
		line-height: 1.75;
		font-weight: 300;
		margin: 0 0 40px 0;
	}

	.api-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		background-color: #a1846d;
		color: #ffffff;
		text-decoration: none;
		padding: 14px 32px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		align-self: flex-start;
		transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease, gap 0.25s ease;
	}

	.api-cta:hover {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(161, 132, 109, 0.3);
		gap: 14px;
	}

	/* ── Responsive ── */
	@media (max-width: 1100px) {
		.api-widget-col { padding: 48px 36px; }
		.api-content-col { padding: 64px 48px; }
	}

	@media (max-width: 900px) {
		.api-section {
			grid-template-columns: 1fr;
			min-height: auto;
		}
		.api-widget-col { padding: 56px 40px 0; }
		.api-content-col {
			padding: 56px 40px 64px;
			border-top: 1px solid rgba(22, 11, 17, 0.08);
		}
	}

	@media (max-width: 640px) {
		.api-widget-col { padding: 40px 24px 0; }
		.api-content-col { padding: 44px 24px 56px; }
	}
</style>
