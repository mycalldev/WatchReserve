import { readable } from 'svelte/store';
import { getOfferMonth } from './offer.js';

// Refresh on the minute and when returning to a tab, including month rollover.
export const offerMonth = readable(getOfferMonth(), (set) => {
	set(getOfferMonth());
	if (typeof window === 'undefined') return;

	let timer;
	const refresh = () => {
		clearTimeout(timer);
		set(getOfferMonth());
		timer = setTimeout(refresh, 60_000 - (Date.now() % 60_000));
	};
	refresh();
	window.addEventListener('focus', refresh);
	document.addEventListener('visibilitychange', refresh);
	return () => {
		clearTimeout(timer);
		window.removeEventListener('focus', refresh);
		document.removeEventListener('visibilitychange', refresh);
	};
});
