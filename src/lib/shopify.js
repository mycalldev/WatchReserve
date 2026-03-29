import {
	SHOPIFY_STORE_DOMAIN,
	SHOPIFY_STOREFRONT_TOKEN,
	SHOPIFY_ADMIN_TOKEN
} from '$env/static/private';

const SHOPIFY_API_VERSION = '2024-10';

// ── Storefront API (public) ──────────────────────────────────────────────────

async function shopifyFetch(query, variables = {}) {
	const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
		},
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
	}

	const { data, errors } = await response.json();

	if (errors) {
		throw new Error(`Shopify GraphQL error: ${errors.map((e) => e.message).join(', ')}`);
	}

	return data;
}

// ── Admin API (private) ──────────────────────────────────────────────────────

async function shopifyAdminFetch(query, variables = {}) {
	const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN
		},
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		throw new Error(`Shopify Admin API error: ${response.status} ${response.statusText}`);
	}

	const { data, errors } = await response.json();

	if (errors) {
		throw new Error(`Shopify Admin GraphQL error: ${errors.map((e) => e.message).join(', ')}`);
	}

	return data;
}

// ── Metafield definitions (Admin) ────────────────────────────────────────────

const METAFIELD_DEFINITIONS_QUERY = `
  query GetMetafieldDefinitions($ownerType: MetafieldOwnerType!, $after: String) {
    metafieldDefinitions(first: 100, ownerType: $ownerType, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          namespace
          key
          name
          description
          type { name }
          ownerType
          pinnedPosition
        }
      }
    }
  }
`;

export async function getMetafieldDefinitions(ownerType = 'PRODUCT') {
	const definitions = [];
	let hasNextPage = true;
	let cursor = null;

	while (hasNextPage) {
		const data = await shopifyAdminFetch(METAFIELD_DEFINITIONS_QUERY, { ownerType, after: cursor });

		const { edges, pageInfo } = data.metafieldDefinitions;

		for (const { node } of edges) {
			definitions.push({
				id: node.id,
				namespace: node.namespace,
				key: node.key,
				name: node.name,
				description: node.description,
				typeName: node.type.name,
				ownerType: node.ownerType,
				pinnedPosition: node.pinnedPosition
			});
		}

		hasNextPage = pageInfo.hasNextPage;
		cursor = pageInfo.endCursor;
	}

	return definitions;
}

// ── Single product (Storefront) ───────────────────────────────────────────────

function buildProductQuery(metafieldIdentifiers = []) {
	const metafieldsField =
		metafieldIdentifiers.length > 0
			? `metafields(identifiers: [${metafieldIdentifiers
					.map((id) => `{namespace: "${id.namespace}", key: "${id.key}"}`)
					.join(', ')}]) {
        namespace
        key
        value
        type
      }`
			: '';

	return `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        vendor
        productType
        tags
        description
        descriptionHtml
        category { name }
        images(first: 10) {
          edges {
            node { url altText width height }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }
          }
        }
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        ${metafieldsField}
      }
    }
  `;
}

export async function getProduct(handle, metafieldIdentifiers = []) {
	const query = buildProductQuery(metafieldIdentifiers);
	const data = await shopifyFetch(query, { handle });

	if (!data.product) return null;

	const p = data.product;

	return {
		id: p.id,
		title: p.title,
		handle: p.handle,
		vendor: p.vendor,
		productType: p.productType,
		tags: p.tags,
		description: p.description,
		descriptionHtml: p.descriptionHtml,
		category: p.category ? { name: p.category.name } : null,
		images: p.images.edges.map(({ node }) => ({
			url: node.url,
			altText: node.altText ?? p.title,
			width: node.width,
			height: node.height
		})),
		variants: p.variants.edges.map(({ node }) => ({
			id: node.id,
			title: node.title,
			availableForSale: node.availableForSale,
			price: parseFloat(node.price.amount),
			currencyCode: node.price.currencyCode,
			compareAtPrice: node.compareAtPrice ? parseFloat(node.compareAtPrice.amount) : null
		})),
		minPrice: parseFloat(p.priceRange.minVariantPrice.amount),
		maxPrice: parseFloat(p.priceRange.maxVariantPrice.amount),
		currencyCode: p.priceRange.minVariantPrice.currencyCode,
		metafields: (p.metafields ?? []).filter(Boolean)
	};
}

// ── Single collection with products (Storefront) ──────────────────────────────

const COLLECTION_QUERY = `
  query GetCollection($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        url
        altText
        width
        height
      }
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            vendor
            productType
            tags
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            collections(first: 10) {
              edges {
                node { title handle }
              }
            }
            metafields(identifiers: [{namespace: "custom", key: "status"}]) {
              namespace
              key
              value
            }
          }
        }
      }
    }
  }
`;

