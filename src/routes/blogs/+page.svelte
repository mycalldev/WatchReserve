<script>
	import LuxuryForm from '$lib/components/LuxuryForm.svelte';

	let { data } = $props();
	const { articles, blogs } = data;

	let selectedBlog = $state('all');

	const filtered = $derived(
		selectedBlog === 'all'
			? articles
			: articles.filter((a) => a.blogHandle === selectedBlog)
	);

	function formatDate(iso) {
		return new Date(iso).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Blogs &amp; Guides — Watch Reserve</title>
	<meta name="description" content="Expert guides, market insights and watch buying advice from Watch Reserve." />
</svelte:head>

<div class="page-header">
	<img src="/assets/hero/Patek-Warranty.jpg" alt="" class="page-header-bg" aria-hidden="true" fetchpriority="high" />
	<div class="page-header-overlay" aria-hidden="true"></div>
	<div class="page-header-content">
		<p class="page-eyebrow">Knowledge &amp; Insight</p>
		<h1 class="page-title">Blogs &amp; Guides</h1>
		<p class="page-subtitle">Expert advice, market insights and collector knowledge</p>
	</div>
</div>

<main class="blogs-page">
	<div class="blogs-container">

		{#if blogs.length > 1}
			<div class="filter-bar">
				<button class="filter-pill" class:active={selectedBlog === 'all'} onclick={() => (selectedBlog = 'all')}>All</button>
				{#each blogs as blog}
					<button class="filter-pill" class:active={selectedBlog === blog.handle} onclick={() => (selectedBlog = blog.handle)}>{blog.title}</button>
				{/each}
			</div>
		{/if}

		{#if filtered.length === 0}
			<div class="empty-state">
				<p class="empty-title">No articles yet</p>
				<p class="empty-sub">Check back soon — new guides are on the way.</p>
			</div>
		{:else}
			<p class="article-count">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</p>
			<div class="articles-grid">
				{#each filtered as article (article.id)}
					<a href="/blogs/{article.blogHandle}/{article.handle}" class="article-card">
						<div class="card-img-wrap">
							{#if article.image}
								<img src={article.image.url} alt={article.image.alt} class="card-img" loading="lazy" />
							{:else}
								<div class="card-img-placeholder" aria-hidden="true">
									<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a1846d" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
									</svg>
								</div>
							{/if}
						</div>
						<div class="card-body">
							<div class="card-meta">
								<time datetime={article.publishedAt} class="card-date">{formatDate(article.publishedAt)}</time>
							</div>
							<h2 class="card-title">{article.title}</h2>
							{#if article.excerpt}<p class="card-excerpt">{article.excerpt}</p>{/if}
							<span class="read-more">Read Article <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>
						</div>
					</a>
				{/each}
			</div>
		{/if}

	</div>
</main>

<!-- Enquiry Form -->
<section class="enquiry-section">
	<div class="enquiry-inner">
		<p class="enquiry-eyebrow">Get In Touch</p>
		<h2 class="enquiry-heading">Have a Question?</h2>
		<p class="enquiry-sub">Our team of experts is on hand to help with any enquiries.</p>
		<LuxuryForm source="Blog" />
	</div>
</section>

<style>
	.page-header {
		position: relative;
		border-bottom: 1px solid rgba(161, 132, 109, 0.2);
		padding: 80px 40px 72px;
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
		background: linear-gradient(
			180deg,
			rgba(22, 11, 17, 0.72) 0%,
			rgba(22, 11, 17, 0.82) 100%
		);
		z-index: 1;
	}
	.page-header-content { position: relative; z-index: 2; }
	.page-eyebrow {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 14px 0;
	}
	.page-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 3.75rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 16px 0;
		letter-spacing: -0.02em;
		line-height: 1.12;
	}
	.page-subtitle {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.45);
		margin: 0;
		letter-spacing: 0.02em;
	}
	.blogs-page { background-color: #ffffff; min-height: 50vh; }
	.blogs-container { max-width: 1400px; margin: 0 auto; padding: 56px 40px 100px; }
	.filter-bar {
		display: flex;
		gap: 6px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		margin-bottom: 40px;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.filter-bar::-webkit-scrollbar { display: none; }
	.filter-pill {
		flex-shrink: 0;
		padding: 12px 22px;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #888;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.2s ease, border-color 0.2s ease;
		margin-bottom: -1px;
	}
	.filter-pill:hover { color: #160b11; }
	.filter-pill.active { color: #160b11; font-weight: 600; border-bottom-color: #a1846d; }
	.article-count { font-family: 'acumin-pro', sans-serif; font-size: 0.875rem; color: #999; margin: 0 0 32px 0; }
	.articles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
	.article-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
		border: 1px solid rgba(22, 11, 17, 0.08);
		box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05);
		transition: transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.32s ease;
	}
	.article-card:hover { transform: translateY(-5px); box-shadow: 0 4px 14px rgba(0,0,0,0.07), 0 16px 40px rgba(0,0,0,0.09); border-color: rgba(161, 132, 109, 0.25); }
	.card-img-wrap { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: linear-gradient(135deg, #f8f6f4 0%, #f0ece8 100%); flex-shrink: 0; }
	.card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
	.article-card:hover .card-img { transform: scale(1.05); }
	.card-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
	.card-body { padding: 24px 24px 28px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
	.card-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
	.card-date { font-family: 'acumin-pro', sans-serif; font-size: 0.75rem; color: #999; letter-spacing: 0.02em; }
	.card-title { font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif; font-size: clamp(1.1rem, 1.4vw, 1.3rem); font-weight: 400; color: #160b11; margin: 0; line-height: 1.4; letter-spacing: -0.01em; transition: color 0.2s ease; }
	.article-card:hover .card-title { color: #a1846d; }
	.card-excerpt { font-family: 'acumin-pro', sans-serif; font-size: 0.875rem; color: #666; line-height: 1.65; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
	.read-more { display: inline-flex; align-items: center; gap: 7px; margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(22, 11, 17, 0.07); font-family: 'acumin-pro', sans-serif; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #a1846d; transition: gap 0.2s ease; }
	.article-card:hover .read-more { gap: 11px; }
	.empty-state { text-align: center; padding: 80px 20px; }
	.empty-title { font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif; font-size: 1.5rem; font-weight: 400; color: #160b11; margin: 0 0 12px 0; }
	.empty-sub { font-family: 'acumin-pro', sans-serif; font-size: 0.9375rem; color: #888; margin: 0; }
	@media (max-width: 1100px) { .articles-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }
	@media (max-width: 768px) { .blogs-container { padding: 40px 24px 72px; } .articles-grid { gap: 20px; } }
	@media (max-width: 640px) { .page-header { padding: 60px 24px 52px; } .blogs-container { padding: 32px 16px 64px; } .articles-grid { grid-template-columns: 1fr; gap: 20px; } .card-body { padding: 20px 18px 22px; } }

	/* ── ENQUIRY SECTION ── */
	.enquiry-section {
		background-color: #ffffff;
		padding: 0 40px 100px;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
	}
	.enquiry-inner {
		max-width: 900px;
		margin: 0 auto;
		padding-top: 64px;
	}
	.enquiry-eyebrow {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 12px 0;
	}
	.enquiry-heading {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 14px 0;
		line-height: 1.2;
	}
	.enquiry-sub {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.9375rem;
		color: #6b5c55;
		line-height: 1.7;
		font-weight: 300;
		margin: 0 0 40px 0;
	}
	@media (max-width: 768px) {
		.enquiry-section { padding: 0 24px 80px; }
		.enquiry-inner { padding-top: 48px; }
	}
	@media (max-width: 480px) {
		.enquiry-section { padding: 0 16px 64px; }
		.enquiry-inner { padding-top: 40px; }
	}
</style>
