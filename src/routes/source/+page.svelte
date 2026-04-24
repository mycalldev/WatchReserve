<script>
	let sf = $state({ fullName: '', email: '', brand: '', model: '', reference: '' });
	let sfSubmitting = $state(false);
	let sfSubmitted = $state(false);
	let sfAttempted = $state(false);
	let sfErrors = $state({});

	function validateSf() {
		const e = {};
		if (sf.fullName.trim().length < 2)                     e.fullName = 'Please enter your full name.';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sf.email))     e.email    = 'Please enter a valid email address.';
		if (!sf.brand.trim())                                  e.brand    = 'Please enter the watch brand.';
		if (!sf.model.trim())                                  e.model    = 'Please enter the watch model.';
		return e;
	}

	async function handleSfSubmit(e) {
		e.preventDefault();
		sfAttempted = true;
		sfErrors = validateSf();
		if (Object.keys(sfErrors).length > 0) return;
		sfSubmitting = true;

		try {
			const res = await fetch('/api/source-request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fullName:  sf.fullName,
					email:     sf.email,
					brand:     sf.brand,
					model:     sf.model,
					reference: sf.reference
				})
			});

			const data = await res.json();
			if (!res.ok) {
				console.error('[source-request]', data.error);
			}
		} catch (err) {
			console.error('[source-request] fetch error:', err);
		} finally {
			sfSubmitting = false;
			sfSubmitted = true;
		}
	}

	$effect(() => {
		if (sfAttempted) sfErrors = validateSf();
	});
</script>

<section class="source-hero-section">
	<div class="source-hero-container">
		<div class="source-hero-content">
			<h1 class="source-hero-heading">
				Let Us Source Your Next Timepiece
			</h1>
			<p class="source-hero-text">
				From hard-to-find classics to the latest releases, we tap into our global network to help you secure the perfect watch without delay or pressure.
			</p>
		</div>
	</div>
</section>

