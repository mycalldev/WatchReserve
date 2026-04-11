import { STRIPE_SECRET_KEY } from '$env/static/private';
import { getCart } from '$lib/shopify.js';
import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY);

// Currencies with no decimal places (Stripe zero-decimal list).
const ZERO_DECIMAL = new Set([
	'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
	'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
]);

function toMinorUnits(amount, currencyCode) {
	const code = currencyCode.toUpperCase();
	if (ZERO_DECIMAL.has(code)) return Math.round(amount);
	return Math.round(amount * 100);
}

export async function POST({ cookies }) {
	const cartId = cookies.get('cartId');
	if (!cartId) throw error(400, 'No active cart');

	const cart = await getCart(cartId);
	if (!cart || !cart.lines.length) throw error(400, 'Cart is empty');

	const amount = Number(cart.total?.amount ?? 0);
	const currency = (cart.total?.currencyCode ?? 'GBP').toLowerCase();
	if (amount <= 0) throw error(400, 'Invalid cart total');

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: toMinorUnits(amount, currency),
			currency,
			automatic_payment_methods: { enabled: true },
			metadata: {
				shopify_cart_id: cartId
			}
		});

		return json({
			clientSecret: paymentIntent.client_secret,
			amount,
			currency
		});
	} catch (e) {
		throw error(500, e?.message || 'Could not initialise payment');
	}
}
