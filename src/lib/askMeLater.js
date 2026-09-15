export const ASK_ME_LATER_KEY = 'wr_ask_me_later';

export function setAskMeLater() {
	try {
		localStorage.setItem(ASK_ME_LATER_KEY, String(Date.now()));
	} catch {
		/* ignore */
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
