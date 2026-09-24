export const ASK_ME_LATER_KEY = 'wr_ask_me_later';
export const VALUATION_SUBMITTED_KEY = 'wr_valuation_submitted';
export const VALUATION_SUBMITTED_EVENT = 'wr:valuation-submitted';

export function setAskMeLater() {
	try {
		localStorage.setItem(ASK_ME_LATER_KEY, String(Date.now()));
	} catch {
		/* ignore */
	}
}

export function setValuationSubmitted() {
	try {
		localStorage.setItem(VALUATION_SUBMITTED_KEY, String(Date.now()));
	} catch {
		/* ignore */
	}
	// Notify the current page even when browser storage is unavailable.
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event(VALUATION_SUBMITTED_EVENT));
	}
}

export function hasValuationSubmitted() {
	try {
		return Boolean(localStorage.getItem(VALUATION_SUBMITTED_KEY));
	} catch {
		return false;
	}
}

// Reads and clears the flag in one step, so the reminder only ever fires once
// per "Ask Me Later" click.
export function consumeAskMeLater() {
	try {
		const value = localStorage.getItem(ASK_ME_LATER_KEY);
		if (value) localStorage.removeItem(ASK_ME_LATER_KEY);
		return Boolean(value);
	} catch {
		return false;
	}
}
