import { getCollection } from '$lib/shopify.js';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const collection = await getCollection('other');
		if (!collection) throw new Error('Collection not found');
		return { products: collection.products };
	} catch (e) {
		console.error('[curated-editions] Failed to fetch products:', e?.message);
		throw error(500, 'Failed to load Curated Editions. Please try again later.');
	}
}
