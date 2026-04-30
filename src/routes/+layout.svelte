<script>
	import { onMount } from 'svelte';
	const favicon = '/favicon.png';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';

	let { children } = $props();

	let trustpilotEl = $state(null);

	onMount(() => {
		// Trustpilot widget
		const SRC = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';

		function initWidget() {
			if (typeof window !== 'undefined' && window.Trustpilot && trustpilotEl) {
				window.Trustpilot.loadFromElement(trustpilotEl, true);
			}
		}

		const existing = document.querySelector('script[src*="tp.widget.bootstrap.min.js"]');
		if (existing) {
			initWidget();
			return;
		}

		const script = document.createElement('script');
		script.src = SRC;
		script.async = true;
		script.onload = initWidget;
		document.head.appendChild(script);
	});
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
</svelte:head>

<div class="announcement-banner">
	<!-- TrustBox widget - Micro Star -->
	<div
		bind:this={trustpilotEl}
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
	<!-- End TrustBox widget -->
</div>

<Navbar />

{@render children()}

<Footer />

<CookieConsent />

<style>
	.announcement-banner {
		width: 100%;
		background-color: #f5f0eb;
		padding: 10px 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
	}

	.announcement-banner :global(.trustpilot-widget) {
		max-width: 100%;
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
		font-family: 'Montserrat', sans-serif;
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