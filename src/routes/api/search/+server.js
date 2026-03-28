import { searchProducts } from '$lib/shopify.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const q = url.searchParams.get('q') ?? '';

	if (!q || q.trim().length < 2) {
		return json({ results: [], fallback: false, fallbackTerm: null });
	}

	try {
		const data = await searchProducts(q.trim());
		return json(data);
	} catch {
		return json({ results: [], fallback: false, fallbackTerm: null });
	}
}
