import { getBlogs } from '$lib/shopify.js';

export async function load() {
	let blogs = [];

	try {
		blogs = await getBlogs(10);
	} catch (e) {
		console.error('[blogs] fetch error:', e?.message);
	}

	// Flatten all articles across all blogs into a single feed, sorted newest first
	const articles = blogs
		.flatMap((b) => b.articles)
		.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

	return { blogs, articles };
}
