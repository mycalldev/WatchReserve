<script>
	let reference = $state('');
	let selectedYear = $state('');
	let loading = $state(false);
	let result = $state(null);
	let error = $state('');
	let errorDetail = $state('');

	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i);

	function formatPrice(p) {
		if (!p) return '—';
		return new Intl.NumberFormat('en-GB', {
			style: 'currency', currency: 'GBP',
			minimumFractionDigits: 0, maximumFractionDigits: 0
		}).format(p);
	}

	function calcStats(listings) {
		if (!listings.length) return null;
		const prices = listings.map(l => l.price);
		const sorted = [...prices].sort((a, b) => a - b);
		const m = Math.floor(sorted.length / 2);
		const med = sorted.length % 2 ? sorted[m] : Math.round((sorted[m - 1] + sorted[m]) / 2);
		return {
			count: prices.length,
			low: sorted[0],
			high: sorted[sorted.length - 1],
			median: med,
			average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
		};
	}

	// Filtered listings and recalculated stats based on selected year
	let filtered = $derived.by(() => {
		if (!result) return null;
		const yr = selectedYear ? parseInt(selectedYear) : null;
		const list = yr ? result.listings.filter(l => l.year === yr) : result.listings;
		const stats = yr ? calcStats(list) : {
			count: result.count,
			low: result.low,
			high: result.high,
			median: result.median,
			average: result.average
		};
		return { listings: list.slice(0, 8), stats };
	});

	// Only show years that actually appear in the listings
	let availableYears = $derived.by(() => {
		if (!result) return [];
		return [...new Set(result.listings.map(l => l.year).filter(Boolean))].sort((a, b) => b - a);
	});

	async function checkPrice() {
		const ref = reference.trim();
		if (!ref) return;
		loading = true;
		result = null;
		error = '';
		errorDetail = '';
		selectedYear = '';

		try {
			const res = await fetch(`/api/watch-price?reference=${encodeURIComponent(ref)}`);
			const data = await res.json();

			if (!res.ok || data.error) {
				error = data.error ?? 'Something went wrong. Please try again.';
				errorDetail = data.detail ?? '';
			} else {
				result = data;
			}
		} catch {
			error = 'Network error — please try again.';
			errorDetail = 'Could not reach the server. Check your connection or try again shortly.';
		} finally {
			loading = false;
		}
	}

	function handleKeydown(e) {
		if (e.key === 'Enter') checkPrice();
	}
</script>

