<script>
	const TOTAL = 4;
	let step = $state(1);
	let done = $state(false);
	let submitting = $state(false);
	let submitError = $state('');

	let brand = $state('');
	let model = $state('');
	let reference = $state('');
	let year = $state('');

	let condition = $state('');
	let hasBox = $state('');
	let hasPapers = $state('');
	let photos = $state('');

	let preference = $state('both');

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phone = $state('');
	let gdprConsent = $state(false);

	let honeypot = $state('');

	const progressPct = $derived(done ? 100 : (step / TOTAL) * 100);

	function isValidEmail(v) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
	}

	async function submitConsignment() {
		if (honeypot) {
			// Honeypot field was filled in — almost certainly a bot. Pretend
			// success without actually submitting the enquiry.
			done = true;
			return;
		}

		submitError = '';

		if (!firstName.trim() || !lastName.trim() || !isValidEmail(email)) {
			submitError = 'Please provide your name and a valid email address.';
			return;
		}

		submitting = true;
		try {
			const res = await fetch('/api/consignment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					brand,
					model,
					reference,
					year,
					condition,
					hasBox,
					hasPapers,
					photos,
					preference,
					firstName,
					lastName,
					email,
					phone,
					gdprConsent
				})
			});

			const data = await res.json();
			if (!res.ok) {
				submitError = data.error || 'Failed to send your request. Please try again.';
				return;
			}
			done = true;
		} catch {
			submitError = 'Failed to send your request. Please try again.';
		} finally {
			submitting = false;
		}
	}

	function next() {
		if (step < TOTAL) {
			step += 1;
			return;
		}
		submitConsignment();
	}
	function back() {
		if (step > 1) step -= 1;
	}

	const reviews = [
		{
			quote:
				'A pleasure doing business. Honest and 100% reliable. I dealt with Conor, who was incredibly knowledgeable and very competitive on price. I sold him a Patek and bought two pieces. I will definitely be buying again. A great dealer, can 100% recommend.',
			name: 'Danny',
			source: 'Google Review'
		},
		{
			quote:
				'Conor was really professional throughout. He answered all my questions, provided detailed information, and made the entire process feel really trustworthy and safe. I will definitely be working with Watch Reserve again.',
			name: 'Cameron',
			source: 'Google Review'
		},
		{
			quote:
				'Excellent experience, very easy to do business with the team at Watch Reserve. Nice and secure showroom with a good selection of watches on offer. Thanks to Conor and Will for your help, slick trade.',
			name: 'DW',
			source: 'Google Review'
		},
		{
			quote: 'Very professional business and great guy. Conor looked after me. Overall a fantastic experience.',
			name: 'Harry',
			source: 'Google Review'
		}
	];

	let activeReview = $state(0);
	let reviewTimer;

	function goToReview(i) {
		activeReview = i;
		restartReviewTimer();
	}
	function restartReviewTimer() {
		clearInterval(reviewTimer);
		reviewTimer = setInterval(() => {
			activeReview = (activeReview + 1) % reviews.length;
		}, 5500);
	}

	$effect(() => {
		restartReviewTimer();
		return () => clearInterval(reviewTimer);
	});
</script>

<svelte:head>
	<title>Sell or Consign Your Watch | Watch Reserve</title>
</svelte:head>

