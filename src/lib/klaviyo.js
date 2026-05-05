import { KLAVIYO_PRIVATE_KEY, KLAVIYO_LIST_ID } from '$env/static/private';

const API_BASE = 'https://a.klaviyo.com/api';
const REVISION = '2024-10-15';

function headers() {
	return {
		Authorization: `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
		'Content-Type': 'application/json',
		revision: REVISION
	};
}

/**
 * Syncs a contact to Klaviyo.
 * - gdprConsent true  → subscribes to the marketing list (KLAVIYO_LIST_ID)
 * - gdprConsent false → creates/updates the profile only, no subscription
 *
 * Errors are swallowed so a Klaviyo outage never breaks a form submission.
 *
 * @param {string} email
 * @param {string} firstName
 * @param {boolean} gdprConsent
 */
export async function syncToKlaviyo(email, firstName, gdprConsent) {
	if (!email) return;

	try {
		if (gdprConsent) {
			const res = await fetch(`${API_BASE}/profile-subscription-bulk-create-jobs/`, {
				method: 'POST',
				headers: headers(),
				body: JSON.stringify({
					data: {
						type: 'profile-subscription-bulk-create-job',
						attributes: {
							list_id: KLAVIYO_LIST_ID,
							profiles: {
								data: [
									{
										type: 'profile',
										attributes: {
											email,
											subscriptions: {
												email: { marketing: { consent: 'SUBSCRIBED' } }
											}
										}
									}
								]
							}
						}
					}
				})
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				console.error('[klaviyo] subscribe failed:', body?.errors?.[0]?.detail ?? res.status);
			}
		} else {
			// Profile-only — no list subscription
			const res = await fetch(`${API_BASE}/profiles/`, {
				method: 'POST',
				headers: headers(),
				body: JSON.stringify({
					data: {
						type: 'profile',
						attributes: {
							email,
							first_name: firstName || ''
						}
					}
				})
			});
			// 409 = profile already exists, not an error
			if (!res.ok && res.status !== 409) {
				const body = await res.json().catch(() => ({}));
				console.error('[klaviyo] profile create failed:', body?.errors?.[0]?.detail ?? res.status);
			}
		}
	} catch (err) {
		console.error('[klaviyo] error:', err);
	}
}
