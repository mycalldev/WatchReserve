import { env } from '$env/dynamic/private';

const SHOPIFY_API_VERSION = '2024-10';

const SHOPIFY_STORE_DOMAIN = env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = env.SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_CLIENT_ID = env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET = env.SHOPIFY_CLIENT_SECRET;

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

// Module-level token cache — persists across requests within the same server process.
let _adminToken = null;
let _adminTokenExpiry = 0;

async function getAdminToken() {
	// Refresh 60 s before expiry to avoid using a token that expires mid-request.
	if (_adminToken && Date.now() < _adminTokenExpiry - 60_000) {
		return _adminToken;
	}

	const res = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			client_id: SHOPIFY_CLIENT_ID,
			client_secret: SHOPIFY_CLIENT_SECRET,
			grant_type: 'client_credentials'
		})
	});

	if (!res.ok) {
		const body = await res.text();
		console.error('[shopify] token exchange failed:', res.status, body);
		throw new Error(`Shopify Admin token error: ${res.status} ${res.statusText}`);
	}

	const payload = await res.json();
	_adminToken = payload.access_token;
	_adminTokenExpiry = Date.now() + (payload.expires_in ?? 86400) * 1000;

	return _adminToken;
}

async function shopifyAdminFetch(query, variables = {}) {
	const token = await getAdminToken();
	const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Access-Token': token
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

		console.log(
			'[getCollection] raw response for handle:',
			handle,
			JSON.stringify(
				data?.collection ? { id: data.collection.id, title: data.collection.title } : null
			)
		);

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
          metafields(identifiers: [
            {namespace: "custom", key: "status"},
            {namespace: "custom", key: "sort_order"}
          ]) {
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
			const metafields = node.metafields ?? [];
			const statusMeta = metafields.find(
				(m) => m && m.namespace === 'custom' && m.key === 'status'
			);
			const sortMeta = metafields.find(
				(m) => m && m.namespace === 'custom' && m.key === 'sort_order'
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
				status: statusMeta?.value ?? null,
				sortOrder: sortMeta?.value != null ? parseInt(sortMeta.value, 10) : null
			});
		}

		hasNextPage = pageInfo.hasNextPage;
		cursor = pageInfo.endCursor;
	}

	allProducts.sort((a, b) => {
		const aOrder = a.sortOrder ?? Infinity;
		const bOrder = b.sortOrder ?? Infinity;
		return aOrder - bOrder;
	});

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
          metafields(identifiers: [
            {namespace: "custom", key: "status"},
            {namespace: "custom", key: "sort_order"}
          ]) {
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
		const metafields = node.metafields ?? [];
		const statusMeta = metafields.find((m) => m && m.namespace === 'custom' && m.key === 'status');
		const sortMeta = metafields.find(
			(m) => m && m.namespace === 'custom' && m.key === 'sort_order'
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
				status,
				sortOrder: sortMeta?.value != null ? parseInt(sortMeta.value, 10) : null
			});
		}
	}

	results.sort((a, b) => {
		const aOrder = a.sortOrder ?? Infinity;
		const bOrder = b.sortOrder ?? Infinity;
		return aOrder - bOrder;
	});

	return results.slice(0, limit);
}

// ── Products by tag (Storefront) ─────────────────────────────────────────────

const PRODUCTS_BY_TAG_QUERY = `
  query GetProductsByTag($query: String!, $first: Int!, $after: String) {
    products(first: $first, after: $after, query: $query) {
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
`;

