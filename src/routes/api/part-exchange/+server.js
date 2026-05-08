import { json } from '@sveltejs/kit';
import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';
import { syncToKlaviyo } from '$lib/klaviyo.js';
import { sendCustomerConfirmation } from '$lib/customerConfirmation.js';

const resend = new Resend(RESEND_API_KEY);

const TO   = 'info@watchreserve.co.uk';
const FROM = 'Watch Reserve <noreply@watchreserve.co.uk>';

function clean(v) { return String(v ?? '').trim(); }

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function escapeHtml(v) {
	return String(v ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function optionalRow(label, value) {
	if (!value) return '';
	return `<tr>
		<td style="padding:6px 12px 6px 0;color:#6b5c55;width:160px;vertical-align:top;">${label}</td>
		<td style="color:#160b11;">${escapeHtml(value)}</td>
	</tr>`;
}

export async function POST({ request }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}

	// Contact fields
	const name        = clean(body.name);
	const email       = clean(body.email);
	const phone       = clean(body.phone);
	const gdprConsent = body.gdprConsent === true;

	// Watch being traded in
	const brand          = clean(body.brand);
	const model          = clean(body.model);
	const reference      = clean(body.reference);
	const year           = clean(body.year);
	const condition      = clean(body.condition);
	const estimatedValue = clean(body.estimatedValue);

	// Watch being purchased (product page context)
	const targetProduct = clean(body.targetProduct);

	// Source — 'product-page' or 'part-exchange-page'
	const source = clean(body.source) || 'product-page';

	if (name.length < 2)      return json({ error: 'Full name is required.' },            { status: 400 });
	if (!isValidEmail(email)) return json({ error: 'A valid email address is required.' }, { status: 400 });
	if (!brand)               return json({ error: 'Watch brand is required.' },            { status: 400 });
	if (!model)               return json({ error: 'Watch model is required.' },            { status: 400 });

	const sourceLabel = source === 'part-exchange-page'
		? 'Part Exchange Page · Exchange Form'
		: 'Product Page · Part Exchange Slide-Over';

	const conditionMap = {
		'unworn':    'Unworn / New',
		'excellent': 'Excellent',
		'very-good': 'Very Good',
		'good':      'Good',
		'fair':      'Fair'
	};
	const conditionLabel = conditionMap[condition] || condition;

	const html = `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve</p>
					<h2 style="margin:6px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">New Part Exchange Valuation Request</h2>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 8px;">
					<p style="margin:0;display:inline-block;padding:5px 12px;background:#faf0e6;border:1px solid #a1846d;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1846d;font-weight:700;">${escapeHtml(sourceLabel)}</p>
				</td>
			</tr>

			${targetProduct ? `
			<!-- Watch being purchased -->
			<tr>
				<td style="padding:16px 32px 8px;border-top:1px solid #e5e5e5;">
					<h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#a1846d;font-weight:700;">Part Exchange Towards</h3>
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;width:160px;vertical-align:top;">Target Watch</td>
							<td style="color:#160b11;font-weight:600;">${escapeHtml(targetProduct)}</td>
						</tr>
					</table>
				</td>
			</tr>` : ''}

			<!-- Watch being traded in -->
			<tr>
				<td style="padding:20px 32px 8px;border-top:1px solid #e5e5e5;">
					<h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#a1846d;font-weight:700;">Watch to Trade In</h3>
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;width:160px;vertical-align:top;">Brand</td>
							<td style="color:#160b11;font-weight:600;">${escapeHtml(brand)}</td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Model</td>
							<td style="color:#160b11;">${escapeHtml(model)}</td>
						</tr>
						${optionalRow('Reference', reference)}
						${optionalRow('Year', year)}
						${condition ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Condition</td>
							<td style="color:#160b11;">${escapeHtml(conditionLabel)}</td>
						</tr>` : ''}
						${optionalRow('Est. Value', estimatedValue)}
					</table>
				</td>
			</tr>

			<!-- Contact details -->
			<tr>
				<td style="padding:16px 32px 28px;border-top:1px solid #e5e5e5;">
					<h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#a1846d;font-weight:700;">Contact Details</h3>
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;width:160px;vertical-align:top;">Full Name</td>
							<td style="color:#160b11;font-weight:600;">${escapeHtml(name)}</td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Email</td>
							<td><a href="mailto:${escapeHtml(email)}" style="color:#a1846d;text-decoration:none;">${escapeHtml(email)}</a></td>
						</tr>
						${phone ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Phone</td>
							<td><a href="tel:${escapeHtml(phone)}" style="color:#a1846d;text-decoration:none;">${escapeHtml(phone)}</a></td>
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
					Submitted via Watch Reserve · Reply directly to respond to the client.
				</td>
			</tr>
		</table>
	</body>
</html>`.trim();

	const textLines = [
		'New Part Exchange Valuation Request — Watch Reserve',
		`Source: ${sourceLabel}`,
		'',
	];

	if (targetProduct) {
		textLines.push('PART EXCHANGE TOWARDS', `Target Watch: ${targetProduct}`, '');
	}

	textLines.push(
		'WATCH TO TRADE IN',
		`Brand:     ${brand}`,
		`Model:     ${model}`,
	);
	if (reference)      textLines.push(`Reference: ${reference}`);
	if (year)           textLines.push(`Year:      ${year}`);
	if (condition)      textLines.push(`Condition: ${conditionLabel}`);
	if (estimatedValue) textLines.push(`Est Value: ${estimatedValue}`);

	textLines.push(
		'',
		'CONTACT DETAILS',
		`Full Name: ${name}`,
		`Email:     ${email}`,
	);
	if (phone) textLines.push(`Phone:     ${phone}`);
	textLines.push(`Marketing Opt-in: ${gdprConsent ? 'Yes' : 'No'}`);

	textLines.push('', '— Submitted via Watch Reserve');

	const text = textLines.join('\n');

	const subjectWatch = reference ? `${brand} ${model} (Ref. ${reference})` : `${brand} ${model}`;
	const subject = targetProduct
		? `Part Exchange · ${subjectWatch} towards ${targetProduct} · ${name}`
		: `Part Exchange Valuation · ${subjectWatch} · ${name}`;

	try {
		const { error } = await resend.emails.send({
			from: FROM,
			to: [TO],
			replyTo: email,
			subject,
			html,
			text
		});

		if (error) {
			console.error('[part-exchange] resend error:', error);
			return json({ error: 'Failed to send. Please try again later.' }, { status: 502 });
		}

		const firstName = name.split(' ')[0];

		await sendCustomerConfirmation({
			to: email,
			firstName,
			formType: 'part-exchange',
			details: { targetProduct }
		});

		await syncToKlaviyo(email, firstName, gdprConsent);
		return json({ success: true });
	} catch (err) {
		console.error('[part-exchange] unexpected error:', err);
		return json({ error: 'Failed to send. Please try again later.' }, { status: 500 });
	}
}
