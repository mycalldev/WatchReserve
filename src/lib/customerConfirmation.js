import { RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);

const FROM = 'Watch Reserve <noreply@watchreserve.co.uk>';
const REPLY_TO = 'info@watchreserve.co.uk';

const PHONE_DISPLAY = '+44 (0)20 8150 1987';
const PHONE_TEL = '+442081501987';
const ADDRESS = '25 Cabot Square, Canary Wharf, London E14 4QA';
const OPENING_HOURS = 'Mon – Sat: 10:00AM – 6:00PM';

const TZ = 'Europe/London';
const LOCALE = 'en-GB';

function escapeHtml(v) {
	return String(v ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function formatSubmittedAt(date = new Date()) {
	return new Intl.DateTimeFormat(LOCALE, {
		timeZone: TZ,
		dateStyle: 'long',
		timeStyle: 'short'
	}).format(date);
}

const TEMPLATES = {
	contact: () => ({
		subject: "We've Received Your Enquiry · Watch Reserve",
		heading: "We've Received Your Enquiry",
		formName: 'Contact Form',
		intro:
			'We have received your enquiry and a member of our team will be in touch shortly to assist you.'
	}),

	'product-enquiry': ({ productLabel } = {}) => ({
		subject: productLabel
			? `We've Received Your Enquiry · ${productLabel}`
			: "We've Received Your Enquiry · Watch Reserve",
		heading: "We've Received Your Enquiry",
		formName: 'Product Enquiry Form',
		intro: productLabel
			? `We have received your enquiry about the ${productLabel} and a member of our team will be in touch shortly to assist you.`
			: 'We have received your enquiry and a member of our team will be in touch shortly to assist you.'
	}),

	consignment: () => ({
		subject: 'Your Valuation Request Has Been Received · Watch Reserve',
		heading: 'Your Valuation Request Has Been Received',
		formName: 'Consignment Page Valuation Form',
		intro:
			'A member of our team will review the details you have provided and be in touch shortly with your valuation. We aim to respond within 30 minutes during business hours.'
	}),

	'part-exchange': ({ targetProduct } = {}) => ({
		subject: targetProduct
			? `Your Part Exchange Request Has Been Received · ${targetProduct}`
			: 'Your Part Exchange Request Has Been Received · Watch Reserve',
		heading: 'Your Part Exchange Request Has Been Received',
		formName: 'Part Exchange Form',
		intro: targetProduct
			? `A member of our team will review the details of your trade-in towards the ${targetProduct} and be in touch shortly with a valuation.`
			: 'A member of our team will review the details of your trade-in and be in touch shortly with a valuation.'
	}),

	'source-request': ({ productLabel } = {}) => ({
		subject: productLabel
			? `Your Sourcing Request Has Been Received · ${productLabel}`
			: 'Your Sourcing Request Has Been Received · Watch Reserve',
		heading: 'Your Sourcing Request Has Been Received',
		formName: 'Sourcing Request Form',
		intro: productLabel
			? `A member of our team will begin the search for the ${productLabel} and be in touch shortly to keep you informed throughout the process.`
			: 'A member of our team will begin the search and be in touch shortly to keep you informed throughout the process.'
	}),

	waitlist: () => ({
		subject: "You're On the Watch Reserve Intelligence Waitlist",
		heading: "You're On the Waitlist",
		formName: 'Waitlist Form',
		intro:
			'You will be among the first to receive access when we launch, along with exclusive early insights and updates.'
	}),

	'free-valuation': () => ({
		subject: 'September Month Free Valuation · Watch Reserve',
		heading: 'September Month Free Valuation',
		formName: 'Free Valuation Request',
		intro:
			'A member of the Watch Reserve team will be in contact with you very soon with a link to upload images and details of your timepiece.',
		signoff: 'Kind Regards,\nWatch Reserve Team'
	}),

	'landing-enquiry': () => ({
		subject: "We've Received Your Enquiry · Watch Reserve",
		heading: "We've Received Your Enquiry",
		formName: 'Enquiry Form',
		intro: 'A member of our team will be in touch shortly using your preferred contact method.'
	}),

	'kyc-checkout': () => ({
		subject: 'Your Order Is Being Verified · Watch Reserve',
		heading: 'Your Order Is Being Verified',
		formName: 'Checkout Form',
		intro:
			'As part of our standard verification process for high-value timepieces, a member of our team will be in touch shortly to complete a brief identity check and arrange your payment.'
	}),

	'kyc-deposit': ({ productLabel } = {}) => ({
		subject: productLabel
			? `Your Deposit Request Is Being Verified · ${productLabel}`
			: 'Your Deposit Request Is Being Verified · Watch Reserve',
		heading: 'Your Deposit Request Is Being Verified',
		formName: 'Deposit Request Form',
		intro: productLabel
			? `As part of our standard verification process for the ${productLabel}, a member of our team will be in touch shortly to complete a brief identity check and arrange your deposit payment.`
			: 'As part of our standard verification process, a member of our team will be in touch shortly to complete a brief identity check and arrange your deposit payment.'
	})
};

function filterRows(rows) {
	return rows.filter(
		(r) => r.value !== undefined && r.value !== null && String(r.value).trim() !== ''
	);
}

function renderSummaryHtmlRows(rows) {
	return filterRows(rows)
		.map(
			(r) => `<tr>
					<td style="padding:6px 12px 6px 0;color:#6b5c55;width:160px;vertical-align:top;">${escapeHtml(r.label)}</td>
					<td style="color:#160b11;white-space:pre-wrap;">${escapeHtml(r.value)}</td>
				</tr>`
		)
		.join('\n');
}

function renderSummaryTextRows(rows) {
	return filterRows(rows).map((r) => `${r.label}: ${r.value}`);
}

function buildHtml({ heading, formName, intro, firstName, summary, submittedAt, signoff }) {
	const greeting = firstName ? `Dear ${escapeHtml(firstName)},` : 'Dear Customer,';
	const summaryHtml = renderSummaryHtmlRows([
		{ label: 'Submitted', value: submittedAt },
		...summary
	]);
	const signoffHtml = escapeHtml(signoff ?? 'Warm regards,\nThe Watch Reserve Team').replace(
		/\n/g,
		'<br/>'
	);

	return `
<!doctype html>
<html>
	<body style="margin:0;padding:24px;background-color:#faf8f6;font-family:Arial,Helvetica,sans-serif;color:#160b11;">
		<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;">

			<tr>
				<td style="padding:28px 32px;border-bottom:2px solid #a1846d;">
					<p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a1846d;font-weight:700;">Watch Reserve</p>
					<h2 style="margin:6px 0 0;font-family:'freight-display-pro',Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#160b11;">${escapeHtml(heading)}</h2>
				</td>
			</tr>

			<tr>
				<td style="padding:28px 32px 16px;">
					<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#3a2a31;">${greeting}</p>
					<p style="margin:0;font-size:14px;line-height:1.7;color:#3a2a31;">Thank you for filling out the ${escapeHtml(formName)}. ${escapeHtml(intro)}</p>
				</td>
			</tr>

			<tr>
				<td style="padding:16px 32px 24px;border-top:1px solid #e5e5e5;">
					<h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:#a1846d;font-weight:700;">Your Submission</h3>
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						${summaryHtml}
					</table>
				</td>
			</tr>

			<tr>
				<td style="padding:20px 32px;background:#f9f5f2;border-top:1px solid #e5e5e5;border-left:3px solid #a1846d;">
					<p style="margin:0 0 8px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#a1846d;font-weight:700;">Need to Speak with Us Sooner?</p>
					<p style="margin:0 0 18px;font-family:'freight-display-pro',Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;color:#160b11;">
						<a href="tel:${PHONE_TEL}" style="color:#160b11;text-decoration:none;">${PHONE_DISPLAY}</a>
					</p>
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;line-height:1.75;">
						<tr>
							<td style="padding:4px 12px 4px 0;color:#6b5c55;width:140px;vertical-align:top;">Address</td>
							<td style="color:#160b11;">${ADDRESS}</td>
						</tr>
						<tr>
							<td style="padding:4px 12px 4px 0;color:#6b5c55;vertical-align:top;">Opening Hours</td>
							<td style="color:#160b11;">${OPENING_HOURS}</td>
						</tr>
					</table>
				</td>
			</tr>

			<tr>
				<td style="padding:24px 32px 28px;border-top:1px solid #e5e5e5;">
					<p style="margin:0;font-size:14px;line-height:1.7;color:#3a2a31;">${signoffHtml}</p>
				</td>
			</tr>

			<tr>
				<td style="padding:18px 32px;background:#faf8f6;border-top:1px solid #e5e5e5;font-size:11px;color:#6b5c55;text-align:center;line-height:1.7;">
					Watch Reserve · ${ADDRESS}<br/>
					<a href="https://www.watchreserve.co.uk" style="color:#a1846d;text-decoration:none;">www.watchreserve.co.uk</a>
				</td>
			</tr>

		</table>
	</body>
</html>`.trim();
}

function buildText({ heading, formName, intro, firstName, summary, submittedAt, signoff }) {
	const greeting = firstName ? `Dear ${firstName},` : 'Dear Customer,';
	const summaryLines = renderSummaryTextRows([
		{ label: 'Submitted', value: submittedAt },
		...summary
	]);
	const signoffLines = (signoff ?? 'Warm regards,\nThe Watch Reserve Team').split('\n');

	return [
		heading,
		'',
		greeting,
		'',
		`Thank you for filling out the ${formName}. ${intro}`,
		'',
		'YOUR SUBMISSION',
		...summaryLines,
		'',
		'NEED TO SPEAK WITH US SOONER?',
		`Phone:         ${PHONE_DISPLAY}`,
		`Address:       ${ADDRESS}`,
		`Opening Hours: ${OPENING_HOURS}`,
		'',
		...signoffLines,
		'',
		`Watch Reserve · ${ADDRESS}`,
		'www.watchreserve.co.uk'
	].join('\n');
}

/**
 * Sends an automated confirmation email to the customer after they submit a form.
 * Errors are swallowed so a Resend outage never breaks a form submission.
 *
 * @param {{
 *   to: string,
 *   firstName?: string,
 *   formType: keyof typeof TEMPLATES,
 *   details?: object,
 *   summary?: Array<{ label: string, value: string }>
 * }} args
 */
export async function sendCustomerConfirmation({
	to,
	firstName,
	formType,
	details = {},
	summary = []
}) {
	if (!to) return;

	const builder = TEMPLATES[formType];
	if (!builder) {
		console.error(`[customerConfirmation] unknown formType: ${formType}`);
		return;
	}

	const template = builder(details);
	const submittedAt = formatSubmittedAt();

	try {
		const { error } = await resend.emails.send({
			from: FROM,
			to: [to],
			replyTo: REPLY_TO,
			subject: template.subject,
			html: buildHtml({ ...template, firstName, summary, submittedAt }),
			text: buildText({ ...template, firstName, summary, submittedAt })
		});

		if (error) {
			console.error('[customerConfirmation] resend error:', error);
		}
	} catch (err) {
		console.error('[customerConfirmation] unexpected error:', err);
	}
}
