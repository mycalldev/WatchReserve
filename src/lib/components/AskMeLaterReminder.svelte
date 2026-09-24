<script>
	import { onMount } from 'svelte';
	import { offerMonth } from '$lib/offerMonth.js';
	import { consumeAskMeLater, setValuationSubmitted } from '$lib/askMeLater.js';
	import { trackEvent } from '$lib/ga.js';
	import FormSuccess from '$lib/components/FormSuccess.svelte';

	let visible = $state(false);
	let animateIn = $state(false);
	let showTimeoutId;

	let submitting = $state(false);
	let submitted = $state(false);
	let submitError = $state('');

	let fullName = $state('');
	let email = $state('');
	let gdprConsent = $state(false);
	let honeypot = $state('');
	let fieldErrors = $state({ fullName: '', email: '' });

	function dismiss() {
		animateIn = false;
		setTimeout(() => {
			visible = false;
		}, 420);
	}

	function validate() {
		const errors = { fullName: '', email: '' };

		if (!fullName.trim()) {
			errors.fullName = 'Please enter your full name.';
		}

		if (!email.trim()) {
			errors.email = 'Please enter your email address.';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			errors.email = 'Please enter a valid email address.';
		}

		fieldErrors = errors;
		return !errors.fullName && !errors.email;
	}

	function clearFieldError(field) {
		if (fieldErrors[field]) fieldErrors = { ...fieldErrors, [field]: '' };
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (submitting || submitted) return;

		if (!validate()) return;

		// Honeypot: a real visitor never fills this hidden field. If it's filled,
		// quietly treat it as success without contacting the server as a genuine lead.
		if (honeypot.trim()) {
			submitted = true;
			setTimeout(() => dismiss(), 3200);
			return;
		}

		submitting = true;
		submitError = '';

		try {
			const res = await fetch('/api/free-valuation', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fullName: fullName.trim(),
					email: email.trim(),
					gdprConsent,
					website: honeypot.trim(),
					source: 'Ask Me Later Reminder · Homepage Popup'
				})
			});
			const data = await res.json();
			if (!res.ok) {
				submitError = data?.error || 'Something went wrong. Please try again.';
			} else {
				setValuationSubmitted();
				submitted = true;
				trackEvent('form_submit', { form_name: 'ask_me_later_reminder' });
				setTimeout(() => dismiss(), 3200);
			}
		} catch {
			submitError = 'Something went wrong. Please try again.';
		} finally {
			submitting = false;
		}
	}

	onMount(() => {
		if (!consumeAskMeLater()) return;

		visible = true;
		// Small delay so the slide-in reads as a deliberate greeting rather than
		// firing the instant the page paints.
		showTimeoutId = setTimeout(() => {
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					animateIn = true;
				})
			);
		}, 700);

		return () => clearTimeout(showTimeoutId);
	});
</script>

