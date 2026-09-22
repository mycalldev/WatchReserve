<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getOfferMonth } from '$lib/offer.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import ConditionalGA from '$lib/components/ConditionalGA.svelte';
	import LiveChat from '$lib/components/LiveChat.svelte';

	const favicon = '/favicon.png';
	const offerMonth = getOfferMonth();
	let { children } = $props();
	const isHome = $derived(page.url.pathname === '/');
	const isValuationLink = $derived(page.url.pathname === '/valuation-link');
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
	<script src="https://elfsightcdn.com/platform.js" async></script>
</svelte:head>

<header class="site-header">
	<div class="announcement-banner">
		{#if isHome}
			<a class="announcement-link" href={resolve('/sell#start')}>
				<span>Request your <strong>FREE {offerMonth} Valuation Today</strong></span>
				<span class="announcement-arrow" aria-hidden="true">→</span>
			</a>
		{:else}
			<div class="elfsight-app-3792420a-7204-4b4b-b884-4ed4c4b7956f" data-elfsight-app-lazy></div>
		{/if}
	</div>

	<Navbar />
</header>

{@render children()}

<Footer />

<CookieConsent />

<ConditionalGA />

{#if !isValuationLink}
	<LiveChat />
{/if}

<!-- #A1846D Button Background -->
<!-- #160B11 Navbar Background -->
<!-- #422635 Banner Background -->
<!-- #160B11 Button Text -->
<!-- #E5E5E5 Button Link Text -->

<style>
	.announcement-banner {
		width: 100%;
		background-color: #f5f0eb;
		padding: 6px 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 0;
		max-height: 50px;
		overflow: hidden;
	}

	.site-header {
		position: sticky;
		top: 0;
		z-index: 1001;
	}

	.announcement-banner :global([class^='elfsight-app-']) {
		max-width: 100%;
		width: fit-content !important;
	}

	.announcement-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		color: #160b11;
		font-family: 'acumin-pro', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		line-height: 1.2;
		text-align: center;
		text-decoration: none;
		text-transform: uppercase;
		transition: color 0.2s ease;
	}

	.announcement-link:hover {
		color: #a1846d;
	}

	.announcement-arrow {
		font-size: 1.15em;
		transition: transform 0.2s ease;
	}

	.announcement-link:hover .announcement-arrow {
		transform: translateX(3px);
	}

	@media (max-width: 480px) {
		.announcement-banner {
			padding: 7px 12px;
		}

		.announcement-link {
			gap: 6px;
			font-size: 0.68rem;
			letter-spacing: 0.05em;
		}
	}

	:global(html) {
		margin: 0;
		padding: 0;
		max-width: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		max-width: 100%;
		width: 100%;
		box-sizing: border-box;
		font-family: 'acumin-pro', sans-serif;
		font-weight: 300;
	}

	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}

	:global(em, i, cite, address, blockquote) {
		font-style: normal;
	}
</style>
