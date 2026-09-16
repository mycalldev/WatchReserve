<script>
	import { browser } from '$app/environment';

	const STORAGE_KEY = 'wr_valuation_link_form';
	const SOURCE = 'Valuation Link Page · September Free Valuation Offer';

	const TOTAL = 3;
	const STEP_TITLES = {
		1: 'Tell Us About Your Watch',
		2: 'The Condition of the Watch',
		3: 'Tell Us About You'
	};
	const ROLEX_MODELS = [
		'Submariner',
		'Datejust',
		'Day-Date',
		'GMT-Master II',
		'Daytona',
		'Explorer',
		'Explorer II',
		'Sea-Dweller',
		'Yacht-Master',
		'Yacht-Master II',
		'Milgauss',
		'Air-King',
		'Sky-Dweller',
		'Cellini',
		'Oyster Perpetual',
		'Pearlmaster',
		'Other'
	];
	let step = $state(1);
	let done = $state(false);
	let submitting = $state(false);
	let submitError = $state('');
	let attempted = $state(false);

	let brand = $state('');
	let model = $state('');
	let reference = $state('');
	let year = $state('');

	let condition = $state('');
	let hasBox = $state('');
	let hasPapers = $state('');

	const MAX_PHOTOS = 4;
	const MAX_PHOTO_SIZE = 4 * 1024 * 1024; // 4MB
	const COMPRESS_MAX_DIM = 1600;
	const COMPRESS_QUALITY = 0.82;
	let photoFiles = $state([]);
	let photoError = $state('');

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phone = $state('');
	let contactMethods = $state([]);
	let gdprConsent = $state(false);

	let honeypot = $state('');

	if (browser) {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const saved = JSON.parse(raw);
				step = saved.step ?? 1;
				brand = saved.brand ?? '';
				model = saved.model ?? '';
				reference = saved.reference ?? '';
				year = saved.year ?? '';
				condition = saved.condition ?? '';
				hasBox = saved.hasBox ?? '';
				hasPapers = saved.hasPapers ?? '';
				firstName = saved.firstName ?? '';
				lastName = saved.lastName ?? '';
				email = saved.email ?? '';
				phone = saved.phone ?? '';
				contactMethods = Array.isArray(saved.contactMethods) ? saved.contactMethods : [];
				gdprConsent = saved.gdprConsent ?? false;
			}
		} catch {
			// Ignore corrupt/unreadable storage — form just starts blank.
		}
	}

	$effect(() => {
		if (!browser || done) return;
		const data = {
			step,
			brand,
			model,
			reference,
			year,
			condition,
			hasBox,
			hasPapers,
			firstName,
			lastName,
			email,
			phone,
			contactMethods,
			gdprConsent
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	});

	const progressPct = $derived(done ? 100 : (step / TOTAL) * 100);

	function isValidEmail(v) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
	}

	const errors = $derived.by(() => {
		const e = {};
		if (step === 1) {
			if (!brand) e.brand = 'Please select a brand.';
			if (!model.trim()) e.model = 'Please enter the model.';
			if (!year.trim()) e.year = 'Please enter the year.';
		} else if (step === 2) {
			if (!condition) e.condition = 'Please select a condition.';
			if (!hasBox) e.hasBox = 'Please let us know if you have the box.';
			if (!hasPapers) e.hasPapers = 'Please let us know if you have the papers.';
		} else if (step === 3) {
			if (!firstName.trim()) e.firstName = 'First name is required.';
			if (!lastName.trim()) e.lastName = 'Last name is required.';
			if (!email.trim()) e.email = 'Email is required.';
			else if (!isValidEmail(email)) e.email = 'Please enter a valid email address.';
		}
		return e;
	});

	function formatFileSize(bytes) {
		return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)}KB` : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
	}

	function sourceKey(file) {
		return `${file.name}|${file.size}|${file.lastModified}`;
	}

	// Downscales and re-encodes to JPEG so the base64 payload we email stays small,
	// regardless of the source photo's resolution (camera/HEIC photos can be 10MB+).
	async function compressImage(file) {
		if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;

		try {
			const bitmap = await createImageBitmap(file);
			const scale = Math.min(1, COMPRESS_MAX_DIM / Math.max(bitmap.width, bitmap.height));
			const width = Math.round(bitmap.width * scale);
			const height = Math.round(bitmap.height * scale);

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
			bitmap.close?.();

			const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', COMPRESS_QUALITY));
			if (!blob || blob.size >= file.size) return file;

			const newName = file.name.replace(/\.\w+$/, '') + '.jpg';
			return new File([blob], newName, { type: 'image/jpeg', lastModified: file.lastModified });
		} catch {
			// Decoding failed (e.g. HEIC in a browser without codec support) — fall back to the original file.
			return file;
		}
	}

	async function handlePhotoSelect(e) {
		photoError = '';
		const incoming = Array.from(e.target.files ?? []);
		const input = e.target;
		setTimeout(() => (input.value = ''), 0);

		for (const file of incoming) {
			const key = sourceKey(file);
			if (photoFiles.some((existing) => existing._sourceKey === key)) {
				continue;
			}
			if (photoFiles.length >= MAX_PHOTOS) {
				photoError = `You can attach up to ${MAX_PHOTOS} photos.`;
				break;
			}
			if (!file.type.startsWith('image/')) {
				photoError = `${file.name} isn't a supported image file.`;
				continue;
			}
			if (file.size > MAX_PHOTO_SIZE) {
				photoError = `${file.name} is larger than 4MB.`;
				continue;
			}
			const compressed = await compressImage(file);
			compressed._sourceKey = key;
			photoFiles = [...photoFiles, compressed];
		}
	}

	function removePhoto(i) {
		photoFiles = photoFiles.filter((_, idx) => idx !== i);
	}

	function readFileAsBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(file);
		});
	}

	async function filesToAttachments(files) {
		return Promise.all(
			files.map(async (file) => ({
				filename: file.name,
				contentType: file.type,
				content: await readFileAsBase64(file)
			}))
		);
	}

	async function submitConsignment() {
		if (honeypot) {
			// Honeypot field was filled in — almost certainly a bot. Pretend
			// success without actually submitting the enquiry.
			done = true;
			return;
		}

		submitError = '';

		submitting = true;
		try {
			const photos = await filesToAttachments(photoFiles);

			const res = await fetch('/api/sell', {
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
					firstName,
					lastName,
					email,
					phone,
					contactMethods,
					gdprConsent,
					source: SOURCE
				})
			});

			const data = await res.json();
			if (!res.ok) {
				submitError = data.error || 'Failed to send your request. Please try again.';
				return;
			}
			done = true;
			if (browser) localStorage.removeItem(STORAGE_KEY);
		} catch {
			submitError = 'Failed to send your request. Please try again.';
		} finally {
			submitting = false;
		}
	}

	function next() {
		attempted = true;
		if (Object.keys(errors).length > 0) return;
		attempted = false;
		if (step < TOTAL) {
			step += 1;
			return;
		}
		submitConsignment();
	}
	function back() {
		attempted = false;
		if (step > 1) step -= 1;
	}

	function toggleContactMethod(method) {
		contactMethods = contactMethods.includes(method)
			? contactMethods.filter((m) => m !== method)
			: [...contactMethods, method];
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
	<title>Claim Your Free September Valuation | Watch Reserve</title>
</svelte:head>

<div class="cg-page">
	<!-- HERO -->
	<header class="cg-hero">
		<div class="cg-hero-bg"></div>
		<div class="cg-container">
			<div class="cg-hero-inner">
				<h1 class="cg-hero-title">Claim Your Free Valuation</h1>
				<p class="cg-hero-text">
					Thank you for your interest in the Free Valuation this September. Complete the short form below and
					one of our experts will be in touch with your valuation.
				</p>
				<a href="#start" class="cg-btn cg-btn-cream">Start My Free Valuation</a>
			</div>
		</div>
	</header>

	<!-- FORM -->
	<section class="cg-section cg-form-section" id="start">
		<div class="cg-container">
			<div class="cg-section-head cg-center">
				<span class="cg-offer-badge"><span class="cg-offer-dot" aria-hidden="true"></span>Free September Valuation</span>
				<h2>Tell Us About Your Watch</h2>
				<p>A few quick details is all it takes. Our specialists aim to respond within 30 minutes during business hours.</p>
			</div>

			<div class="cg-form-wrap">
				<div class="cg-form-card">
					<div class="cg-form-header">
						{#if !done}
							<h3 class="cg-step-title">{STEP_TITLES[step]}</h3>
						{/if}
						<div class="cg-form-progress">
							<span>{done ? 'Complete' : `Step ${step} of ${TOTAL}`}</span>
							<span class="cg-progress-track"
								><span class="cg-progress-fill" style="width:{progressPct}%"></span></span
							>
						</div>
					</div>

					{#if done}
						<div class="cg-form-done">
							<h3>Thank You</h3>
							<p>
								Thank you for claiming your free September valuation. A member of our team will review the
								details you have provided and be in touch shortly with your valuation. We aim to respond within
								30 minutes during business hours.
							</p>
						</div>
					{:else}
						<form novalidate onsubmit={(e) => e.preventDefault()}>
							{#if step === 1}
								<div class="cg-field" class:cg-field-invalid={attempted && errors.brand}>
									<label for="cg-brand">Brand</label>
									<select id="cg-brand" bind:value={brand} onchange={() => (model = '')}>
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
									{#if attempted && errors.brand}<p class="cg-field-error" role="alert">{errors.brand}</p>{/if}
								</div>
								<div class="cg-field-row">
									<div class="cg-field" class:cg-field-invalid={attempted && errors.model}>
										<label for="cg-model">Model</label>
										{#if brand === 'Rolex'}
											<select id="cg-model" bind:value={model}>
												<option value="" disabled selected>Select a model</option>
												{#each ROLEX_MODELS as m}
													<option>{m}</option>
												{/each}
											</select>
										{:else}
											<input type="text" id="cg-model" placeholder="" bind:value={model} />
										{/if}
										{#if attempted && errors.model}<p class="cg-field-error" role="alert">{errors.model}</p>{/if}
									</div>
									<div class="cg-field">
										<label for="cg-ref">Reference Number <span class="cg-optional">(optional)</span></label>
										<input type="text" id="cg-ref" placeholder="e.g. 116500LN" bind:value={reference} />
									</div>
								</div>
								<div class="cg-field" class:cg-field-invalid={attempted && errors.year}>
									<label for="cg-year">Year</label>
									<input
										type="text"
										id="cg-year"
										placeholder="e.g. 2021"
										inputmode="numeric"
										pattern="[0-9]*"
										maxlength="4"
										bind:value={year}
										oninput={(e) => (year = e.currentTarget.value.replace(/\D/g, ''))}
									/>
									{#if attempted && errors.year}<p class="cg-field-error" role="alert">{errors.year}</p>{/if}
								</div>
							{:else if step === 2}
								<div class="cg-field" class:cg-field-invalid={attempted && errors.condition}>
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
									{#if attempted && errors.condition}<p class="cg-field-error" role="alert">{errors.condition}</p>{/if}
								</div>
								<div class="cg-field" class:cg-field-invalid={attempted && errors.hasBox}>
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
									{#if attempted && errors.hasBox}<p class="cg-field-error" role="alert">{errors.hasBox}</p>{/if}
								</div>
								<div class="cg-field" class:cg-field-invalid={attempted && errors.hasPapers}>
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
									{#if attempted && errors.hasPapers}<p class="cg-field-error" role="alert">{errors.hasPapers}</p>{/if}
								</div>
								<div class="cg-field">
									<label for="cg-photos">Photos <span class="cg-optional">(optional)</span></label>
									<input
										type="file"
										id="cg-photos"
										class="cg-file-input"
										accept="image/*"
										multiple
										onchange={handlePhotoSelect}
									/>
									<label for="cg-photos" class="cg-file-btn">Choose Photos</label>
									<p class="cg-field-hint">Up to {MAX_PHOTOS} images, 4MB each.</p>
									{#if photoFiles.length}
										<ul class="cg-photo-list">
											{#each photoFiles as file, i (file.name + file.lastModified)}
												<li class="cg-photo-item">
													<span class="cg-photo-name">{file.name}</span>
													<span class="cg-photo-size">{formatFileSize(file.size)}</span>
													<button
														type="button"
														class="cg-photo-remove"
														onclick={() => removePhoto(i)}
														aria-label="Remove {file.name}">×</button
													>
												</li>
											{/each}
										</ul>
									{/if}
									{#if photoError}<p class="cg-form-error">{photoError}</p>{/if}
								</div>
							{:else if step === 3}
								<div class="cg-field-row">
									<div class="cg-field" class:cg-field-invalid={attempted && errors.firstName}>
										<label for="cg-fname">First Name</label>
										<input type="text" id="cg-fname" placeholder="First name" bind:value={firstName} />
										{#if attempted && errors.firstName}<p class="cg-field-error" role="alert">{errors.firstName}</p>{/if}
									</div>
									<div class="cg-field" class:cg-field-invalid={attempted && errors.lastName}>
										<label for="cg-lname">Last Name</label>
										<input type="text" id="cg-lname" placeholder="Last name" bind:value={lastName} />
										{#if attempted && errors.lastName}<p class="cg-field-error" role="alert">{errors.lastName}</p>{/if}
									</div>
								</div>
								<div class="cg-field" class:cg-field-invalid={attempted && errors.email}>
									<label for="cg-email">Email</label>
									<input type="email" id="cg-email" placeholder="you@example.com" bind:value={email} autocomplete="email" />
									{#if attempted && errors.email}<p class="cg-field-error" role="alert">{errors.email}</p>{/if}
								</div>
								<div class="cg-field">
									<label for="cg-phone">Phone <span class="cg-optional">(optional)</span></label>
									<input type="tel" id="cg-phone" placeholder="Best number to reach you" bind:value={phone} autocomplete="tel" />
								</div>
								<div class="cg-field">
									<label for="cg-contact-pref">Preferred Method of Contact <span class="cg-optional">(optional)</span></label>
									<div class="cg-choice-group" id="cg-contact-pref">
										{#each ['Phone', 'Email', 'WhatsApp'] as opt}
											<span
												class="cg-choice"
												class:cg-selected={contactMethods.includes(opt)}
												onclick={() => toggleContactMethod(opt)}
												onkeydown={(e) => e.key === 'Enter' && toggleContactMethod(opt)}
												role="button"
												tabindex="0">{opt}</span
											>
										{/each}
									</div>
								</div>
								<label class="cg-gdpr-wrap">
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
		--gold: #a1846d;

		--maroon-70: rgba(66, 38, 53, 0.7);
		--maroon-45: rgba(66, 38, 53, 0.45);
		--maroon-15: rgba(66, 38, 53, 0.15);
		--maroon-08: rgba(66, 38, 53, 0.08);

		--cream-70: rgba(250, 244, 243, 0.7);
		--cream-45: rgba(250, 244, 243, 0.45);
		--cream-18: rgba(250, 244, 243, 0.18);

		--font-head: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		--font-ui: 'acumin-pro', Arial, sans-serif;

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

	.cg-container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--gutter); }

	/* HERO */
	.cg-hero {
		position: relative;
		min-height: 64vh;
		min-height: 64dvh;
		display: flex;
		align-items: center;
		overflow: hidden;
	}
	.cg-hero-bg {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, rgba(22, 11, 17, 0.72) 0%, rgba(22, 11, 17, 0.45) 45%, rgba(22, 11, 17, 0.1) 100%),
			linear-gradient(to top, rgba(22, 11, 17, 0.55) 0%, rgba(22, 11, 17, 0) 45%),
			url('/assets/consignment_hero.jpg') center/cover no-repeat;
	}
	.cg-hero .cg-container { width: 100%; }
	.cg-hero-inner { position: relative; z-index: 2; max-width: 540px; padding: 40px 0; }
	.cg-hero .cg-hero-title { color: var(--white); margin-bottom: 24px; font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1.2; letter-spacing: -0.02em; max-width: 480px; }
	.cg-hero-text { color: var(--white); opacity: 0.9; font-size: 1.02rem; font-weight: 300; max-width: 440px; margin: 0 0 34px; }

	@media (max-width: 820px) {
		.cg-hero { min-height: 58vh; min-height: 58dvh; }
	}

	@media (max-width: 520px) {
		.cg-hero { min-height: 72vh; min-height: 72dvh; }
		.cg-hero-inner { max-width: 100%; padding: 32px 0; }
		.cg-hero-text { max-width: 100%; }
	}

	/* BUTTONS */
	.cg-btn {
		display: inline-block;
		font-family: var(--font-ui);
		font-size: 0.72rem;
		font-weight: 700;
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

	/* OFFER BADGE (above the form) */
	.cg-offer-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: var(--maroon-08);
		border: 1px solid var(--gold);
		color: var(--maroon);
		padding: 7px 16px;
		font-family: var(--font-ui);
		font-weight: 700;
		font-size: 0.68rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 16px;
	}
	.cg-offer-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--gold);
		flex-shrink: 0;
		box-shadow: 0 0 6px rgba(161, 132, 109, 0.6);
	}

	/* FORM */
	.cg-form-section { background: linear-gradient(180deg, var(--cream) 0%, #f3e9e7 100%); }
	.cg-form-wrap { max-width: 1080px; margin: 0 auto; }
	.cg-form-card { background: var(--white); border: 1px solid var(--maroon-15); padding: 52px 60px; box-shadow: 0 30px 70px rgba(22, 11, 17, 0.1); }
	.cg-form-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 36px;
	}
	.cg-form-progress {
		font-family: var(--font-ui);
		font-weight: 700;
		font-size: 0.66rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--maroon-45);
		display: flex;
		align-items: center;
		gap: 12px;
		flex-shrink: 0;
		width: 180px;
	}
	.cg-progress-track { flex: 1; height: 2px; background: var(--maroon-15); position: relative; }
	.cg-progress-fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--maroon); transition: width 0.35s ease; }

	.cg-step-title {
		font-size: 1.4rem;
		margin: 0;
	}

	@media (max-width: 620px) {
		.cg-form-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
			margin-bottom: 28px;
		}
		.cg-form-progress { width: 100%; }
	}

	.cg-field { margin-bottom: 22px; }
	.cg-field label {
		display: block;
		font-family: var(--font-ui);
		font-weight: 700;
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--maroon-70);
		margin-bottom: 9px;
	}
	.cg-optional { font-weight: 400; opacity: 0.6; letter-spacing: 0.08em; }
	.cg-field input[type='text'],
	.cg-field input[type='email'],
	.cg-field input[type='tel'],
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
	.cg-field select {
		border-radius: 4px;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		padding-right: 40px;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23422635' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 14px center;
		background-size: 12px 8px;
	}
	.cg-field input:focus,
	.cg-field select:focus { border-color: var(--maroon); }
	.cg-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
	@media (max-width: 520px) { .cg-field-row { grid-template-columns: 1fr; } }

	.cg-field-error { margin: 8px 0 0; font-family: var(--font-ui); font-size: 0.74rem; color: #a33; }
	.cg-field-invalid input[type='text'],
	.cg-field-invalid input[type='email'],
	.cg-field-invalid input[type='tel'],
	.cg-field-invalid select { border-color: #a33; }
	.cg-field-invalid .cg-choice-group { border: 1px solid #a33; padding: 8px; }

	.cg-file-input { position: absolute; opacity: 0; width: 1px; height: 1px; overflow: hidden; }
	.cg-file-btn {
		display: inline-block;
		font-family: var(--font-ui);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--maroon);
		padding: 11px 22px;
		border: 1px solid var(--maroon-45);
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}
	.cg-file-btn:hover { background: var(--maroon); color: var(--cream); }
	.cg-field-hint { margin: 8px 0 0; font-family: var(--font-ui); font-size: 0.74rem; font-weight: 300; color: var(--maroon-70); }
	.cg-photo-list { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
	.cg-photo-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 12px;
		background: var(--white);
		border: 1px solid var(--maroon-15);
		font-family: var(--font-ui);
		font-size: 0.8rem;
	}
	.cg-photo-name { flex: 1; color: var(--maroon); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.cg-photo-size { color: var(--maroon-70); font-size: 0.7rem; }
	.cg-photo-remove {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--maroon-70);
		font-size: 1rem;
		line-height: 1;
		padding: 0 2px;
	}
	.cg-photo-remove:hover { color: var(--maroon); }

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

	.cg-hp-field {
		position: absolute;
		left: -9999px;
		top: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.cg-gdpr-wrap {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		cursor: pointer;
		user-select: none;
		margin-top: 20px;
		padding: 16px 18px;
		background: var(--maroon-08);
		border: 1px solid var(--maroon-15);
		border-left: 3px solid var(--maroon);
		transition: background 0.2s ease;
	}
	.cg-gdpr-wrap:hover { background: var(--maroon-15); }
	.cg-gdpr-input { position: absolute; opacity: 0; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }
	.cg-gdpr-box { flex-shrink: 0; width: 19px; height: 19px; border: 1.5px solid var(--maroon-45); background-color: var(--white); position: relative; margin-top: 1px; transition: border-color 0.2s ease, background-color 0.2s ease; }
	.cg-gdpr-wrap:hover .cg-gdpr-box { border-color: var(--maroon); }
	.cg-gdpr-input:checked + .cg-gdpr-box { background-color: var(--maroon); border-color: var(--maroon); }
	.cg-gdpr-input:checked + .cg-gdpr-box::after {
		content: '';
		position: absolute;
		left: 5px;
		top: 2px;
		width: 6px;
		height: 10px;
		border: 2px solid var(--white);
		border-top: none;
		border-left: none;
		transform: rotate(45deg);
	}
	.cg-gdpr-label { font-family: var(--font-ui); font-size: 0.85rem; font-weight: 500; color: var(--maroon); line-height: 1.55; }

	.cg-form-error { margin-top: 14px; font-family: var(--font-ui); font-size: 0.8rem; color: #a33; }
	.cg-form-nav { display: flex; justify-content: flex-end; align-items: center; margin-top: 32px; gap: 14px; }
	.cg-link-back {
		background: none;
		border: none;
		cursor: pointer;
		margin-right: auto;
		font-family: var(--font-ui);
		font-size: 0.68rem;
		font-weight: 700;
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
	.cg-review-name { font-family: var(--font-ui); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cream); opacity: 0.7; margin: 0; }
	.cg-review-source { font-weight: 400; opacity: 0.65; margin-left: 8px; }
	.cg-review-dots { display: flex; gap: 10px; margin-top: 56px; }
	.cg-review-dot { width: 8px; height: 8px; border-radius: 50%; background: transparent; border: 1px solid var(--cream-45); cursor: pointer; padding: 0; transition: background 0.2s; }
	.cg-review-dot.cg-active { background: var(--cream); border-color: var(--cream); }

	.cg-contact-block { border-left: 1px solid var(--cream-18); padding-left: 60px; }
	.cg-contact-block h3 { color: var(--cream); margin-bottom: 22px; }
	.cg-contact-line { margin-bottom: 20px; }
	.cg-label { font-family: var(--font-ui); font-weight: 700; font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cream); opacity: 0.55; margin-bottom: 5px; }
	.cg-value { font-size: 0.98rem; font-weight: 300; color: var(--cream); }
	.cg-value a { color: var(--cream); text-decoration: none; border-bottom: 1px solid var(--cream-45); padding-bottom: 1px; }
	.cg-value a:hover { border-color: var(--cream); }

	@media (max-width: 820px) {
		.cg-reviews-grid { grid-template-columns: 1fr; gap: 48px; }
		.cg-contact-block { border-left: none; border-top: 1px solid var(--cream-18); padding-left: 0; padding-top: 44px; }
	}
</style>