<section class="contact-section">
	<div class="contact-container">
		<div class="contact-info">
			<p class="contact-eyebrow">Get in Touch</p>
			<h2 class="contact-heading">Tell Us What You're Looking For</h2>
			<p class="contact-text">
				Describe the watch you're after and one of our sourcing specialists will be in touch within 24 hours. The more detail you can provide, the better we can match you with the right piece.
			</p>
		</div>
		<div class="sf-wrap">
			<div class="sf-head">
				<span class="sf-eyebrow">Sourcing Request</span>
				<div class="sf-rule"></div>
			</div>

			{#if sfSubmitted}
				<div class="sf-success" role="status" aria-live="polite">
					<div class="sf-success-icon" aria-hidden="true">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 6L9 17l-5-5"/>
						</svg>
					</div>
					<div>
						<p class="sf-success-title">Request received</p>
						<p class="sf-success-body">A sourcing specialist will be in touch within 24 hours.</p>
					</div>
				</div>
			{:else}
				<form class="sf-form" onsubmit={handleSfSubmit} novalidate>

					<div class="sf-row-2">
						<div class="sf-field" class:sf-field--error={sfAttempted && sfErrors.fullName}>
							<label for="sf-fullname" class="sf-label">Full Name <span class="sf-req" aria-hidden="true">*</span></label>
							<input id="sf-fullname" type="text" class="sf-input" placeholder="Jane Smith" autocomplete="name" bind:value={sf.fullName} />
							{#if sfAttempted && sfErrors.fullName}<p class="sf-hint-err">{sfErrors.fullName}</p>{/if}
						</div>

						<div class="sf-field" class:sf-field--error={sfAttempted && sfErrors.email}>
							<label for="sf-email" class="sf-label">Email Address <span class="sf-req" aria-hidden="true">*</span></label>
							<input id="sf-email" type="email" class="sf-input" placeholder="email@example.com" autocomplete="email" bind:value={sf.email} />
							{#if sfAttempted && sfErrors.email}<p class="sf-hint-err">{sfErrors.email}</p>{/if}
						</div>
					</div>

					<div class="sf-row-2">
						<div class="sf-field" class:sf-field--error={sfAttempted && sfErrors.brand}>
							<label for="sf-brand" class="sf-label">Brand <span class="sf-req" aria-hidden="true">*</span></label>
							<input id="sf-brand" type="text" class="sf-input" placeholder="e.g. Rolex" bind:value={sf.brand} />
							{#if sfAttempted && sfErrors.brand}<p class="sf-hint-err">{sfErrors.brand}</p>{/if}
						</div>

						<div class="sf-field" class:sf-field--error={sfAttempted && sfErrors.model}>
							<label for="sf-model" class="sf-label">Model <span class="sf-req" aria-hidden="true">*</span></label>
							<input id="sf-model" type="text" class="sf-input" placeholder="e.g. Submariner" bind:value={sf.model} />
							{#if sfAttempted && sfErrors.model}<p class="sf-hint-err">{sfErrors.model}</p>{/if}
						</div>
					</div>

					<div class="sf-field">
						<label for="sf-reference" class="sf-label">Reference <span class="sf-optional">Optional</span></label>
						<input id="sf-reference" type="text" class="sf-input" placeholder="e.g. 126610LN" bind:value={sf.reference} />
					</div>

					<div class="sf-privacy">
						By submitting you agree to our <a href="/privacy-policy" class="sf-privacy-link">Privacy Policy</a>.
					</div>

					<button type="submit" class="sf-submit" disabled={sfSubmitting} aria-busy={sfSubmitting}>
						{#if sfSubmitting}
							<span class="sf-spinner" aria-hidden="true"></span>
							Sending…
						{:else}
							Submit Request
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
						{/if}
					</button>

				</form>
			{/if}
		</div>
	</div>
</section>

<section class="steps-section">
	<div class="steps-container">
		<div class="steps-header">
			<p class="steps-eyebrow">The Process</p>
			<h2 class="steps-title">Why Use Our Sourcing Service?</h2>
			<p class="steps-subtitle">
				Three simple steps stand between you and your next investment-grade timepiece.
			</p>
		</div>

		<div class="steps-grid">
			<!-- Step 1 -->
			<div class="step">
				<div class="step-number-wrap">
					<span class="step-number">01</span>
					<div class="step-line" aria-hidden="true"></div>
				</div>
				<div class="step-content">
					<h3 class="step-heading">Global Network Access</h3>
					<p class="step-text">
						We connect with a worldwide network of reputable suppliers to locate rare and in-demand watches quickly — pieces that rarely surface on the open market.
					</p>
				</div>
			</div>

			<!-- Step 2 -->
			<div class="step">
				<div class="step-number-wrap">
					<span class="step-number">02</span>
					<div class="step-line" aria-hidden="true"></div>
				</div>
				<div class="step-content">
					<h3 class="step-heading">Fair, Transparent Pricing</h3>
					<p class="step-text">
						You'll receive upfront, honest pricing with no pressure to commit. We only move forward when the watch and the terms are right for you.
					</p>
				</div>
			</div>

			<!-- Step 3 -->
			<div class="step">
				<div class="step-number-wrap">
					<span class="step-number">03</span>
				</div>
				<div class="step-content">
					<h3 class="step-heading">White-Glove Delivery</h3>
					<p class="step-text">
						Backed by five-star reviews and years of expertise, we deliver your timepiece with insured, seamless service from first enquiry to your wrist.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.source-hero-section {
		position: relative;
		width: 100%;
		min-height: 80vh;
		display: flex;
		align-items: center;
		background-image: url('/assets/lifestyle/Source_Hero.avif');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.source-hero-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.7) 0%,
			rgba(0, 0, 0, 0.4) 50%,
			rgba(0, 0, 0, 0.1) 100%
		);
		z-index: 1;
	}

	.source-hero-container {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 100px 0;
	}

	.source-hero-content {
		max-width: 600px;
		width: 100%;
		padding-left: 40px;
	}

	.source-hero-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 32px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
		text-align: left;
	}

	.source-hero-heading em {
		font-style: italic;
		font-weight: 400;
	}

	.source-hero-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1rem, 1.5vw, 1.25rem);
		color: #ffffff;
		margin: 0 0 48px 0;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		text-align: left;
		opacity: 0.95;
	}

	@media (max-width: 1024px) {
		.source-hero-container {
			padding: 80px 0;
		}

		.source-hero-content {
			max-width: 100%;
			padding-left: 30px;
		}
	}

	@media (max-width: 768px) {
		.source-hero-section {
			min-height: 70vh;
		}

		.source-hero-container {
			padding: 60px 0;
		}

		.source-hero-content {
			padding-left: 20px;
		}

		.source-hero-heading {
			margin: 0 0 24px 0;
		}

		.source-hero-text {
			margin: 0 0 40px 0;
		}
	}

	@media (max-width: 480px) {
		.source-hero-section {
			min-height: 60vh;
		}

		.source-hero-container {
			padding: 40px 0;
		}

		.source-hero-content {
			padding-left: 20px;
		}
	}

	/* ── STEPS SECTION ── */
	.steps-section {
		width: 100%;
		position: relative;
		background-image: url('/assets/hero/Meteorite-Prod.jpg');
		background-size: cover;
		background-position: center;
		padding: 100px 40px;
		box-sizing: border-box;
	}

	.steps-section::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(22, 11, 17, 0.78);
	}

	.steps-container {
		max-width: 1100px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}

	/* Header */
	.steps-header {
		text-align: center;
		margin-bottom: 80px;
	}

	.steps-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 16px 0;
	}

	.steps-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 20px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.steps-subtitle {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.0625rem);
		color: rgba(255, 255, 255, 0.65);
		margin: 0 auto;
		line-height: 1.65;
		max-width: 520px;
		font-weight: 300;
	}

	/* Grid */
	.steps-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0;
	}

	/* Individual step */
	.step {
		padding: 0 48px 0 0;
		box-sizing: border-box;
	}

	.step:last-child {
		padding-right: 0;
	}

	/* Number + connector line */
	.step-number-wrap {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-bottom: 28px;
	}

	.step-number {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 3rem;
		font-weight: 400;
		color: #a1846d;
		line-height: 1;
		letter-spacing: -0.03em;
		flex-shrink: 0;
	}

	.step-line {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, rgba(161, 132, 109, 0.4), rgba(161, 132, 109, 0.1));
	}

	/* Step copy */
	.step-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.1rem, 1.5vw, 1.3rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 14px 0;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	.step-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9rem, 1.1vw, 1rem);
		color: rgba(255, 255, 255, 0.62);
		line-height: 1.7;
		font-weight: 300;
		margin: 0;
		letter-spacing: 0.01em;
	}

	/* Responsive */
	@media (max-width: 900px) {
		.steps-section {
			padding: 80px 30px;
		}

		.steps-header {
			margin-bottom: 60px;
		}

		.steps-grid {
			grid-template-columns: 1fr;
			gap: 52px;
		}

		.step {
			padding: 0;
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 0 32px;
			align-items: start;
		}

		.step-number-wrap {
			flex-direction: column;
			align-items: center;
			gap: 12px;
			margin-bottom: 0;
		}

		.step-line {
			width: 1px;
			height: 100%;
			min-height: 60px;
			background: linear-gradient(180deg, rgba(161, 132, 109, 0.4), rgba(161, 132, 109, 0.1));
		}

		.step:last-child .step-line {
			display: none;
		}

		.step-content {
			padding-top: 6px;
		}
	}

	@media (max-width: 480px) {
		.steps-section {
			padding: 60px 20px;
		}

		.steps-header {
			margin-bottom: 48px;
		}

		.step {
			grid-template-columns: auto 1fr;
			gap: 0 24px;
		}

		.step-number {
			font-size: 2.25rem;
		}
	}

	/* ── CONTACT SECTION ── */
	.contact-section {
		width: 100%;
		background-color: #faf8f6;
		padding: 100px 40px;
		box-sizing: border-box;
		border-top: 1px solid rgba(161, 132, 109, 0.15);
	}

	.contact-container {
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: start;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.contact-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0;
	}

	.contact-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.25;
		letter-spacing: -0.02em;
	}

	.contact-text {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9rem, 1.1vw, 1rem);
		color: #6b5c55;
		line-height: 1.7;
		font-weight: 300;
		margin: 0;
	}

	@media (max-width: 900px) {
		.contact-section {
			padding: 80px 30px;
		}

		.contact-container {
			grid-template-columns: 1fr;
			gap: 48px;
		}
	}

	@media (max-width: 480px) {
		.contact-section {
			padding: 60px 20px;
		}
	}

	/* ── SOURCE FORM ── */
	.sf-wrap { width: 100%; }

	.sf-head {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 36px;
	}

	.sf-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		white-space: nowrap;
	}

	.sf-rule {
		flex: 1;
		height: 1px;
		background: linear-gradient(to right, rgba(22,11,17,0.15), transparent);
	}

	.sf-form {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.sf-row-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.sf-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.sf-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #3a2e33;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.sf-req { color: #a1846d; font-size: 0.8rem; }

	.sf-optional {
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		color: #aaa;
		text-transform: uppercase;
	}

	.sf-input {
		width: 100%;
		box-sizing: border-box;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9375rem;
		color: #160b11;
		background-color: #ffffff;
		border: 1px solid #d8d0c8;
		border-bottom: 2px solid #d8d0c8;
		padding: 13px 16px;
		outline: none;
		transition: border-color 0.2s ease, background-color 0.2s ease;
		-webkit-appearance: none;
	}

	.sf-input::placeholder { color: #b8b0a8; }

	.sf-input:focus {
		border-color: rgba(22,11,17,0.2);
		border-bottom-color: #a1846d;
		background-color: #fefcfb;
	}

	.sf-field--error .sf-input {
		border-bottom-color: #c94040;
		background-color: #fff8f8;
	}

	.sf-hint-err {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		color: #c94040;
		margin: 0;
	}

	.sf-privacy {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		color: rgba(22, 11, 17, 0.45);
		line-height: 1.6;
		padding-top: 4px;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
	}

	.sf-privacy-link {
		color: #a1846d;
		text-decoration: none;
		border-bottom: 1px solid rgba(161, 132, 109, 0.35);
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.sf-privacy-link:hover { color: #8a6f59; border-color: #8a6f59; }

	.sf-submit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		padding: 16px 32px;
		background-color: #a1846d;
		color: #ffffff;
		border: none;
		border-radius: 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease, gap 0.25s ease;
		margin-top: 4px;
	}

	.sf-submit:hover:not(:disabled) {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(161, 132, 109, 0.32);
		gap: 14px;
	}

	.sf-submit:active:not(:disabled) { transform: translateY(0); }

	.sf-submit:disabled { opacity: 0.55; cursor: not-allowed; }

	.sf-spinner {
		width: 15px;
		height: 15px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: sf-spin 0.65s linear infinite;
		flex-shrink: 0;
	}

	@keyframes sf-spin { to { transform: rotate(360deg); } }

	.sf-success {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		background-color: #f4f9f5;
		border: 1px solid rgba(34, 160, 90, 0.22);
		border-left: 3px solid #22a05a;
		padding: 20px 24px;
	}

	.sf-success-icon {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		background-color: #22a05a;
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sf-success-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1rem;
		color: #1a4a2e;
		margin: 0 0 4px;
	}

	.sf-success-body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: rgba(26, 74, 46, 0.8);
		margin: 0;
		line-height: 1.5;
	}

	@media (max-width: 640px) {
		.sf-row-2 {
			grid-template-columns: 1fr;
		}
	}
</style>

