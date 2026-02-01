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
	:global(body) {
		margin: 0;
		padding: 0;
	}

	:global(html) {
		margin: 0;
		padding: 0;
	}
</style>

<!-- #A1846D Button Background -->
<!-- #160B11 Navbar Background -->
<!-- #422635 Banner Background -->
<!-- #160B11 Button Text -->
 <!-- #E5E5E5 Button Link Text -->