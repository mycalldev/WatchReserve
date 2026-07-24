<script>
	const favicon = '/favicon.png';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import ConditionalGA from '$lib/components/ConditionalGA.svelte';
	import LiveChat from '$lib/components/LiveChat.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
	<script src="https://elfsightcdn.com/platform.js" async></script>
</svelte:head>

<div class="announcement-banner">
	<div class="elfsight-app-3792420a-7204-4b4b-b884-4ed4c4b7956f" data-elfsight-app-lazy></div>
</div>

<Navbar />

{@render children()}

<Footer />

<CookieConsent />

<ConditionalGA />

<LiveChat />

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

	.announcement-banner :global([class^='elfsight-app-']) {
		max-width: 100%;
		width: fit-content !important;
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
</style>

<!-- #A1846D Button Background -->
<!-- #160B11 Navbar Background -->
<!-- #422635 Banner Background -->
<!-- #160B11 Button Text -->
 <!-- #E5E5E5 Button Link Text -->