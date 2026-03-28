import { getProduct, getMetafieldDefinitions, getProductsByVendor, createCart, addToCart } from '$lib/shopify.js';
import { error } from '@sveltejs/kit';

// Metafields that are always fetched regardless of Admin API definitions
const REQUIRED_IDENTIFIERS = [
	{ namespace: 'custom', key: 'status' },
	{ namespace: 'custom', key: 'viewed' }
];

export async function load({ params }) {
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

	// Fetch related products from the same vendor, excluding the current product
	const relatedProducts = product.vendor
		? await getProductsByVendor(product.vendor, params.handle, 8).catch(() => [])
		: [];

	return {
		product: { ...product, metafields: enrichedMetafields },
		metafieldsByGroup,
		relatedProducts
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