<div class="pc-wrap">
	<div class="pc-head">
		<span class="pc-eyebrow">Market Price Check</span>
		<div class="pc-rule"></div>
	</div>

	<p class="pc-desc">
		Enter a watch reference number to see current market prices from active listings.
	</p>

	<div class="pc-input-row">
		<input
			class="pc-input"
			type="text"
			placeholder="e.g. 126610LN, 5711/1A, 15500ST"
			bind:value={reference}
			onkeydown={handleKeydown}
			disabled={loading}
			aria-label="Watch reference number"
		/>
		<button
			class="pc-btn"
			onclick={checkPrice}
			disabled={loading || !reference.trim()}
			aria-busy={loading}
		>
			{#if loading}
				<span class="pc-spinner" aria-hidden="true"></span>
				Checking…
			{:else}
				Check Price
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M5 12h14M12 5l7 7-7 7"/>
				</svg>
			{/if}
		</button>
	</div>

	{#if error}
		<div class="pc-error" role="alert">
			<span class="pc-error-msg">{error}</span>
			{#if errorDetail}
				<span class="pc-error-detail">{errorDetail}</span>
			{/if}
		</div>
	{/if}

	{#if result && filtered}
		<div class="pc-result">

			<!-- Year filter -->
			{#if availableYears.length > 0}
				<div class="pc-filter-row">
					<label class="pc-filter-label" for="pc-year">Filter by Year</label>
					<div class="pc-select-wrap">
						<select id="pc-year" class="pc-select" bind:value={selectedYear}>
							<option value="">All Years ({result.count} listings)</option>
							{#each availableYears as yr}
								<option value={String(yr)}>{yr}</option>
							{/each}
						</select>
						<svg class="pc-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M6 9l6 6 6-6"/>
						</svg>
					</div>
					{#if selectedYear && filtered.stats?.count === 0}
						<span class="pc-filter-none">No listings found for {selectedYear}</span>
					{/if}
				</div>
			{/if}

			<!-- Summary row -->
			{#if filtered.stats && filtered.stats.count > 0}
				<div class="pc-summary">
					<div class="pc-stat">
						<span class="pc-stat-label">Median Price</span>
						<span class="pc-stat-value pc-stat-value--main">{formatPrice(filtered.stats.median)}</span>
					</div>
					<div class="pc-stat">
						<span class="pc-stat-label">Range</span>
						<span class="pc-stat-value">{formatPrice(filtered.stats.low)} – {formatPrice(filtered.stats.high)}</span>
					</div>
					<div class="pc-stat">
						<span class="pc-stat-label">Listings Found</span>
						<span class="pc-stat-value">{filtered.stats.count}{selectedYear ? '' : '+'}</span>
					</div>
				</div>

				<!-- Individual listings -->
				{#if filtered.listings.length}
					<div class="pc-listings">
						<p class="pc-listings-label">
							{selectedYear ? `${selectedYear} Listings` : 'Recent Listings'}
						</p>
						{#each filtered.listings as listing}
							<div class="pc-listing-row">
								<span class="pc-listing-title">{listing.title || result.reference}</span>
								<div class="pc-listing-right">
									{#if listing.year}
										<span class="pc-listing-year">{listing.year}</span>
									{/if}
									<span class="pc-listing-price">{formatPrice(listing.price)}</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}

		</div>
	{/if}
</div>

<style>
	.pc-wrap { width: 100%; }

	.pc-head {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 16px;
	}

	.pc-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		white-space: nowrap;
	}

	.pc-rule {
		flex: 1;
		height: 1px;
		background: linear-gradient(to right, rgba(22,11,17,0.15), transparent);
	}

	.pc-desc {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #6b5c55;
		margin: 0 0 24px 0;
		line-height: 1.6;
	}

	.pc-input-row {
		display: flex;
		gap: 12px;
		margin-bottom: 20px;
	}

	.pc-input {
		flex: 1;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		color: #160b11;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 13px 16px;
		outline: none;
		transition: border-color 0.2s ease, background-color 0.2s ease;
		-webkit-appearance: none;
		min-width: 0;
	}

	.pc-input::placeholder { color: #b8b0a8; }

	.pc-input:focus {
		border-color: rgba(22,11,17,0.2);
		border-bottom-color: #a1846d;
		background-color: #fefcfb;
	}

	.pc-input:disabled { opacity: 0.6; cursor: not-allowed; }

	.pc-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 13px 22px;
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		border-radius: 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		cursor: pointer;
		white-space: nowrap;
		transition: background-color 0.2s ease, gap 0.2s ease;
		flex-shrink: 0;
	}

	.pc-btn:hover:not(:disabled) {
		background-color: #8a6f59;
		gap: 12px;
	}

	.pc-btn:disabled { opacity: 0.45; cursor: not-allowed; }

	.pc-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255,255,255,0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: pc-spin 0.65s linear infinite;
		flex-shrink: 0;
	}

	@keyframes pc-spin { to { transform: rotate(360deg); } }

	.pc-error {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.85rem;
		color: #8b2635;
		background-color: #fff5f5;
		border-left: 3px solid #c94040;
		padding: 12px 16px;
		margin-bottom: 16px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.pc-error-msg { font-weight: 600; }

	.pc-error-detail {
		font-size: 0.78rem;
		color: #a03040;
		font-family: 'Montserrat', sans-serif;
		font-weight: 400;
	}

	/* ── Result ── */
	.pc-result {
		border: 1px solid rgba(161, 132, 109, 0.2);
		background-color: #fdfaf8;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		animation: pc-fadein 0.3s ease;
	}

	@keyframes pc-fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

	/* ── Year filter ── */
	.pc-filter-row {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.pc-filter-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #a1846d;
		white-space: nowrap;
	}

	.pc-select-wrap {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	.pc-select {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		font-weight: 500;
		color: #160b11;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 8px 36px 8px 12px;
		outline: none;
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
		transition: border-color 0.2s ease;
		min-width: 180px;
	}

	.pc-select:focus {
		border-color: rgba(22,11,17,0.2);
		border-bottom-color: #a1846d;
	}

	.pc-select-arrow {
		position: absolute;
		right: 10px;
		pointer-events: none;
		color: #a1846d;
	}

	.pc-filter-none {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		color: #9a8880;
		font-style: italic;
	}

	.pc-summary {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		padding-bottom: 20px;
		border-bottom: 1px solid rgba(22,11,17,0.07);
	}

	.pc-stat {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.pc-stat-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.pc-stat-value {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #160b11;
	}

	.pc-stat-value--main {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.375rem;
		font-weight: 400;
		letter-spacing: -0.02em;
	}

	/* ── Listings ── */
	.pc-listings { display: flex; flex-direction: column; gap: 0; }

	.pc-listings-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 10px 0;
	}

	.pc-listing-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 10px 0;
		border-bottom: 1px solid rgba(22,11,17,0.05);
	}

	.pc-listing-row:last-child { border-bottom: none; }

	.pc-listing-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		color: #3a2e33;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	.pc-listing-right {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-shrink: 0;
	}

	.pc-listing-year {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		color: #9a8880;
	}

	.pc-listing-price {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		color: #160b11;
	}

	/* ── Responsive ── */
	@media (max-width: 640px) {
		.pc-input-row { flex-direction: column; }
		.pc-btn { width: 100%; justify-content: center; }
		.pc-summary { grid-template-columns: 1fr 1fr; }
		.pc-summary .pc-stat:last-child { grid-column: span 2; }
		.pc-filter-row { flex-direction: column; align-items: flex-start; }
		.pc-select { min-width: 100%; }
	}
</style>
