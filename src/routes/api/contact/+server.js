import { json } from '@sveltejs/kit';
import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';
import { syncToKlaviyo } from '$lib/klaviyo.js';

const resend = new Resend(RESEND_API_KEY);

const TO = 'info@watchreserve.co.uk';

const FROM = 'Watch Reserve <noreply@watchreserve.co.uk>';

function clean(v) {
	return String(v ?? '').trim();
}

function isValidEmail(v) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(v) {
	return /^[\d\s+\-()]{7,}$/.test(v);
}

function escapeHtml(v) {
	return String(v ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

const INTEREST_LABELS = {
	'general-inquiry': 'General Inquiry',
	'private-viewing': 'Private Viewing',
	'servicing-maintenance': 'Servicing / Maintenance',
	'specific-collection': 'Specific Collection'
};

export async function POST({ request }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}

	const fullName = clean(body.fullName);
	const email = clean(body.email);
	const phone = clean(body.phone);
	const interest = clean(body.interest);
	const preferredContact = clean(body.preferredContact) || 'email';
	const message = clean(body.message);
	const source = clean(body.source) || 'Contact Page';
	const gdprConsent = body.gdprConsent === true;

	// Server-side validation (client is validated too, this is defence in depth)
	if (fullName.length < 2) {
		return json({ error: 'Full name is required.' }, { status: 400 });
	}
	if (!isValidEmail(email)) {
		return json({ error: 'A valid email address is required.' }, { status: 400 });
	}
	if (!interest) {
		return json({ error: 'Area of interest is required.' }, { status: 400 });
	}
	if (preferredContact === 'phone' && !isValidPhone(phone)) {
		return json({ error: 'A valid phone number is required.' }, { status: 400 });
	}
	if (message.length > 5000) {
		return json({ error: 'Message is too long.' }, { status: 400 });
	}

	const interestLabel = INTEREST_LABELS[interest] ?? interest;
	const contactLabel = preferredContact === 'phone' ? 'Phone' : 'Email';

	const html = `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve</p>
					<h2 style="margin:6px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">New Contact Enquiry</h2>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 8px;">
					<p style="margin:0;display:inline-block;padding:5px 12px;background:#faf0e6;border:1px solid #a1846d;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1846d;font-weight:700;">${escapeHtml(source)}</p>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px;">
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
						${phone ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Phone</td>
							<td><a href="tel:${escapeHtml(phone)}" style="color:#a1846d;text-decoration:none;">${escapeHtml(phone)}</a></td>
						</tr>` : ''}
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Preferred Contact</td>
							<td style="color:#160b11;">${escapeHtml(contactLabel)}</td>
						</tr>
						<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;vertical-align:top;">Area of Interest</td>
							<td style="color:#160b11;">${escapeHtml(interestLabel)}</td>
						</tr>
					</table>
				</td>
			</tr>
			${message ? `<tr>
				<td style="padding:20px 32px 28px;border-top:1px solid #e5e5e5;">
					<h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#a1846d;font-weight:700;">Message</h3>
					<p style="margin:0;font-size:14px;line-height:1.7;color:#3a2a31;white-space:pre-wrap;">${escapeHtml(message)}</p>
				</td>
			</tr>` : ''}
			<tr>
				<td style="padding:16px 32px;background:#faf8f6;border-top:1px solid #e5e5e5;font-size:11px;color:#6b5c55;text-align:center;">
					Submitted via the Watch Reserve contact form · Reply directly to this email to respond to the enquirer.
				</td>
			</tr>
		</table>
	</body>
</html>`.trim();

	const text = [
		'New Contact Enquiry — Watch Reserve',
		`Source: ${source}`,
		'',
		`Full Name: ${fullName}`,
		`Email: ${email}`,
		phone ? `Phone: ${phone}` : null,
		`Preferred Contact: ${contactLabel}`,
		`Area of Interest: ${interestLabel}`,
		'',
		message ? `Message:\n${message}` : null,
		'',
		'— Submitted via the Watch Reserve contact form'
	]
		.filter(Boolean)
		.join('\n');

	try {
		const { error } = await resend.emails.send({
			from: FROM,
			to: [TO],
			replyTo: email,
			subject: `New enquiry · ${interestLabel} · ${fullName}`,
			html,
			text
		});

		if (error) {
			console.error('[contact] resend error:', error);
			return json({ error: 'Failed to send message. Please try again later.' }, { status: 502 });
		}

		await syncToKlaviyo(email, fullName.split(' ')[0], gdprConsent);
		return json({ success: true });
	} catch (err) {
		console.error('[contact] unexpected error:', err);
		return json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
	}
}
