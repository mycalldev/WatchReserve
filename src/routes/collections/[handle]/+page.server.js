import { getCollection } from '$lib/shopify.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	let collection = null;

	try {
		collection = await getCollection(params.handle);
	} catch (e) {
		console.error('[collection] fetch error for handle:', params.handle, e?.message);
		throw error(404, 'Collection not found');
	}

	if (!collection) {
		console.error('[collection] not found for handle:', params.handle);
		throw error(404, 'Collection not found');
	}

	return { collection };
}
