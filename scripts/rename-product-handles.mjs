// Rewrite every Shopify product handle to the canonical form defined in
// src/lib/productHandle.js, and regenerate src/lib/handleAliases.js so the old
// URLs 301 to the new ones.
//
//   node scripts/rename-product-handles.mjs           # dry run, changes nothing
//   node scripts/rename-product-handles.mjs --apply   # write to Shopify
//
// Safe to rerun: products already on their canonical handle are skipped, and
// the alias map is merged rather than replaced.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildProductHandle, parseWatchTitle } from '../src/lib/productHandle.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ALIAS_FILE = path.join(ROOT, 'src/lib/handleAliases.js');
const API_VERSION = '2024-10';
const APPLY = process.argv.includes('--apply');

// ── env ──────────────────────────────────────────────────────────────────────

function loadEnv() {
	const raw = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
	const env = {};
	for (const line of raw.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const i = trimmed.indexOf('=');
		if (i === -1) continue;
		env[trimmed.slice(0, i).trim()] = trimmed
			.slice(i + 1)
			.trim()
			.replace(/^["']|["']$/g, '');
	}
	return env;
}

const env = loadEnv();
const DOMAIN = env.SHOPIFY_STORE_DOMAIN;

for (const key of [
	'SHOPIFY_STORE_DOMAIN',
	'SHOPIFY_STOREFRONT_TOKEN',
	'SHOPIFY_CLIENT_ID',
	'SHOPIFY_CLIENT_SECRET'
]) {
	if (!env[key]) {
		console.error(`Missing ${key} in .env`);
		process.exit(1);
	}
}

// ── admin api ────────────────────────────────────────────────────────────────

let token = null;

async function adminFetch(query, variables = {}) {
	if (!token) {
		const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				client_id: env.SHOPIFY_CLIENT_ID,
				client_secret: env.SHOPIFY_CLIENT_SECRET,
				grant_type: 'client_credentials'
			})
		});
		if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
		token = (await res.json()).access_token;
	}

	const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
		body: JSON.stringify({ query, variables })
	});

	if (!res.ok) throw new Error(`Admin API ${res.status} ${res.statusText}`);

	const { data, errors } = await res.json();
	if (errors) throw new Error(errors.map((e) => e.message).join(', '));
	return data;
}

// Read the catalogue over the Storefront API. The Admin app is only scoped for
// orders, so `products` is denied there; the Storefront token can list them.
// Caveat: this returns published products only, so drafts are not renamed.
async function storefrontFetch(query, variables = {}) {
	const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': env.SHOPIFY_STOREFRONT_TOKEN
		},
		body: JSON.stringify({ query, variables })
	});

	if (!res.ok) throw new Error(`Storefront API ${res.status} ${res.statusText}`);

	const { data, errors } = await res.json();
	if (errors) throw new Error(errors.map((e) => e.message).join(', '));
	return data;
}

const PRODUCTS_QUERY = `
  query AllProducts($after: String) {
    products(first: 250, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges { node { id handle title vendor } }
    }
  }
`;

const APP_SCOPES_QUERY = `{ currentAppInstallation { accessScopes { handle } } }`;

async function assertProductWriteScope() {
	const data = await adminFetch(APP_SCOPES_QUERY);
	const scopes = data.currentAppInstallation.accessScopes.map((s) => s.handle);

	if (!scopes.includes('write_products')) {
		console.error(
			[
				'',
				'Cannot apply: the Shopify custom app is missing the `write_products` scope.',
				`Current scopes: ${scopes.join(', ')}`,
				'',
				'Fix in Shopify admin -> Settings -> Apps and sales channels -> Develop apps',
				'-> your app -> Configuration -> Admin API scopes. Tick `write_products`',
				'(and `read_products`), save, then reinstall the app so the change takes',
				'effect. Rerun this script afterwards.',
				''
			].join('\n')
		);
		process.exit(1);
	}
}

const UPDATE_HANDLE_MUTATION = `
  mutation UpdateHandle($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id handle }
      userErrors { field message }
    }
  }
`;

async function fetchAllProducts() {
	const all = [];
	let after = null;
	let hasNext = true;

	while (hasNext) {
		const data = await storefrontFetch(PRODUCTS_QUERY, { after });
		const { edges, pageInfo } = data.products;
		all.push(...edges.map((e) => e.node));
		hasNext = pageInfo.hasNextPage;
		after = pageInfo.endCursor;
	}

	return all;
}

async function setHandle(id, handle) {
	const data = await adminFetch(UPDATE_HANDLE_MUTATION, { input: { id, handle } });
	const { product, userErrors } = data.productUpdate;
	if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join(', '));
	return product.handle;
}

// ── alias map ────────────────────────────────────────────────────────────────

async function readExistingAliases() {
	try {
		const mod = await import(`${ALIAS_FILE}?t=${Date.now()}`);
		return { ...mod.HANDLE_ALIASES };
	} catch {
		return {};
	}
}

