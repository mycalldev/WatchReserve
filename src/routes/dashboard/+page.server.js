import { fail } from '@sveltejs/kit';
import { createWatch, getRecentProducts } from '$lib/shopify.js';

export async function load() {
	let recent = [];
	try {
		recent = await getRecentProducts(null, 6);
	} catch (e) {
		console.error('[dashboard] failed to load recent products:', e.message);
	}
	return { recent };
}

export const actions = {
	addWatch: async ({ request }) => {
		const form = await request.formData();

		const title = String(form.get('title') ?? '').trim();
		const vendor = String(form.get('vendor') ?? '').trim();
		const price = String(form.get('price') ?? '').trim();
		const status = String(form.get('status') ?? '').trim();
		const description = String(form.get('description') ?? '').trim();

		const values = { title, vendor, price, status, description };

		if (!title) return fail(400, { error: 'A watch title is required.', values });

		const amount = Number(price);
		if (!price || !Number.isFinite(amount) || amount < 0) {
			return fail(400, { error: 'Enter a valid price.', values });
		}

		try {
			const product = await createWatch({ title, vendor, price: amount, description, status });
			return {
				success: true,
				product,
				message: `Added "${product.title}" as a draft. Publish it in Shopify to make it live.`
			};
		} catch (e) {
			return fail(500, { error: e.message, values });
		}
	}
};
