import {
	getProduct,
	getMetafieldDefinitions,
	getProductsByVendor,
	getRecentProducts,
	createCart,
	addToCart
} from '$lib/shopify.js';
import { error, redirect } from '@sveltejs/kit';
import { resolveHandleAlias } from '$lib/handleAliases.js';

// Metafields that are always fetched regardless of Admin API definitions
const REQUIRED_IDENTIFIERS = [
	// System
	{ namespace: 'custom', key: 'status' },
	{ namespace: 'custom', key: 'viewed' },
	// Watch tab
	{ namespace: 'custom', key: 'reference' },
	{ namespace: 'custom', key: 'brand' },
	{ namespace: 'custom', key: 'model' },
	{ namespace: 'custom', key: 'year' },
	{ namespace: 'custom', key: 'condition' },
	{ namespace: 'custom', key: 'functions' },
	// Calibre tab
	{ namespace: 'custom', key: 'movement_calibre' },
	{ namespace: 'custom', key: 'power_reserve' },
	// Case tab
	{ namespace: 'custom', key: 'dial' },
	{ namespace: 'custom', key: 'diameter' },
	{ namespace: 'custom', key: 'case_material' },
	{ namespace: 'custom', key: 'water_resistance' },
	// Bracelet tab
	{ namespace: 'custom', key: 'clasp_material' },
	{ namespace: 'custom', key: 'clasp_type' },
	{ namespace: 'custom', key: 'colour' },
	{ namespace: 'custom', key: 'bracelet_material' }
];

export async function load({ params, url }) {
	// Fetch product metafield definitions from Admin API (best-effort)
	const [productDefinitions, categoryDefinitions] = await Promise.allSettled([
		getMetafieldDefinitions('PRODUCT'),
		getMetafieldDefinitions('PRODUCT_TAXONOMY_NODE')
	]);

	const productDefs = productDefinitions.status === 'fulfilled' ? productDefinitions.value : [];
	const categoryDefs = categoryDefinitions.status === 'fulfilled' ? categoryDefinitions.value : [];
	const allDefs = [...productDefs, ...categoryDefs];

	// Always include required identifiers, then merge any additional ones from Admin API
	const adminIdentifiers = allDefs.map((d) => ({ namespace: d.namespace, key: d.key }));
	const identifiers = [
		...REQUIRED_IDENTIFIERS,
		...adminIdentifiers.filter(
			(ai) => !REQUIRED_IDENTIFIERS.some((r) => r.namespace === ai.namespace && r.key === ai.key)
		)
	];

	// Fetch product with all metafield values resolved
	const product = await getProduct(params.handle, identifiers);

	if (!product) {
		// The handle may be one we renamed. Send old links to the current URL
		// rather than 404ing them.
		const current = resolveHandleAlias(params.handle);
		if (current) redirect(301, `/shop/${current}${url.search}`);

		throw error(404, 'Product not found');
	}

	// Enrich metafields with their definition metadata (name, description, type)
	const defMap = Object.fromEntries(allDefs.map((d) => [`${d.namespace}__${d.key}`, d]));

	const enrichedMetafields = product.metafields.map((mf) => {
		const def = defMap[`${mf.namespace}__${mf.key}`] ?? null;
		return {
			...mf,
			name: def?.name ?? mf.key.replace(/_/g, ' '),
			description: def?.description ?? null,
			typeName: def?.typeName ?? mf.type,
			ownerType: def?.ownerType ?? 'PRODUCT'
		};
	});

	const metafieldsByGroup = {
		product: enrichedMetafields.filter((mf) => mf.ownerType !== 'PRODUCT_TAXONOMY_NODE'),
		category: enrichedMetafields.filter((mf) => mf.ownerType === 'PRODUCT_TAXONOMY_NODE')
	};

	// Fetch related products from the same vendor, excluding the current product.
	// Fall back to recent products across all vendors if fewer than 4 vendor matches.
	let relatedProducts = product.vendor
		? await getProductsByVendor(product.vendor, params.handle, 8).catch(() => [])
		: [];

	if (relatedProducts.length < 4) {
		const recent = await getRecentProducts(params.handle, 8).catch(() => []);
		// Merge: vendor matches first, then fill with recent (deduped by id)
		const existing = new Set(relatedProducts.map((p) => p.id));
		relatedProducts = [...relatedProducts, ...recent.filter((p) => !existing.has(p.id))].slice(
			0,
			8
		);
	}

	return {
		product: { ...product, metafields: enrichedMetafields },
		metafieldsByGroup,
		relatedProducts,
		canonical: `${url.origin}/shop/${product.handle}`
	};
}

export const actions = {
	addToCart: async ({ request, cookies }) => {
		const form = await request.formData();
		const variantId = form.get('variantId');
		const quantity = parseInt(form.get('quantity') ?? '1', 10);

		if (!variantId) return { success: false, error: 'No variant selected' };

		try {
			const existingCartId = cookies.get('cartId');
			let cart;

			if (existingCartId) {
				try {
					cart = await addToCart(existingCartId, variantId, quantity);
				} catch {
					cart = await createCart(variantId, quantity);
				}
			} else {
				cart = await createCart(variantId, quantity);
			}

			cookies.set('cartId', cart.id, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7
			});

			return {
				success: true,
				cartId: cart.id,
				checkoutUrl: cart.checkoutUrl,
				totalQuantity: cart.totalQuantity
			};
		} catch (e) {
			return { success: false, error: e.message };
		}
	}
};
