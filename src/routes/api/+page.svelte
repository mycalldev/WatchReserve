<script>
	import { onMount, onDestroy } from 'svelte';

	const BASE_DATA = [
		{ id: 1, brand: 'Rolex', model: 'Submariner Date', ref: '126610LN', basePrice: 12800, volume: 143 },
		{ id: 2, brand: 'Rolex', model: 'Daytona', ref: '116500LN', basePrice: 28500, volume: 87 },
		{ id: 3, brand: 'Rolex', model: 'GMT-Master II', ref: '126710BLNR', basePrice: 16200, volume: 112 },
		{ id: 4, brand: 'Patek Philippe', model: 'Nautilus', ref: '5711/1A', basePrice: 115000, volume: 21 },
		{ id: 5, brand: 'Patek Philippe', model: 'Aquanaut', ref: '5168G', basePrice: 68000, volume: 34 },
		{ id: 6, brand: 'Audemars Piguet', model: 'Royal Oak', ref: '15500ST', basePrice: 42000, volume: 56 },
		{ id: 7, brand: 'Audemars Piguet', model: 'Royal Oak Offshore', ref: '26400SO', basePrice: 38500, volume: 44 },
		{ id: 8, brand: 'Richard Mille', model: 'RM 11-03', ref: 'RM11-03', basePrice: 185000, volume: 8 }
	];

	function randomVariance(base, pct = 0.008) {
		const delta = base * pct * (Math.random() * 2 - 1);
		return Math.round(base + delta);
	}

	function buildRow(item) {
		const price = randomVariance(item.basePrice);
		const change = parseFloat(((price - item.basePrice) / item.basePrice * 100).toFixed(2));
		return {
			...item,
			price,
			change,
			updated: true
		};
	}

	let feed = $state(BASE_DATA.map(buildRow));
	let lastUpdated = $state(new Date());
	let tickCount = $state(0);

	let interval;

	onMount(() => {
		interval = setInterval(() => {
			const idx = Math.floor(Math.random() * feed.length);
			feed = feed.map((row, i) => {
				if (i === idx) return buildRow(BASE_DATA[i]);
				return { ...row, updated: false };
			});
			lastUpdated = new Date();
			tickCount += 1;
		}, 2200);
	});

	onDestroy(() => clearInterval(interval));

	function formatPrice(n) {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(n);
	}

	function formatTime(d) {
		return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	}

	const FEATURES = [
		{
			icon: 'M13 10V3L4 14h7v7l9-11h-7z',
			title: 'Real-Time Pricing',
			desc: 'Sub-second price updates sourced from verified dealer transactions and auction results globally.'
		},
		{
			icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
			title: 'Historical Trends',
			desc: 'Up to 15 years of price history per reference. Track appreciation, depreciation, and market cycles.'
		},
		{
			icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
			title: 'Deep Reference Coverage',
			desc: 'Over 40,000 references across 200+ brands. Filter by model, material, year, and condition.'
		},
		{
			icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
			title: 'Market Alerts',
			desc: 'Webhook and email alerts when references breach your defined price thresholds.'
		},
		{
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			title: 'Authenticated Data',
			desc: 'Every data point is cross-referenced and verified. No scraped estimates — dealer-grade accuracy.'
		},
		{
			icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
			title: 'RESTful & GraphQL',
			desc: 'Clean, well-documented endpoints. SDKs for JavaScript, Python, and Ruby. OpenAPI spec included.'
		}
	];

	let signupEmail = $state('');
	let signupSubmitted = $state(false);

	function handleSignup(e) {
		e.preventDefault();
		if (signupEmail.trim()) {
			signupSubmitted = true;
		}
	}
</script>

<svelte:head>
	<title>Watch Reserve API — Watch Reserve</title>
	<meta name="description" content="Real-time luxury watch market data API. Track prices, trends, and valuations across 40,000+ references." />
</svelte:head>

