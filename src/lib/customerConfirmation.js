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
	contact: () => ({
		subject: "We've Received Your Enquiry · Watch Reserve",
		heading: "We've Received Your Enquiry",
		intro: 'Thank you for reaching out to Watch Reserve. We have received your enquiry and a member of our team will be in touch shortly to assist you.'
	}),

	'product-enquiry': ({ productLabel } = {}) => ({
		subject: productLabel
			? `We've Received Your Enquiry · ${productLabel}`
			: "We've Received Your Enquiry · Watch Reserve",
		heading: "We've Received Your Enquiry",
		intro: productLabel
			? `Thank you for your interest in the ${productLabel}. We have received your enquiry and a member of our team will be in touch shortly to assist you.`
			: 'Thank you for your enquiry. We have received your message and a member of our team will be in touch shortly to assist you.'
	}),

	'sell-valuation': () => ({
		subject: 'Your Valuation Request Has Been Received · Watch Reserve',
		heading: 'Your Valuation Request Has Been Received',
		intro: 'Thank you for submitting your timepiece for valuation. A member of our team will review the details you have provided and be in touch shortly with our offer.'
	}),

	'sell-consignment': () => ({
		subject: 'Your Consignment Submission Has Been Received · Watch Reserve',
		heading: 'Your Consignment Submission Has Been Received',
		intro: 'Thank you for considering Watch Reserve to consign your timepiece. A member of our team will review your submission and be in touch shortly to discuss the next steps.'
	}),

	'part-exchange': ({ targetProduct } = {}) => ({
		subject: targetProduct
			? `Your Part Exchange Request Has Been Received · ${targetProduct}`
			: 'Your Part Exchange Request Has Been Received · Watch Reserve',
		heading: 'Your Part Exchange Request Has Been Received',
		intro: targetProduct
			? `Thank you for your part exchange enquiry towards the ${targetProduct}. A member of our team will review the details of your trade-in and be in touch shortly with a valuation.`
			: 'Thank you for your part exchange enquiry. A member of our team will review the details of your trade-in and be in touch shortly with a valuation.'
	}),

	'source-request': ({ productLabel } = {}) => ({
		subject: productLabel
			? `Your Sourcing Request Has Been Received · ${productLabel}`
			: 'Your Sourcing Request Has Been Received · Watch Reserve',
		heading: 'Your Sourcing Request Has Been Received',
		intro: productLabel
			? `Thank you for entrusting Watch Reserve to source the ${productLabel}. A member of our team will begin the search and be in touch shortly to keep you informed throughout the process.`
			: 'Thank you for entrusting Watch Reserve to source your next timepiece. A member of our team will begin the search and be in touch shortly to keep you informed throughout the process.'
	}),

	waitlist: () => ({
		subject: "You're On the Watch Reserve Intelligence Waitlist",
		heading: "You're On the Waitlist",
		intro: 'Thank you for joining the Watch Reserve Intelligence waitlist. You will be among the first to receive access when we launch, along with exclusive early insights and updates.'
	}),

	'landing-enquiry': () => ({
		subject: "We've Received Your Enquiry · Watch Reserve",
		heading: "We've Received Your Enquiry",
		intro: 'Thank you for your enquiry. A member of our team will be in touch shortly using your preferred contact method.'
	}),

	'kyc-checkout': () => ({
		subject: 'Your Order Is Being Verified · Watch Reserve',
		heading: 'Your Order Is Being Verified',
		intro: 'Thank you for your order. As part of our standard verification process for high-value timepieces, a member of our team will be in touch shortly to complete a brief identity check and arrange your payment.'
	}),

	'kyc-deposit': ({ productLabel } = {}) => ({
		subject: productLabel
			? `Your Deposit Request Is Being Verified · ${productLabel}`
			: 'Your Deposit Request Is Being Verified · Watch Reserve',
		heading: 'Your Deposit Request Is Being Verified',
		intro: productLabel
			? `Thank you for your interest in reserving the ${productLabel}. As part of our standard verification process, a member of our team will be in touch shortly to complete a brief identity check and arrange your deposit payment.`
			: 'Thank you for your interest in reserving this timepiece. As part of our standard verification process, a member of our team will be in touch shortly to complete a brief identity check and arrange your deposit payment.'
	})
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
 * @param {{ to: string, firstName?: string, formType: keyof typeof TEMPLATES, details?: object }} args
 */
export async function sendCustomerConfirmation({ to, firstName, formType, details = {} }) {
	if (!to) return;

	const builder = TEMPLATES[formType];
	if (!builder) {
		console.error(`[customerConfirmation] unknown formType: ${formType}`);
		return;
	}

	const template = builder(details);

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
