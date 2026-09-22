<script>
	import Search from '$lib/components/Search.svelte';
	import { wishlist } from '$lib/stores/wishlist.svelte.js';
	import { cart } from '$lib/stores/cart.svelte.js';
	import { page } from '$app/state';
	import { getOfferMonth } from '$lib/offer.js';
	let isMenuOpen = $state(false);

	const isValuationLink = $derived(page.url.pathname === '/valuation-link');
	const offerMonth = getOfferMonth();

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	function handleOverlayKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			closeMenu();
		}
	}
</script>

<nav class="navbar">
	<div class="navbar-container" class:offer-mode={isValuationLink}>
		{#if isValuationLink}
			<span class="logo-link">
				<img src="/assets/branding/Logo_Horizontal_Cream.avif" alt="Watch Reserve" class="logo" />
			</span>
		{:else}
			<a href="/" class="logo-link">
				<img src="/assets/branding/Logo_Horizontal_Cream.avif" alt="Watch Reserve" class="logo" />
			</a>
		{/if}

		{#if isValuationLink}
			<span class="offer-text">{offerMonth} Free Valuation Offer</span>
		{:else}
			<ul class="nav-links">
				<li><a href="/shop">SHOP</a></li>
				<li><a href="/sell">SELL</a></li>
				<li><a href="/source">SOURCE</a></li>
				<li><a href="/blogs">BLOGS & GUIDES</a></li>
				<li><a href="/api">INTELLIGENCE</a></li>
				<li><a href="/contact">CONTACT</a></li>
			</ul>

			<div class="navbar-right">
				<Search />
				<a href="/wishlist" class="wishlist-link" aria-label="Wishlist{wishlist.count > 0 ? ` (${wishlist.count} saved)` : ''}">
					<svg
						class="wishlist-icon"
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill={wishlist.count > 0 ? 'currentColor' : 'none'}
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
					{#if wishlist.count > 0}
						<span class="wishlist-badge">{wishlist.count}</span>
					{/if}
				</a>
				<a href="/checkout" class="cart-link" aria-label="Cart{cart.count > 0 ? ` (${cart.count} item${cart.count === 1 ? '' : 's'})` : ''}">
					<svg
						class="cart-icon"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					{#if cart.count > 0}
						<span class="cart-badge">{cart.count}</span>
					{/if}
				</a>
			</div>

			<button
				class="burger-menu"
				onclick={toggleMenu}
				aria-label="Toggle menu"
				aria-expanded={isMenuOpen}
			>
				<span class="burger-line" class:open={isMenuOpen}></span>
				<span class="burger-line" class:open={isMenuOpen}></span>
				<span class="burger-line" class:open={isMenuOpen}></span>
			</button>
		{/if}
	</div>

	<!-- Mobile Menu -->
	{#if !isValuationLink}
		<div class="mobile-menu" class:open={isMenuOpen}>
			<div
				class="mobile-menu-overlay"
				onclick={closeMenu}
				onkeydown={handleOverlayKeydown}
				role="button"
				tabindex="0"
				aria-label="Close menu"
			></div>
			<div class="mobile-menu-content">
				<ul class="mobile-nav-links">
				<li><a href="/shop" onclick={closeMenu}>SHOP</a></li>
				<li><a href="/sell" onclick={closeMenu}>SELL</a></li>
				<li><a href="/source" onclick={closeMenu}>SOURCE</a></li>
				<li><a href="/blogs" onclick={closeMenu}>BLOGS & GUIDES</a></li>
				<li><a href="/api" onclick={closeMenu}>INTELLIGENCE</a></li>
					<li><a href="/wishlist" onclick={closeMenu}>WISHLIST{wishlist.count > 0 ? ` (${wishlist.count})` : ''}</a></li>
					<li class="contact-li"><a href="/contact" onclick={closeMenu} class="mobile-contact-link">CONTACT</a></li>
				</ul>
			</div>
		</div>
	{/if}
</nav>

<style>
	.navbar {
		background-color: #160b11;
		width: 100%;
		padding: 0;
		margin: 0;
		position: relative;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.navbar-container {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 40px;
		gap: 24px;
	}

	.logo-link {
		display: flex;
		align-items: center;
		text-decoration: none;
		flex-shrink: 0;
	}

	.logo {
		height: 40px;
		width: auto;
		object-fit: contain;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 24px;
		list-style: none;
		margin: 0;
		padding: 0;
		flex: 1;
		justify-content: center;
	}

	.nav-links li {
		margin: 0;
		padding: 0;
	}

	.nav-links a {
		color: #ffffff;
		text-decoration: none;
		font-family: 'acumin-pro', sans-serif;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		transition: opacity 0.3s ease;
		white-space: nowrap;
	}

	.nav-links a:hover {
		opacity: 0.7;
	}

	.navbar-right {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-shrink: 0;
	}

	.offer-text {
		margin-left: auto;
		color: #ffffff;
		font-family: 'acumin-pro', sans-serif;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-align: right;
	}

	.burger-menu {
		display: none;
		flex-direction: column;
		justify-content: space-around;
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		width: 40px;
		height: 40px;
		box-sizing: border-box;
		z-index: 1001;
		position: relative;
	}

	.burger-line {
		width: 100%;
		height: 2px;
		background-color: #ffffff;
		border-radius: 2px;
		transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		transform-origin: center;
	}

	.burger-line:nth-child(2) {
		width: 70%;
		margin-left: auto;
	}

	.burger-line.open:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
		width: 100%;
	}

	.burger-line.open:nth-child(2) {
		opacity: 0;
		transform: scaleX(0);
		width: 100%;
		margin-left: 0;
	}

	.burger-line.open:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
		width: 100%;
	}

	.mobile-menu {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
		pointer-events: none;
	}

	.mobile-menu.open {
		pointer-events: all;
	}

	.mobile-menu-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.mobile-menu.open .mobile-menu-overlay {
		opacity: 1;
	}

	.mobile-menu-content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		background-color: #160b11;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
		transform: translateY(calc(-100% - 60px));
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow-y: auto;
		padding-top: 60px;
		padding-bottom: 40px;
		max-height: calc(100vh - 60px);
	}

	.mobile-menu.open .mobile-menu-content {
		transform: translateY(60px);
	}

	.mobile-nav-links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.mobile-nav-links li {
		margin: 0;
		padding: 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.mobile-nav-links li.contact-li {
		border-bottom: none;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		text-align: center;
		width: 100%;
	}

	.mobile-nav-links a {
		display: block;
		color: #ffffff;
		text-decoration: none;
		font-family: 'acumin-pro', sans-serif;
		font-size: 16px;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		padding: 20px 30px;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.mobile-nav-links a::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 4px;
		background-color: #a1846d;
		transform: scaleY(0);
		transition: transform 0.3s ease;
		transform-origin: bottom;
	}

	.mobile-nav-links a:hover::before,
	.mobile-nav-links a:focus::before {
		transform: scaleY(1);
		transform-origin: top;
	}

	.mobile-nav-links a:hover {
		background-color: rgba(255, 255, 255, 0.05);
		padding-left: 40px;
	}

	.mobile-contact-link {
		background-color: #a1846d;
		margin: 24px auto 0;
		border-radius: 0;
		text-align: center;
		padding: 12px 24px;
		width: fit-content;
		min-width: 140px;
		font-size: 14px;
		display: block;
	}

	.mobile-contact-link::before {
		display: none;
	}

	.mobile-contact-link:hover {
		background-color: #8a6f59;
		padding-left: 24px;
		padding-right: 24px;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.wishlist-link {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		text-decoration: none;
		transition: opacity 0.3s ease, color 0.2s ease;
	}

	.wishlist-link:hover {
		opacity: 0.7;
	}

	.wishlist-icon {
		width: 22px;
		height: 22px;
		color: #ffffff;
	}

	.wishlist-badge {
		position: absolute;
		top: -8px;
		right: -8px;
		background-color: #a1846d;
		color: #ffffff;
		border-radius: 50%;
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		font-weight: 600;
		font-family: 'acumin-pro', sans-serif;
	}

	.cart-link {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		text-decoration: none;
		transition: opacity 0.3s ease;
	}

	.cart-link:hover {
		opacity: 0.7;
	}

	.cart-icon {
		width: 24px;
		height: 24px;
	}

	.cart-badge {
		position: absolute;
		top: -8px;
		right: -8px;
		background-color: #000000;
		color: #ffffff;
		border-radius: 50%;
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		font-weight: 600;
		font-family: 'acumin-pro', sans-serif;
	}

	@media (max-width: 1100px) {
		.navbar-container {
			padding: 16px 28px;
			gap: 16px;
		}

		.nav-links {
			gap: 18px;
		}

		.nav-links a {
			font-size: 12px;
		}

		.offer-text {
			font-size: 12px;
		}
	}

	@media (max-width: 1024px) {
		.navbar-container {
			padding: 16px 24px;
			gap: 12px;
		}

		.nav-links {
			gap: 14px;
		}

		.nav-links a {
			font-size: 11.5px;
		}

		.offer-text {
			font-size: 11.5px;
		}
	}

	@media (max-width: 768px) {
		.navbar {
			position: relative;
		}

		/* Two-row mobile layout */
		.navbar-container {
			flex-wrap: wrap;
			padding: 0;
			gap: 0;
			align-items: stretch;
		}

		/* Row 1: utility strip — search fills left, icons sit right */
		.navbar-right {
			order: 1;
			width: 100%;
			justify-content: space-between;
			padding: 8px 20px;
			gap: 16px;
			border-bottom: 1px solid rgba(255, 255, 255, 0.08);
			background-color: rgba(255, 255, 255, 0.03);
		}

		/* Row 2: logo (left) + burger (right) */
		.logo-link {
			order: 2;
			flex: 1;
			padding: 12px 20px;
			align-self: center;
		}

		.burger-menu {
			display: flex;
			order: 3;
			width: 44px;
			height: 44px;
			padding: 10px;
			box-sizing: border-box;
			align-self: center;
			margin-right: 16px;
		}

		.nav-links {
			display: none;
		}

		.logo {
			height: 30px;
		}

		.mobile-menu-content {
			transform: translateY(calc(-100% - 56px));
			padding-top: 56px;
			max-height: calc(100vh - 56px);
		}

		.mobile-menu.open .mobile-menu-content {
			transform: translateY(56px);
		}

		/* Valuation-link route: single-row layout, no burger/utility row to wrap around */
		.navbar-container.offer-mode {
			flex-wrap: nowrap;
			align-items: center;
			padding: 12px 20px;
		}

		.navbar-container.offer-mode .logo-link {
			order: 0;
			flex: 0 0 auto;
			padding: 0;
		}

		.offer-text {
			display: none;
		}
	}
</style>
