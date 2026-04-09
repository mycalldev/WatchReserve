import { getArticle } from '$lib/shopify.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const article = await getArticle(params.blog, params.article);

	if (!article) {
		error(404, 'Article not found');
	}

	return { article };
}
