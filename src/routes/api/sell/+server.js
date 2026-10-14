import { json } from '@sveltejs/kit';
import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';
import { syncToKlaviyo } from '$lib/klaviyo.js';
import { sendCustomerConfirmation } from '$lib/customerConfirmation.js';
import { isValuationLinkSource, getOfferMonth, getValuationLinkSource } from '$lib/offer.js';

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

const CONTACT_METHODS = ['Phone', 'Email', 'WhatsApp'];

function parseContactMethods(raw) {
	if (!Array.isArray(raw)) return [];
	return CONTACT_METHODS.filter((method) => raw.includes(method));
}

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

	if (!body || typeof body !== 'object' || Array.isArray(body)) {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}

	// Honeypot: bots commonly fill every field, including this hidden one.
	// Pretend success without sending emails or syncing the lead.
	if (clean(body.website)) {
		return json({ success: true });
	}

	const brand       = clean(body.brand);
	const model       = clean(body.model);
	const reference   = clean(body.reference);
	const dialDescription = typeof body.dialDescription === 'string' ? body.dialDescription.trim() : '';
	const year        = clean(body.year);
	const condition   = clean(body.condition);
	const hasBox      = clean(body.hasBox);
	const hasPapers   = clean(body.hasPapers);
	const photoAttachments = parsePhotoAttachments(body.photos);
	const firstName   = typeof body.firstName === 'string' ? body.firstName.trim() : '';
	const lastName    = typeof body.lastName === 'string' ? body.lastName.trim() : '';
	const email       = typeof body.email === 'string' ? body.email.trim() : '';
	const phone       = clean(body.phone);
	const contactMethods = parseContactMethods(body.contactMethods);
	const gdprConsent = body.gdprConsent === true;
	let source        = clean(body.source) || 'Sale and Consignment Page · Get Your Instant Valuation';
	const isValuationLinkSubmission = isValuationLinkSource(source);
	if (isValuationLinkSubmission) source = getValuationLinkSource();
	const valuationLabel = isValuationLinkSubmission
		? `${getOfferMonth()} Free Valuation`
		: 'Sale and Consignment Valuation';
	const submissionHeading = isValuationLinkSubmission
		? `New ${valuationLabel} Submission`
		: 'New Sale and Consignment Submission';

	const name = [firstName, lastName].filter(Boolean).join(' ');
	const contactMethodsLabel = contactMethods.join(', ');

	if (isValuationLinkSubmission && !/^[1-9]\d{3}$/.test(year)) {
		return json({ error: 'Please enter a valid four-digit year.' }, { status: 400 });
	}

	if ((body.phone != null && typeof body.phone !== 'string') || (phone && !/^[0-9]{11}$/.test(phone))) {
		return json({ error: 'Please enter exactly 11 digits for your phone number.' }, { status: 400 });
	}

	if (isValuationLinkSubmission && !phone) {
		return json({ error: 'Please enter your phone number.' }, { status: 400 });
	}

	if (isValuationLinkSubmission && !name) {
		return json({ error: 'Full name is required.' }, { status: 400 });
	}
	if (!isValidEmail(email)) return json({ error: 'A valid email address is required.' }, { status: 400 });

	if (!isValuationLinkSubmission) {
		if (firstName.length < 1) return json({ error: 'First name is required.' }, { status: 400 });
		if (lastName.length < 1) return json({ error: 'Last name is required.' }, { status: 400 });
	}
	if (!brand)                  return json({ error: 'Watch brand is required.' },           { status: 400 });
	if (!model)                  return json({ error: 'Watch model is required.' },           { status: 400 });

	const html = `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve · Internal</p>
					<h2 style="margin:6px 0 0;font-family:'freight-display-pro',Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">${escapeHtml(submissionHeading)}</h2>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 8px;">
					<p style="margin:0;display:inline-block;padding:5px 12px;background:#faf0e6;border:1px solid #a1846d;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1846d;font-weight:700;">${escapeHtml(source)}</p>
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
						${dialDescription ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Dial Description</td>
							<td style="color:#160b11;">${escapeHtml(dialDescription)}</td>
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
					</table>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 28px;border-top:1px solid #f0ece8;">
					<h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#a1846d;font-weight:700;">Contact Details</h3>
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;width:160px;vertical-align:top;">Full Name</td>
							<td style="color:#160b11;font-weight:600;">${escapeHtml(name || 'Provided at initial valuation request')}</td>
						</tr>
						${email ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Email</td>
							<td><a href="mailto:${escapeHtml(email)}" style="color:#a1846d;text-decoration:none;">${escapeHtml(email)}</a></td>
						</tr>` : `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Email</td>
							<td style="color:#6b5c55;">Provided at initial valuation request</td>
						</tr>`}
						${phone ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Phone</td>
							<td><a href="tel:${escapeHtml(phone)}" style="color:#a1846d;text-decoration:none;">${escapeHtml(phone)}</a></td>
						</tr>` : ''}
						${contactMethodsLabel ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Preferred Contact Method</td>
							<td style="color:#160b11;">${escapeHtml(contactMethodsLabel)}</td>
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
					Submitted via ${escapeHtml(source)} · Reply directly to respond to the client.
				</td>
			</tr>
		</table>
	</body>
</html>`.trim();

	const text = [
		`Internal · ${submissionHeading} — Watch Reserve`,
		`Source: ${source}`,
		'',
		'— Watch Details —',
		`Brand: ${brand}`,
		`Model: ${model}`,
		reference      ? `Reference: ${reference}`         : null,
		dialDescription ? `Dial Description: ${dialDescription}` : null,
		year           ? `Year: ${year}`                   : null,
		condition      ? `Condition: ${condition}`         : null,
		hasBox         ? `Has Box: ${hasBox}`              : null,
		hasPapers      ? `Has Papers: ${hasPapers}`        : null,
		photoAttachments.length ? `Photos: ${photoAttachments.length} image${photoAttachments.length === 1 ? '' : 's'} attached` : null,
		'',
		'— Contact Details —',
		`Full Name: ${name || 'Provided at initial valuation request'}`,
		`Email: ${email || 'Provided at initial valuation request'}`,
		phone ? `Phone: ${phone}` : null,
		contactMethodsLabel ? `Preferred Contact Method: ${contactMethodsLabel}` : null,
		`Marketing Opt-in: ${gdprConsent ? 'Yes' : 'No'}`,
		'',
		`— Submitted via ${source}`
	]
		.filter(Boolean)
		.join('\n');

	try {
		const { error } = await resend.emails.send({
			from: FROM,
			to: [TO],
			replyTo: isValidEmail(email) ? email : TO,
			subject: `[Internal] ${valuationLabel} · ${brand} ${model} · ${name || 'Existing valuation lead'}`,
			html,
			text,
			...(photoAttachments.length ? { attachments: photoAttachments } : {})
		});

		if (error) {
			console.error('[consignment] resend error:', error);
			return json({ error: 'Failed to send request. Please try again later.' }, { status: 502 });
		}

		if (isValidEmail(email)) {
			await sendCustomerConfirmation({
				to: email,
				firstName,
				formType: isValuationLinkSubmission ? 'valuation-link-submission' : 'consignment',
				summary: [
					{ label: 'Brand', value: brand },
					{ label: 'Model', value: model },
					{ label: 'Reference', value: reference },
					{ label: 'Dial Description', value: dialDescription },
					{ label: 'Year', value: year },
					{ label: 'Condition', value: condition },
					{ label: 'Has Box', value: hasBox },
					{ label: 'Has Papers', value: hasPapers },
					{ label: 'Full Name', value: name },
					{ label: 'Email', value: email },
					{ label: 'Phone', value: phone },
					{ label: 'Preferred Contact Method', value: contactMethodsLabel },
					{ label: 'Marketing Opt-in', value: gdprConsent ? 'Yes' : 'No' }
				]
			});

			await syncToKlaviyo(email, firstName, gdprConsent, source);
		}
		return json({ success: true });
	} catch (err) {
		console.error('[consignment] unexpected error:', err);
		return json({ error: 'Failed to send request. Please try again later.' }, { status: 500 });
	}
}
