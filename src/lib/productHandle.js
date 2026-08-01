// Canonical product URL slugs.
//
// Shopify generates a handle from the title once, at creation time, and never
// updates it again — which is how the catalogue ended up with `rolex-submariner-1`
// and `untitled-mar31_18-28`. We derive the handle ourselves instead.
//
// Product titles follow a consistent shape: "Model, Reference, Material, Year".
// The canonical handle is vendor + model + reference + year. Material is left
// out to keep URLs short; year is required because reference alone is not
// unique across the catalogue (e.g. Day-Date 228235 exists in 2023 and 2026).
//
// No SvelteKit imports here on purpose — scripts/rename-product-handles.mjs
// imports this file directly under plain Node.

export function slugify(value) {
	return String(value ?? '')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Split a watch title into its parts.
 * "Submariner Date, 126610LN, Stainless Steel, 2023"
 *   -> { model: 'Submariner Date', reference: '126610LN', year: '2023' }
 */
export function parseWatchTitle(title) {
	const parts = String(title ?? '')
		.split(',')
		.map((p) => p.trim())
		.filter(Boolean);

	const last = parts[parts.length - 1] ?? '';
	const year = /^(19|20)\d{2}$/.test(last) ? last : '';

	return {
		model: parts[0] ?? '',
		reference: parts[1] ?? '',
		year
	};
}

/**
 * Build the canonical handle for a product.
 * Falls back to the whole title if it doesn't match the expected shape, so a
 * non-conforming product still gets a readable URL rather than an empty one.
 *
 * @param {{ vendor?: string, title?: string }} product
 * @returns {string}
 */
export function buildProductHandle({ vendor, title }) {
	const { model, reference, year } = parseWatchTitle(title);

	const useVendor = vendor && vendor.toLowerCase() !== 'my store' ? vendor : '';
	const fromParts = slugify([useVendor, model, reference, year].filter(Boolean).join(' '));

	if (fromParts) return fromParts;

	return slugify([useVendor, title].filter(Boolean).join(' ')) || 'watch';
}

/**
 * Assign unique handles across a set of products, suffixing only where two
 * products genuinely resolve to the same slug.
 *
 * @param {Array<{ vendor?: string, title?: string }>} products
 * @param {Set<string>} [reserved] handles that must not be used
 * @returns {string[]} one handle per product, index-aligned with the input
 */
export function buildUniqueHandles(products, reserved = new Set()) {
	const taken = new Set(reserved);

	return products.map((p) => {
		const base = buildProductHandle(p);
		let handle = base;
		let n = 2;
		while (taken.has(handle)) handle = `${base}-${n++}`;
		taken.add(handle);
		return handle;
	});
}
