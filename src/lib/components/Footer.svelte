<script>
	// Footer component
</script>

<footer class="footer">
	<div class="footer-container">
		<div class="footer-top">
			<div class="footer-intro">
				<h2 class="footer-heading">Trusted Luxury Watch Dealer in London</h2>
				<p class="footer-description">
					Watch Reserve is a boutique business based in Canary Wharf, specialising in the sale and sourcing of luxury pre-owned watches including Rolex, Patek Philippe, and Audemars Piguet. We offer a discreet, five-star service for collectors across the UK.
				</p>
			</div>

			<div class="footer-contact">
				<p class="contact-item">25 Cabot Square, Canary Wharf, London, E14 4QA</p>
				<p class="contact-item">
					<a href="mailto:info@thewatchreserve.co.uk" class="contact-link-text">info@thewatchreserve.co.uk</a>
				</p>
				<p class="contact-item">
					<a href="tel:07850250984" class="contact-link-text">07850 250 984 LandLine Required Here *****</a>
				</p>
				<a href="/contact" class="contact-link-btn">
					Contact Us
				</a>
			</div>
		</div>

		<div class="footer-links">
			<div class="footer-nav-column">
				<a href="/shop">Shop All</a>
				<a href="/sell">Sell</a>
				<a href="/source">Source</a>
				<a href="/about">About</a>
				<a href="/blogs">Blogs & Guides</a>
				<a href="/part-exchange">Part Exchange</a>
			</div>

			<div class="footer-nav-column">
				<a href="/shop/rolex">Shop Rolex</a>
				<a href="/shop/audemars-piguet">Shop Audemars Piguet</a>
				<a href="/shop/patek-philippe">Shop Patek Phillipe</a>
				<a href="/shop/curated-editions">Shop Curated Editions</a>
				<a href="/contact">Contact Us</a>
			</div>
		</div>

		<div class="footer-policies">
			<a href="/privacy-policy">Privacy Policy</a>
			<a href="/refund-policy">Refund Policy</a>
			<a href="/shipping-policy">Shipping Policy</a>
			<a href="/terms-of-service">Terms of Service</a>
		</div>

		<div class="footer-bottom">
			<div class="footer-divider"></div>
			<div class="footer-copyright">
				<a
					href="https://instagram.com/thewatchreserve"
					target="_blank"
					rel="noopener noreferrer"
					class="instagram-link"
					aria-label="Instagram"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2" />
						<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" />
						<circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
					</svg>
				</a>
				<p class="copyright-text">Watch Reserve. All rights reserved.</p>
			</div>
		</div>
	</div>
</footer>

<style>
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
		padding: 80px 40px 40px;
	}

	.footer-top {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		margin-bottom: 60px;
	}

	.footer-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 3vw, 2.5rem);
		font-weight: 400;
		color: #e5e5e5;
		margin: 0 0 24px 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.footer-description {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.125rem);
		color: #e5e5e5;
		line-height: 1.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		margin: 0;
	}

	.footer-contact {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.contact-item {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.125rem);
		color: #e5e5e5;
		line-height: 1.6;
		font-weight: 300;
		letter-spacing: 0.01em;
		margin: 0;
	}

	.contact-link-text {
		color: #e5e5e5;
		text-decoration: none;
		transition: opacity 0.3s ease;
	}

	.contact-link-text:hover {
		opacity: 0.7;
	}

	.contact-link-btn {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		color: #e5e5e5;
		text-decoration: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 500;
		transition: all 0.3s ease;
		letter-spacing: 0.01em;
		margin-top: 8px;
		align-self: flex-start;
	}

	.contact-link-btn:hover {
		opacity: 0.8;
	}

	.footer-links {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		margin-bottom: 60px;
	}

	.footer-nav-column {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.footer-nav-column a {
		color: #e5e5e5;
		text-decoration: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.125rem);
		font-weight: 300;
		letter-spacing: 0.01em;
		transition: opacity 0.3s ease;
	}

	.footer-nav-column a:hover {
		opacity: 0.7;
	}

	.footer-policies {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 40px;
	}

	.footer-policies a {
		color: #e5e5e5;
		text-decoration: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.95rem, 1.2vw, 1.125rem);
		font-weight: 300;
		letter-spacing: 0.01em;
		transition: opacity 0.3s ease;
	}

	.footer-policies a:hover {
		opacity: 0.7;
	}

	.footer-bottom {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.footer-divider {
		width: 100%;
		height: 1px;
		background-color: #e5e5e5;
		opacity: 0.3;
	}

	.footer-copyright {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.instagram-link {
		color: #e5e5e5;
		text-decoration: none;
		display: flex;
		align-items: center;
		transition: opacity 0.3s ease;
	}

	.instagram-link:hover {
		opacity: 0.7;
	}

	.instagram-link svg {
		width: 24px;
		height: 24px;
	}

	.copyright-text {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.875rem;
		color: #e5e5e5;
		margin: 0;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	@media (max-width: 1024px) {
		.footer-container {
			padding: 60px 30px 30px;
		}

		.footer-top {
			gap: 40px;
		}

		.footer-links {
			gap: 40px;
		}
	}

	@media (max-width: 768px) {
		.footer-container {
			padding: 50px 20px 30px;
		}

		.footer-top {
			grid-template-columns: 1fr;
			gap: 40px;
			margin-bottom: 40px;
		}

		.footer-links {
			grid-template-columns: 1fr;
			gap: 40px;
			margin-bottom: 40px;
		}

		.footer-policies {
			margin-bottom: 30px;
		}

		.footer-copyright {
			flex-wrap: wrap;
		}
	}

	@media (max-width: 480px) {
		.footer-container {
			padding: 40px 20px 20px;
		}

		.footer-top {
			gap: 30px;
			margin-bottom: 30px;
		}

		.footer-links {
			gap: 30px;
			margin-bottom: 30px;
		}
	}
</style>

