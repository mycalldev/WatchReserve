<script>
	import LuxuryForm from '$lib/components/LuxuryForm.svelte';

	let { data } = $props();
	const { article } = data;

	function formatDate(iso) {
		return new Date(iso).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{article.title} — Watch Reserve</title>
	<meta name="description" content={article.excerpt || article.title} />
</svelte:head>

<!-- Breadcrumb -->
<nav class="breadcrumb" aria-label="Breadcrumb">
	<div class="breadcrumb-inner">
		<a href="/">Home</a>
		<span class="sep" aria-hidden="true">/</span>
		<a href="/blogs">Blogs &amp; Guides</a>
		<span class="sep" aria-hidden="true">/</span>
		<span class="current">{article.title}</span>
	</div>
</nav>

<main class="article-page">

	<!-- Hero -->
	<div class="article-hero">
		{#if article.image}
			<img
				src={article.image.url}
				alt={article.image.alt}
				class="hero-img"
				fetchpriority="high"
			/>
			<div class="hero-overlay" aria-hidden="true"></div>
		{/if}
		<div class="hero-content">
			<h1 class="hero-title">{article.title}</h1>
			<div class="hero-meta">
				<time datetime={article.publishedAt} class="hero-date">
					{formatDate(article.publishedAt)}
				</time>
			</div>
		</div>
	</div>

	<!-- Article body -->
	<div class="article-layout">
		<article class="article-body">

			{#if article.excerpt}
				<p class="article-excerpt">{article.excerpt}</p>
			{/if}

			<div class="article-content">
				{@html article.contentHtml}
			</div>


			<div class="article-back">
				<a href="/blogs" class="back-link">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					Back to Blogs &amp; Guides
				</a>
			</div>

		</article>
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
	/* ── BREADCRUMB ── */
	.breadcrumb {
		background-color: #faf8f5;
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		padding: 0 40px;
	}
	.breadcrumb-inner {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 14px 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		color: #999;
		flex-wrap: wrap;
	}
	.breadcrumb-inner a { color: #999; text-decoration: none; transition: color 0.2s ease; }
	.breadcrumb-inner a:hover { color: #a1846d; }
	.sep { color: rgba(22, 11, 17, 0.2); }
	.current { color: #160b11; font-weight: 500; }

	/* ── HERO ── */
	.article-hero {
		position: relative;
		width: 100%;
		height: clamp(320px, 45vh, 520px);
		overflow: hidden;
		display: flex;
		align-items: flex-end;
		background-color: #160b11;
	}
	.hero-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
	}
	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(22, 11, 17, 0.85) 0%, rgba(22, 11, 17, 0.3) 60%, transparent 100%);
	}
	.hero-content {
		position: relative;
		z-index: 1;
		padding: 48px 40px;
		max-width: 900px;
		width: 100%;
		margin: 0 auto;
	}
	.hero-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 4vw, 3rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 16px 0;
		line-height: 1.22;
		letter-spacing: -0.02em;
	}
	.hero-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
	.hero-date { font-family: 'Montserrat', sans-serif; font-size: 0.8125rem; color: rgba(255,255,255,0.5); }

	/* ── ARTICLE LAYOUT ── */
	.article-page { background-color: #ffffff; }
	.article-layout {
		max-width: 900px;
		margin: 0 auto;
		padding: 64px 40px 100px;
	}
	.article-body { width: 100%; }

	/* ── EXCERPT ── */
	.article-excerpt {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.1rem, 1.5vw, 1.25rem);
		color: #3a2e33;
		line-height: 1.7;
		border-left: 3px solid #a1846d;
		padding-left: 24px;
		margin: 0 0 48px 0;
		font-style: italic;
	}

	/* ── CONTENT (Shopify HTML) ── */
	.article-content {
		font-family: 'Montserrat', sans-serif;
		font-size: 1rem;
		line-height: 1.85;
		color: #3a2e33;
		margin-bottom: 48px;
	}
	:global(.article-content h1),
	:global(.article-content h2),
	:global(.article-content h3),
	:global(.article-content h4) {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-weight: 400;
		color: #160b11;
		letter-spacing: -0.02em;
		margin: 2em 0 0.75em;
		line-height: 1.3;
	}
	:global(.article-content h2) { font-size: clamp(1.4rem, 2.5vw, 1.75rem); }
	:global(.article-content h3) { font-size: clamp(1.15rem, 2vw, 1.375rem); }
	:global(.article-content p) { margin: 0 0 1.4em 0; }
	:global(.article-content a) { color: #a1846d; text-decoration: underline; text-underline-offset: 3px; transition: color 0.2s ease; }
	:global(.article-content a:hover) { color: #8d7060; }
	:global(.article-content img) { max-width: 100%; height: auto; display: block; margin: 2em auto; }
	:global(.article-content ul),
	:global(.article-content ol) { padding-left: 1.5em; margin: 0 0 1.4em 0; }
	:global(.article-content li) { margin-bottom: 0.5em; }
	:global(.article-content blockquote) {
		border-left: 3px solid #a1846d;
		margin: 2em 0;
		padding: 4px 0 4px 24px;
		font-style: italic;
		color: #6b5c55;
	}
	:global(.article-content hr) { border: none; border-top: 1px solid rgba(22,11,17,0.1); margin: 2.5em 0; }


	/* ── BACK LINK ── */
	.article-back { padding-top: 16px; }
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #160b11;
		text-decoration: none;
		padding-bottom: 3px;
		border-bottom: 1px solid rgba(22, 11, 17, 0.2);
		transition: color 0.2s ease, gap 0.2s ease, border-color 0.2s ease;
	}
	.back-link:hover { color: #a1846d; gap: 13px; border-color: #a1846d; }

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
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 12px 0;
	}
	.enquiry-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 12px 0;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}
	.enquiry-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		color: rgba(22, 11, 17, 0.5);
		margin: 0 0 48px 0;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 768px) {
		.breadcrumb { padding: 0 24px; }
		.hero-content { padding: 36px 24px; }
		.article-layout { padding: 48px 24px 72px; }
		.enquiry-section { padding: 0 24px 80px; }
		.enquiry-inner { padding-top: 48px; }
	}
	@media (max-width: 480px) {
		.breadcrumb { padding: 0 16px; }
		.hero-content { padding: 28px 16px; }
		.article-layout { padding: 36px 16px 60px; }
		.article-excerpt { padding-left: 16px; }
		.enquiry-section { padding: 0 16px 64px; }
		.enquiry-inner { padding-top: 40px; }
	}
</style>
