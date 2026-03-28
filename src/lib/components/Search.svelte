<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	let query      = $state('');
	let results    = $state([]);
	let loading    = $state(false);
	let open       = $state(false);
	let expanded   = $state(false);
	let isFallback = $state(false);
	let fallbackTerm = $state(null);
	let activeIndex  = $state(-1);
	let dropdownTop  = $state(0);

	let inputRef = $state(null);
	let rootRef  = $state(null);
	let searchTimer;

	function formatPrice(n, currency = 'GBP') {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency,
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(n);
	}

	async function doSearch(term) {
		loading = true;
		try {
			const res  = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
			const data = await res.json();
			results      = data.results ?? [];
			isFallback   = data.fallback ?? false;
			fallbackTerm = data.fallbackTerm ?? null;
		} catch {
			results = [];
		} finally {
			loading = false;
			open = true;
		}
	}

	function handleInput() {
		clearTimeout(searchTimer);
		activeIndex = -1;
		const trimmed = query.trim();
		if (trimmed.length < 2) {
			results = [];
			open    = false;
			loading = false;
			return;
		}
		loading = true;
		searchTimer = setTimeout(() => doSearch(trimmed), 350);
	}

	function computeDropdownTop() {
		const nav = rootRef?.closest('nav');
		if (nav) dropdownTop = nav.getBoundingClientRect().bottom;
	}

	function openSearch() {
		expanded = true;
		computeDropdownTop();
		setTimeout(() => inputRef?.focus(), 60);
	}

	function closeSearch() {
		expanded     = false;
		open         = false;
		query        = '';
		results      = [];
		loading      = false;
		activeIndex  = -1;
		isFallback   = false;
		fallbackTerm = null;
		clearTimeout(searchTimer);
	}

	function handleKeydown(e) {
		if (!expanded) return;
		if (e.key === 'Escape') { closeSearch(); return; }
		if (!open || results.length === 0) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = Math.min(activeIndex + 1, results.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = Math.max(activeIndex - 1, 0);
		} else if (e.key === 'Enter' && activeIndex >= 0) {
			e.preventDefault();
			goto(`/shop/${results[activeIndex].handle}`);
			closeSearch();
		}
	}

	function handlePointerDown(e) {
		const dropdown = document.getElementById('wr-search-dropdown');
		if (!rootRef?.contains(e.target) && !dropdown?.contains(e.target)) {
			closeSearch();
		}
	}

	// Recompute position on scroll/resize so dropdown tracks sticky navbar
	function handleScroll() {
		if (expanded) computeDropdownTop();
	}

	onMount(() => {
		document.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', computeDropdownTop);
	});

	onDestroy(() => {
		document.removeEventListener('pointerdown', handlePointerDown);
		window.removeEventListener('scroll', handleScroll);
		window.removeEventListener('resize', computeDropdownTop);
		clearTimeout(searchTimer);
	});
</script>

<!-- ── Inline navbar trigger / expanded input ─────────────────────────────── -->
<div
	class="search-root"
	bind:this={rootRef}
	onkeydown={handleKeydown}
	role="search"
	aria-label="Search watches"
