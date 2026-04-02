<script>
	let { data } = $props();
	const { blogs, articles } = data;

	// Active blog filter — null means "All"
	let activeFilter = $state(null);

	const filtered = $derived(
		activeFilter
			? articles.filter((a) => a.blogHandle === activeFilter)
			: articles
	);

	function formatDate(iso) {
		return new Date(iso).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	// Pick the featured article (first overall, or first in filtered view)
	const featured = $derived(filtered[0] ?? null);
	const rest     = $derived(filtered.slice(1));
</script>

<svelte:head>
	<title>Blogs &amp; Guides — Watch Reserve</title>
	<meta name="description" content="Expert guides, market insights and stories from Watch Reserve — London's destination for pre-owned luxury timepieces." />
</svelte:head>

<!-- ── HERO ── -->
<section class="jn-hero" aria-label="Blogs and Guides">
	<div class="jn-hero-content">
		<p class="jn-hero-eyebrow">Watch Reserve</p>
		<h1 class="jn-hero-heading">Blogs &amp; Guides</h1>
		<p class="jn-hero-sub">
			Market insights, collector guides and stories from the world of luxury horology.
		</p>
	</div>
</section>

<!-- ── FILTER TABS ── -->
{#if blogs.length > 1}
	<div class="jn-filters-wrap">
		<div class="jn-filters" role="tablist" aria-label="Filter by category">
			<button
				class="jn-filter-pill"
				class:jn-filter-pill--active={activeFilter === null}
				role="tab"
				aria-selected={activeFilter === null}
				onclick={() => (activeFilter = null)}
			>
				All
			</button>
			{#each blogs as blog}
				<button
					class="jn-filter-pill"
					class:jn-filter-pill--active={activeFilter === blog.handle}
					role="tab"
					aria-selected={activeFilter === blog.handle}
					onclick={() => (activeFilter = blog.handle)}
				>
					{blog.title}
				</button>
			{/each}
		</div>
	</div>
{/if}

<!-- ── CONTENT ── -->
<div class="jn-content">

	{#if filtered.length === 0}
		<!-- Empty / coming soon state -->
		<div class="jn-empty">
			<div class="jn-empty-icon" aria-hidden="true">
				<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
				</svg>
			</div>
			<h2 class="jn-empty-title">Articles coming soon</h2>
			<p class="jn-empty-text">
				We're busy crafting expert guides and market insights. Check back shortly — there's plenty on the way.
			</p>
		</div>

	{:else}
		<!-- Featured article -->
		{#if featured}
			<a href="/blogs/{featured.blogHandle}/{featured.handle}" class="jn-featured">
				<div class="jn-featured-img-wrap">
					{#if featured.image}
						<img
							src={featured.image.url}
							alt={featured.image.alt}
							class="jn-featured-img"
							loading="lazy"
						/>
					{:else}
						<div class="jn-featured-img jn-img-placeholder" aria-hidden="true"></div>
					{/if}
					<span class="jn-featured-badge">Featured</span>
				</div>
				<div class="jn-featured-body">
					<div class="jn-meta">
						<span class="jn-meta-blog">{featured.blogTitle}</span>
						{#if featured.publishedAt}
							<span class="jn-meta-sep" aria-hidden="true">·</span>
							<time class="jn-meta-date" datetime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
						{/if}
						{#if featured.author}
							<span class="jn-meta-sep" aria-hidden="true">·</span>
							<span class="jn-meta-author">{featured.author}</span>
						{/if}
					</div>
					<h2 class="jn-featured-title">{featured.title}</h2>
					{#if featured.excerpt}
						<p class="jn-featured-excerpt">{featured.excerpt}</p>
					{/if}
					{#if featured.tags?.length}
						<div class="jn-tags" aria-label="Tags">
							{#each featured.tags.slice(0, 3) as tag}
								<span class="jn-tag">{tag}</span>
							{/each}
						</div>
					{/if}
					<span class="jn-read-more">
						Read article
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
					</span>
				</div>
			</a>
		{/if}

		<!-- Article grid -->
		{#if rest.length > 0}
			<div class="jn-grid-head">
				<h2 class="jn-grid-title">
					{activeFilter ? blogs.find(b => b.handle === activeFilter)?.title ?? 'Articles' : 'Latest Articles'}
				</h2>
				<span class="jn-grid-count">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
			</div>

			<div class="jn-grid">
				{#each rest as article}
					<a href="/blogs/{article.blogHandle}/{article.handle}" class="jn-card">
						<div class="jn-card-img-wrap">
							{#if article.image}
								<img
									src={article.image.url}
									alt={article.image.alt}
									class="jn-card-img"
									loading="lazy"
								/>
							{:else}
								<div class="jn-card-img jn-img-placeholder" aria-hidden="true"></div>
							{/if}
						</div>
						<div class="jn-card-body">
							<div class="jn-meta jn-meta--sm">
								<span class="jn-meta-blog">{article.blogTitle}</span>
								{#if article.publishedAt}
									<span class="jn-meta-sep" aria-hidden="true">·</span>
									<time class="jn-meta-date" datetime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
								{/if}
							</div>
							<h3 class="jn-card-title">{article.title}</h3>
							{#if article.excerpt}
								<p class="jn-card-excerpt">{article.excerpt}</p>
							{/if}
							{#if article.tags?.length}
								<div class="jn-tags" aria-label="Tags">
									{#each article.tags.slice(0, 2) as tag}
										<span class="jn-tag">{tag}</span>
									{/each}
								</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	{/if}

</div>

<style>
	/* ── HERO ── */
	.jn-hero {
		width: 100%;
		background-color: #160b11;
		display: flex;
		align-items: center;
		padding: 52px 60px;
		box-sizing: border-box;
	}

	.jn-hero-content {
		max-width: 1240px;
		margin: 0 auto;
		width: 100%;
	}

	.jn-hero-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 12px 0;
	}

	.jn-hero-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.8rem, 3.5vw, 2.8rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 12px 0;
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.jn-hero-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.85rem, 1.1vw, 0.9375rem);
		color: rgba(255, 255, 255, 0.55);
		margin: 0;
		line-height: 1.65;
		font-weight: 300;
		max-width: 480px;
	}

	/* ── FILTER TABS ── */
	.jn-filters-wrap {
		background: #ffffff;
		border-bottom: 1px solid rgba(22, 11, 17, 0.08);
		padding: 0 60px;
	}

	.jn-filters {
		display: flex;
		gap: 0;
		overflow-x: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.jn-filters::-webkit-scrollbar { display: none; }

	.jn-filter-pill {
		flex-shrink: 0;
		padding: 18px 22px;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.45);
		cursor: pointer;
		transition: color 0.18s ease, border-color 0.18s ease;
		margin-bottom: -1px;
	}

	.jn-filter-pill:hover { color: #160b11; }

	.jn-filter-pill--active {
		color: #a1846d;
		border-bottom-color: #a1846d;
	}

	/* ── CONTENT WRAPPER ── */
	.jn-content {
		max-width: 1240px;
		margin: 0 auto;
		padding: 72px 60px 100px;
	}

	/* ── EMPTY STATE ── */
	.jn-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 80px 20px;
		gap: 16px;
	}

	.jn-empty-icon {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: rgba(161, 132, 109, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #a1846d;
		margin-bottom: 8px;
	}

	.jn-empty-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.6rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
	}

	.jn-empty-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		color: rgba(22, 11, 17, 0.5);
		margin: 0;
		max-width: 440px;
		line-height: 1.7;
		font-weight: 300;
	}

	/* ── FEATURED ARTICLE ── */
	.jn-featured {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		text-decoration: none;
		border: 1px solid rgba(22, 11, 17, 0.08);
		overflow: hidden;
		margin-bottom: 72px;
		transition: box-shadow 0.25s ease, transform 0.25s ease;
	}

	.jn-featured:hover {
		box-shadow: 0 12px 40px rgba(22, 11, 17, 0.1);
		transform: translateY(-3px);
	}

	.jn-featured-img-wrap {
		position: relative;
		overflow: hidden;
		min-height: 380px;
	}

	.jn-featured-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.5s ease;
	}

	.jn-featured:hover .jn-featured-img {
		transform: scale(1.04);
	}

	.jn-featured-badge {
		position: absolute;
		top: 18px;
		left: 18px;
		background: #a1846d;
		color: #ffffff;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 5px 12px;
	}

	.jn-featured-body {
		padding: 48px 52px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 16px;
		background: #ffffff;
	}

	.jn-featured-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.4rem, 2.2vw, 2rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.25;
		letter-spacing: -0.02em;
	}

	.jn-featured-excerpt {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		color: rgba(22, 11, 17, 0.6);
		margin: 0;
		line-height: 1.7;
		font-weight: 300;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ── SHARED META ── */
	.jn-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.jn-meta--sm { font-size: 0.65rem; }

	.jn-meta-blog { color: #a1846d; }
	.jn-meta-sep { color: rgba(22, 11, 17, 0.25); }
	.jn-meta-date,
	.jn-meta-author { color: rgba(22, 11, 17, 0.4); }

	/* ── TAGS ── */
	.jn-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.jn-tag {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.5);
		background: rgba(22, 11, 17, 0.05);
		padding: 4px 10px;
	}

	/* ── READ MORE ── */
	.jn-read-more {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
		margin-top: 4px;
		transition: gap 0.2s ease, color 0.2s ease;
	}

	.jn-featured:hover .jn-read-more { gap: 12px; color: #8a6f59; }

	/* ── GRID HEADER ── */
	.jn-grid-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 32px;
		padding-bottom: 18px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.08);
	}

	.jn-grid-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.3rem, 2vw, 1.6rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.01em;
	}

	.jn-grid-count {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		color: rgba(22, 11, 17, 0.35);
		font-weight: 500;
		white-space: nowrap;
	}

	/* ── ARTICLE GRID ── */
	.jn-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 36px 28px;
	}

	.jn-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		border: 1px solid rgba(22, 11, 17, 0.07);
		overflow: hidden;
		transition: box-shadow 0.22s ease, transform 0.22s ease;
	}

	.jn-card:hover {
		box-shadow: 0 8px 28px rgba(22, 11, 17, 0.09);
		transform: translateY(-3px);
	}

	.jn-card-img-wrap {
		aspect-ratio: 16 / 10;
		overflow: hidden;
	}

	.jn-card-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.45s ease;
	}

	.jn-card:hover .jn-card-img { transform: scale(1.05); }

	.jn-img-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #f0ede8, #e8e2db);
	}

	.jn-card-body {
		padding: 22px 24px 26px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
	}

	.jn-card-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1rem, 1.3vw, 1.15rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.35;
		letter-spacing: -0.01em;
	}

	.jn-card-excerpt {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		color: rgba(22, 11, 17, 0.55);
		margin: 0;
		line-height: 1.65;
		font-weight: 300;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 1024px) {
		.jn-hero { padding: 44px 40px; }
		.jn-filters-wrap { padding: 0 40px; }
		.jn-content { padding: 60px 40px 88px; }
		.jn-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (max-width: 768px) {
		.jn-hero { padding: 36px 28px; }
		.jn-filters-wrap { padding: 0 28px; }
		.jn-content { padding: 48px 28px 72px; }
		.jn-featured { grid-template-columns: 1fr; }
		.jn-featured-img-wrap { min-height: 260px; }
		.jn-featured-body { padding: 32px 28px; }
		.jn-grid { grid-template-columns: repeat(2, 1fr); gap: 24px 20px; }
	}

	@media (max-width: 540px) {
		.jn-hero { padding: 28px 20px; }
		.jn-filters-wrap { padding: 0 20px; }
		.jn-content { padding: 40px 20px 64px; }
		.jn-grid { grid-template-columns: 1fr; }
		.jn-featured-body { padding: 24px 20px; }
	}
</style>