<div class="cg-page">
	<!-- HERO -->
	<header class="cg-hero">
		<div class="cg-hero-bg"></div>
		<div class="cg-container">
			<div class="cg-hero-inner">
				<h1 class="cg-hero-title">Sell or Consign Your Watch</h1>
				<p class="cg-hero-text">
					We offer two ways to sell your watch. Choose the option that best reflects your priorities, and our
					expert team will take care of everything from there.
				</p>
				<a href="#start" class="cg-btn cg-btn-cream">Get Started</a>
			</div>
		</div>
	</header>

	<!-- OPTIONS -->
	<section class="cg-section">
		<div class="cg-container">
			<div class="cg-section-head cg-center">
				<h2>How Can I Sell My Watch?</h2>
			</div>

			<div class="cg-options">
				<div class="cg-option-col">
					<p class="cg-option-kicker">Option One</p>
					<h3 class="cg-option-title">Consignment</h3>
					<span class="cg-option-tagline">Achieve the best possible price.</span>
					<ul class="cg-option-points">
						<li>We handle the entire sale on your behalf</li>
						<li>Typically achieves a higher price than an outright sale</li>
						<li>Your watch remains yours until it sells</li>
					</ul>
				</div>

				<div class="cg-option-divider"></div>

				<div class="cg-option-col">
					<p class="cg-option-kicker">Option Two</p>
					<h3 class="cg-option-title">Outright Sale</h3>
					<span class="cg-option-tagline">The simplest way to sell your watch.</span>
					<ul class="cg-option-points">
						<li>We buy your watch from you directly</li>
						<li>A firm, competitive offer at current market value</li>
						<li>Payment sent within one working day</li>
					</ul>
				</div>
			</div>

			<p class="cg-options-footnote">Not sure which suits you? <a href="#start">Speak to our team</a>.</p>
		</div>
	</section>

	<!-- HOW IT WORKS -->
	<section class="cg-section cg-how">
		<div class="cg-container">
			<div class="cg-section-head cg-center">
				<p class="cg-eyebrow">How It Works</p>
				<h2>One Simple Process</h2>
			</div>

			<ol class="cg-steps">
				<li>
					<div class="cg-step-title">Share the Details</div>
					<div class="cg-step-body">Get in touch via the form below with the details of your watch.</div>
				</li>
				<li>
					<div class="cg-step-title">Receive Our Offer</div>
					<div class="cg-step-body">
						A free, no obligation offer based on current market conditions, within 24 hours.
						<span class="cg-step-split"
							><span class="cg-tag">Consign &amp; Outright</span>You receive both offers to compare.</span
						>
					</div>
				</li>
				<li>
					<div class="cg-step-title">Send or Bring It In</div>
					<div class="cg-step-body">Ship your watch securely to us, or visit our Canary Wharf boutique.</div>
				</li>
				<li>
					<div class="cg-step-title">Inspection</div>
					<div class="cg-step-body">Our experts confirm authenticity and finalise the agreed price and terms.</div>
				</li>
				<li>
					<div class="cg-step-title">Get Paid</div>
					<div class="cg-step-body">
						<span class="cg-step-split"><span class="cg-tag">Outright</span>Payment within one working day of inspection.</span>
						<span class="cg-step-split"><span class="cg-tag">Consignment</span>Payment once your watch sells.</span>
					</div>
				</li>
			</ol>

			<p class="cg-how-note">
				<span class="cg-tag">For Consignments</span>Your watch is professionally photographed and listed online,
				and you are kept updated at every step while we work to find the right buyer. If it has not sold after 45
				days, you can take it back or review the terms with us.
			</p>
		</div>
	</section>

	<!-- FORM -->
	<section class="cg-section cg-form-section" id="start">
		<div class="cg-container">
			<div class="cg-section-head cg-center">
				<h2>Get Your Instant Valuation</h2>
				<p>Tell us about your watch and our specialists will reply shortly. Confidential, with no obligation.</p>
			</div>

			<div class="cg-form-wrap">
				<div class="cg-form-card">
					<div class="cg-form-progress">
						<span>{done ? 'Complete' : `Step ${step} of ${TOTAL}`}</span>
						<span class="cg-progress-track"
							><span class="cg-progress-fill" style="width:{progressPct}%"></span></span
						>
					</div>

					{#if done}
						<div class="cg-form-done">
							<h3>Thank You</h3>
							<p>Your details are with our team. A specialist will be in touch shortly with your valuation.</p>
						</div>
					{:else}
						<form novalidate onsubmit={(e) => e.preventDefault()}>
							{#if step === 1}
								<div class="cg-field">
									<label for="cg-brand">Brand</label>
									<select id="cg-brand" bind:value={brand}>
										<option value="" disabled selected>Select a brand</option>
										<option>Rolex</option>
										<option>Patek Philippe</option>
										<option>Audemars Piguet</option>
										<option>Omega</option>
										<option>Cartier</option>
										<option>IWC</option>
										<option>Breitling</option>
										<option>Jaeger-LeCoultre</option>
										<option>Panerai</option>
										<option>Tudor</option>
										<option>TAG Heuer</option>
										<option>Hublot</option>
										<option>Other</option>
									</select>
								</div>
								<div class="cg-field-row">
									<div class="cg-field">
										<label for="cg-model">Model</label>
										<input type="text" id="cg-model" placeholder="e.g. Daytona" bind:value={model} />
									</div>
									<div class="cg-field">
										<label for="cg-ref">Reference Number <span class="cg-optional">(optional)</span></label>
										<input type="text" id="cg-ref" placeholder="e.g. 116500LN" bind:value={reference} />
									</div>
								</div>
								<div class="cg-field">
									<label for="cg-year">Year</label>
									<input type="text" id="cg-year" placeholder="e.g. 2021" bind:value={year} />
								</div>
							{:else if step === 2}
								<div class="cg-field">
									<label for="cg-condition">Condition</label>
									<div class="cg-choice-group" id="cg-condition">
										{#each ['Unworn', 'Excellent', 'Good', 'Fair'] as opt}
											<span
												class="cg-choice"
												class:cg-selected={condition === opt}
												onclick={() => (condition = opt)}
												onkeydown={(e) => e.key === 'Enter' && (condition = opt)}
												role="button"
												tabindex="0">{opt}</span
											>
										{/each}
									</div>
								</div>
								<div class="cg-field">
									<label for="cg-box">Do You Have the Box?</label>
									<div class="cg-choice-group" id="cg-box">
										{#each ['Yes', 'No'] as opt}
											<span
												class="cg-choice"
												class:cg-selected={hasBox === opt}
												onclick={() => (hasBox = opt)}
												onkeydown={(e) => e.key === 'Enter' && (hasBox = opt)}
												role="button"
												tabindex="0">{opt}</span
											>
										{/each}
									</div>
								</div>
								<div class="cg-field">
									<label for="cg-papers">Do You Have the Papers?</label>
									<div class="cg-choice-group" id="cg-papers">
										{#each ['Yes', 'No'] as opt}
											<span
												class="cg-choice"
												class:cg-selected={hasPapers === opt}
												onclick={() => (hasPapers = opt)}
												onkeydown={(e) => e.key === 'Enter' && (hasPapers = opt)}
												role="button"
												tabindex="0">{opt}</span
											>
										{/each}
									</div>
								</div>
								<div class="cg-field">
									<label for="cg-photos">Photos <span class="cg-optional">(optional)</span></label>
									<input type="text" id="cg-photos" placeholder="Paste a link, or add photos when we reply" bind:value={photos} />
								</div>
							{:else if step === 3}
								<div class="cg-field">
									<label for="cg-pref">What Are You Looking For? <span class="cg-optional">(optional)</span></label>
									<div class="cg-pref-group" id="cg-pref">
										<div
											class="cg-pref"
											class:cg-selected={preference === 'both'}
											onclick={() => (preference = 'both')}
											onkeydown={(e) => e.key === 'Enter' && (preference = 'both')}
											role="button"
											tabindex="0"
										>
											<span class="cg-pref-radio"></span>
											<span class="cg-pref-text"
												><strong>Show Me Both</strong><span
													>See your consignment estimate and outright offer side by side.</span
												></span
											>
										</div>
										<div
											class="cg-pref"
											class:cg-selected={preference === 'consignment'}
											onclick={() => (preference = 'consignment')}
											onkeydown={(e) => e.key === 'Enter' && (preference = 'consignment')}
											role="button"
											tabindex="0"
										>
											<span class="cg-pref-radio"></span>
											<span class="cg-pref-text"
												><strong>The Best Possible Price</strong><span>Consignment. Sell for the strongest return.</span
												></span
											>
										</div>
										<div
											class="cg-pref"
											class:cg-selected={preference === 'outright'}
											onclick={() => (preference = 'outright')}
											onkeydown={(e) => e.key === 'Enter' && (preference = 'outright')}
											role="button"
											tabindex="0"
										>
											<span class="cg-pref-radio"></span>
											<span class="cg-pref-text"
												><strong>A Fast, Guaranteed Sale</strong><span
													>Outright. Sell to us directly, payment agreed up front.</span
												></span
											>
										</div>
									</div>
								</div>
							{:else if step === 4}
								<div class="cg-field-row">
									<div class="cg-field"><label for="cg-fname">First Name</label><input type="text" id="cg-fname" placeholder="First name" bind:value={firstName} /></div>
									<div class="cg-field"><label for="cg-lname">Last Name</label><input type="text" id="cg-lname" placeholder="Last name" bind:value={lastName} /></div>
								</div>
								<div class="cg-field">
									<label for="cg-email">Email</label><input type="email" id="cg-email" placeholder="you@example.com" bind:value={email} autocomplete="email" />
								</div>
								<div class="cg-field">
									<label for="cg-phone">Phone <span class="cg-optional">(optional)</span></label>
									<input type="tel" id="cg-phone" placeholder="Best number to reach you" bind:value={phone} autocomplete="tel" />
								</div>
								<label class="cg-gdpr-check">
									<input type="checkbox" bind:checked={gdprConsent} class="cg-gdpr-input" />
									<span class="cg-gdpr-box" aria-hidden="true"></span>
									<span class="cg-gdpr-label">I am happy to receive updates and offers from Watch Reserve by email.</span>
								</label>
								{#if submitError}<p class="cg-form-error" role="alert">{submitError}</p>{/if}
							{/if}

							<div class="cg-hp-field" aria-hidden="true">
								<label for="cg-company">Company</label>
								<input
									type="text"
									id="cg-company"
									name="company"
									bind:value={honeypot}
									tabindex="-1"
									autocomplete="off"
								/>
							</div>

							<div class="cg-form-nav">
								<button type="button" class="cg-link-back" hidden={step === 1} onclick={back}>Back</button>
								<button type="button" class="cg-btn cg-btn-primary" onclick={next} disabled={submitting} aria-busy={submitting}
									>{step === TOTAL ? (submitting ? 'Submitting…' : 'Submit') : 'Continue'}</button
								>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- REVIEWS -->
	<section class="cg-section cg-reviews">
		<div class="cg-container">
			<div class="cg-reviews-grid">
				<div class="cg-review-block">
					<div class="cg-review-stage">
						{#each reviews as review, i}
							<div class="cg-review-slide" class:cg-active={activeReview === i}>
								<div class="cg-stars">★ ★ ★ ★ ★</div>
								<p class="cg-review-quote">"{review.quote}"</p>
								<p class="cg-review-name">{review.name} <span class="cg-review-source">{review.source}</span></p>
							</div>
						{/each}
					</div>
					<div class="cg-review-dots">
						{#each reviews as _, i}
							<button
								class="cg-review-dot"
								class:cg-active={activeReview === i}
								aria-label="Review {i + 1}"
								onclick={() => goToReview(i)}
							></button>
						{/each}
					</div>
				</div>

				<div class="cg-contact-block">
					<h3>Prefer to Speak With Us?</h3>
					<div class="cg-contact-line">
						<div class="cg-label">Call</div>
						<div class="cg-value"><a href="tel:02081501987">0208 150 1987</a></div>
					</div>
					<div class="cg-contact-line">
						<div class="cg-label">Email</div>
						<div class="cg-value"><a href="mailto:info@watchreserve.co.uk">info@watchreserve.co.uk</a></div>
					</div>
					<div class="cg-contact-line">
						<div class="cg-label">Visit</div>
						<div class="cg-value">25 Cabot Square, Canary Wharf, London, E14 4QA</div>
					</div>
					<div class="cg-contact-line">
						<div class="cg-label">Hours</div>
						<div class="cg-value">By appointment only</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.cg-page {
		--white: #ffffff;
		--cream: #faf4f3;
		--maroon: #422635;
		--deep-maroon: #160b11;

		--maroon-70: rgba(66, 38, 53, 0.7);
		--maroon-45: rgba(66, 38, 53, 0.45);
		--maroon-15: rgba(66, 38, 53, 0.15);
		--maroon-08: rgba(66, 38, 53, 0.08);

		--cream-70: rgba(250, 244, 243, 0.7);
		--cream-45: rgba(250, 244, 243, 0.45);
		--cream-18: rgba(250, 244, 243, 0.18);

		--font-head: 'Georgia', 'Times New Roman', serif;
		--font-ui: 'Montserrat', Arial, sans-serif;

		--space-section: 52px;
		--max-width: 1200px;
		--gutter: 32px;

		background: var(--cream);
		color: var(--maroon);
		font-family: var(--font-ui);
		font-weight: 300;
		font-size: 16px;
		line-height: 1.7;
	}

	.cg-page :global(h1),
	.cg-page :global(h2),
	.cg-page :global(h3) {
		font-family: var(--font-head);
		font-weight: 400;
		letter-spacing: -0.01em;
		line-height: 1.12;
		color: var(--maroon);
		margin: 0;
	}
	.cg-page :global(h1) { font-size: clamp(2.6rem, 6vw, 4.2rem); }
	.cg-page :global(h2) { font-size: clamp(2rem, 4vw, 3rem); }
	.cg-page :global(h3) { font-size: clamp(1.4rem, 2.5vw, 1.9rem); }
	.cg-page :global(a) { color: inherit; }

	.cg-eyebrow {
		font-family: var(--font-ui);
		font-weight: 600;
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--maroon-70);
		margin: 0;
	}

	.cg-container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--gutter); }

	/* HERO */
	.cg-hero { position: relative; min-height: 64vh; display: flex; align-items: center; overflow: hidden; }
	.cg-hero-bg {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, rgba(22, 11, 17, 0.72) 0%, rgba(22, 11, 17, 0.45) 45%, rgba(22, 11, 17, 0.1) 100%),
			linear-gradient(to top, rgba(22, 11, 17, 0.55) 0%, rgba(22, 11, 17, 0) 45%),
			url('/assets/consignment_hero.jpg') center/cover no-repeat;
	}
	.cg-hero .cg-container { width: 100%; }
	.cg-hero-inner { position: relative; z-index: 2; max-width: 520px; padding: 20px 0; }
	.cg-hero-eyebrow {
		font-family: var(--font-ui);
		font-weight: 600;
		font-size: 0.72rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--white);
		opacity: 0.85;
		margin-bottom: 26px;
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.cg-hero-eyebrow::before { content: ''; width: 44px; height: 1px; background: var(--white); opacity: 0.6; }
	.cg-hero .cg-hero-title { color: var(--white); margin-bottom: 24px; line-height: 1.06; max-width: 440px; }
	.cg-hero-text { color: var(--white); opacity: 0.9; font-size: 1.02rem; font-weight: 300; max-width: 400px; margin: 0 0 34px; }

	/* BUTTONS */
	.cg-btn {
		display: inline-block;
		font-family: var(--font-ui);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		padding: 16px 36px;
		border: 1px solid transparent;
		cursor: pointer;
		text-decoration: none;
		transition: background 0.2s, color 0.2s, border-color 0.2s;
	}
	.cg-btn-primary { background: var(--maroon); color: var(--cream); }
	.cg-btn-primary:hover { background: var(--deep-maroon); }
	.cg-btn-cream { background: var(--cream); color: var(--maroon); }
	.cg-btn-cream:hover { background: var(--white); }

	/* SECTION SHELL */
	.cg-section { padding: var(--space-section) 0; }
	.cg-section-head { max-width: 620px; margin-bottom: 32px; }
	.cg-center { margin-left: auto; margin-right: auto; text-align: center; }
	.cg-section-head p { margin-top: 12px; color: var(--maroon-70); font-size: 0.98rem; }

	/* OPTIONS */
	.cg-options { display: grid; grid-template-columns: 1fr 1px 1fr; gap: 56px; max-width: 940px; margin: 0 auto; align-items: start; }
	.cg-option-divider { background: var(--maroon-15); width: 1px; align-self: stretch; }
	.cg-option-col { text-align: center; }
	.cg-option-kicker {
		font-family: var(--font-ui);
		font-weight: 600;
		font-size: 0.64rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--maroon-45);
		margin: 0 0 6px;
	}
	.cg-option-title { font-size: clamp(1.8rem, 3vw, 2.3rem); margin-bottom: 12px; }
	.cg-option-tagline {
		display: block;
		font-family: var(--font-head);
		font-size: 1.15rem;
		color: var(--maroon);
		margin: 0 auto 22px;
		max-width: 340px;
		padding-bottom: 22px;
		border-bottom: 1px solid var(--maroon-15);
	}
	.cg-option-points { list-style: none; text-align: left; display: inline-block; margin: 0; padding: 0; }
	.cg-option-points li {
		font-size: 0.94rem;
		font-weight: 300;
		color: var(--maroon);
		padding: 8px 0 8px 26px;
		position: relative;
		line-height: 1.5;
	}
	.cg-option-points li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 15px;
		width: 7px;
		height: 7px;
		transform: rotate(45deg);
		border: 1px solid var(--maroon-45);
	}
	.cg-options-footnote { text-align: center; margin: 30px auto 0; max-width: 900px; font-size: 0.82rem; font-weight: 300; color: var(--maroon-45); }
	.cg-options-footnote a { color: var(--maroon-70); font-weight: 400; text-decoration: underline; text-underline-offset: 3px; }

	@media (max-width: 760px) {
		.cg-options { grid-template-columns: 1fr; gap: 40px; }
		.cg-option-divider { display: none; }
	}

	/* HOW IT WORKS */
	.cg-how { background: var(--maroon); color: var(--cream); }
	.cg-how :global(h2) { color: var(--cream); }
	.cg-how .cg-eyebrow { color: var(--cream); opacity: 0.75; }

	.cg-steps { list-style: none; counter-reset: step; display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; margin: 0; padding: 0; }
	.cg-steps li { position: relative; padding-top: 62px; text-align: center; }
	.cg-steps li::before {
		content: counter(step);
		counter-increment: step;
		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--cream-45);
		border-radius: 50%;
		font-family: var(--font-head);
		font-size: 1.15rem;
		color: var(--cream);
		background: var(--maroon);
		z-index: 1;
	}
	.cg-steps li::after {
		content: '';
		position: absolute;
		left: calc(50% + 22px);
		top: 22px;
		width: calc(100% + 24px - 44px);
		height: 1px;
		background: var(--cream-18);
	}
	.cg-steps li:last-child::after { display: none; }
	.cg-step-title { font-family: var(--font-ui); font-weight: 600; font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cream); margin-bottom: 9px; }
	.cg-step-body { font-size: 0.9rem; font-weight: 500; color: var(--cream-70); line-height: 1.55; }
	.cg-step-split { display: block; margin-top: 8px; }
	.cg-step-split .cg-tag {
		font-family: var(--font-ui);
		font-weight: 600;
		font-size: 0.6rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--cream);
		opacity: 0.6;
		display: block;
		margin-bottom: 1px;
	}
	.cg-how-note { margin-top: 38px; padding-top: 24px; border-top: 1px solid var(--cream-18); font-size: 0.9rem; font-weight: 300; color: var(--cream-70); max-width: 820px; }
	.cg-how-note .cg-tag { font-family: var(--font-ui); font-weight: 600; font-size: 0.64rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cream); opacity: 0.75; margin-right: 8px; }

	@media (max-width: 820px) {
		.cg-steps { grid-template-columns: 1fr 1fr; gap: 34px 24px; }
		.cg-steps li::after { display: none; }
	}
	@media (max-width: 520px) { .cg-steps { grid-template-columns: 1fr; } }

	/* FORM */
	.cg-form-section { background: linear-gradient(180deg, var(--cream) 0%, #f3e9e7 100%); }
	.cg-form-wrap { max-width: 1080px; margin: 0 auto; }
	.cg-form-card { background: var(--white); border: 1px solid var(--maroon-15); padding: 52px 60px; box-shadow: 0 30px 70px rgba(22, 11, 17, 0.1); }
	.cg-form-progress {
		font-family: var(--font-ui);
		font-weight: 600;
		font-size: 0.66rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--maroon-45);
		margin-bottom: 26px;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.cg-progress-track { flex: 1; height: 2px; background: var(--maroon-15); position: relative; }
	.cg-progress-fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--maroon); transition: width 0.35s ease; }

	.cg-field { margin-bottom: 22px; }
	.cg-field label {
		display: block;
		font-family: var(--font-ui);
		font-weight: 600;
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--maroon-70);
		margin-bottom: 9px;
	}
	.cg-optional { font-weight: 400; opacity: 0.6; letter-spacing: 0.08em; }
	.cg-field input[type='text'],
	.cg-field select {
		width: 100%;
		font-family: var(--font-ui);
		font-size: 0.95rem;
		font-weight: 300;
		color: var(--maroon);
		padding: 13px 14px;
		background: var(--white);
		border: 1px solid var(--maroon-15);
		border-radius: 0;
		outline: none;
		transition: border-color 0.2s;
	}
	.cg-field input:focus,
	.cg-field select:focus { border-color: var(--maroon); }
	.cg-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
	@media (max-width: 520px) { .cg-field-row { grid-template-columns: 1fr; } }

	.cg-choice-group { display: flex; flex-wrap: wrap; gap: 10px; }
	.cg-choice {
		font-family: var(--font-ui);
		font-size: 0.8rem;
		font-weight: 400;
		padding: 10px 18px;
		background: var(--white);
		border: 1px solid var(--maroon-15);
		cursor: pointer;
		user-select: none;
		transition: background 0.15s, color 0.15s, border-color 0.15s;
	}
	.cg-choice:hover { border-color: var(--maroon-45); }
	.cg-choice.cg-selected { background: var(--maroon); color: var(--cream); border-color: var(--maroon); }

	.cg-pref-group { display: grid; gap: 10px; }
	.cg-pref {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 16px 18px;
		background: var(--white);
		border: 1px solid var(--maroon-15);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
	}
	.cg-pref:hover { border-color: var(--maroon-45); }
	.cg-pref.cg-selected { border-color: var(--maroon); background: var(--maroon-08); }
	.cg-pref-radio { flex-shrink: 0; margin-top: 3px; width: 16px; height: 16px; border-radius: 50%; border: 1px solid var(--maroon-45); position: relative; }
	.cg-pref.cg-selected .cg-pref-radio { border-color: var(--maroon); }
	.cg-pref.cg-selected .cg-pref-radio::after { content: ''; position: absolute; inset: 3px; background: var(--maroon); border-radius: 50%; }
	.cg-pref-text strong { display: block; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.04em; margin-bottom: 2px; }
	.cg-pref-text span { font-size: 0.82rem; font-weight: 300; color: var(--maroon-70); }

	.cg-hp-field {
		position: absolute;
		left: -9999px;
		top: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.cg-gdpr-check { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; user-select: none; margin-top: 18px; }
	.cg-gdpr-input { position: absolute; opacity: 0; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }
	.cg-gdpr-box { flex-shrink: 0; width: 16px; height: 16px; border: 1.5px solid var(--maroon-15); background-color: var(--white); position: relative; margin-top: 1px; transition: border-color 0.2s ease, background-color 0.2s ease; }
	.cg-gdpr-check:hover .cg-gdpr-box { border-color: var(--maroon-45); }
	.cg-gdpr-input:checked + .cg-gdpr-box { background-color: var(--maroon-45); border-color: var(--maroon-45); }
	.cg-gdpr-input:checked + .cg-gdpr-box::after {
		content: '';
		position: absolute;
		left: 4px;
		top: 1px;
		width: 5px;
		height: 9px;
		border: 2px solid var(--white);
		border-top: none;
		border-left: none;
		transform: rotate(45deg);
	}
	.cg-gdpr-label { font-family: var(--font-ui); font-size: 0.82rem; font-weight: 300; color: var(--maroon-70); line-height: 1.55; }

	.cg-form-error { margin-top: 14px; font-family: var(--font-ui); font-size: 0.8rem; color: #a33; }
	.cg-form-nav { display: flex; justify-content: flex-end; align-items: center; margin-top: 32px; gap: 14px; }
	.cg-link-back {
		background: none;
		border: none;
		cursor: pointer;
		margin-right: auto;
		font-family: var(--font-ui);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--maroon-45);
	}
	.cg-link-back:hover { color: var(--maroon); }
	.cg-link-back[hidden] { visibility: hidden; }

	.cg-form-done { text-align: center; padding: 20px 0; }
	.cg-form-done h3 { margin-bottom: 14px; }
	.cg-form-done p { color: var(--maroon-70); font-weight: 300; margin: 0; }

	@media (max-width: 620px) { .cg-form-card { padding: 36px 28px; } }

	/* REVIEWS */
	.cg-reviews { position: relative; background: var(--maroon); color: var(--cream); overflow: hidden; }
	.cg-reviews::before {
		content: '';
		position: absolute;
		top: 50%;
		left: calc(var(--gutter) + 26%);
		transform: translate(-50%, -50%);
		width: 640px;
		height: 640px;
		background: url('/logo.png') center/contain no-repeat;
		opacity: 0.03;
		pointer-events: none;
		z-index: 0;
	}
	.cg-reviews-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 64px; align-items: center; }
	.cg-review-stage { position: relative; min-height: 340px; }
	.cg-review-slide { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-start; opacity: 0; transition: opacity 0.6s ease; pointer-events: none; }
	.cg-review-slide.cg-active { opacity: 1; pointer-events: auto; }
	.cg-stars { color: var(--cream); letter-spacing: 4px; font-size: 0.9rem; margin: 0 0 20px; opacity: 0.85; }
	.cg-review-quote { font-family: var(--font-head); font-size: clamp(1.35rem, 2.6vw, 1.85rem); line-height: 1.38; color: var(--cream); margin: 0 0 22px; }
	.cg-review-name { font-family: var(--font-ui); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cream); opacity: 0.7; margin: 0; }
	.cg-review-source { font-weight: 400; opacity: 0.65; margin-left: 8px; }
	.cg-review-dots { display: flex; gap: 10px; margin-top: 56px; }
	.cg-review-dot { width: 8px; height: 8px; border-radius: 50%; background: transparent; border: 1px solid var(--cream-45); cursor: pointer; padding: 0; transition: background 0.2s; }
	.cg-review-dot.cg-active { background: var(--cream); border-color: var(--cream); }

	.cg-contact-block { border-left: 1px solid var(--cream-18); padding-left: 60px; }
	.cg-contact-block h3 { color: var(--cream); margin-bottom: 22px; }
	.cg-contact-line { margin-bottom: 20px; }
	.cg-label { font-family: var(--font-ui); font-weight: 600; font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cream); opacity: 0.55; margin-bottom: 5px; }
	.cg-value { font-size: 0.98rem; font-weight: 300; color: var(--cream); }
	.cg-value a { color: var(--cream); text-decoration: none; border-bottom: 1px solid var(--cream-45); padding-bottom: 1px; }
	.cg-value a:hover { border-color: var(--cream); }

	@media (max-width: 820px) {
		.cg-reviews-grid { grid-template-columns: 1fr; gap: 48px; }
		.cg-contact-block { border-left: none; border-top: 1px solid var(--cream-18); padding-left: 0; padding-top: 44px; }
	}
</style>
