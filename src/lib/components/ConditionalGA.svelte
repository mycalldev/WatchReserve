<script>
	import { onMount, onDestroy } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { initGA, hasConsent, trackPageView, CONSENT_EVENT } from '$lib/ga.js';

	let ready = $state(false);

	function activate() {
		if (!hasConsent()) return;
		initGA();
		ready = true;
		trackPageView();
	}

	function onConsentChanged(e) {
		if (e?.detail?.value === 'accepted') {
			activate();
		}
	}

	afterNavigate(() => {
		if (ready) trackPageView();
	});

	onMount(() => {
		activate();
		window.addEventListener(CONSENT_EVENT, onConsentChanged);
	});

	onDestroy(() => {
		if (typeof window === 'undefined') return;
		window.removeEventListener(CONSENT_EVENT, onConsentChanged);
	});
</script>
