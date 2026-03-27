import { getCollection } from '$lib/shopify.js';

export async function load() {
	let featuredProducts = [];

	try {
		const featured = await getCollection('featured');
		featuredProducts = featured?.products ?? [];
	} catch (e) {
		console.error('[home] failed to fetch featured products:', e?.message);
	}

	return { featuredProducts };
}
