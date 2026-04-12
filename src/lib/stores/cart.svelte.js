import { browser } from '$app/environment';

let count = $state(browser ? loadFromStorage() : 0);

function loadFromStorage() {
	try {
		return Number(localStorage.getItem('wr_cart_qty') ?? 0);
	} catch {
		return 0;
	}
}

function save() {
	if (!browser) return;
	try {
		localStorage.setItem('wr_cart_qty', String(count));
	} catch { /* ignore */ }
}

export const cart = {
	get count() {
		return count;
	},
	set(qty) {
		count = Math.max(0, qty);
		save();
	},
	clear() {
		count = 0;
		save();
	}
};
