import { browser } from '$app/environment';

let items = $state(browser ? loadFromStorage() : []);

function loadFromStorage() {
	try {
		const raw = localStorage.getItem('wr_wishlist');
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function save() {
	if (!browser) return;
	try {
		localStorage.setItem('wr_wishlist', JSON.stringify(items));
	} catch { /* ignore */ }
}

export const wishlist = {
	get items() {
		return items;
	},
	get count() {
		return items.length;
	},
	isInWishlist(id) {
		return items.some((p) => p.id === id);
	},
	toggle(product) {
		if (items.some((p) => p.id === product.id)) {
			items = items.filter((p) => p.id !== product.id);
		} else {
			items = [
				...items,
				{
					id: product.id,
					handle: product.handle,
					title: product.title,
					vendor: product.vendor ?? null,
					price: product.price ?? 0,
					currencyCode: product.currencyCode ?? 'GBP',
					image: product.image ?? null,
					imageAlt: product.imageAlt ?? null,
					status: product.status ?? null
				}
			];
		}
		save();
	},
	remove(id) {
		items = items.filter((p) => p.id !== id);
		save();
	}
};