export async function getProductsByTag(tag) {
	const allProducts = [];
	let hasNextPage = true;
	let cursor = null;

	while (hasNextPage) {
		const data = await shopifyFetch(PRODUCTS_BY_TAG_QUERY, {
			query: `tag:"${tag}"`,
			first: 250,
			after: cursor
		});

		const { edges, pageInfo } = data.products;

		for (const { node } of edges) {
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

		hasNextPage = pageInfo.hasNextPage;
		cursor = pageInfo.endCursor;
	}

	return allProducts;
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

// ── Recent products fallback (Storefront) ────────────────────────────────────

const RECENT_PRODUCTS_QUERY = `
  query GetRecentProducts($first: Int!) {
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

export async function getRecentProducts(excludeHandle, limit = 8) {
	const data = await shopifyFetch(RECENT_PRODUCTS_QUERY, { first: limit + 1 });
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

// ── Blogs & Articles (Storefront) ────────────────────────────────────────────

const BLOGS_QUERY = `
  query GetBlogs($first: Int!) {
    blogs(first: $first) {
      edges {
        node {
          id
          handle
          title
          articles(first: 50, sortKey: PUBLISHED_AT, reverse: true) {
            edges {
              node {
                id
                title
                handle
                excerpt
                excerptHtml
                publishedAt
                tags
                image {
                  url
                  altText
                  width
                  height
                }
                author {
                  name
                }
                blog {
                  handle
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getBlogs(first = 10) {
	const data = await shopifyFetch(BLOGS_QUERY, { first });
	return (data.blogs?.edges ?? []).map(({ node: blog }) => ({
		id: blog.id,
		handle: blog.handle,
		title: blog.title,
		articles: (blog.articles?.edges ?? []).map(({ node: a }) => ({
			id: a.id,
			title: a.title,
			handle: a.handle,
			excerpt: a.excerpt ?? '',
			publishedAt: a.publishedAt,
			tags: a.tags ?? [],
			image: a.image ? { url: a.image.url, alt: a.image.altText ?? a.title } : null,
			author: a.author?.name ?? null,
			blogHandle: blog.handle,
			blogTitle: blog.title
		}))
	}));
}

// ── Single Article (Storefront) ──────────────────────────────────────────────

const ARTICLE_QUERY = `
  query GetArticle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      id
      handle
      title
      articleByHandle(handle: $articleHandle) {
        id
        title
        handle
        contentHtml
        excerpt
        publishedAt
        tags
        image {
          url
          altText
          width
          height
        }
        author {
          name
        }
        blog {
          handle
          title
        }
      }
    }
  }
`;

export async function getArticle(blogHandle, articleHandle) {
	const data = await shopifyFetch(ARTICLE_QUERY, { blogHandle, articleHandle });
	const blog = data?.blog;
	const a = blog?.articleByHandle;
	if (!a) return null;
	return {
		id: a.id,
		title: a.title,
		handle: a.handle,
		contentHtml: a.contentHtml ?? '',
		excerpt: a.excerpt ?? '',
		publishedAt: a.publishedAt,
		tags: a.tags ?? [],
		image: a.image
			? {
					url: a.image.url,
					alt: a.image.altText ?? a.title,
					width: a.image.width,
					height: a.image.height
				}
			: null,
		author: a.author?.name ?? null,
		blogHandle: blog.handle,
		blogTitle: blog.title
	};
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

const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
        totalTaxAmount { amount currencyCode }
      }
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount currencyCode }
                image { url altText width height }
                product { title handle vendor }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCart(cartId) {
	if (!cartId) return null;
	const data = await shopifyFetch(GET_CART_QUERY, { cartId });
	const c = data?.cart;
	if (!c) return null;
	return {
		id: c.id,
		checkoutUrl: c.checkoutUrl,
		totalQuantity: c.totalQuantity ?? 0,
		subtotal: c.cost?.subtotalAmount ?? null,
		total: c.cost?.totalAmount ?? null,
		tax: c.cost?.totalTaxAmount ?? null,
		lines: (c.lines?.edges ?? []).map(({ node }) => ({
			id: node.id,
			quantity: node.quantity,
			variantId: node.merchandise?.id,
			variantTitle: node.merchandise?.title,
			price: node.merchandise?.price ?? null,
			image: node.merchandise?.image ?? null,
			productTitle: node.merchandise?.product?.title ?? '',
			productHandle: node.merchandise?.product?.handle ?? '',
			vendor: node.merchandise?.product?.vendor ?? ''
		}))
	};
}

const UPDATE_CART_LINES_MUTATION = `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id totalQuantity }
      userErrors { field message }
    }
  }
`;

const REMOVE_CART_LINES_MUTATION = `
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id totalQuantity }
      userErrors { field message }
    }
  }
`;

export async function updateCartLine(cartId, lineId, quantity) {
	const data = await shopifyFetch(UPDATE_CART_LINES_MUTATION, {
		cartId,
		lines: [{ id: lineId, quantity }]
	});
	const { cart, userErrors } = data.cartLinesUpdate;
	if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join(', '));
	return cart;
}

export async function removeCartLine(cartId, lineId) {
	const data = await shopifyFetch(REMOVE_CART_LINES_MUTATION, { cartId, lineIds: [lineId] });
	const { cart, userErrors } = data.cartLinesRemove;
	if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join(', '));
	return cart;
}

// ── Order fulfillment (Admin API) ────────────────────────────────────────────

const CREATE_DRAFT_ORDER_MUTATION = `
  mutation DraftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder { id }
      userErrors { field message }
    }
  }
`;

const COMPLETE_DRAFT_ORDER_MUTATION = `
  mutation DraftOrderComplete($id: ID!) {
    draftOrderComplete(id: $id, paymentPending: false) {
      draftOrder {
        id
        order { id name }
      }
      userErrors { field message }
    }
  }
`;

export async function createShopifyOrder({
	lineItems,
	email,
	shippingAddress,
	billingAddress,
	note
}) {
	const createData = await shopifyAdminFetch(CREATE_DRAFT_ORDER_MUTATION, {
		input: {
			lineItems,
			email,
			shippingAddress,
			billingAddress: billingAddress ?? shippingAddress,
			note,
			tags: ['stripe-payment']
		}
	});

	const { draftOrder, userErrors } = createData.draftOrderCreate;
	if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join(', '));

	const completeData = await shopifyAdminFetch(COMPLETE_DRAFT_ORDER_MUTATION, {
		id: draftOrder.id
	});

	const { draftOrder: completed, userErrors: completeErrors } = completeData.draftOrderComplete;
	if (completeErrors?.length) throw new Error(completeErrors.map((e) => e.message).join(', '));

	return completed.order;
}

// ── Set product status metafield (Admin) ─────────────────────────────────────

const SET_PRODUCT_METAFIELD_MUTATION = `
  mutation SetProductMetafield($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id }
      userErrors { field message }
    }
  }
`;

export async function setProductStatus(shopifyProductId, status) {
	const data = await shopifyAdminFetch(SET_PRODUCT_METAFIELD_MUTATION, {
		input: {
			id: shopifyProductId,
			metafields: [
				{
					namespace: 'custom',
					key: 'status',
					value: status,
					type: 'single_line_text_field'
				}
			]
		}
	});

	const { userErrors } = data.productUpdate;
	if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join(', '));
}

// ── Create a watch product (Admin) ───────────────────────────────────────────

const PRODUCT_CREATE_MUTATION = `
  mutation CreateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        handle
        title
        vendor
        variants(first: 1) {
          edges { node { id } }
        }
      }
      userErrors { field message }
    }
  }
`;

const PRODUCT_VARIANT_PRICE_MUTATION = `
  mutation SetVariantPrice($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants { id price }
      userErrors { field message }
    }
  }
`;

/**
 * Create a new watch as a Shopify product.
 * As of Storefront/Admin API 2024-10, ProductInput no longer accepts inline
 * variant pricing, so we create the product first (which yields a default
 * variant) and then set the price on that variant with a bulk update.
 *
 * @param {{ title: string, vendor?: string, price: string|number, description?: string, status?: string, tags?: string[] }} watch
 * @returns {Promise<{ id: string, handle: string, title: string }>}
 */
export async function createWatch({ title, vendor, price, description, status, tags = [] }) {
	if (!title?.trim()) throw new Error('A watch title is required.');

	const amount = Number(price);
	if (!Number.isFinite(amount) || amount < 0) throw new Error('A valid price is required.');

	const input = {
		title: title.trim(),
		vendor: vendor?.trim() || undefined,
		descriptionHtml: description?.trim() || undefined,
		tags,
		status: 'DRAFT'
	};

	if (status?.trim()) {
		input.metafields = [
			{
				namespace: 'custom',
				key: 'status',
				value: status.trim(),
				type: 'single_line_text_field'
			}
		];
	}

	const createData = await shopifyAdminFetch(PRODUCT_CREATE_MUTATION, { input });

	const { product, userErrors } = createData.productCreate;
	if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join(', '));

	const variantId = product.variants.edges[0]?.node.id;
	if (variantId) {
		const priceData = await shopifyAdminFetch(PRODUCT_VARIANT_PRICE_MUTATION, {
			productId: product.id,
			variants: [{ id: variantId, price: amount.toFixed(2) }]
		});

		const { userErrors: priceErrors } = priceData.productVariantsBulkUpdate;
		if (priceErrors?.length) throw new Error(priceErrors.map((e) => e.message).join(', '));
	}

	return { id: product.id, handle: product.handle, title: product.title };
}
