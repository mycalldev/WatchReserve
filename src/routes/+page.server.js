import { getCollection, getNewArrivals } from '$lib/shopify.js';

export async function load() {
	let featuredProducts = [];
	let newArrivals = [];

	try {
		const featured = await getCollection('featured');
		featuredProducts = featured?.products ?? [];
	} catch (e) {
		console.error('[home] failed to fetch featured products:', e?.message);
	}

	try {
		newArrivals = await getNewArrivals(12);
	} catch (e) {
		console.error('[home] failed to fetch new arrivals:', e?.message);
	}

	return { featuredProducts, newArrivals };
}