<main class="api-page">

	<!-- ── HERO ── -->
	<section class="hero">
		<div class="hero-grid-bg" aria-hidden="true"></div>
		<div class="hero-inner">
			<div class="hero-badge">
				<span class="pulse-dot" aria-hidden="true"></span>
				Live Market Data
			</div>
			<h1 class="hero-title">Watch Reserve <em>Intelligence</em> API</h1>
			<p class="hero-sub">
				Real-time pricing, historical trends, and deep reference data for the global luxury watch market.
				Built for dealers, collectors, and platforms.
			</p>
			<div class="hero-actions">
				<a href="#signup" class="btn-primary">Get API Access</a>
				<a href="#data-feed" class="btn-ghost">View Live Data</a>
			</div>
		</div>
	</section>

	<!-- ── LIVE FEED ── -->
	<section class="feed-section" id="data-feed">
		<div class="feed-container">
			<div class="feed-header">
				<div class="feed-title-group">
					<h2 class="section-title">Live Market Feed</h2>
					<p class="section-sub">Prices update in real time. Data shown is illustrative.</p>
				</div>
				<div class="feed-meta">
					<span class="live-badge">
						<span class="pulse-dot small" aria-hidden="true"></span>
						LIVE
					</span>
					<span class="feed-timestamp">Last updated: {formatTime(lastUpdated)}</span>
				</div>
			</div>

			<div class="table-wrapper">
				<table class="feed-table">
					<thead>
						<tr>
							<th>Brand</th>
							<th>Model</th>
							<th>Reference</th>
							<th class="right">Market Price</th>
							<th class="right">24h Change</th>
							<th class="right">Volume</th>
						</tr>
					</thead>
					<tbody>
						{#each feed as row (row.id)}
							<tr class:flash={row.updated}>
								<td class="brand-cell">{row.brand}</td>
								<td class="model-cell">{row.model}</td>
								<td class="ref-cell"><code>{row.ref}</code></td>
								<td class="right price-cell">{formatPrice(row.price)}</td>
								<td class="right change-cell" class:positive={row.change >= 0} class:negative={row.change < 0}>
									<span class="change-arrow">{row.change >= 0 ? '▲' : '▼'}</span>
									{Math.abs(row.change)}%
								</td>
								<td class="right volume-cell">{row.volume}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<p class="feed-note">
				* Prices are indicative market estimates for demonstration purposes only. Sign up for authenticated, dealer-verified data.
			</p>
		</div>
	</section>

	<!-- ── FEATURES ── -->
	<section class="features-section">
		<div class="features-container">
			<div class="section-header">
				<h2 class="section-title">Everything You Need</h2>
				<p class="section-sub">A complete data infrastructure for the luxury watch market.</p>
			</div>
			<div class="features-grid">
				{#each FEATURES as feat}
					<div class="feature-card">
						<div class="feature-icon-wrap">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
								<path d={feat.icon} />
							</svg>
						</div>
						<h3 class="feature-title">{feat.title}</h3>
						<p class="feature-desc">{feat.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── SIGNUP ── -->
	<section class="signup-section" id="signup">
		<div class="signup-container">
			<div class="signup-content">
				<h2 class="signup-title">Get Early Access</h2>
				<p class="signup-sub">
					Join the waitlist and be the first to access the Watch Reserve Market API.
					Early members receive 3 months of Professional tier at no cost.
				</p>
				{#if signupSubmitted}
					<div class="signup-success">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						You're on the list. We'll be in touch soon.
					</div>
				{:else}
					<form class="signup-form" onsubmit={handleSignup}>
						<input
							type="email"
							class="signup-input"
							placeholder="your@email.com"
							bind:value={signupEmail}
							required
							aria-label="Email address"
						/>
						<button type="submit" class="btn-primary signup-btn">Request Access</button>
					</form>
					<p class="signup-note">No credit card required. Cancel anytime.</p>
				{/if}
			</div>
		</div>
	</section>

</main>

<style>
	/* ── BASE ── */
	.api-page {
		width: 100%;
		background-color: #ffffff;
	}

	.section-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 3.5vw, 3rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 12px 0;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.section-title.light { color: #ffffff; }

	.section-sub {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.3vw, 1.1rem);
		color: #666;
		margin: 0;
		line-height: 1.7;
	}

	.section-sub.light { color: rgba(255,255,255,0.7); }

	.section-header {
		text-align: center;
		margin-bottom: 60px;
	}

	.section-header .section-sub {
		margin-top: 12px;
	}

	/* ── BUTTONS ── */
	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: #a1846d;
		color: #ffffff;
		text-decoration: none;
		border: none;
		padding: 14px 32px;
		border-radius: 8px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9375rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		cursor: pointer;
		transition: background-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
		white-space: nowrap;
	}

	.btn-primary:hover {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(161, 132, 109, 0.35);
	}

	.btn-ghost {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		color: #ffffff;
		text-decoration: none;
		border: 1px solid rgba(255,255,255,0.4);
		padding: 14px 32px;
		border-radius: 8px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9375rem;
		font-weight: 400;
		cursor: pointer;
		transition: border-color 0.25s ease, background-color 0.25s ease;
		white-space: nowrap;
	}

	.btn-ghost:hover {
		border-color: rgba(255,255,255,0.8);
		background-color: rgba(255,255,255,0.08);
	}

	/* ── PULSE DOT ── */
	.pulse-dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #4ade80;
		position: relative;
		flex-shrink: 0;
	}

	.pulse-dot::after {
		content: '';
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		background-color: #4ade80;
		opacity: 0.35;
		animation: pulse 1.8s ease-in-out infinite;
	}

	.pulse-dot.small {
		width: 6px;
		height: 6px;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); opacity: 0.35; }
		50% { transform: scale(1.7); opacity: 0; }
	}

	/* ── HERO ── */
	.hero {
		position: relative;
		background-color: #160b11;
		padding: 100px 40px 90px;
		overflow: hidden;
	}

	.hero-grid-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
		background-size: 60px 60px;
		pointer-events: none;
	}

	.hero-inner {
		position: relative;
		z-index: 1;
		max-width: 860px;
		margin: 0 auto;
		text-align: center;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background-color: rgba(74, 222, 128, 0.12);
		border: 1px solid rgba(74, 222, 128, 0.25);
		color: #4ade80;
		padding: 6px 16px;
		border-radius: 100px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8125rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		margin-bottom: 28px;
	}

	.hero-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5.5vw, 4.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 24px 0;
		line-height: 1.15;
		letter-spacing: -0.025em;
	}

	.hero-title em {
		font-style: italic;
		color: #a1846d;
	}

	.hero-sub {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(1rem, 1.5vw, 1.2rem);
		color: rgba(255,255,255,0.65);
		margin: 0 auto 40px;
		max-width: 680px;
		line-height: 1.75;
		font-weight: 300;
	}

	.hero-actions {
		display: flex;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
	}


	/* ── LIVE FEED ── */
	.feed-section {
		background-color: #fafaf9;
		padding: 80px 40px;
	}

	.feed-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.feed-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 32px;
		gap: 20px;
		flex-wrap: wrap;
	}

	.feed-title-group .section-title {
		margin-bottom: 6px;
	}

	.feed-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		flex-shrink: 0;
	}

	.live-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background-color: rgba(74, 222, 128, 0.1);
		border: 1px solid rgba(74, 222, 128, 0.2);
		color: #16a34a;
		padding: 4px 12px;
		border-radius: 100px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
	}

	.feed-timestamp {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8rem;
		color: #999;
		font-variant-numeric: tabular-nums;
	}

	.table-wrapper {
		overflow-x: auto;
		border-radius: 12px;
		border: 1px solid rgba(22, 11, 17, 0.08);
		box-shadow: 0 2px 12px rgba(0,0,0,0.04);
	}

	.feed-table {
		width: 100%;
		border-collapse: collapse;
		background-color: #ffffff;
		border-radius: 12px;
		overflow: hidden;
		min-width: 640px;
	}

	.feed-table thead tr {
		background-color: #160b11;
	}

	.feed-table th {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255,255,255,0.6);
		padding: 14px 20px;
		text-align: left;
		white-space: nowrap;
	}

	.feed-table th.right { text-align: right; }

	.feed-table tbody tr {
		border-bottom: 1px solid rgba(22, 11, 17, 0.06);
		transition: background-color 0.2s ease;
	}

	.feed-table tbody tr:last-child { border-bottom: none; }

	.feed-table tbody tr:hover {
		background-color: rgba(161, 132, 109, 0.04);
	}

	.feed-table tbody tr.flash {
		animation: rowFlash 0.6s ease-out;
	}

	@keyframes rowFlash {
		0% { background-color: rgba(161, 132, 109, 0.15); }
		100% { background-color: transparent; }
	}

	.feed-table td {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9rem;
		color: #160b11;
		padding: 16px 20px;
		text-align: left;
		white-space: nowrap;
	}

	.feed-table td.right { text-align: right; }

	.brand-cell {
		font-weight: 600;
		color: #160b11 !important;
	}

	.model-cell { color: #444 !important; }

	.ref-cell code {
		background-color: rgba(22, 11, 17, 0.06);
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 0.8125rem;
		font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
		color: #160b11;
	}

	.price-cell {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.01em;
	}

	.change-cell {
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}

	.change-cell.positive { color: #16a34a; }
	.change-cell.negative { color: #dc2626; }

	.change-arrow {
		font-size: 0.65rem;
		margin-right: 2px;
	}

	.volume-cell { color: #888 !important; }

	.feed-note {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8rem;
		color: #aaa;
		margin: 20px 0 0 0;
		text-align: center;
	}

	/* ── FEATURES ── */
	.features-section {
		background-color: #ffffff;
		padding: 90px 40px;
	}

	.features-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
	}

	.feature-card {
		padding: 32px;
		border: 1px solid rgba(22, 11, 17, 0.08);
		border-radius: 16px;
		transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
	}

	.feature-card:hover {
		box-shadow: 0 8px 32px rgba(0,0,0,0.07);
		transform: translateY(-4px);
		border-color: rgba(161, 132, 109, 0.3);
	}

	.feature-icon-wrap {
		width: 44px;
		height: 44px;
		background-color: rgba(161, 132, 109, 0.1);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #a1846d;
		margin-bottom: 20px;
	}

	.feature-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.125rem;
		font-weight: 400;
		color: #160b11;
		margin: 0 0 10px 0;
		line-height: 1.3;
	}

	.feature-desc {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9rem;
		color: #666;
		margin: 0;
		line-height: 1.65;
	}

	/* ── SIGNUP ── */
	.signup-section {
		background-color: #422635;
		padding: 90px 40px;
	}

	.signup-container {
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
	}

	.signup-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 16px 0;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.signup-sub {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.3vw, 1.05rem);
		color: rgba(255,255,255,0.7);
		margin: 0 0 40px 0;
		line-height: 1.7;
	}

	.signup-form {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.signup-input {
		flex: 1;
		min-width: 240px;
		padding: 14px 20px;
		border-radius: 8px;
		border: 1px solid rgba(255,255,255,0.2);
		background-color: rgba(255,255,255,0.08);
		color: #ffffff;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.9375rem;
		outline: none;
		transition: border-color 0.2s ease;
	}

	.signup-input::placeholder { color: rgba(255,255,255,0.35); }

	.signup-input:focus {
		border-color: rgba(255,255,255,0.5);
	}

	.signup-btn {
		flex-shrink: 0;
	}

	.signup-note {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.8125rem;
		color: rgba(255,255,255,0.4);
		margin: 16px 0 0 0;
	}

	.signup-success {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		background-color: rgba(74, 222, 128, 0.12);
		border: 1px solid rgba(74, 222, 128, 0.3);
		color: #86efac;
		padding: 16px 28px;
		border-radius: 10px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 1024px) {
		.features-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.hero {
			padding: 72px 24px 64px;
		}

		.feed-section,
		.features-section,
		.signup-section {
			padding: 64px 24px;
		}

		.features-grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}

		.feed-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.feed-meta {
			align-items: flex-start;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 12px;
		}
	}

	@media (max-width: 480px) {
		.hero {
			padding: 56px 20px 48px;
		}

		.hero-actions {
			flex-direction: column;
			width: 100%;
		}

		.btn-primary,
		.btn-ghost {
			width: 100%;
			justify-content: center;
		}

		.feature-card {
			padding: 24px;
		}

		.signup-form {
			flex-direction: column;
		}

		.signup-input,
		.signup-btn {
			width: 100%;
		}
	}
</style>