{#if visible}
	<div
		class="ask-later-panel"
		class:visible={animateIn}
		role="dialog"
		aria-label="Free valuation reminder"
	>
		<button class="ask-later-close" onclick={dismiss} aria-label="Close">
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>

		{#if submitted}
			<FormSuccess
				message={`A member of our team will be in touch shortly with your free ${$offerMonth} valuation.`}
			/>
		{:else}
			<p class="ask-later-eyebrow">Still Deciding?</p>
			<h3 class="ask-later-title">Your Free {$offerMonth} Valuation Is Ready When You Are</h3>
			<p class="ask-later-text">
				You asked us to check back. The form below takes 30 seconds, with no obligation to sell.
			</p>
			<form class="ask-later-form" onsubmit={handleSubmit} novalidate>
				<input
					type="text"
					name="website"
					bind:value={honeypot}
					tabindex="-1"
					autocomplete="off"
					aria-hidden="true"
					class="ask-later-honeypot"
				/>

				<div class="ask-later-field" class:ask-later-field-invalid={fieldErrors.fullName}>
					<label for="ask-later-name">Full Name</label>
					<input
						id="ask-later-name"
						type="text"
						placeholder="Full Name"
						bind:value={fullName}
						oninput={() => clearFieldError('fullName')}
						autocomplete="name"
					/>
					{#if fieldErrors.fullName}<p class="ask-later-field-error">{fieldErrors.fullName}</p>{/if}
				</div>

				<div class="ask-later-field" class:ask-later-field-invalid={fieldErrors.email}>
					<label for="ask-later-email">Email Address</label>
					<input
						id="ask-later-email"
						type="email"
						placeholder="email@example.com"
						bind:value={email}
						oninput={() => clearFieldError('email')}
						autocomplete="email"
					/>
					{#if fieldErrors.email}<p class="ask-later-field-error">{fieldErrors.email}</p>{/if}
				</div>

				{#if submitError}<p class="ask-later-field-error">{submitError}</p>{/if}

				<label class="ask-later-gdpr">
					<input type="checkbox" bind:checked={gdprConsent} />
					<span>I am happy to receive updates and offers from Watch Reserve by email.</span>
				</label>

				<button type="submit" class="ask-later-cta" disabled={submitting || submitted} aria-busy={submitting}>
					{submitting ? 'Submitting…' : 'Get My Free Valuation'}
				</button>
			</form>
		{/if}
	</div>
{/if}

<style>
	.ask-later-panel {
		position: fixed;
		left: 20px;
		bottom: 20px;
		z-index: 1050;
		width: min(320px, calc(100vw - 40px));
		background: #ffffff;
		border-left: 4px solid #a1846d;
		box-shadow:
			0 20px 50px rgba(22, 11, 17, 0.25),
			0 2px 8px rgba(0, 0, 0, 0.1);
		padding: 26px 26px 24px;
		transform: translateX(-130%);
		opacity: 0;
		transition:
			transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.5s ease;
	}

	.ask-later-panel.visible {
		transform: translateX(0);
		opacity: 1;
	}

	.ask-later-close {
		position: absolute;
		top: 12px;
		right: 12px;
		background: none;
		border: none;
		cursor: pointer;
		color: rgba(22, 11, 17, 0.4);
		padding: 4px;
		display: flex;
		transition: color 0.2s ease;
	}

	.ask-later-close:hover {
		color: #160b11;
	}

	.ask-later-eyebrow {
		margin: 0 0 8px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.ask-later-title {
		margin: 0 0 10px;
		padding-right: 18px;
		font-family: 'freight-display-pro', Georgia, 'Times New Roman', serif;
		font-size: 1.25rem;
		font-weight: 400;
		line-height: 1.25;
		color: #160b11;
	}

	.ask-later-text {
		margin: 0 0 18px;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.86rem;
		font-weight: 300;
		line-height: 1.55;
		color: rgba(22, 11, 17, 0.65);
	}

	.ask-later-cta {
		display: inline-block;
		background: linear-gradient(135deg, #a1846d 0%, #8d7060 100%);
		color: #ffffff;
		text-decoration: none;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 12px 20px;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
	}

	.ask-later-cta:hover {
		opacity: 0.92;
		transform: translateY(-1px);
	}

	.ask-later-cta:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	/* ── FORM ── */
	.ask-later-form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.ask-later-honeypot {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}

	.ask-later-field {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.ask-later-field label {
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #999;
	}

	.ask-later-field input[type='text'],
	.ask-later-field input[type='email'] {
		width: 100%;
		padding: 11px 12px;
		border: 1.5px solid #e8e3e1;
		border-radius: 0;
		background-color: #fdfcfc;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.88rem;
		color: #160b11;
		outline: none;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
		box-sizing: border-box;
	}

	.ask-later-field input:focus {
		border-color: #a1846d;
		background-color: #ffffff;
	}

	.ask-later-field-invalid input {
		border-color: #c94040;
	}

	.ask-later-field-error {
		margin: 0;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.72rem;
		color: #c94040;
	}

	.ask-later-gdpr {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		cursor: pointer;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.76rem;
		line-height: 1.45;
		color: #555;
	}

	.ask-later-gdpr input {
		margin-top: 2px;
		flex-shrink: 0;
		accent-color: #a1846d;
	}

	.ask-later-form .ask-later-cta {
		width: 100%;
		text-align: center;
		border: none;
		cursor: pointer;
	}

	@media (max-width: 520px) {
		.ask-later-panel {
			left: 12px;
			right: 12px;
			bottom: 12px;
			width: auto;
		}
	}
</style>