function writeAliases(aliases) {
	const entries = Object.entries(aliases).sort(([a], [b]) => a.localeCompare(b));

	const body = entries.length
		? entries.map(([from, to]) => `\t'${from}': '${to}'`).join(',\n')
		: '';

	const contents = `// Old product handle -> current product handle.
//
// Generated by scripts/rename-product-handles.mjs. Do not edit by hand; rerun
// the script instead. Consumed by src/routes/shop/[handle]/+page.server.js,
// which 301s a stale handle to its current URL so previously indexed and
// shared links keep working.

export const HANDLE_ALIASES = {${body ? `\n${body}\n` : ''}};

/**
 * Resolve a possibly-stale handle to the current one.
 * @param {string} handle
 * @returns {string|null} the current handle, or null if there is no alias
 */
export function resolveHandleAlias(handle) {
	const target = HANDLE_ALIASES[handle];
	return target && target !== handle ? target : null;
}
`;

	fs.writeFileSync(ALIAS_FILE, contents);
}

// ── main ─────────────────────────────────────────────────────────────────────

const products = await fetchAllProducts();
console.log(`Fetched ${products.length} products from ${DOMAIN}\n`);

// Assign canonical handles. Suffix only when two products truly collide, and
// never hand a product a slug another product is keeping.
const desired = new Map();
const taken = new Set();

for (const p of products) {
	const base = buildProductHandle(p);
	let handle = base;
	let n = 2;
	while (taken.has(handle)) handle = `${base}-${n++}`;
	taken.add(handle);
	desired.set(p.id, handle);
}

// ── data-quality warnings ────────────────────────────────────────────────────
// A handle is only as good as the title it comes from. Surface titles that
// don't fit "Model, Reference, Material, Year" rather than quietly slugging
// a material into the reference slot.

const MATERIAL_WORDS =
	/^(stainless|steel|rose|yellow|white|gold|platinum|titanium|ceramic|oystersteel|everose|two[- ]tone|bi[- ]metal)/i;

const malformed = products.filter((p) => {
	const { reference, year } = parseWatchTitle(p.title);
	return !year || !reference || MATERIAL_WORDS.test(reference);
});

if (malformed.length) {
	console.log(`Titles that don't fit "Model, Reference, Material, Year" (${malformed.length}):`);
	for (const p of malformed) {
		console.log(`  ${p.vendor} — ${p.title}`);
		console.log(`      -> ${buildProductHandle(p)}`);
	}
	console.log('  Fix these titles in Shopify for a correct slug, then rerun.\n');
}

const collisions = new Map();
for (const p of products) {
	const base = buildProductHandle(p);
	if (!collisions.has(base)) collisions.set(base, []);
	collisions.get(base).push(p);
}

const clashing = [...collisions.entries()].filter(([, group]) => group.length > 1);

if (clashing.length) {
	console.log(`Products sharing a brand+model+reference+year (${clashing.length}):`);
	for (const [slug, group] of clashing) {
		console.log(`  ${slug}`);
		for (const p of group) console.log(`      ${p.handle}  —  ${p.title}`);
	}
	console.log('  These get a -2 suffix. If any pair is a duplicate listing,');
	console.log('  delete the extra in Shopify before applying.\n');
}

const changes = products
	.map((p) => ({ ...p, next: desired.get(p.id) }))
	.filter((p) => p.next !== p.handle);

if (!changes.length) {
	console.log('Every product is already on its canonical handle. Nothing to do.');
	process.exit(0);
}

const width = Math.max(...changes.map((c) => c.handle.length));
for (const c of changes) {
	console.log(`  ${c.handle.padEnd(width)}  ->  ${c.next}`);
}
console.log(`\n${changes.length} of ${products.length} products would change.`);

if (!APPLY) {
	console.log('\nDry run. Rerun with --apply to write these to Shopify.');
	process.exit(0);
}

await assertProductWriteScope();

// A product's target handle may currently be held by another product that is
// itself being renamed. Park those on a temporary handle first so the final
// pass never collides.
const currentlyHeld = new Map(products.map((p) => [p.handle, p.id]));
const parked = changes.filter((c) => {
	const holder = currentlyHeld.get(c.next);
	return holder && holder !== c.id;
});

for (const c of parked) {
	const temp = `tmp-rehandle-${c.id.split('/').pop()}`;
	await setHandle(c.id, temp);
	console.log(`  parked ${c.handle} -> ${temp}`);
}

let renamed = 0;
const failures = [];
const aliases = await readExistingAliases();

for (const c of changes) {
	try {
		const applied = await setHandle(c.id, c.next);

		if (applied !== c.next) {
			failures.push(`${c.handle}: Shopify assigned "${applied}" instead of "${c.next}"`);
		}

		// Point the old handle at the new one, and re-target any alias that
		// previously resolved to the old handle so chains stay one hop.
		aliases[c.handle] = applied;
		for (const [from, to] of Object.entries(aliases)) {
			if (to === c.handle) aliases[from] = applied;
		}
		delete aliases[applied];

		renamed++;
		console.log(`  ${c.handle} -> ${applied}`);
	} catch (e) {
		failures.push(`${c.handle}: ${e.message}`);
		console.error(`  FAILED ${c.handle}: ${e.message}`);
	}

	// Stay well inside the Admin API's leaky-bucket rate limit.
	await new Promise((r) => setTimeout(r, 250));
}

writeAliases(aliases);

console.log(`\nRenamed ${renamed} products.`);
console.log(`Wrote ${Object.keys(aliases).length} aliases to src/lib/handleAliases.js`);

if (failures.length) {
	console.log(`\n${failures.length} problem(s):`);
	for (const f of failures) console.log(`  - ${f}`);
	process.exit(1);
}
