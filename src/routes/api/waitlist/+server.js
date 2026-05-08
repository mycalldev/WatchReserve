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

	const firstName = clean(body.firstName);
	const email     = clean(body.email);
	const gdprConsent = body.gdprConsent === true;

	if (!isValidEmail(email)) return json({ error: 'A valid email address is required.' }, { status: 400 });

	const html = `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve</p>
					<h2 style="margin:6px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">New Intelligence Waitlist Sign-Up</h2>
				</td>
			</tr>
			<tr>
				<td style="padding:16px 32px 8px;">
					<p style="margin:0;display:inline-block;padding:5px 12px;background:#faf0e6;border:1px solid #a1846d;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1846d;font-weight:700;">Intelligence Page · Join the Waitlist</p>
				</td>
			</tr>
			<tr>
				<td style="padding:20px 32px 32px;border-top:1px solid #e5e5e5;">
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						${firstName ? `<tr>
							<td style="padding:6px 12px 6px 0;color:#6b5c55;width:160px;vertical-align:top;">First Name</td>
							<td style="color:#160b11;font-weight:600;">${escapeHtml(firstName)}</td>
						</tr>` : ''}
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
				<td style="padding:16px 32px;background:#faf8f6;border-top:1px solid #e5e5e5;font-size:11px;color:#6b5c55;text-align:center;">
					Submitted via the Watch Reserve Intelligence page · Join the Waitlist.
				</td>
			</tr>
		</table>
	</body>
</html>`.trim();

	const text = [
		'New Intelligence Waitlist Sign-Up — Watch Reserve',
		'Source: Intelligence Page · Join the Waitlist',
		'',
		firstName ? `First Name: ${firstName}` : null,
		`Email:      ${email}`,
		`Marketing Opt-in: ${gdprConsent ? 'Yes' : 'No'}`,
		'',
		'— Submitted via the Watch Reserve Intelligence page'
	]
		.filter(Boolean)
		.join('\n');

	try {
		const { error } = await resend.emails.send({
			from: FROM,
			to: [TO],
			replyTo: email,
			subject: `Waitlist · Watch Reserve Intelligence${firstName ? ` · ${firstName}` : ''}`,
			html,
			text
		});

		if (error) {
			console.error('[waitlist] resend error:', error);
			return json({ error: 'Failed to join waitlist. Please try again later.' }, { status: 502 });
		}

		await sendCustomerConfirmation({
			to: email,
			firstName,
			formType: 'waitlist'
		});

		await syncToKlaviyo(email, firstName, gdprConsent);
		return json({ success: true });
	} catch (err) {
		console.error('[waitlist] unexpected error:', err);
		return json({ error: 'Failed to join waitlist. Please try again later.' }, { status: 500 });
	}
}
