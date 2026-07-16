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

const PREFERENCE_LABELS = {
	both:         'Show Me Both',
	consignment:  'The Best Possible Price (Consignment)',
	outright:     'A Fast, Guaranteed Sale (Outright)'
};

const MAX_PHOTOS = 4;
const MAX_PHOTO_SIZE = 4 * 1024 * 1024; // 4MB, matches the client-side cap

function parsePhotoAttachments(rawPhotos) {
	if (!Array.isArray(rawPhotos)) return [];

	return rawPhotos
		.slice(0, MAX_PHOTOS)
		.filter((p) => p && typeof p.content === 'string' && typeof p.filename === 'string')
		.filter((p) => p.contentType?.startsWith?.('image/'))
		.map((p) => ({
			filename: p.filename,
			content: p.content,
			contentType: p.contentType
		}))
		.filter((p) => {
			// content is base64 — decoded size is roughly 3/4 of the encoded length
			const approxBytes = (p.content.length * 3) / 4;
			return approxBytes <= MAX_PHOTO_SIZE;
		});
}

export async function POST({ request }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}

	const brand       = clean(body.brand);
	const model       = clean(body.model);
	const reference   = clean(body.reference);
	const year        = clean(body.year);
	const condition   = clean(body.condition);
	const hasBox      = clean(body.hasBox);
	const hasPapers   = clean(body.hasPapers);
	const photoAttachments = parsePhotoAttachments(body.photos);
	const preference  = clean(body.preference);
	const firstName   = clean(body.firstName);
	const lastName    = clean(body.lastName);
	const email       = clean(body.email);
	const phone       = clean(body.phone);
	const gdprConsent = body.gdprConsent === true;

	const name = [firstName, lastName].filter(Boolean).join(' ');
	const preferenceLabel = PREFERENCE_LABELS[preference] ?? preference;

	if (firstName.length < 1)    return json({ error: 'First name is required.' },           { status: 400 });
	if (lastName.length < 1)     return json({ error: 'Last name is required.' },             { status: 400 });
	if (!isValidEmail(email))    return json({ error: 'A valid email address is required.' },{ status: 400 });
	if (!brand)                  return json({ error: 'Watch brand is required.' },           { status: 400 });
	if (!model)                  return json({ error: 'Watch model is required.' },           { status: 400 });

	const html = `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve</p>
					<h2 style="margin:6px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">New Sale and Consignment Submission</h2>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 8px;">
					<p style="margin:0;display:inline-block;padding:5px 12px;background:#faf0e6;border:1px solid #a1846d;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1846d;font-weight:700;">Sale and Consignment Page · Get Your Instant Valuation</p>
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
						${year ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Year</td>
							<td style="color:#160b11;">${escapeHtml(year)}</td>
						</tr>` : ''}
						${condition ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Condition</td>
							<td style="color:#160b11;">${escapeHtml(condition)}</td>
						</tr>` : ''}
						${hasBox ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Has Box</td>
							<td style="color:#160b11;">${escapeHtml(hasBox)}</td>
						</tr>` : ''}
						${hasPapers ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Has Papers</td>
							<td style="color:#160b11;">${escapeHtml(hasPapers)}</td>
						</tr>` : ''}
						${photoAttachments.length ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Photos</td>
							<td style="color:#160b11;">${photoAttachments.length} image${photoAttachments.length === 1 ? '' : 's'} attached</td>
						</tr>` : ''}
						${preferenceLabel ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Preference</td>
							<td style="color:#160b11;">${escapeHtml(preferenceLabel)}</td>
						</tr>` : ''}
					</table>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 28px;border-top:1px solid #f0ece8;">
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
					Submitted via the Sale and Consignment page · Reply directly to respond to the client.
				</td>
			</tr>
		</table>
	</body>
</html>`.trim();

	const text = [
		'New Sale and Consignment Submission — Watch Reserve',
		'Source: Sale and Consignment Page · Get Your Instant Valuation',
		'',
		'— Watch Details —',
		`Brand: ${brand}`,
		`Model: ${model}`,
		reference      ? `Reference: ${reference}`         : null,
		year           ? `Year: ${year}`                   : null,
		condition      ? `Condition: ${condition}`         : null,
		hasBox         ? `Has Box: ${hasBox}`              : null,
		hasPapers      ? `Has Papers: ${hasPapers}`        : null,
		photoAttachments.length ? `Photos: ${photoAttachments.length} image${photoAttachments.length === 1 ? '' : 's'} attached` : null,
		preferenceLabel ? `Preference: ${preferenceLabel}` : null,
		'',
		'— Contact Details —',
		`Full Name: ${name}`,
		`Email: ${email}`,
		phone ? `Phone: ${phone}` : null,
		`Marketing Opt-in: ${gdprConsent ? 'Yes' : 'No'}`,
		'',
		'— Submitted via the Watch Reserve Sale and Consignment page'
	]
		.filter(Boolean)
		.join('\n');

	try {
		const { error } = await resend.emails.send({
			from: FROM,
			to: [TO],
			replyTo: email,
			subject: `Sale and Consignment Valuation · ${brand} ${model} · ${name}`,
			html,
			text,
			...(photoAttachments.length ? { attachments: photoAttachments } : {})
		});

		if (error) {
			console.error('[consignment] resend error:', error);
			return json({ error: 'Failed to send request. Please try again later.' }, { status: 502 });
		}

		await sendCustomerConfirmation({
			to: email,
			firstName,
			formType: 'consignment',
			summary: [
				{ label: 'Brand', value: brand },
				{ label: 'Model', value: model },
				{ label: 'Reference', value: reference },
				{ label: 'Year', value: year },
				{ label: 'Condition', value: condition },
				{ label: 'Has Box', value: hasBox },
				{ label: 'Has Papers', value: hasPapers },
				{ label: 'Preference', value: preferenceLabel },
				{ label: 'Phone', value: phone },
				{ label: 'Marketing Opt-in', value: gdprConsent ? 'Yes' : 'No' }
			]
		});

		await syncToKlaviyo(email, firstName, gdprConsent, 'Sale and Consignment · Get Your Instant Valuation');
		return json({ success: true });
	} catch (err) {
		console.error('[consignment] unexpected error:', err);
		return json({ error: 'Failed to send request. Please try again later.' }, { status: 500 });
	}
}