>
	{#if expanded}
		<div class="search-bar">
			<svg class="search-bar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
			</svg>
			<input
				bind:this={inputRef}
				bind:value={query}
				oninput={handleInput}
				type="search"
				placeholder="Search watches, brands, references…"
				class="search-input"
				autocomplete="off"
				spellcheck="false"
				aria-label="Search"
				aria-autocomplete="list"
				aria-expanded={open}
				aria-haspopup="listbox"
			/>
			{#if loading}
				<span class="search-spinner" aria-hidden="true"></span>
			{/if}
			<button class="search-close-btn" onclick={closeSearch} type="button" aria-label="Close search">
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
					<path d="M18 6L6 18M6 6l12 12"/>
				</svg>
			</button>
		</div>
	{:else}
		<button class="search-trigger" onclick={openSearch} type="button" aria-label="Open search">
			<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
			</svg>
			<span class="search-trigger-label">Search</span>
		</button>
	{/if}
</div>

<!-- ── Results dropdown panel (fixed, below navbar) ──────────────────────── -->
{#if expanded && (open || loading)}
	<div
		id="wr-search-dropdown"
		class="search-dropdown"
		style="top: {dropdownTop}px"
		role="listbox"
		aria-label="Search results"
	>
		<div class="dropdown-inner">

			<!-- Fallback notice -->
			{#if isFallback && fallbackTerm}
				<div class="fallback-banner" role="status">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
					</svg>
					No exact results for "<strong>{query}</strong>" — showing results for "<strong>{fallbackTerm}</strong>"
				</div>
			{/if}

			<!-- Loading skeleton -->
			{#if loading && results.length === 0}
				<div class="search-loading" aria-live="polite" aria-label="Searching">
					<span class="loading-ring" aria-hidden="true"></span>
					Searching…
				</div>

			<!-- Results grid -->
			{:else if results.length > 0}
				<div class="results-header">
					<span class="results-count">{results.length} result{results.length !== 1 ? 's' : ''}</span>
					<a href="/shop" onclick={() => closeSearch()} class="results-browse-all">
						Browse all →
					</a>
				</div>

				<div class="results-grid" role="group" aria-label="Product results">
					{#each results as result, i}
						{@const status     = result.status?.trim() ?? null}
						{@const statusSlug = status ? status.toLowerCase().replace(/\s+/g, '-') : 'available'}
						<a
							href="/shop/{result.handle}"
							class="result-card"
							class:result-card--active={i === activeIndex}
							onclick={() => closeSearch()}
							role="option"
							aria-selected={i === activeIndex}
						>
							<!-- Image -->
							<div class="result-img-wrap">
								{#if result.image}
									<img
										src={result.image}
										alt={result.imageAlt ?? result.title}
										class="result-img"
										loading="lazy"
										decoding="async"
									/>
								{:else}
									<div class="result-img-placeholder" aria-hidden="true">
										<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
											<circle cx="12" cy="12" r="9" stroke="#a1846d" stroke-width="1.5"/>
											<circle cx="12" cy="12" r="3" stroke="#a1846d" stroke-width="1.5"/>
										</svg>
									</div>
								{/if}
							</div>

							<!-- Info -->
							<div class="result-info">
								{#if result.vendor}
									<span class="result-vendor">{result.vendor}</span>
								{/if}
								<p class="result-title">{result.title}</p>
								<div class="result-meta">
									<span class="result-price">
										{formatPrice(result.price, result.currencyCode)}
									</span>
									<span class="result-status status-{statusSlug}">
										<span class="r-dot" aria-hidden="true"></span>
										{status ?? 'Available'}
									</span>
								</div>
							</div>

							<svg class="result-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M9 18l6-6-6-6"/>
							</svg>
						</a>
					{/each}
				</div>

				<div class="dropdown-footer">
					<a href="/shop" onclick={() => closeSearch()} class="view-all-link">
						View all watches in shop
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
					</a>
				</div>

			<!-- Empty state -->
			{:else if !loading}
				<div class="search-empty">
					<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
					</svg>
					<p class="empty-text">No results for "<strong>{query}</strong>"</p>
					<a href="/shop" onclick={() => closeSearch()} class="empty-browse">
						Browse all watches →
					</a>
				</div>
			{/if}

		</div>
	</div>
{/if}

<style>
	/* ── Trigger button ──────────────────────────────── */
	.search-trigger {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.18);
		color: rgba(255, 255, 255, 0.75);
		border-radius: 6px;
		padding: 7px 14px 7px 10px;
		cursor: pointer;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.8125rem;
		font-weight: 400;
		letter-spacing: 0.02em;
		transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
		white-space: nowrap;
	}

	.search-trigger:hover {
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.4);
		background-color: rgba(255, 255, 255, 0.06);
	}

	.search-trigger-label {
		font-size: 0.8125rem;
	}

	/* ── Expanded search bar ─────────────────────────── */
	.search-bar {
		display: flex;
		align-items: center;
		gap: 8px;
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 8px;
		padding: 7px 10px 7px 12px;
		width: 300px;
		transition: border-color 0.2s ease, background-color 0.2s ease;
	}

	.search-bar:focus-within {
		background-color: rgba(255, 255, 255, 0.14);
		border-color: rgba(255, 255, 255, 0.45);
	}

	.search-bar-icon {
		color: rgba(255, 255, 255, 0.5);
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		color: #ffffff;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.875rem;
		font-weight: 300;
		min-width: 0;
	}

	.search-input::placeholder { color: rgba(255, 255, 255, 0.38); }
	.search-input::-webkit-search-cancel-button { display: none; }

	/* Spinner */
	.search-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-top-color: rgba(255, 255, 255, 0.7);
		border-radius: 50%;
		animation: spin 0.65s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	/* Close button */
	.search-close-btn {
		background: none;
		border: none;
		padding: 3px;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.45);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: color 0.2s ease;
		flex-shrink: 0;
	}

	.search-close-btn:hover { color: #ffffff; }

	/* ── Dropdown panel ──────────────────────────────── */
	.search-dropdown {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 998;
		background-color: #ffffff;
		border-top: 3px solid #422635;
		box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18), 0 4px 16px rgba(0, 0, 0, 0.1);
		max-height: calc(100vh - var(--dropdown-top, 100px));
		overflow-y: auto;
		animation: dropIn 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	@keyframes dropIn {
		from { opacity: 0; transform: translateY(-8px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	.dropdown-inner {
		max-width: 1300px;
		margin: 0 auto;
		padding: 20px 40px 24px;
	}

	/* Fallback notice */
	.fallback-banner {
		display: flex;
		align-items: center;
		gap: 8px;
		background-color: #fef9f0;
		border: 1px solid rgba(161, 132, 109, 0.3);
		color: #7a5c44;
		padding: 10px 16px;
		border-radius: 6px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.85rem;
		margin-bottom: 18px;
	}

	/* Loading */
	.search-loading {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 32px 0;
		justify-content: center;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.9rem;
		color: #999;
	}

	.loading-ring {
		width: 20px;
		height: 20px;
		border: 2.5px solid rgba(22, 11, 17, 0.1);
		border-top-color: #422635;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	/* Results header */
	.results-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
	}

	.results-count {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #999;
	}

	.results-browse-all {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.8rem;
		color: #422635;
		text-decoration: none;
		font-weight: 500;
		transition: opacity 0.2s ease;
	}

	.results-browse-all:hover { opacity: 0.7; }

	/* Results grid */
	.results-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
	}

	/* Result card */
	.result-card {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		border: 1px solid rgba(22, 11, 17, 0.08);
		border-radius: 10px;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
		position: relative;
	}

	.result-card:hover,
	.result-card--active {
		border-color: rgba(66, 38, 53, 0.25);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		transform: translateY(-2px);
	}

	.result-img-wrap {
		width: 100%;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		background: linear-gradient(135deg, #f8f6f4, #f0ece8);
		flex-shrink: 0;
	}

	.result-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.4s ease;
	}

	.result-card:hover .result-img { transform: scale(1.05); }

	.result-img-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.result-info {
		padding: 12px 14px 14px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.result-vendor {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.result-title {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.8375rem;
		color: #160b11;
		font-weight: 400;
		margin: 0;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.result-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		margin-top: 6px;
		flex-wrap: wrap;
	}

	.result-price {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		color: #160b11;
		letter-spacing: -0.01em;
	}

	/* Status */
	.result-status {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.68rem;
		font-weight: 500;
		color: #555;
		background-color: rgba(22, 11, 17, 0.05);
		padding: 3px 8px;
		border-radius: 100px;
	}

	.r-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		flex-shrink: 0;
		background-color: #999;
	}

	.status-available .r-dot    { background-color: #22a05a; }
	.status-sold .r-dot         { background-color: #c94040; }
	.status-new-arrival .r-dot  { background-color: #c9a230; }
	.status-reserved .r-dot     { background-color: #422635; }

	/* Chevron */
	.result-chevron {
		position: absolute;
		bottom: 14px;
		right: 14px;
		color: #ccc;
		transition: color 0.2s ease, transform 0.2s ease;
	}

	.result-card:hover .result-chevron,
	.result-card--active .result-chevron {
		color: #a1846d;
		transform: translateX(2px);
	}

	/* Dropdown footer */
	.dropdown-footer {
		margin-top: 20px;
		padding-top: 16px;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		display: flex;
		justify-content: center;
	}

	.view-all-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #422635;
		text-decoration: none;
		padding-bottom: 2px;
		border-bottom: 1px solid rgba(66, 38, 53, 0.3);
		transition: gap 0.2s ease, border-color 0.2s ease;
	}

	.view-all-link:hover {
		gap: 12px;
		border-color: #422635;
	}

	/* Empty state */
	.search-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 40px 20px;
		text-align: center;
	}

	.empty-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.9375rem;
		color: #666;
		margin: 0;
	}

	.empty-browse {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 0.875rem;
		color: #422635;
		text-decoration: none;
		font-weight: 500;
	}

	.empty-browse:hover { text-decoration: underline; }

	/* ── Responsive ──────────────────────────────────── */
	@media (max-width: 1100px) {
		.results-grid { grid-template-columns: repeat(3, 1fr); }
	}

	@media (max-width: 900px) {
		.search-bar { width: 240px; }
		.results-grid { grid-template-columns: repeat(2, 1fr); }
		.dropdown-inner { padding: 16px 24px 20px; }
	}

	@media (max-width: 640px) {
		.search-trigger-label { display: none; }

		.search-bar {
			width: 200px;
		}

		.results-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 10px;
		}

		.dropdown-inner { padding: 14px 16px 18px; }

		.result-info { padding: 10px 10px 12px; }
		.result-title { font-size: 0.8rem; }
		.result-price { font-size: 0.8125rem; }
		.result-status { display: none; }
		.result-chevron { display: none; }
	}

	@media (max-width: 400px) {
		.search-bar { width: 160px; }
		.results-grid { grid-template-columns: 1fr; }
	}
</style>
