import { fail } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import crypto from 'node:crypto';
import subscriptionsMarkdown from '$lib/data/watchreserve-subscriptions.md?raw';

const COOKIE_NAME = 'wr_internal_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function sign(payload) {
	return crypto.createHmac('sha256', env.INTERNAL_SESSION_SECRET).update(payload).digest('hex');
}

function timingSafeEqualStrings(a, b) {
	const aBuf = Buffer.from(a);
	const bBuf = Buffer.from(b);
	if (aBuf.length !== bBuf.length) return false;
	return crypto.timingSafeEqual(aBuf, bBuf);
}

function createSessionToken() {
	const payload = `internal:${Date.now() + SESSION_TTL_MS}`;
	return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token) {
	if (!token) return false;
	const dot = token.lastIndexOf('.');
	if (dot === -1) return false;
	const payload = token.slice(0, dot);
	const sig = token.slice(dot + 1);
	if (!timingSafeEqualStrings(sig, sign(payload))) return false;
	const expires = Number(payload.split(':')[1]);
	return Number.isFinite(expires) && Date.now() < expires;
}

function splitRow(line) {
	return line
		.split('|')
		.slice(1, -1)
		.map((cell) => cell.trim());
}

function normalize(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function matchServiceName(candidate, serviceNames) {
	const normCandidate = normalize(candidate).replace(/s$/, '');
	if (!normCandidate) return null;
	return serviceNames.find((name) => {
		const normName = normalize(name);
		return normName.includes(normCandidate) || normCandidate.includes(normName);
	});
}

function parseRowNotes(content, serviceNames) {
	const notesSection = content.split('## Open questions for Mike')[1] ?? '';
	const bullets = notesSection
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.startsWith('- '))
		.map((line) => line.slice(2).trim());

	const notesByService = {};

	for (const bullet of bullets) {
		const rowMatch = bullet.match(/^(.*?)\s+This was on (?:the )?(.+?) Row\.?$/i);
		let text = bullet;
		let targets = [];

		if (rowMatch) {
			text = rowMatch[1].trim();
			targets = [rowMatch[2].trim()];
		} else {
			const leadMatch = bullet.match(/^([^—-]+)[—-]/);
			if (leadMatch) targets = [leadMatch[1].trim()];
		}

		if (targets.length === 0) {
			const parenMatch = bullet.match(/\(([^)]+)\)/);
			if (parenMatch) targets = parenMatch[1].split(',').map((s) => s.trim());
		}

		for (const target of targets.flatMap((t) => t.split('/'))) {
			const service = matchServiceName(target, serviceNames);
			if (!service) continue;
			if (!notesByService[service]) {
				notesByService[service] = text;
			} else if (!notesByService[service].includes(text)) {
				notesByService[service] += ` ${text}`;
			}
		}
	}

	return notesByService;
}

function loadSubscriptionsTable() {
	const content = subscriptionsMarkdown;
	const tableLines = content.split('\n').filter((line) => line.trim().startsWith('|'));
	if (tableLines.length < 2) return { headers: [], rows: [] };

	const headers = splitRow(tableLines[0]);
	const cellRows = tableLines.slice(2).map(splitRow);
	const serviceNames = cellRows.map((cells) => cells[0]);
	const notesByService = parseRowNotes(content, serviceNames);

	console.log('[internal debug] notesByService', notesByService);
	const rows = cellRows.map((cells) => ({
		cells,
		note: notesByService[cells[0]] ?? null
	}));

	return { headers, rows };
}

export async function load({ cookies }) {
	const authenticated = verifySessionToken(cookies.get(COOKIE_NAME));
	if (!authenticated) return { authenticated: false };

	try {
		const { headers, rows } = loadSubscriptionsTable();
		return { authenticated: true, headers, rows };
	} catch (e) {
		console.error('[internal] failed to load spreadsheet:', e.message);
		return {
			authenticated: true,
			headers: [],
			rows: [],
			loadError: 'Could not load the spreadsheet.'
		};
	}
}

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		const username = String(form.get('username') ?? '');
		const password = String(form.get('password') ?? '');

		const validUser = timingSafeEqualStrings(username, env.INTERNAL_USER ?? '');
		const validPass = timingSafeEqualStrings(password, env.INTERNAL_PASS ?? '');

		if (!validUser || !validPass) {
			return fail(401, { error: 'Incorrect username or password.' });
		}

		cookies.set(COOKIE_NAME, createSessionToken(), {
			path: '/internal',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: SESSION_TTL_MS / 1000
		});

		return { success: true };
	},

	logout: async ({ cookies }) => {
		cookies.delete(COOKIE_NAME, { path: '/internal' });
		return { success: true };
	}
};
