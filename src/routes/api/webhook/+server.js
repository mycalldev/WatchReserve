import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { getCart, createShopifyOrder, setProductStatus } from '$lib/shopify.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);
const resend = new Resend(RESEND_API_KEY);

const TO   = 'info@watchreserve.co.uk';
const FROM = 'Watch Reserve <noreply@watchreserve.co.uk>';

const ZERO_DECIMAL = new Set([
	'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
	'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
]);

function fromMinorUnits(amount, currencyCode) {
	const code = (currencyCode ?? 'GBP').toUpperCase();
	if (ZERO_DECIMAL.has(code)) return amount;
	return amount / 100;
}

function formatPrice(amount, currencyCode = 'GBP') {
	return new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: currencyCode,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}

function escapeHtml(v) {
	return String(v ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

// ── Deposit emails ─────────────────────────────────────────────────────────────

async function sendDepositEmails(pi) {
	const meta     = pi.metadata ?? {};
	const currency = (meta.currency ?? 'GBP').toUpperCase();

	const depositAmt = fromMinorUnits(pi.amount, currency);
	const fullPrice  = Number(meta.full_price  ?? 0);
	const balanceDue = Number(meta.balance_due ?? 0);

	const depositFmt = formatPrice(depositAmt, currency);
	const fullFmt    = formatPrice(fullPrice,  currency);
	const balanceFmt = formatPrice(balanceDue, currency);

	const customerName  = escapeHtml(meta.customer_name  ?? '');
	const customerEmail = meta.customer_email ?? '';
	const customerPhone = escapeHtml(meta.customer_phone ?? '');
	const productTitle  = escapeHtml(meta.product_title  ?? 'Timepiece');
	const productVendor = escapeHtml(meta.product_vendor ?? '');
	const productLine   = [productVendor, productTitle].filter(Boolean).join(' ');
	const piId          = escapeHtml(pi.id ?? '');

	// ── Customer confirmation ──────────────────────────────────────────────────

	const customerHtml = `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve</p>
					<h2 style="margin:6px 0 0;font-family:'freight-display-pro',Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">Your Deposit Has Been Received</h2>
				</td>
			</tr>
			<tr>
				<td style="padding:24px 32px 8px;">
					<p style="margin:0;font-size:15px;line-height:1.7;color:#160b11;">
						${customerName ? `Dear ${customerName},` : 'Thank you for your deposit.'}
					</p>
					<p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:#160b11;">
						Your deposit for the <strong>${productLine}</strong> has been received. This timepiece is now reserved exclusively in your name for <strong>7 days</strong>.
					</p>
				</td>
			</tr>
			<tr>
				<td style="padding:20px 32px;">
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f9f5f2;border:1px solid rgba(161,132,109,0.25);font-size:14px;line-height:1.75;">
						<tr>
							<td style="padding:14px 18px;border-bottom:1px solid rgba(161,132,109,0.15);">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
									<tr>
										<td style="color:#6b5c55;">Watch</td>
										<td style="text-align:right;font-weight:600;color:#160b11;">${productLine}</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td style="padding:14px 18px;border-bottom:1px solid rgba(161,132,109,0.15);">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
									<tr>
										<td style="color:#6b5c55;">Watch Price</td>
										<td style="text-align:right;color:#160b11;">${fullFmt}</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td style="padding:14px 18px;border-bottom:1px solid rgba(161,132,109,0.15);background:#fff8f2;">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
									<tr>
										<td style="color:#6b5c55;font-weight:700;">Deposit Paid (10%)</td>
										<td style="text-align:right;font-weight:700;color:#a1846d;font-size:16px;">${depositFmt}</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td style="padding:14px 18px;">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
									<tr>
										<td style="color:#6b5c55;">Balance Due on Collection / Delivery</td>
										<td style="text-align:right;color:#160b11;">${balanceFmt}</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td style="padding:0 32px 24px;">
					<p style="margin:0;font-size:14px;line-height:1.7;color:#160b11;">
						A member of our team at Watch Reserve will be in touch shortly to arrange collection or delivery and to finalise the balance payment.
					</p>
					<p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:#160b11;">
						If you have any questions in the meantime, please contact us at
						<a href="mailto:info@watchreserve.co.uk" style="color:#a1846d;text-decoration:none;">info@watchreserve.co.uk</a>
						or call <a href="tel:+442081501987" style="color:#a1846d;text-decoration:none;">+44 (0)20 8150 1987</a>.
					</p>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px;background:#faf8f6;border-top:1px solid #e5e5e5;font-size:11px;color:#6b5c55;text-align:center;">
					Watch Reserve · 25 Cabot Square, Canary Wharf, London E14 4QA · Reference: ${piId}
				</td>
			</tr>
		</table>
	</body>
</html>`.trim();

	const customerText = [
		`Watch Reserve — Deposit Confirmation`,
		``,
		customerName ? `Dear ${meta.customer_name},` : 'Thank you for your deposit.',
		``,
		`Your deposit for the ${meta.product_vendor ? meta.product_vendor + ' ' : ''}${meta.product_title} has been received.`,
		`This timepiece is now reserved exclusively in your name for 7 days.`,
		``,
		`Watch:               ${meta.product_vendor ? meta.product_vendor + ' ' : ''}${meta.product_title}`,
		`Watch Price:         ${fullFmt}`,
		`Deposit Paid (10%):  ${depositFmt}`,
		`Balance Due:         ${balanceFmt}`,
		``,
		`A member of our team at Watch Reserve will be in touch to arrange collection or delivery.`,
		``,
		`Questions? Email info@watchreserve.co.uk or call +44 (0)20 8150 1987.`,
		``,
		`Reference: ${pi.id}`
	].join('\n');

	// ── Store notification ─────────────────────────────────────────────────────

	const storeHtml = `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve</p>
					<h2 style="margin:6px 0 0;font-family:'freight-display-pro',Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">New Deposit Received</h2>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 8px;">
					<p style="margin:0;display:inline-block;padding:5px 12px;background:#faf0e6;border:1px solid #a1846d;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1846d;font-weight:700;">Deposit · 10% Holding Payment</p>
				</td>
			</tr>
			<tr>
				<td style="padding:20px 32px 32px;border-top:1px solid #e5e5e5;">
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;width:180px;vertical-align:top;">Watch</td>
							<td style="color:#160b11;font-weight:600;">${productLine}</td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Watch Price</td>
							<td style="color:#160b11;">${fullFmt}</td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Deposit Paid</td>
							<td style="color:#a1846d;font-weight:700;">${depositFmt}</td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Balance Due</td>
							<td style="color:#160b11;">${balanceFmt}</td>
						</tr>
						<tr><td colspan="2" style="padding:10px 0;border-bottom:1px solid #e5e5e5;"></td></tr>
						<tr>
							<td style="padding:10px 12px 6px 0;color:#6b5c55;vertical-align:top;">Customer</td>
							<td style="color:#160b11;font-weight:600;padding-top:10px;">${customerName || '—'}</td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Email</td>
							<td><a href="mailto:${escapeHtml(customerEmail)}" style="color:#a1846d;text-decoration:none;">${escapeHtml(customerEmail)}</a></td>
						</tr>
						${customerPhone ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Phone</td>
							<td style="color:#160b11;">${customerPhone}</td>
						</tr>` : ''}
						<tr><td colspan="2" style="padding:10px 0;border-bottom:1px solid #e5e5e5;"></td></tr>
						<tr>
							<td style="padding:10px 12px 6px 0;color:#6b5c55;vertical-align:top;">Stripe PI</td>
							<td style="color:#160b11;font-family:monospace;font-size:12px;padding-top:10px;">${piId}</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px;background:#faf8f6;border-top:1px solid #e5e5e5;font-size:11px;color:#6b5c55;text-align:center;">
					Watch Reserve · Deposit webhook · payment_intent.succeeded
				</td>
			</tr>
		</table>
	</body>
</html>`.trim();

	const storeText = [
		`New Deposit Received — Watch Reserve`,
		``,
		`Watch:        ${meta.product_vendor ? meta.product_vendor + ' ' : ''}${meta.product_title}`,
		`Watch Price:  ${fullFmt}`,
		`Deposit Paid: ${depositFmt}`,
		`Balance Due:  ${balanceFmt}`,
		``,
		`Customer:     ${meta.customer_name ?? ''}`,
		`Email:        ${customerEmail}`,
		customerPhone ? `Phone:        ${meta.customer_phone}` : null,
		``,
		`Stripe PI:    ${pi.id}`
	].filter(v => v !== null).join('\n');

	const subject = `Deposit Received · ${meta.product_vendor ? meta.product_vendor + ' ' : ''}${meta.product_title} · ${depositFmt}`;

	const results = await Promise.allSettled([
		// Notification to store
		resend.emails.send({
			from: FROM,
			to: [TO],
			replyTo: customerEmail || TO,
			subject,
			html: storeHtml,
			text: storeText
		}),
		// Confirmation to customer
		customerEmail
			? resend.emails.send({
					from: FROM,
					to: [customerEmail],
					subject: `Your deposit has been received — ${meta.product_vendor ? meta.product_vendor + ' ' : ''}${meta.product_title}`,
					html: customerHtml,
					text: customerText
			  })
			: Promise.resolve(null)
	]);

	for (const result of results) {
		if (result.status === 'rejected') {
			console.error('[webhook] deposit email error:', result.reason);
		}
	}
}

// ── Webhook handler ────────────────────────────────────────────────────────────

export async function POST({ request }) {
	const signature = request.headers.get('stripe-signature');
	if (!signature) {
		return json({ error: 'Missing stripe-signature header' }, { status: 400 });
	}

	let event;
	try {
		const rawBody = await request.text();
		event = stripe.webhooks.constructEvent(
			rawBody,
			signature,
			STRIPE_WEBHOOK_SECRET
		);
	} catch (err) {
		console.error('[webhook] signature verification failed:', err.message);
		return json({ error: `Webhook error: ${err.message}` }, { status: 400 });
	}

	try {
		if (event.type === 'payment_intent.succeeded') {
			const pi   = event.data.object;
			const meta = pi.metadata ?? {};

			if (meta.type === 'deposit') {
				await sendDepositEmails(pi);

				if (meta.shopify_product_id) {
					try {
						await setProductStatus(meta.shopify_product_id, 'reserved');
						console.log('[webhook] product marked reserved:', meta.shopify_product_id);
					} catch (err) {
						console.error('[webhook] failed to mark product reserved:', err.message);
					}
				}
			} else {
				const cart = await getCart(meta.shopify_cart_id);
				if (!cart || !cart.lines.length) {
					console.error('[webhook] cart not found or empty:', meta.shopify_cart_id);
				} else {
					const nameParts = (pi.shipping?.name ?? '').trim().split(/\s+/);
					const firstName = nameParts[0] ?? '';
					const lastName  = nameParts.slice(1).join(' ') || firstName;

					// Retrieve payment method to get billing details
					let billingAddress = null;
					if (pi.payment_method) {
						try {
							const pm = await stripe.paymentMethods.retrieve(pi.payment_method);
							const ba = pm.billing_details?.address;
							if (ba) {
								const billingNameParts = (pm.billing_details?.name ?? '').trim().split(/\s+/);
								billingAddress = {
									firstName:   billingNameParts[0] ?? firstName,
									lastName:    (billingNameParts.slice(1).join(' ') || billingNameParts[0]) ?? lastName,
									address1:    ba.line1         ?? '',
									address2:    ba.line2         ?? '',
									city:        ba.city          ?? '',
									zip:         ba.postal_code   ?? '',
									countryCode: ba.country        ?? 'GB',
									phone:       pm.billing_details?.phone ?? ''
								};
							}
						} catch (err) {
							console.error('[webhook] could not retrieve payment method:', err.message);
						}
					}

					const order = await createShopifyOrder({
						lineItems: cart.lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
						email: pi.receipt_email ?? '',
						shippingAddress: {
							firstName,
							lastName,
							address1:    pi.shipping?.address?.line1        ?? '',
							address2:    pi.shipping?.address?.line2        ?? '',
							city:        pi.shipping?.address?.city         ?? '',
							zip:         pi.shipping?.address?.postal_code  ?? '',
							countryCode: pi.shipping?.address?.country      ?? 'GB',
							phone:       pi.shipping?.phone                 ?? ''
						},
						billingAddress,
						note: `Stripe Payment Intent: ${pi.id}`
					});

					console.log('[webhook] Shopify order created:', order?.name);
				}
			}
		}
	} catch (err) {
		// Log but return 200 — prevents Stripe from retrying for non-Stripe errors.
		console.error('[webhook] handler error:', err);
	}

	return json({ received: true });
}