export async function getCollection(handle) {
	const allProducts = [];
	let hasNextPage = true;
	let cursor = null;
	let collectionMeta = null;

	while (hasNextPage) {
		let data;
		try {
			data = await shopifyFetch(COLLECTION_QUERY, { handle, first: 250, after: cursor });
		} catch (e) {
			console.error('[getCollection] Shopify fetch error for handle:', handle, e?.message);
			return null;
		}

		console.log('[getCollection] raw response for handle:', handle, JSON.stringify(data?.collection ? { id: data.collection.id, title: data.collection.title } : null));

		if (!data?.collection) return null;

		const { products, ...meta } = data.collection;

		if (!collectionMeta) {
			collectionMeta = {
				id: meta.id,
				title: meta.title,
				handle: meta.handle,
				description: meta.description,
				descriptionHtml: meta.descriptionHtml,
				image: meta.image
					? {
							url: meta.image.url,
							altText: meta.image.altText ?? meta.title,
							width: meta.image.width,
							height: meta.image.height
						}
					: null
			};
		}

		for (const { node } of products.edges) {
			const statusMeta = (node.metafields ?? []).find(
				(m) => m && m.namespace === 'custom' && m.key === 'status'
			);
			const collections = (node.collections?.edges ?? []).map(({ node: c }) => ({
				title: c.title,
				handle: c.handle
			}));
			allProducts.push({
				id: node.id,
				title: node.title,
				handle: node.handle,
				vendor: node.vendor,
				productType: node.productType,
				tags: node.tags,
				collections,
				image: node.featuredImage?.url ?? null,
				imageAlt: node.featuredImage?.altText ?? node.title,
				price: parseFloat(node.priceRange.minVariantPrice.amount),
				currencyCode: node.priceRange.minVariantPrice.currencyCode,
				status: statusMeta?.value ?? null
			});
		}

		hasNextPage = products.pageInfo.hasNextPage;
		cursor = products.pageInfo.endCursor;
	}

	return { ...collectionMeta, products: allProducts };
}

// ── All products (Storefront) ─────────────────────────────────────────────────

const PRODUCTS_QUERY = `
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          vendor
          productType
          tags
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          collections(first: 10) {
            edges {
              node {
                title
                handle
              }
            }
          }
          metafields(identifiers: [{namespace: "custom", key: "status"}]) {
            namespace
            key
            value
          }
        }
      }
    }
  }
`;

export async function getProducts() {
	const allProducts = [];
	let hasNextPage = true;
	let cursor = null;

	while (hasNextPage) {
		const data = await shopifyFetch(PRODUCTS_QUERY, { first: 250, after: cursor });

		const { edges, pageInfo } = data.products;

		for (const { node } of edges) {
			const statusMeta = (node.metafields ?? []).find(
				(m) => m && m.namespace === 'custom' && m.key === 'status'
			);
			// Store { title, handle } pairs so the UI can build correct collection URLs
			const collections = (node.collections?.edges ?? []).map(({ node: c }) => ({
				title: c.title,
				handle: c.handle
			}));
			allProducts.push({
				id: node.id,
				title: node.title,
				handle: node.handle,
				vendor: node.vendor,
				productType: node.productType,
				tags: node.tags,
				collections,
				image: node.featuredImage?.url ?? null,
				imageAlt: node.featuredImage?.altText ?? node.title,
				price: parseFloat(node.priceRange.minVariantPrice.amount),
				currencyCode: node.priceRange.minVariantPrice.currencyCode,
				status: statusMeta?.value ?? null
			});
		}

		hasNextPage = pageInfo.hasNextPage;
		cursor = pageInfo.endCursor;
	}

	return allProducts;
}

// ── Product search with tag support + fallback (Storefront) ──────────────────

const SEARCH_QUERY = `
  query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          vendor
          tags
          featuredImage { url altText }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          metafields(identifiers: [{namespace: "custom", key: "status"}]) {
            namespace key value
          }
        }
      }
    }
  }
`;

function mapSearchNodes(edges) {
	return (edges ?? []).map(({ node }) => {
		const statusMeta = (node.metafields ?? []).find(
			(m) => m && m.namespace === 'custom' && m.key === 'status'
		);
		return {
			id: node.id,
			title: node.title,
			handle: node.handle,
			vendor: node.vendor,
			tags: node.tags ?? [],
			image: node.featuredImage?.url ?? null,
			imageAlt: node.featuredImage?.altText ?? node.title,
			price: parseFloat(node.priceRange.minVariantPrice.amount),
			currencyCode: node.priceRange.minVariantPrice.currencyCode,
			status: statusMeta?.value ?? null
		};
	});
}

