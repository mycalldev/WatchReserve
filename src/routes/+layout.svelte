<script>
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="announcement-banner">
	<p class="announcement-text">
		We Offer Part Exchange &nbsp;|&nbsp;
		<a href="/sell" class="announcement-link">Request a FREE Valuation Today →</a>
	</p>
</div>

<Navbar />

{@render children()}

<Footer />

<style>
	.announcement-banner {
		width: 100%;
		background-color: #f5f0eb;
		padding: 8px 20px;
		text-align: center;
	}

	.announcement-text {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 13px;
		font-weight: 500;
		color: #2c1810;
		letter-spacing: 0.03em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.announcement-link {
		color: #6f130a;
		text-decoration: none;
		font-weight: 600;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s ease, opacity 0.2s ease;
	}

	.announcement-link:hover {
		border-bottom-color: #6f130a;
		opacity: 0.8;
	}

	@media (max-width: 480px) {
		.announcement-text {
			font-size: 11px;
			white-space: normal;
		}
	}

	:global(html) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		max-width: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		max-width: 100%;
		width: 100%;
		box-sizing: border-box;
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