import { browser } from '$app/environment';

export const GA_MEASUREMENT_ID = 'G-PNLG35W9B7';
export const CONSENT_KEY = 'wr_cookie_consent';
export const CONSENT_EVENT = 'wr-consent-changed';

let injected = false;

export function hasConsent() {
	if (!browser) return false;
	try {
		return localStorage.getItem(CONSENT_KEY) === 'accepted';
	} catch {
		return false;
	}
}

export function initGA() {
	if (!browser || injected || !hasConsent()) return;
	injected = true;

	window.dataLayer = window.dataLayer || [];
	function gtag() { window.dataLayer.push(arguments); }
	window.gtag = gtag;

	gtag('js', new Date());
	gtag('config', GA_MEASUREMENT_ID, {
		send_page_view: false,
		anonymize_ip: true
	});

	const script = document.createElement('script');
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
	document.head.appendChild(script);
}

export function trackPageView(path, title) {
	if (!browser || !injected || typeof window.gtag !== 'function') return;
	window.gtag('event', 'page_view', {
		page_path: path ?? window.location.pathname + window.location.search,
		page_location: window.location.href,
		page_title: title ?? document.title
	});
}

export function trackEvent(name, params = {}) {
	if (!browser) return;
	if (!injected || typeof window.gtag !== 'function') return;
	window.gtag('event', name, params);
}

export function notifyConsentChanged(value) {
	if (!browser) return;
	window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { value } }));
}
