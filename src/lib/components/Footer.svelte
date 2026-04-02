<script>
	// Footer component
</script>

<footer class="footer">

	<!-- Info bar -->
	<div class="footer-info-bar">
		<div class="footer-info-inner">

			<div class="info-col">
				<span class="info-label">Talk to Us</span>
				<a href="tel:02081501987" class="info-primary">0208 150 1987</a>
				<a href="mailto:info@thewatchreserve.co.uk" class="info-secondary">info@thewatchreserve.co.uk</a>
			</div>

			<div class="info-divider" aria-hidden="true"></div>

			<div class="info-col info-col--center">
				<span class="info-brand">Watch Reserve</span>
				<span class="info-secondary">25 Cabot Square, Canary Wharf</span>
				<span class="info-secondary">London, E14 4QA</span>
			</div>

			<div class="info-divider" aria-hidden="true"></div>

			<div class="info-col info-col--right">
				<span class="info-label">Opening Hours</span>
				<span class="info-primary">Mon – Sat: 10:00AM – 6:00PM</span>
				<span class="info-secondary">By Appointment Only</span>
			</div>

		</div>
	</div>

	<div class="footer-container">
		<div class="footer-grid">

			<!-- Brand column -->
			<div class="footer-col footer-col--brand">
				<h2 class="footer-heading">The Tech Hub of Luxury Watches</h2>
				<p class="footer-description">
					Watch Reserve is a boutique based in Canary Wharf, specialising in the sale and sourcing of pre-owned luxury timepieces. We offer a discreet, five-star service for collectors across the UK.
				</p>
			</div>

			<!-- Explore column -->
			<div class="footer-col">
				<h3 class="footer-col-label">Explore</h3>
				<nav class="footer-nav">
					<a href="/shop">Shop All</a>
					<a href="/sell">Sell a Watch</a>
					<a href="/source">Source a Watch</a>
					<a href="/about">About Us</a>
					<a href="/blogs">Blogs &amp; Guides</a>
					<a href="/part-exchange">Part Exchange</a>
					<a href="/contact">Contact Us</a>
				</nav>
			</div>

			<!-- Collections column -->
			<div class="footer-col">
				<h3 class="footer-col-label">Collections</h3>
				<nav class="footer-nav">
					<a href="/shop/rolex">Rolex</a>
					<a href="/shop/audemars-piguet">Audemars Piguet</a>
					<a href="/shop/patek-philippe">Patek Philippe</a>
					<a href="/shop/curated-editions">Curated Editions</a>
				</nav>

				<h3 class="footer-col-label footer-col-label--spaced">Legal</h3>
				<nav class="footer-nav">
					<a href="/privacy-policy">Privacy Policy</a>
					<a href="/refund-policy">Refund Policy</a>
					<a href="/terms-of-service">Terms of Service</a>
				</nav>
			</div>

			<!-- Intelligence API column -->
			<div class="footer-col footer-col--api">
				<div class="api-eyebrow">
					<span class="api-dot" aria-hidden="true"></span>
					Intelligence API
				</div>
				<h3 class="api-heading">Intelligence API Asset Valuation</h3>
				<p class="api-body">
					Real-time pricing, availability data for luxury timepieces direct from our In House Intelligence API.
				</p>
				<a href="/api" class="api-subscribe-btn">
					Subscribe to API
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M5 12h14M12 5l7 7-7 7"/>
					</svg>
				</a>
				<a href="/api" class="api-learn-link">Learn more about the API →</a>
			</div>

		</div>
	</div>

	<div class="footer-bottom-bar">
		<div class="footer-bottom-inner">
			<a
				href="https://instagram.com/thewatchreserve"
				target="_blank"
				rel="noopener noreferrer"
				class="social-link"
				aria-label="Instagram"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2" />
					<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" />
					<circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
				</svg>
			</a>
			<a
				href="https://www.youtube.com/@thewatchreserve"
				target="_blank"
				rel="noopener noreferrer"
				class="social-link"
				aria-label="YouTube"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" stroke="currentColor" stroke-width="2"/>
					<polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor"/>
				</svg>
			</a>
			<p class="copyright-text">Watch Reserve. All rights reserved.</p>
		</div>
	</div>
</footer>

