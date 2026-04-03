import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// ── Cache (1hr TTL) ────────────────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

function getCached(key) {
	const entry = cache.get(key);
	if (!entry) return null;
	if (Date.now() - entry.ts > CACHE_TTL_MS) { cache.delete(key); return null; }
	return entry.data;
}
function setCache(key, data) {
	cache.set(key, { data, ts: Date.now() });
}

// ── UA pool ────────────────────────────────────────────────────────────────
const USER_AGENTS = [
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
];
function pickUA() {
	return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// ── Fetch via curl (bypasses undici TLS fingerprint detection) ─────────────
async function curlFetch(reference) {
	const ua  = pickUA();
	const url = `https://www.chrono24.co.uk/search/index.htm?query=${encodeURIComponent(reference)}&dosearch=true&watchTypes=A&resultview=block&currencyId=GBP`;

	const args = [
		'--silent',
		'--max-time', '20',
		'--compressed',
		'--location',
		'-w', '\n__STATUS__%{http_code}',
		'-H', `User-Agent: ${ua}`,
		'-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
		'-H', 'Accept-Language: en-GB,en;q=0.9,en-US;q=0.8',
		'-H', 'Cache-Control: max-age=0',
		'-H', 'Sec-Fetch-Dest: document',
		'-H', 'Sec-Fetch-Mode: navigate',
		'-H', 'Sec-Fetch-Site: none',
		'-H', 'Sec-Fetch-User: ?1',
		'-H', 'Upgrade-Insecure-Requests: 1',
		url,
	];

	const { stdout } = await execFileAsync('/usr/bin/curl', args, { maxBuffer: 10 * 1024 * 1024 });

	// Split body from status code appended at end
	const statusMatch = stdout.match(/\n__STATUS__(\d+)$/);
	const status = statusMatch ? parseInt(statusMatch[1]) : 0;
	const body = statusMatch ? stdout.slice(0, stdout.lastIndexOf('\n__STATUS__')) : stdout;

	return { status, body };
}

// ── Helpers ────────────────────────────────────────────────────────────────
function parsePrice(str) {
	if (!str) return null;
	const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
	return isNaN(num) || num < 500 || num > 5_000_000 ? null : num;
}

function median(arr) {
	if (!arr.length) return null;
	const s = [...arr].sort((a, b) => a - b);
	const m = Math.floor(s.length / 2);
	return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

function extractYear(text) {
	const m = text?.match(/\b(19[5-9]\d|20[0-3]\d)\b/);
	return m ? parseInt(m[1]) : null;
}

// ── Parse HTML — verified selectors from live Chrono24 HTML (2026-04-03) ──
// Card container : div.wt-listing-item.js-listing-item   (60 cards per page)
// Price          : div.align-content-end > p.text-bold   e.g. "£8,700"
// Title          : p.text-bold.text-sm.text-ellipsis     e.g. "Rolex Submariner Date"
// Subtitle/year  : p.text-ellipsis.text-sm.text-sm-md:not(.text-bold)  e.g. "126610LN - 2022 41mm..."

function parseListings(html, reference) {
	const $ = cheerio.load(html);
	const prices = [];
	const listings = [];

	$('div.wt-listing-item.js-listing-item').each((_, el) => {
		const card = $(el);

		const priceText = card.find('div.align-content-end p.text-bold').first().text().trim();
		const price = parsePrice(priceText);
		if (!price) return;

		const title    = card.find('p.text-bold.text-sm.text-ellipsis').first().text().trim();
		const subtitle = card.find('p.text-ellipsis.text-sm.text-sm-md:not(.text-bold)').first().text().trim();
		const year     = extractYear(subtitle) ?? extractYear(title);

		prices.push(price);
		listings.push({ price, year, title: (title || reference).slice(0, 80) });
	});

	// Fallback regex if Chrono24 changes their markup
	if (!prices.length) {
		for (const m of html.matchAll(/£\s*([\d,]{4,})/g)) {
			const p = parsePrice(m[1]);
			if (p) prices.push(p);
		}
	}

	return { prices, listings };
}

// ── GET handler ────────────────────────────────────────────────────────────
export async function GET({ url }) {
	const reference = url.searchParams.get('reference')?.trim();
	if (!reference || reference.length < 3) {
		return json({ error: 'Please provide a valid reference number.' }, { status: 400 });
	}

	const cacheKey = reference.toLowerCase();
	const cached = getCached(cacheKey);
	if (cached) return json({ ...cached, cached: true });

	try {
		let { status, body } = await curlFetch(reference);

		if (status === 403 || status === 429) {
			// Brief pause then one retry
			await new Promise(r => setTimeout(r, 1500));
			({ status, body } = await curlFetch(reference));
		}

		if (status !== 200) throw new Error(`HTTP ${status}`);

		if (body.includes('cf-browser-verification') || body.includes('challenge-form')) {
			throw new Error('CF_CHALLENGE');
		}

		const { prices, listings } = parseListings(body, reference);

		if (!prices.length) {
			return json({
				error: 'No listings found. Try adjusting the format — e.g. 126610LN, 5711/1A.',
				reference
			}, { status: 404 });
		}

		const sorted = [...prices].sort((a, b) => a - b);
		const result = {
			reference,
			currency: 'GBP',
			count:    prices.length,
			low:      sorted[0],
			high:     sorted[sorted.length - 1],
			median:   median(prices),
			average:  Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
			listings,
			cached:   false,
			source:   'Chrono24',
			fetchedAt: new Date().toISOString()
		};

		setCache(cacheKey, result);
		return json(result);

	} catch (err) {
		console.error('[watch-price] error:', err.message, err.stderr ?? '');

		let error = 'Unable to fetch prices right now. Please try again.';
		let detail = err.message;

		if (err.message === 'CF_CHALLENGE') {
			error = 'Bot protection triggered — try again shortly.';
			detail = 'Chrono24 returned a Cloudflare challenge page. Wait 30–60 seconds and try again.';
		} else if (err.code === 'ENOENT') {
			error = 'Server configuration error.';
			detail = 'curl not found on this server. Contact support.';
		} else if (err.message.includes('TIMEDOUT') || err.message.includes('max-time')) {
			error = 'Request timed out.';
			detail = 'Chrono24 took too long to respond. Try again in a moment.';
		} else if (err.message.startsWith('HTTP ')) {
			const code = err.message.replace('HTTP ', '');
			error = `Chrono24 returned an error (${code}).`;
			detail = code === '403' || code === '429'
				? 'Too many requests — wait a minute and try again.'
				: `Unexpected HTTP ${code} from Chrono24. Try again shortly.`;
		}

		return json({ error, detail }, { status: 502 });
	}
}
