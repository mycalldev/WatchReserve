import { getProducts } from '$lib/shopify.js';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const products = await getProducts();
		return { products };
	} catch (e) {
		console.error('Failed to fetch products from Shopify:', e);
		throw error(500, 'Failed to load products. Please try again later.');
	}
}