export async function searchProducts(term, limit = 8) {
	const sanitized = term.trim().replace(/"/g, '').slice(0, 100);
	if (!sanitized || sanitized.length < 2) {
		return { results: [], fallback: false, fallbackTerm: null };
	}

	// Shopify's product query searches title, vendor, product_type, and tags natively
	const primary = await shopifyFetch(SEARCH_QUERY, { query: sanitized, first: limit });
	const primaryResults = mapSearchNodes(primary.products?.edges);

	if (primaryResults.length > 0) {
		return { results: primaryResults, fallback: false, fallbackTerm: null };
	}

	// Fallback: truncate to first half of the term (min 2 chars) and retry
	const fallbackLength = Math.max(2, Math.floor(sanitized.length / 2));
	const fallbackTerm = sanitized.slice(0, fallbackLength);

	if (fallbackTerm === sanitized) {
		return { results: [], fallback: false, fallbackTerm: null };
	}

	const secondary = await shopifyFetch(SEARCH_QUERY, { query: fallbackTerm, first: limit });
	const fallbackResults = mapSearchNodes(secondary.products?.edges);

	return {
		results: fallbackResults,
		fallback: fallbackResults.length > 0,
		fallbackTerm: fallbackResults.length > 0 ? fallbackTerm : null
	};
}

// ── New Arrivals — filter by status metafield (Storefront) ───────────────────

const NEW_ARRIVALS_QUERY = `
  query NewArrivalsProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          vendor
          featuredImage { url altText }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          metafields(identifiers: [{namespace: "custom", key: "status"}]) {
            namespace key value
          }
        }
      }
    }
  }
`;

export async function getNewArrivals(limit = 12) {
	// Fetch a generous batch sorted by newest first, then filter by status
	const data = await shopifyFetch(NEW_ARRIVALS_QUERY, { first: 50 });
	const edges = data.products?.edges ?? [];

	const results = [];
	for (const { node } of edges) {
		const statusMeta = (node.metafields ?? []).find(
			(m) => m && m.namespace === 'custom' && m.key === 'status'
		);
		const status = statusMeta?.value?.trim() ?? null;
		if (status?.toLowerCase() === 'new arrival') {
			results.push({
				id: node.id,
				title: node.title,
				handle: node.handle,
				vendor: node.vendor,
				image: node.featuredImage?.url ?? null,
				imageAlt: node.featuredImage?.altText ?? node.title,
				price: parseFloat(node.priceRange.minVariantPrice.amount),
				currencyCode: node.priceRange.minVariantPrice.currencyCode,
				status
			});
			if (results.length >= limit) break;
		}
	}

	return results;
}

// ── Products by vendor (Storefront) ──────────────────────────────────────────

const PRODUCTS_BY_VENDOR_QUERY = `
  query GetProductsByVendor($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          vendor
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          metafields(identifiers: [{namespace: "custom", key: "status"}]) {
            namespace
            key
            value
          }
        }
      }
    }
  }
`;

export async function getProductsByVendor(vendor, excludeHandle, limit = 8) {
	// Fetch one extra so we still have `limit` after excluding the current product
	const data = await shopifyFetch(PRODUCTS_BY_VENDOR_QUERY, {
		query: `vendor:"${vendor}"`,
		first: limit + 1
	});

	return (data.products?.edges ?? [])
		.map(({ node }) => {
			const statusMeta = (node.metafields ?? []).find(
				(m) => m && m.namespace === 'custom' && m.key === 'status'
			);
			return {
				id: node.id,
				title: node.title,
				handle: node.handle,
				vendor: node.vendor,
				image: node.featuredImage?.url ?? null,
				imageAlt: node.featuredImage?.altText ?? node.title,
				price: parseFloat(node.priceRange.minVariantPrice.amount),
				currencyCode: node.priceRange.minVariantPrice.currencyCode,
				status: statusMeta?.value ?? null
			};
		})
		.filter((p) => p.handle !== excludeHandle)
		.slice(0, limit);
}

// ── Cart mutations (Storefront) ───────────────────────────────────────────────

const CREATE_CART_MUTATION = `
  mutation CreateCart($variantId: ID!, $quantity: Int!) {
    cartCreate(input: {
      lines: [{ quantity: $quantity, merchandiseId: $variantId }]
    }) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $variantId: ID!, $quantity: Int!) {
    cartLinesAdd(cartId: $cartId, lines: [{ quantity: $quantity, merchandiseId: $variantId }]) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

export async function createCart(variantId, quantity = 1) {
	const data = await shopifyFetch(CREATE_CART_MUTATION, { variantId, quantity });
	const { cart, userErrors } = data.cartCreate;
	if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join(', '));
	return cart;
}

export async function addToCart(cartId, variantId, quantity = 1) {
	const data = await shopifyFetch(ADD_TO_CART_MUTATION, { cartId, variantId, quantity });
	const { cart, userErrors } = data.cartLinesAdd;
	if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join(', '));
	return cart;
}
