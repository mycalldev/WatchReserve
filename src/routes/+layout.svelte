<script>
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar />

{@render children()}

<Footer />

<style>
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