import { getCart, removeCartLine } from '$lib/shopify.js';
import { fail } from '@sveltejs/kit';

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

export const actions = {
	remove: async ({ request, cookies }) => {
		const cartId = cookies.get('cartId');
		if (!cartId) return fail(400, { error: 'No cart' });

		const data = await request.formData();
		const lineId = data.get('lineId');
		if (!lineId) return fail(400, { error: 'Missing lineId' });

		try {
			await removeCartLine(cartId, lineId);
			const refreshed = await getCart(cartId);
			return { totalQuantity: refreshed?.totalQuantity ?? 0 };
		} catch (e) {
			return fail(500, { error: e?.message || 'Could not remove item' });
		}
	}
};
