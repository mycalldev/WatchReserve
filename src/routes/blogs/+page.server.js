import { getBlogs } from '$lib/shopify.js';

export async function load() {
	const blogs = await getBlogs(10);

	// Flatten all articles across all blogs into one list, newest first
	const articles = blogs
		.flatMap((blog) => blog.articles)
		.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

	return { articles, blogs };
}
