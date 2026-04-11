import { getCart } from '$lib/shopify.js';

export async function load({ cookies }) {
	const cartId = cookies.get('cartId');
	if (!cartId) return { cart: null };

	try {
		const cart = await getCart(cartId);
		return { cart };
	} catch {
		return { cart: null };
	}
}
