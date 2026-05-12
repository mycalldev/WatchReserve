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
 * @param {string} [source] - Which form the submission came from
 */
export async function syncToKlaviyo(email, firstName, gdprConsent, source) {
	if (!email) return;

	const listId = (KLAVIYO_LIST_ID ?? '').trim();
	const trimmedFirstName = (firstName ?? '').trim();
	const trimmedSource = (source ?? '').trim();

	const profileAttributes = {
		email,
		...(trimmedFirstName ? { first_name: trimmedFirstName } : {}),
		...(trimmedSource
			? {
					properties: {
						last_form_source: trimmedSource,
						last_form_submitted_at: new Date().toISOString()
					}
				}
			: {})
	};

	try {
		// Always upsert the profile first so first_name + custom properties land,
		// regardless of consent. The subscribe job below cannot carry custom props.
		await upsertProfile(profileAttributes);

		if (gdprConsent) {
			if (!listId) {
				console.error('[klaviyo] KLAVIYO_LIST_ID is empty — cannot subscribe');
				return;
			}
			const res = await fetch(`${API_BASE}/profile-subscription-bulk-create-jobs/`, {
				method: 'POST',
				headers: headers(),
				body: JSON.stringify({
					data: {
						type: 'profile-subscription-bulk-create-job',
						attributes: {
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
						},
						relationships: {
							list: {
								data: { type: 'list', id: listId }
							}
						}
					}
				})
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				console.error(
					'[klaviyo] subscribe failed:',
					res.status,
					JSON.stringify(body?.errors ?? body)
				);
			}
		}
	} catch (err) {
		console.error('[klaviyo] error:', err);
	}
}

async function upsertProfile(attributes) {
	const res = await fetch(`${API_BASE}/profiles/`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({
			data: {
				type: 'profile',
				attributes
			}
		})
	});
	// 409 = profile already exists — extract the id and PATCH to merge new fields.
	if (res.status === 409) {
		const body = await res.json().catch(() => ({}));
		const existingId = body?.errors?.[0]?.meta?.duplicate_profile_id;
		if (!existingId) return;
		const patch = await fetch(`${API_BASE}/profiles/${existingId}/`, {
			method: 'PATCH',
			headers: headers(),
			body: JSON.stringify({
				data: {
					type: 'profile',
					id: existingId,
					attributes
				}
			})
		});
		if (!patch.ok) {
			const patchBody = await patch.json().catch(() => ({}));
			console.error('[klaviyo] profile patch failed:', patchBody?.errors?.[0]?.detail ?? patch.status);
		}
		return;
	}
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		console.error('[klaviyo] profile create failed:', body?.errors?.[0]?.detail ?? res.status);
	}
}
