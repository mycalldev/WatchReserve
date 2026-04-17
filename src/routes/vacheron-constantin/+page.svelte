<script>
	import { onMount, onDestroy } from 'svelte';

	const heroSlides = [
		{
			desktop: '/assets/hero/Vach_Hero1.jpg',
			mobile: '/assets/Landing/Vacheron_01/mobile/hero/hero_01'
		},
		{
			desktop: '/assets/hero/Vach_Hero2',
			mobile: '/assets/Landing/Vacheron_01/mobile/hero/hero_02'
		},
		{
			desktop: '/assets/hero/Vach_Hero3',
			mobile: '/assets/Landing/Vacheron_01/mobile/hero/hero_03'
		}
	];

	let activeSlide = $state(0);
	let sliderInterval;

	onMount(() => {
		sliderInterval = setInterval(() => {
			activeSlide = (activeSlide + 1) % heroSlides.length;
		}, 4000);

		function initTp() {
			if (window.Trustpilot && tpEl) {
				window.Trustpilot.loadFromElement(tpEl, true);
			}
		}

		if (window.Trustpilot) {
			initTp();
		} else {
			const script = document.querySelector('script[src*="tp.widget.bootstrap.min.js"]');
			if (script) script.addEventListener('load', initTp);
		}
	});

	onDestroy(() => {
		clearInterval(sliderInterval);
	});

	function scrollToForm() {
		document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' });
	}

	// Gallery slider
	const galleryImages = [
		{ src: '/assets/Landing/Vacheron_01/01_Product Image Front Image', alt: 'Vacheron Constantin Overseas Dual Time, front' },
		{ src: '/assets/Landing/Vacheron_01/02_Product Image Dial', alt: 'Vacheron Constantin Overseas Dual Time, dial' },
		{ src: '/assets/Landing/Vacheron_01/03_Product Image Angle', alt: 'Vacheron Constantin Overseas Dual Time, angle' },
		{ src: '/assets/Landing/Vacheron_01/04_Product Image Crown', alt: 'Vacheron Constantin Overseas Dual Time, crown' },
		{ src: '/assets/Landing/Vacheron_01/05_Product Image Side', alt: 'Vacheron Constantin Overseas Dual Time, side' },
		{ src: '/assets/Landing/Vacheron_01/Desktop/06_Product Image Clasp', alt: 'Vacheron Constantin Overseas Dual Time, clasp' }
	];

	let galleryIndex = $state(0);
	let touchStartX = 0;

	// Bottom slider
	const bottomSlides = [
		'/assets/Landing/Vacheron_01/mobile/Mobile_Array 1',
		'/assets/Landing/Vacheron_01/mobile/Mobile_Array 2',
		'/assets/Landing/Vacheron_01/mobile/Mobile_Array 3',
		'/assets/Landing/Vacheron_01/mobile/Mobile_Array 4'
	];
	let bottomIndex = $state(0);
	let bottomTouchStartX = 0;

	function bottomPrev() {
		bottomIndex = (bottomIndex - 1 + bottomSlides.length) % bottomSlides.length;
	}

	function bottomNext() {
		bottomIndex = (bottomIndex + 1) % bottomSlides.length;
	}

	function onBottomTouchStart(e) {
		bottomTouchStartX = e.touches[0].clientX;
	}

	function onBottomTouchEnd(e) {
		const delta = bottomTouchStartX - e.changedTouches[0].clientX;
		if (Math.abs(delta) < 40) return;
		if (delta > 0) bottomNext();
		else bottomPrev();
	}
	let specOpen = $state(false);
	let reasonsOpen = $state(false);

	function galleryPrev() {
		galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
	}

	function galleryNext() {
		galleryIndex = (galleryIndex + 1) % galleryImages.length;
	}

	function onTouchStart(e) {
		touchStartX = e.touches[0].clientX;
	}

	function onTouchEnd(e) {
		const delta = touchStartX - e.changedTouches[0].clientX;
		if (Math.abs(delta) < 40) return;
		if (delta > 0) galleryNext();
		else galleryPrev();
	}

	// Trustpilot
	let tpEl = $state(null);

	// Form state
	let form = $state({ fullName: '', email: '', phone: '', contactPreference: 'Email' });
	let errors = $state({});
	let submitting = $state(false);
	let submitted = $state(false);
	let submitError = $state('');

	const contactOptions = ['Email', 'Phone', 'WhatsApp'];

	function validate() {
		const e = {};
		if (form.fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email.';
		if (!/^[\d\s+\-()]{7,}$/.test(form.phone.trim())) e.phone = 'Please enter a valid phone number.';
		errors = e;
		return Object.keys(e).length === 0;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!validate()) return;

		submitting = true;
		submitError = '';

		try {
			const res = await fetch('/api/landing-enquiry', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fullName: form.fullName.trim(),
					email: form.email.trim(),
					phone: form.phone.trim(),
					contactPreference: form.contactPreference,
					source: 'Vacheron Constantin Landing Page'
				})
			});

			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data.success) throw new Error(data.error ?? 'Request failed.');

			submitted = true;
		} catch (err) {
			submitError = err?.message || 'Something went wrong. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Vacheron Constantin Overseas | Watch Reserve</title>
	<meta name="description" content="A rare opportunity to acquire a Vacheron Constantin Overseas from Watch Reserve, London's premier pre-owned luxury timepiece specialist." />
</svelte:head>

<!-- ── HERO ── -->
<section class="hero">
	{#each heroSlides as slide, i}
		<picture
			class="hero-img"
			class:hero-img--active={i === activeSlide}
			aria-hidden="true"
		>
			<source media="(max-width: 640px)" srcset={slide.mobile} />
			<img
				src={slide.desktop}
				alt=""
				aria-hidden="true"
				class="hero-img-el"
				fetchpriority={i === 0 ? 'high' : 'low'}
				loading={i === 0 ? 'eager' : 'lazy'}
			/>
		</picture>
	{/each}

	<div class="hero-overlay" aria-hidden="true"></div>

	<div class="hero-inner">
		<p class="hero-eyebrow">Now Available</p>
		<h1 class="hero-headline">
			Vacheron Constantin<br /><em>Overseas</em>
		</h1>
		<p class="hero-sub">
			One of the world's most coveted sport-luxury timepieces. Fully authenticated, in exceptional condition, available exclusively through Watch Reserve.
		</p>
		<button class="hero-cta" onclick={scrollToForm}>
			Enquire Now
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M12 5v14M5 12l7 7 7-7"/>
			</svg>
		</button>
		<p class="hero-stock">
			<span class="hero-stock-dot" aria-hidden="true"></span>
			<strong>In Stock: 1</strong>
		</p>
	</div>

	<div class="hero-dots" aria-hidden="true">
		{#each heroSlides as _, i}
			<button
				class="hero-dot"
				class:hero-dot--active={i === activeSlide}
				onclick={() => {
					activeSlide = i;
					clearInterval(sliderInterval);
					sliderInterval = setInterval(() => {
						activeSlide = (activeSlide + 1) % heroSlides.length;
					}, 4000);
				}}
				tabindex="-1"
			></button>
		{/each}
	</div>
</section>

<!-- ── TRUSTPILOT BANNER ── -->
<div class="tp-banner">
	<div
		bind:this={tpEl}
		class="trustpilot-widget"
		data-locale="en-GB"
		data-template-id="5419b732fbfb950b10de65e5"
		data-businessunit-id="688cd47d354b1ad541993312"
		data-style-height="24px"
		data-style-width="100%"
		data-token="70e88cb7-59fa-4a6b-8a51-aa184e23812c"
	>
		<a href="https://uk.trustpilot.com/review/thewatchreserve.co.uk" target="_blank" rel="noopener">Trustpilot</a>
	</div>
</div>

<!-- ── PRODUCT DETAILS STRIP ── -->
<div class="product-strip">
	<div class="product-strip-inner">
		<div class="product-strip-title">
			<span class="product-strip-name">Vacheron Constantin Overseas Dual Time</span>
			<span class="product-strip-ref">7920V</span>
		</div>
		<div class="product-strip-meta">
			<div class="product-strip-item">
				<span class="product-strip-label">Reference</span>
				<span class="product-strip-value">7920V/210A-B546</span>
			</div>
			<div class="product-strip-divider" aria-hidden="true"></div>
			<div class="product-strip-item">
				<span class="product-strip-label">Year</span>
				<span class="product-strip-value">2025</span>
			</div>
			<div class="product-strip-divider" aria-hidden="true"></div>
			<div class="product-strip-item">
				<span class="product-strip-label">Condition</span>
				<span class="product-strip-value">Like new &amp; unworn</span>
			</div>
		</div>
	</div>
</div>

<!-- ── GALLERY ── -->
<section class="gallery-section">
	<div class="gallery-outer">

		<div class="gallery-layout">
			<div
				class="gallery-track"
				ontouchstart={onTouchStart}
				ontouchend={onTouchEnd}
				role="region"
				aria-label="Watch image gallery"
			>
			{#each galleryImages as image, i}
				<img
					src={image.src}
					alt={image.alt}
					class="gallery-img"
					class:gallery-img--active={i === galleryIndex}
					loading={i === 0 ? 'eager' : 'lazy'}
				/>
			{/each}

				<button class="gallery-arrow gallery-arrow--prev" onclick={galleryPrev} aria-label="Previous image">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M15 18l-6-6 6-6"/>
					</svg>
				</button>
				<button class="gallery-arrow gallery-arrow--next" onclick={galleryNext} aria-label="Next image">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M9 18l6-6-6-6"/>
					</svg>
				</button>

				<div class="gallery-counter" aria-live="polite" aria-atomic="true">
					{galleryIndex + 1} / {galleryImages.length}
				</div>
			</div>

			<div class="gallery-dots" aria-hidden="true">
				{#each galleryImages as _, i}
					<button
						class="gallery-dot"
						class:gallery-dot--active={i === galleryIndex}
						onclick={() => (galleryIndex = i)}
						tabindex="-1"
					></button>
				{/each}
			</div>
		</div>

		<div class="gallery-text">
			<button class="reserve-cta" onclick={scrollToForm}>
				Reserve This Watch
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M12 5v14M5 12l7 7 7-7"/>
				</svg>
			</button>
			<p class="content-eyebrow">About This Timepiece</p>
			<h3 class="gallery-text-heading">A Masterpiece of<br /><em>Swiss Savoir-Faire</em></h3>
			<p class="content-body">
				The Vacheron Constantin Overseas Dual Time 7920V represents one of the most refined interpretations of the modern luxury travel watch, combining everyday practicality with Geneva Seal finishing and true collector-level prestige.
			</p>
			<p class="content-body">
				Presented here as a 2025 example in like-new unworn condition, this piece offers exceptional value relative to current secondary-market pricing, which averages around £25.8k in comparable condition as of April 2026. Designed for collectors who value versatility as much as craftsmanship, the Dual Time remains one of the most complete integrated-bracelet sports watches available today.
			</p>
		</div>

		<div class="gallery-extras">
			<div class="spec-accordion reasons-accordion">
				<button
					class="spec-accordion-trigger"
					onclick={() => (reasonsOpen = !reasonsOpen)}
					aria-expanded={reasonsOpen}
				>
					<span>Three Reasons Collectors Choose This Watch</span>
					<svg
						class="spec-chevron"
						class:spec-chevron--open={reasonsOpen}
						width="16" height="16" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M6 9l6 6 6-6"/>
					</svg>
				</button>

				{#if reasonsOpen}
					<ol class="reasons-list">
						<li class="reasons-item">
							<span class="reasons-title">Geneva Seal certified in-house movement</span>
							<span class="reasons-body">Powered by Vacheron Constantin's calibre 5110 DT, the movement delivers approximately 60 hours of power reserve and carries the prestigious Hallmark of Geneva, confirming elite finishing standards rarely seen in sports watches.</span>
						</li>
						<li class="reasons-item">
							<span class="reasons-title">Quick-change strap system (three watches in one)</span>
							<span class="reasons-body">Supplied with an integrated steel bracelet, rubber strap, and leather strap — all interchangeable without tools, allowing seamless transitions between formal, sport, and travel wear.</span>
						</li>
						<li class="reasons-item">
							<span class="reasons-title">Part of the "Holy Trinity" of Swiss watchmaking</span>
							<span class="reasons-body">Produced by Vacheron Constantin, one of the legendary "Holy Trinity" of horology alongside Patek Philippe and Audemars Piguet — combining prestige, rarity, and finishing credentials that place it among the world's most respected luxury sports watches.</span>
						</li>
					</ol>
				{/if}
			</div>

			<div class="spec-accordion spec-accordion--centred">
				<button
					class="spec-accordion-trigger"
					onclick={() => (specOpen = !specOpen)}
					aria-expanded={specOpen}
				>
					<span>Specifications</span>
					<svg
						class="spec-chevron"
						class:spec-chevron--open={specOpen}
						width="16" height="16" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M6 9l6 6 6-6"/>
					</svg>
				</button>

				{#if specOpen}
					<dl class="specs">
						<div class="spec-row">
							<dt class="spec-label">Brand</dt>
							<dd class="spec-value">Vacheron Constantin</dd>
						</div>
						<div class="spec-row">
							<dt class="spec-label">Collection</dt>
							<dd class="spec-value">Overseas</dd>
						</div>
						<div class="spec-row">
							<dt class="spec-label">Case Material</dt>
							<dd class="spec-value">Stainless Steel</dd>
						</div>
						<div class="spec-row">
							<dt class="spec-label">Case Diameter</dt>
							<dd class="spec-value">41 mm</dd>
						</div>
						<div class="spec-row">
							<dt class="spec-label">Movement</dt>
							<dd class="spec-value">Automatic, Calibre 5110</dd>
						</div>
						<div class="spec-row">
							<dt class="spec-label">Power Reserve</dt>
							<dd class="spec-value">60 Hours</dd>
						</div>
						<div class="spec-row">
							<dt class="spec-label">Water Resistance</dt>
							<dd class="spec-value">150 m</dd>
						</div>
						<div class="spec-row">
							<dt class="spec-label">Condition</dt>
							<dd class="spec-value">Excellent</dd>
						</div>
						<div class="spec-row">
							<dt class="spec-label">Includes</dt>
							<dd class="spec-value">Box, Papers, Additional Straps</dd>
						</div>
						<div class="spec-row spec-row--highlight">
							<dt class="spec-label">Warranty</dt>
							<dd class="spec-value">24 Months · Watch Reserve</dd>
						</div>
					</dl>
				{/if}
			</div>

			<div class="trust-banner">
				<div class="trust-banner-item">
					<div class="trust-banner-icon">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
						</svg>
					</div>
					<div class="trust-banner-text">
						<span class="trust-banner-label">Fully Authenticated</span>
						<span class="trust-banner-sub">Inspected by our in-house specialists</span>
					</div>
				</div>
				<div class="trust-banner-divider" aria-hidden="true"></div>
				<div class="trust-banner-item">
					<div class="trust-banner-icon">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
						</svg>
					</div>
					<div class="trust-banner-text">
						<span class="trust-banner-label">Insured Delivery</span>
						<span class="trust-banner-sub">Fully insured, tracked worldwide</span>
					</div>
				</div>
			</div>
		</div>

	</div>
</section>

<!-- ── ENQUIRY FORM ── -->
<section class="enquiry-section" id="enquire">
	<div class="enquiry-inner">

		<div class="enquiry-header">
			<p class="enquiry-eyebrow">Private Enquiry</p>
			<h2 class="enquiry-heading">Enquire Today</h2>
			<p class="enquiry-sub">
				A Watch Reserve team member will be in touch within the hour.
			</p>
		</div>

		{#if submitted}
			<div class="form-success">
				<div class="form-success-icon" aria-hidden="true">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20 6 9 17l-5-5"/>
					</svg>
				</div>
				<h3 class="form-success-title">Enquiry Received</h3>
				<p class="form-success-body">
					Thank you, {form.fullName.split(' ')[0]}. A member of our team will be in touch shortly via {form.contactPreference.toLowerCase()}.
				</p>
			</div>
		{:else}
			<form class="enquiry-form" onsubmit={handleSubmit} novalidate>

				<div class="form-field" class:form-field--error={errors.fullName}>
					<label class="form-label" for="lp-name">Full Name</label>
					<input
						id="lp-name"
						type="text"
						class="form-input"
						placeholder="Full Name"
						autocomplete="name"
						bind:value={form.fullName}
						oninput={() => { if (errors.fullName) { errors = { ...errors, fullName: '' }; } }}
					/>
					{#if errors.fullName}<span class="form-error">{errors.fullName}</span>{/if}
				</div>

				<div class="form-row">
					<div class="form-field" class:form-field--error={errors.email}>
						<label class="form-label" for="lp-email">Email Address</label>
						<input
							id="lp-email"
							type="email"
							class="form-input"
							placeholder="email@example.com"
							autocomplete="email"
							bind:value={form.email}
							oninput={() => { if (errors.email) { errors = { ...errors, email: '' }; } }}
						/>
						{#if errors.email}<span class="form-error">{errors.email}</span>{/if}
					</div>

					<div class="form-field" class:form-field--error={errors.phone}>
						<label class="form-label" for="lp-phone">Phone Number</label>
						<input
							id="lp-phone"
							type="tel"
							class="form-input"
							placeholder="+44 7700 000000"
							autocomplete="tel"
							bind:value={form.phone}
							oninput={() => { if (errors.phone) { errors = { ...errors, phone: '' }; } }}
						/>
						{#if errors.phone}<span class="form-error">{errors.phone}</span>{/if}
					</div>
				</div>

				<div class="form-field">
					<span class="form-label">Preferred Contact Method</span>
					<div class="toggle-group" role="group" aria-label="Preferred contact method">
						{#each contactOptions as option}
							<button
								type="button"
								class="toggle-btn"
								class:toggle-btn--active={form.contactPreference === option}
								onclick={() => (form.contactPreference = option)}
							>
								{option}
							</button>
						{/each}
					</div>
				</div>

				{#if submitError}
					<p class="form-submit-error" role="alert">{submitError}</p>
				{/if}

				<button type="submit" class="form-submit" disabled={submitting}>
					{#if submitting}
						<span class="form-spinner" aria-hidden="true"></span>
						Sending…
					{:else}
						Send Enquiry
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
					{/if}
				</button>

				<p class="form-privacy">
					Your details are handled in accordance with our
					<a href="/privacy-policy" class="form-privacy-link">Privacy Policy</a>.
					We will never share your information with third parties.
				</p>

			</form>
		{/if}

	</div>
</section>

<!-- ── BOTTOM SLIDER ── -->
<section class="bottom-slider-section">
	<div
		class="bottom-slider-track"
		ontouchstart={onBottomTouchStart}
		ontouchend={onBottomTouchEnd}
		role="region"
		aria-label="Watch image showcase"
	>
		{#each bottomSlides as src, i}
			<img
				{src}
				alt="Vacheron Constantin Overseas Dual Time, image {i + 1} of {bottomSlides.length}"
				class="bottom-slider-img"
				class:bottom-slider-img--active={i === bottomIndex}
				loading="lazy"
			/>
		{/each}

		<button class="bottom-slider-arrow bottom-slider-arrow--prev" onclick={bottomPrev} aria-label="Previous image">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M15 18l-6-6 6-6"/>
			</svg>
		</button>
		<button class="bottom-slider-arrow bottom-slider-arrow--next" onclick={bottomNext} aria-label="Next image">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M9 18l6-6-6-6"/>
			</svg>
		</button>
	</div>

	<div class="bottom-slider-dots" aria-hidden="true">
		{#each bottomSlides as _, i}
			<button
				class="bottom-slider-dot"
				class:bottom-slider-dot--active={i === bottomIndex}
				onclick={() => (bottomIndex = i)}
				tabindex="-1"
			></button>
		{/each}
	</div>
</section>

<style>
	/* ── HERO ── */
	.hero {
		position: relative;
		width: 100%;
		min-height: 90vh;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.hero-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
		opacity: 0;
		transition: opacity 1.2s ease;
		z-index: 0;
	}

	.hero-img-el {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
	}

	.hero-img--active {
		opacity: 1;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.72) 0%,
			rgba(0, 0, 0, 0.4) 55%,
			rgba(0, 0, 0, 0.1) 100%
		);
		z-index: 1;
	}

	.hero-inner {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 120px 40px;
		box-sizing: border-box;
	}

	.hero-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 20px;
	}

	.hero-headline {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.8rem, 5.5vw, 5rem);
		font-weight: 400;
		color: #ffffff;
		margin: 0 0 24px;
		line-height: 1.1;
		letter-spacing: -0.02em;
		max-width: 560px;
	}

	.hero-headline em {
		font-style: italic;
	}

	.hero-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(0.9rem, 1.4vw, 1.05rem);
		color: rgba(255, 255, 255, 0.88);
		margin: 0 0 44px;
		line-height: 1.75;
		max-width: 480px;
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 18px 36px;
		background: #a1846d;
		color: #ffffff;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		border: none;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.hero-cta:hover {
		background: #8a6f59;
	}

	.hero-stock {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 16px 0 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.82rem;
		color: rgba(255, 255, 255, 0.9);
	}

	.hero-stock strong {
		font-weight: 700;
		color: #ffffff;
	}

	.hero-stock-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #4caf7d;
		flex-shrink: 0;
		box-shadow: 0 0 6px rgba(76, 175, 125, 0.7);
	}

	.hero-dots {
		position: absolute;
		bottom: 28px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 10px;
		z-index: 3;
	}

	.hero-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.4);
		border: none;
		padding: 0;
		cursor: pointer;
		transition: background 0.3s ease, transform 0.3s ease;
	}

	.hero-dot--active {
		background: #ffffff;
		transform: scale(1.25);
	}

	.content-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 16px;
	}

	.content-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 3vw, 2.75rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 28px;
		line-height: 1.2;
		letter-spacing: -0.01em;
	}

	.content-heading em {
		font-style: italic;
	}

	.content-body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.975rem;
		line-height: 1.8;
		color: #4a3f3a;
		margin: 0 0 20px;
	}

	.content-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 12px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #160b11;
		text-decoration: none;
		border-bottom: 1px solid #160b11;
		padding-bottom: 2px;
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.content-cta:hover {
		color: #a1846d;
		border-color: #a1846d;
	}

	/* ── RESERVE CTA ── */
	.reserve-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 16px 32px;
		background: #422635;
		color: #ffffff;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		border: none;
		cursor: pointer;
		transition: background 0.2s ease;
		margin-bottom: 36px;
	}

	.reserve-cta:hover {
		background: #a1846d;
	}

	/* ── REASONS ── */
	.reasons-accordion {
		margin-top: 20px;
	}

	.reasons-accordion .spec-accordion-trigger {
		background: #422635;
		color: #ffffff;
	}

	.reasons-accordion .spec-accordion-trigger:hover {
		background: #5a3249;
	}

	.reasons-accordion .spec-chevron {
		color: #ffffff;
	}

	.reasons-list {
		list-style: none;
		margin: 0;
		padding: 0;
		counter-reset: reasons-counter;
		border-top: 1px solid #ece7df;
	}

	.reasons-item {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 16px 20px 16px 52px;
		border-bottom: 1px solid #ece7df;
		counter-increment: reasons-counter;
		position: relative;
	}

	.reasons-item:last-child {
		border-bottom: none;
	}

	.reasons-item::before {
		content: counter(reasons-counter);
		position: absolute;
		left: 20px;
		top: 18px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 700;
		color: #a1846d;
		letter-spacing: 0.08em;
	}

	.reasons-title {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		color: #160b11;
		letter-spacing: 0.02em;
	}

	.reasons-body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		color: #6a5f58;
		line-height: 1.65;
	}

	/* Specs */
	.specs {
		margin: 0 0 32px;
		border: 1px solid #ece7df;
	}

	.spec-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		padding: 14px 20px;
		border-bottom: 1px solid #ece7df;
	}

	.spec-row:last-child {
		border-bottom: none;
	}

	.spec-row--highlight {
		background: #faf7f2;
	}

	.spec-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #a1846d;
		flex-shrink: 0;
	}

	.spec-value {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: #160b11;
		text-align: right;
		margin: 0;
	}

	.trust-banner {
		display: flex;
		align-items: stretch;
		border: 1px solid #ece7df;
		background: #faf7f2;
		margin-top: 32px;
	}

	.trust-banner-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 20px 24px;
		flex: 1;
	}

	.trust-banner-icon {
		width: 40px;
		height: 40px;
		background: #422635;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: #ffffff;
	}

	.trust-banner-text {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.trust-banner-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		color: #160b11;
		letter-spacing: 0.04em;
	}

	.trust-banner-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		color: #6a5f58;
		letter-spacing: 0.02em;
	}

	.trust-banner-divider {
		width: 1px;
		background: #ece7df;
		flex-shrink: 0;
	}

	/* Specs accordion */
	.spec-accordion {
		margin-top: 32px;
		border: 1px solid #ece7df;
	}

	.spec-accordion-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		background: #faf7f2;
		border: none;
		cursor: pointer;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #160b11;
		transition: background 0.18s ease;
	}

	.spec-accordion-trigger:hover {
		background: #f2ede5;
	}

	.spec-chevron {
		transition: transform 0.25s ease;
		flex-shrink: 0;
		color: #a1846d;
	}

	.spec-chevron--open {
		transform: rotate(180deg);
	}

	.spec-accordion .specs {
		margin: 0;
		border: none;
		border-top: 1px solid #ece7df;
	}

	.spec-accordion--centred .spec-accordion-trigger {
		position: relative;
		justify-content: flex-end;
		background: #422635;
		color: #ffffff;
	}

	.spec-accordion--centred .spec-accordion-trigger:hover {
		background: #5a3249;
	}

	.spec-accordion--centred .spec-chevron {
		color: #ffffff;
	}

	.spec-accordion--centred .spec-accordion-trigger span {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	/* ── PRODUCT DETAILS STRIP ── */
	.product-strip {
		width: 100%;
		background: #160b11;
		padding: 28px 40px;
		box-sizing: border-box;
	}

	.product-strip-inner {
		max-width: 1240px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 32px;
		flex-wrap: wrap;
	}

	.product-strip-title {
		display: flex;
		align-items: baseline;
		gap: 12px;
		flex-shrink: 0;
	}

	.product-strip-name {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1rem, 1.6vw, 1.2rem);
		font-weight: 400;
		color: #ffffff;
		letter-spacing: -0.01em;
	}

	.product-strip-ref {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #a1846d;
	}

	.product-strip-meta {
		display: flex;
		align-items: center;
		gap: 0;
		flex-wrap: wrap;
	}

	.product-strip-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 0 28px;
	}

	.product-strip-item:first-child {
		padding-left: 0;
	}

	.product-strip-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
	}

	.product-strip-value {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #ffffff;
		white-space: nowrap;
	}

	.product-strip-price {
		color: #a1846d;
		font-weight: 700;
	}

	.product-strip-divider {
		width: 1px;
		height: 36px;
		background: rgba(255, 255, 255, 0.1);
		flex-shrink: 0;
		align-self: center;
	}

	@media (max-width: 900px) {
		.product-strip {
			padding: 24px 32px;
		}

		.product-strip-inner {
			flex-direction: column;
			align-items: flex-start;
			gap: 20px;
		}

		.product-strip-meta {
			gap: 0;
		}

		.product-strip-item {
			padding: 0 20px;
		}

		.product-strip-item:first-child {
			padding-left: 0;
		}
	}

	@media (max-width: 640px) {
		.product-strip {
			padding: 24px 24px;
		}

		.product-strip-meta {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 20px;
			width: 100%;
		}

		.product-strip-item {
			padding: 0;
		}

		.product-strip-divider {
			display: none;
		}
	}

	/* ── TRUSTPILOT BANNER ── */
	.tp-banner {
		width: 100%;
		background: #ffffff;
		border-top: 1px solid rgba(22, 11, 17, 0.07);
		border-bottom: 1px solid rgba(22, 11, 17, 0.07);
		padding: 18px 40px;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
	}

	.tp-banner .trustpilot-widget {
		max-width: 1240px;
		width: 100%;
	}

	@media (max-width: 640px) {
		.tp-banner {
			padding: 16px 20px;
		}
	}

	/* ── ENQUIRY SECTION ── */
	/* ── ENQUIRY SECTION ── */
	.enquiry-section {
		background: #f7f5f2;
		padding: 100px 40px;
	}

	.enquiry-inner {
		max-width: 680px;
		margin: 0 auto;
	}

	.enquiry-header {
		text-align: center;
		margin-bottom: 52px;
	}

	.enquiry-eyebrow {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 14px;
	}

	.enquiry-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2rem, 3vw, 2.75rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 16px;
		letter-spacing: -0.01em;
	}

	.enquiry-sub {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.95rem;
		color: #6a5f58;
		line-height: 1.7;
		margin: 0;
	}

	/* Form */
	.enquiry-form {
		background: #ffffff;
		padding: 48px;
		border: 1px solid #ece7df;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #6a5f58;
	}

	.form-input {
		font-family: 'Montserrat', sans-serif;
		font-size: 1rem;
		padding: 14px 16px;
		border: 1px solid #e1dbd2;
		background: #ffffff;
		color: #160b11;
		transition: border-color 0.2s ease;
		border-radius: 0;
		outline: none;
	}

	.form-input:focus {
		border-color: #a1846d;
	}

	.form-field--error .form-input {
		border-color: #b04040;
	}

	.form-error {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.78rem;
		color: #b04040;
	}

	/* Contact preference toggle */
	.toggle-group {
		display: flex;
		gap: 0;
		border: 1px solid #e1dbd2;
	}

	.toggle-btn {
		flex: 1;
		padding: 12px 16px;
		background: #ffffff;
		border: none;
		border-right: 1px solid #e1dbd2;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #6a5f58;
		cursor: pointer;
		transition: background 0.18s ease, color 0.18s ease;
	}

	.toggle-btn:last-child {
		border-right: none;
	}

	.toggle-btn--active {
		background: #faf7f2;
		color: #a1846d;
		border-right: 1px solid #e1dbd2;
		outline: 2px solid #a1846d;
		outline-offset: -2px;
		font-weight: 700;
	}

	.toggle-btn:not(.toggle-btn--active):hover {
		background: #f7f5f2;
		color: #160b11;
	}

	.form-submit-error {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.85rem;
		color: #b04040;
		padding: 12px 16px;
		background: #fdf3f3;
		border: 1px solid #e5c5c5;
		margin: 0;
	}

	.form-submit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 18px 32px;
		background: #a1846d;
		color: #ffffff;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		border: 1px solid #a1846d;
		cursor: pointer;
		transition: background 0.2s ease, border-color 0.2s ease;
		width: 100%;
	}

	.form-submit:hover:not(:disabled) {
		background: #8a6f59;
		border-color: #8a6f59;
	}

	.form-submit:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.form-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.form-privacy {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		color: #a89d94;
		line-height: 1.6;
		text-align: center;
		margin: 0;
	}

	.form-privacy-link {
		color: #a1846d;
		text-decoration: none;
		border-bottom: 1px solid rgba(161, 132, 109, 0.35);
	}

	.form-privacy-link:hover {
		color: #8a6f59;
	}

	/* Success state */
	.form-success {
		background: #ffffff;
		border: 1px solid #ece7df;
		padding: 64px 48px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.form-success-icon {
		width: 56px;
		height: 56px;
		background: #f4efe7;
		color: #a1846d;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.form-success-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.6rem;
		font-weight: 400;
		color: #160b11;
		margin: 0;
	}

	.form-success-body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.95rem;
		color: #6a5f58;
		line-height: 1.7;
		margin: 0;
		max-width: 400px;
	}

	/* ── GALLERY ── */
	.gallery-section {
		background: #ffffff;
		padding: 80px 0;
	}

	.gallery-outer {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 40px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		align-items: center;
	}

	.gallery-layout {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.gallery-track {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		user-select: none;
	}

	.gallery-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		opacity: 0;
		transition: opacity 0.5s ease;
	}

	.gallery-img--active {
		opacity: 1;
	}

	.gallery-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: rgba(255, 255, 255, 0.85);
		border: 1px solid #e1dbd2;
		color: #160b11;
		cursor: pointer;
		transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
	}

	.gallery-arrow:hover {
		background: #a1846d;
		border-color: #a1846d;
		color: #ffffff;
	}

	.gallery-arrow--prev { left: 20px; }
	.gallery-arrow--next { right: 20px; }

	.gallery-counter {
		position: absolute;
		bottom: 16px;
		right: 20px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: rgba(22, 11, 17, 0.5);
		z-index: 2;
	}

	.gallery-text {
		display: flex;
		flex-direction: column;
		gap: 0;
		justify-content: flex-start;
	}

	.gallery-extras {
		grid-column: 2;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.gallery-text-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.6rem, 2.4vw, 2.25rem);
		font-weight: 400;
		color: #160b11;
		margin: 0 0 24px;
		line-height: 1.2;
		letter-spacing: -0.01em;
	}

	.gallery-text-heading em {
		font-style: italic;
	}

	.gallery-dots {
		display: flex;
		justify-content: flex-start;
		gap: 8px;
	}

	.gallery-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #d4cdc6;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: background 0.25s ease, transform 0.25s ease;
	}

	.gallery-dot--active {
		background: #a1846d;
		transform: scale(1.35);
	}

	/* ── RESPONSIVE ── */

	/* Tablet */
	@media (max-width: 900px) {
		.gallery-section {
			padding: 60px 0;
		}

		.gallery-outer {
			grid-template-columns: 1fr;
			gap: 40px;
			padding: 0 32px;
		}

		.gallery-dots {
			justify-content: center;
		}

		.gallery-text {
			padding: 0 8px;
		}

		.enquiry-section {
			padding: 80px 32px;
		}

		.enquiry-form {
			padding: 40px 32px;
		}
	}

	/* Mobile */
	@media (max-width: 640px) {
		.hero-inner {
			padding: 80px 24px;
		}

		.gallery-section {
			padding: 48px 0;
		}

		.gallery-outer {
			gap: 32px;
			padding: 0 24px;
		}

		.gallery-layout {
			order: 2;
		}

		.gallery-text {
			order: 1;
		}

		.gallery-extras {
			grid-column: 1;
			order: 3;
		}

		.content-body--hide-mobile {
			display: none;
		}

		.gallery-track {
			/* full-bleed on mobile: stretch past the column padding */
			margin: 0 -24px;
			width: calc(100% + 48px);
		}

		.gallery-dots {
			justify-content: center;
		}

		.gallery-arrow {
			display: none;
		}

		.gallery-text {
			padding: 0;
		}

		.gallery-text-heading {
			font-size: 1.6rem;
		}

		.spec-accordion {
			margin-top: 24px;
		}

		.trust-banner {
			margin-top: 24px;
			flex-direction: column;
		}

		.trust-banner-divider {
			width: 100%;
			height: 1px;
		}

		.enquiry-section {
			padding: 64px 24px;
		}

		.enquiry-form {
			padding: 32px 20px;
		}

		.form-row {
			grid-template-columns: 1fr;
		}

		.toggle-btn {
			font-size: 0.72rem;
			padding: 12px 8px;
		}

		.form-success {
			padding: 48px 24px;
		}
	}

	/* ── BOTTOM SLIDER ── */
	.bottom-slider-section {
		width: 100%;
		background: #f7f5f2;
		padding: 48px 0 48px;
		display: none;
	}

	.bottom-slider-track {
		position: relative;
		width: 100%;
		aspect-ratio: 3 / 2;
		overflow: hidden;
		user-select: none;
		margin: 0 60px;
		width: calc(100% - 120px);
	}

	.bottom-slider-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		opacity: 0;
		transition: opacity 0.6s ease;
	}

	.bottom-slider-img--active {
		opacity: 1;
	}

	.bottom-slider-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: rgba(255, 255, 255, 0.85);
		border: 1px solid #e1dbd2;
		color: #160b11;
		cursor: pointer;
		transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
	}

	.bottom-slider-arrow:hover {
		background: #a1846d;
		border-color: #a1846d;
		color: #ffffff;
	}

	.bottom-slider-arrow--prev { left: 20px; }
	.bottom-slider-arrow--next { right: 20px; }

	.bottom-slider-dots {
		display: flex;
		justify-content: center;
		gap: 10px;
		padding-top: 20px;
	}

	.bottom-slider-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #d4cdc6;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: background 0.25s ease, transform 0.25s ease;
	}

	.bottom-slider-dot--active {
		background: #a1846d;
		transform: scale(1.3);
	}

	@media (max-width: 640px) {
		.bottom-slider-section {
			display: block;
			padding: 0 0 24px;
		}

		.bottom-slider-track {
			aspect-ratio: 4 / 5;
			margin: 0;
			width: 100%;
		}

		.bottom-slider-arrow {
			display: none;
		}
	}
</style>
