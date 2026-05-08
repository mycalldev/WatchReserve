import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);

const FROM = 'Watch Reserve <noreply@watchreserve.co.uk>';
const REPLY_TO = 'info@watchreserve.co.uk';

function escapeHtml(v) {
	return String(v ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

const TEMPLATES = {
	contact: {
		subject: "We've Received Your Enquiry · Watch Reserve",
		heading: "We've Received Your Enquiry",
		intro: 'Thank you for reaching out to Watch Reserve. We have received your enquiry and a member of our team will be in touch shortly to assist you.'
	}
};

function buildHtml({ heading, intro, firstName }) {
	const greeting = firstName ? `Dear ${escapeHtml(firstName)},` : 'Dear Customer,';
	return `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">
			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve</p>
					<h2 style="margin:6px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">${escapeHtml(heading)}</h2>
				</td>
			</tr>
			<tr>
				<td style="padding:28px 32px;">
					<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3a2a31;">${greeting}</p>
					<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3a2a31;">${escapeHtml(intro)}</p>
					<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3a2a31;">If your enquiry is urgent, please reply directly to this email and we will get back to you as soon as possible.</p>
					<p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#3a2a31;">Warm regards,<br/>The Watch Reserve Team</p>
				</td>
			</tr>
			<tr>
				<td style="padding:20px 32px;background:#faf8f6;border-top:1px solid #e5e5e5;font-size:11px;color:#6b5c55;text-align:center;line-height:1.7;">
					Watch Reserve · 25 Cabot Square, Canary Wharf, London E14 4QA<br/>
					<a href="https://www.watchreserve.co.uk" style="color:#a1846d;text-decoration:none;">www.watchreserve.co.uk</a>
				</td>
			</tr>
		</table>
	</body>
</html>`.trim();
}

function buildText({ heading, intro, firstName }) {
	const greeting = firstName ? `Dear ${firstName},` : 'Dear Customer,';
	return [
		heading,
		'',
		greeting,
		'',
		intro,
		'',
		'If your enquiry is urgent, please reply directly to this email and we will get back to you as soon as possible.',
		'',
		'Warm regards,',
		'The Watch Reserve Team',
		'',
		'Watch Reserve · 25 Cabot Square, Canary Wharf, London E14 4QA',
		'www.watchreserve.co.uk'
	].join('\n');
}

/**
 * Sends an automated confirmation email to the customer after they submit a form.
 * Errors are swallowed so a Resend outage never breaks a form submission.
 *
 * @param {{ to: string, firstName?: string, formType: keyof typeof TEMPLATES }} args
 */
export async function sendCustomerConfirmation({ to, firstName, formType }) {
	if (!to) return;

	const template = TEMPLATES[formType];
	if (!template) {
		console.error(`[customerConfirmation] unknown formType: ${formType}`);
		return;
	}

	try {
		const { error } = await resend.emails.send({
			from: FROM,
			to: [to],
			replyTo: REPLY_TO,
			subject: template.subject,
			html: buildHtml({ ...template, firstName }),
			text: buildText({ ...template, firstName })
		});

		if (error) {
			console.error('[customerConfirmation] resend error:', error);
		}
	} catch (err) {
		console.error('[customerConfirmation] unexpected error:', err);
	}
}
