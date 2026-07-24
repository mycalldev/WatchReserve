import { json } from '@sveltejs/kit';
import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';
import { syncToKlaviyo } from '$lib/klaviyo.js';
import { sendCustomerConfirmation } from '$lib/customerConfirmation.js';

const resend = new Resend(RESEND_API_KEY);

const TO = 'info@watchreserve.co.uk';
const FROM = 'Watch Reserve <noreply@watchreserve.co.uk>';

function clean(v) {
	return String(v ?? '').trim();
}

function escapeHtml(v) {
	return String(v ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export async function POST({ request }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}

	const firstName   = clean(body.firstName);
	const lastName    = clean(body.lastName);
	const fullName    = `${firstName} ${lastName}`.trim();
	const email       = clean(body.email);
	const phone       = clean(body.phone);
	const address1    = clean(body.address1);
	const address2    = clean(body.address2);
	const city        = clean(body.city);
	const postcode    = clean(body.postcode);
	const country     = clean(body.country);
	const gdprConsent = body.gdprConsent === true;

	if (!fullName || !email) {
		return json({ error: 'Missing required fields.' }, { status: 400 });
	}

	const addressLines = [address1, address2, city, postcode, country].filter(Boolean).join(', ');

	const html = `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve</p>
					<h2 style="margin:6px 0 0;font-family:'freight-display-pro',Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">KYC Verification Required</h2>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 8px;">
					<p style="margin:0;display:inline-block;padding:5px 12px;background:#faf0e6;border:1px solid #a1846d;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1846d;font-weight:700;">Checkout — Cart</p>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 28px;">
					<h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#a1846d;font-weight:700;">Customer Details</h3>
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;width:160px;vertical-align:top;">Full Name</td>
							<td style="color:#160b11;font-weight:600;">${escapeHtml(fullName)}</td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Email</td>
							<td><a href="mailto:${escapeHtml(email)}" style="color:#a1846d;text-decoration:none;">${escapeHtml(email)}</a></td>
						</tr>
						${phone ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Phone</td>
							<td><a href="tel:${escapeHtml(phone)}" style="color:#a1846d;text-decoration:none;">${escapeHtml(phone)}</a></td>
						</tr>` : ''}
						${addressLines ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Shipping Address</td>
							<td style="color:#160b11;">${escapeHtml(addressLines)}</td>
						</tr>` : ''}
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Marketing Opt-in</td>
							<td style="color:#160b11;">${gdprConsent ? 'Yes' : 'No'}</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px;background:#faf8f6;border-top:1px solid #e5e5e5;font-size:11px;color:#6b5c55;text-align:center;">
					Please contact this customer to complete KYC verification and arrange payment.
				</td>
			</tr>
		</table>
	</body>
</html>`.trim();

	const text = [
		'KYC Verification Required — Watch Reserve',
		'Checkout: Cart',
		'',
		`Full Name: ${fullName}`,
		`Email: ${email}`,
		phone ? `Phone: ${phone}` : null,
		addressLines ? `Shipping Address: ${addressLines}` : null,
		`Marketing Opt-in: ${gdprConsent ? 'Yes' : 'No'}`,
		'',
		'Please contact this customer to complete KYC verification and arrange payment.'
	]
		.filter(Boolean)
		.join('\n');

	try {
		const { error } = await resend.emails.send({
			from: FROM,
			to: [TO],
			replyTo: email,
			subject: `KYC required · Cart checkout · ${fullName}`,
			html,
			text
		});

		if (error) {
			console.error('[kyc-checkout] resend error:', error);
			return json({ error: 'Failed to send notification.' }, { status: 502 });
		}

		await sendCustomerConfirmation({
			to: email,
			firstName,
			formType: 'kyc-checkout',
			summary: [
				{ label: 'Phone', value: phone },
				{ label: 'Shipping Address', value: addressLines },
				{ label: 'Marketing Opt-in', value: gdprConsent ? 'Yes' : 'No' }
			]
		});

		await syncToKlaviyo(email, firstName, gdprConsent, 'KYC · Checkout');
		return json({ success: true });
	} catch (err) {
		console.error('[kyc-checkout] unexpected error:', err);
		return json({ error: 'Failed to send notification.' }, { status: 500 });
	}
}
