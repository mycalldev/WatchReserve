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

export async function POST({ request }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}

	const fullName    = clean(body.fullName);
	const email       = clean(body.email);
	const brand       = clean(body.brand);
	const model       = clean(body.model);
	const reference   = clean(body.reference);
	const gdprConsent = body.gdprConsent === true;

	if (fullName.length < 2)  return json({ error: 'Full name is required.' },            { status: 400 });
	if (!isValidEmail(email)) return json({ error: 'A valid email address is required.' }, { status: 400 });
	if (!brand)               return json({ error: 'Watch brand is required.' },            { status: 400 });
	if (!model)               return json({ error: 'Watch model is required.' },            { status: 400 });

	const html = `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve</p>
					<h2 style="margin:6px 0 0;font-family:'freight-display-pro',Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">New Sourcing Request</h2>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 8px;">
					<p style="margin:0;display:inline-block;padding:5px 12px;background:#faf0e6;border:1px solid #a1846d;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1846d;font-weight:700;">Source Page · Sourcing Request Form</p>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 8px;border-top:1px solid #e5e5e5;">
					<h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#a1846d;font-weight:700;">Contact Details</h3>
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;width:160px;vertical-align:top;">Full Name</td>
							<td style="color:#160b11;font-weight:600;">${escapeHtml(fullName)}</td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Email</td>
							<td><a href="mailto:${escapeHtml(email)}" style="color:#a1846d;text-decoration:none;">${escapeHtml(email)}</a></td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Marketing Opt-in</td>
							<td style="color:#160b11;">${gdprConsent ? 'Yes' : 'No'}</td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 28px;border-top:1px solid #e5e5e5;">
					<h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#a1846d;font-weight:700;">Watch Details</h3>
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;width:160px;vertical-align:top;">Brand</td>
							<td style="color:#160b11;font-weight:600;">${escapeHtml(brand)}</td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Model</td>
							<td style="color:#160b11;">${escapeHtml(model)}</td>
						</tr>
						${reference ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Reference</td>
							<td style="color:#160b11;">${escapeHtml(reference)}</td>
						</tr>` : ''}
					</table>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px;background:#faf8f6;border-top:1px solid #e5e5e5;font-size:11px;color:#6b5c55;text-align:center;">
					Submitted via the Source page · Sourcing Request Form · Reply directly to respond to the client.
				</td>
			</tr>
		</table>
	</body>
</html>`.trim();

	const text = [
		'New Sourcing Request — Watch Reserve',
		'Source: Source Page · Sourcing Request Form',
		'',
		'CONTACT DETAILS',
		`Full Name:  ${fullName}`,
		`Email:      ${email}`,
		`Marketing Opt-in: ${gdprConsent ? 'Yes' : 'No'}`,
		'',
		'WATCH DETAILS',
		`Brand:      ${brand}`,
		`Model:      ${model}`,
		reference ? `Reference:  ${reference}` : null,
		'',
		'— Submitted via Watch Reserve source page'
	]
		.filter(Boolean)
		.join('\n');

	try {
		const { error } = await resend.emails.send({
			from: FROM,
			to: [TO],
			replyTo: email,
			subject: `Sourcing Request · ${brand} ${model} · ${fullName}`,
			html,
			text
		});

		if (error) {
			console.error('[source-request] resend error:', error);
			return json({ error: 'Failed to send. Please try again later.' }, { status: 502 });
		}

		const firstName = fullName.split(' ')[0];
		const productLabel = `${brand} ${model}`.trim();

		await sendCustomerConfirmation({
			to: email,
			firstName,
			formType: 'source-request',
			details: { productLabel },
			summary: [
				{ label: 'Brand', value: brand },
				{ label: 'Model', value: model },
				{ label: 'Reference', value: reference },
				{ label: 'Marketing Opt-in', value: gdprConsent ? 'Yes' : 'No' }
			]
		});

		await syncToKlaviyo(email, firstName, gdprConsent, 'Source Request');
		return json({ success: true });
	} catch (err) {
		console.error('[source-request] unexpected error:', err);
		return json({ error: 'Failed to send. Please try again later.' }, { status: 500 });
	}
}