<style>
	/* ─────────────────────────────────────────
	   INFO BAR  (top — light #e5e5e5 strip)
	───────────────────────────────────────── */
	.footer-info-bar {
		width: 100%;
		background-color: #e5e5e5;
		border-bottom: 1px solid rgba(22, 11, 17, 0.1);
	}

	.footer-info-inner {
		max-width: 1400px;
		margin: 0 auto;
		padding: 32px 40px;
		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		align-items: center;
	}

	.info-divider {
		width: 1px;
		height: 56px;
		background-color: rgba(22, 11, 17, 0.12);
		margin: 0 40px;
		flex-shrink: 0;
	}

	.info-col {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.info-col--center { text-align: center; align-items: center; }
	.info-col--right  { text-align: right;  align-items: flex-end; }

	.info-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(22, 11, 17, 0.4);
		margin-bottom: 4px;
	}

	.info-brand {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.0625rem;
		font-weight: 400;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #160b11;
		margin-bottom: 4px;
	}

	.info-primary {
		font-family: 'Montserrat', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		color: #160b11;
		text-decoration: none;
		letter-spacing: 0.01em;
		transition: color 0.2s ease;
	}
	a.info-primary:hover { color: #a1846d; }

	.info-secondary {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		font-weight: 400;
		color: rgba(22, 11, 17, 0.5);
		text-decoration: none;
		letter-spacing: 0.01em;
		transition: color 0.2s ease;
	}
	a.info-secondary:hover { color: #a1846d; }

	/* ─────────────────────────────────────────
	   FOOTER BODY  (dark section)
	───────────────────────────────────────── */
	.footer {
		background-color: #160b11;
		color: #e5e5e5;
		width: 100%;
		padding: 0;
		margin: 0;
	}

	.footer-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 80px 40px 56px;
	}

	/* 4-column grid */
	.footer-grid {
		display: grid;
		grid-template-columns: 1.6fr 1fr 1fr 1.5fr;
		gap: 64px;
		padding-bottom: 64px;
		border-bottom: 1px solid rgba(229, 229, 229, 0.1);
	}

	.footer-col {
		display: flex;
		flex-direction: column;
	}

	.footer-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.375rem, 2vw, 1.875rem);
		font-weight: 400;
		color: #e5e5e5;
		margin: 0 0 20px 0;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	.footer-description {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9rem;
		color: rgba(229, 229, 229, 0.6);
		line-height: 1.8;
		font-weight: 400;
		letter-spacing: 0.01em;
		margin: 0;
	}

	/* Nav columns */
	.footer-col-label {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin: 0 0 22px 0;
	}

	.footer-col-label--spaced {
		margin-top: 40px;
	}

	.footer-nav {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.footer-nav a {
		color: rgba(229, 229, 229, 0.7);
		text-decoration: none;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9rem;
		font-weight: 400;
		letter-spacing: 0.01em;
		transition: color 0.2s ease;
	}

	.footer-nav a:hover {
		color: #a1846d;
	}

	/* ─────────────────────────────────────────
	   INTELLIGENCE API COLUMN
	───────────────────────────────────────── */
	.footer-col--api {
		border-left: 1px solid rgba(161, 132, 109, 0.25);
		padding-left: 40px;
	}

	.api-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #a1846d;
		margin-bottom: 16px;
	}

	.api-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background-color: #a1846d;
		flex-shrink: 0;
		animation: apiPulse 2.4s ease-in-out infinite;
	}

	@keyframes apiPulse {
		0%, 100% { opacity: 1; transform: scale(1); }
		50%       { opacity: 0.35; transform: scale(0.7); }
	}

	.api-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.25rem;
		font-weight: 400;
		color: #e5e5e5;
		margin: 0 0 14px 0;
		line-height: 1.35;
		letter-spacing: -0.01em;
	}

	.api-body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.875rem;
		color: rgba(229, 229, 229, 0.55);
		line-height: 1.75;
		font-weight: 400;
		margin: 0 0 28px 0;
	}

	.api-subscribe-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background-color: #a1846d;
		color: #ffffff;
		text-decoration: none;
		font-family: 'Montserrat', sans-serif;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 13px 22px;
		border-radius: 0;
		transition: background-color 0.22s ease, transform 0.2s ease, box-shadow 0.22s ease;
		align-self: flex-start;
		margin-bottom: 16px;
	}

	.api-subscribe-btn:hover {
		background-color: #8a6f59;
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(161, 132, 109, 0.3);
	}

	.api-learn-link {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		font-weight: 500;
		color: rgba(161, 132, 109, 0.65);
		text-decoration: none;
		letter-spacing: 0.01em;
		transition: color 0.2s ease;
	}

	.api-learn-link:hover { color: #a1846d; }

	/* ─────────────────────────────────────────
	   BOTTOM BAR  (light #e5e5e5 strip)
	───────────────────────────────────────── */
	.footer-bottom-bar {
		width: 100%;
		background-color: #e5e5e5;
	}

	.footer-bottom-inner {
		max-width: 1400px;
		margin: 0 auto;
		padding: 18px 40px;
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.social-link {
		color: rgba(22, 11, 17, 0.4);
		text-decoration: none;
		display: flex;
		align-items: center;
		flex-shrink: 0;
		transition: color 0.2s ease;
	}

	.social-link:hover { color: #a1846d; }

	.copyright-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		color: rgba(22, 11, 17, 0.45);
		margin: 0;
		font-weight: 500;
		letter-spacing: 0.03em;
	}

	/* ─────────────────────────────────────────
	   RESPONSIVE
	───────────────────────────────────────── */
	@media (max-width: 1200px) {
		.footer-grid {
			grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
			gap: 48px;
		}
	}

	@media (max-width: 1024px) {
		.footer-info-inner { padding: 28px 30px; }
		.info-divider { margin: 0 28px; }

		.footer-container { padding: 64px 30px 48px; }

		.footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: 48px 40px;
		}

		.footer-col--api {
			border-left: none;
			border-top: 1px solid rgba(161, 132, 109, 0.25);
			padding-left: 0;
			padding-top: 40px;
		}
	}

	@media (max-width: 768px) {
		.footer-info-inner {
			grid-template-columns: 1fr;
			padding: 28px 20px;
			gap: 24px;
		}

		.info-divider {
			width: 100%;
			height: 1px;
			margin: 0;
		}

		.info-col--center,
		.info-col--right {
			text-align: left;
			align-items: flex-start;
		}

		.footer-container { padding: 52px 20px 40px; }

		.footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: 44px 32px;
		}

		.footer-col--brand {
			grid-column: 1 / -1;
		}

		.footer-bottom-inner {
			padding: 16px 20px;
			flex-wrap: wrap;
			gap: 10px;
		}
	}

	@media (max-width: 560px) {
		.footer-grid {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.footer-col--api {
			border-top: 1px solid rgba(161, 132, 109, 0.25);
			padding-top: 36px;
		}
	}

	@media (max-width: 480px) {
		.footer-info-inner { padding: 24px 16px; }
		.footer-container { padding: 44px 16px 36px; }
		.footer-bottom-inner { padding: 14px 16px; }
	}
</style>

