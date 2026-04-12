import { STRIPE_SECRET_KEY } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY);

const ZERO_DECIMAL = new Set([
	'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
	'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
]);

function toMinorUnits(amount, currencyCode) {
	const code = currencyCode.toUpperCase();
	if (ZERO_DECIMAL.has(code)) return Math.round(amount);
	return Math.round(amount * 100);
}

export async function POST({ request }) {
	let body;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid request body');
	}

	const productPrice  = Number(body.productPrice);
	const currencyCode  = String(body.currencyCode  ?? 'GBP');
	const productId     = String(body.productId     ?? '');
	const productTitle  = String(body.productTitle  ?? '');
	const productVendor = String(body.productVendor ?? '');
	const customerName  = String(body.customerName  ?? '');
	const customerEmail = String(body.customerEmail ?? '');
	const customerPhone = String(body.customerPhone ?? '');

	if (!productPrice || productPrice <= 0) throw error(400, 'Invalid product price');

	const depositAmount = productPrice * 0.1;
	const currency = currencyCode.toLowerCase();

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: toMinorUnits(depositAmount, currency),
			currency,
			automatic_payment_methods: { enabled: true },
			receipt_email: customerEmail || undefined,
			metadata: {
				type:               'deposit',
				shopify_product_id: productId,
				product_title:      productTitle,
				product_vendor:     productVendor,
				deposit_percentage: '10',
				full_price:         String(productPrice),
				balance_due:        String(productPrice * 0.9),
				currency:           currencyCode.toUpperCase(),
				customer_name:      customerName,
				customer_email:     customerEmail,
				customer_phone:     customerPhone
			}
		});

		return json({
			clientSecret:  paymentIntent.client_secret,
			depositAmount,
			currency
		});
	} catch (e) {
		throw error(500, e?.message || 'Could not initialise deposit payment');
	}
}
