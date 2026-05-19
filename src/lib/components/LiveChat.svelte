<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	const SOCKET_URL = 'wss://chat.watchreserve.co.uk';
	const SESSION_STORAGE_KEY = 'wr_chat_session_id';
	const MESSAGES_STORAGE_KEY = 'wr_chat_messages';
	const MESSAGES_STORAGE_LIMIT = 200;

	let isOpen = $state(false);
	let messages = $state([]);
	let input = $state('');
	let status = $state('connecting');
	let showTeaser = $state(false);

	let socket = null;
	let sessionId = null;
	let welcomeShown = false;
	let teaserDismissed = false;

	let messagesEndEl = $state(null);
	let inputEl = $state(null);

	const statusLabels = {
		connected: 'Online',
		connecting: 'Connecting…',
		reconnecting: 'Reconnecting…',
		disconnected: 'Offline'
	};

	onMount(() => {
		let cancelled = false;

		try {
			sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
		} catch {
			sessionId = null;
		}

		if (!sessionId) {
			sessionId =
				typeof crypto !== 'undefined' && crypto.randomUUID
					? crypto.randomUUID()
					: `${Date.now()}-${Math.random().toString(36).slice(2)}`;
			try {
				localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
			} catch { /* ignore */ }
		}

		try {
			const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed) && parsed.length > 0) {
					messages = parsed;
					welcomeShown = true;
				}
			}
		} catch { /* ignore parse/storage errors */ }

		const teaserTimer = setTimeout(() => {
			if (!teaserDismissed) showTeaser = true;
		}, 1500);

		(async () => {
			const mod = await import('socket.io-client');
			if (cancelled) return;

			const s = mod.io(SOCKET_URL, {
				transports: ['websocket'],
				reconnection: true,
				reconnectionAttempts: Infinity,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000
			});
			socket = s;

			s.on('connect', () => {
				status = 'connected';
				s.emit('join_session', sessionId);
			});
			s.on('disconnect', () => (status = 'reconnecting'));
			s.on('reconnect_attempt', () => (status = 'reconnecting'));
			s.on('connect_error', () => (status = 'reconnecting'));

			s.on('message', (msg) => {
				messages = [
					...messages,
					{
						body: msg.body,
						senderRole: msg.senderRole || 'agent',
						timestamp: msg.timestamp || Date.now()
					}
				];
			});
		})();

		return () => {
			cancelled = true;
			clearTimeout(teaserTimer);
			if (socket) {
				socket.disconnect();
				socket = null;
			}
		};
	});

	$effect(() => {
		if (isOpen && messages.length >= 0 && messagesEndEl) {
			messagesEndEl.scrollIntoView({ behavior: 'smooth' });
		}
	});

	$effect(() => {
		if (messages.length === 0) return;
		try {
			const trimmed = messages.slice(-MESSAGES_STORAGE_LIMIT);
			localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(trimmed));
		} catch { /* quota exceeded or storage disabled — drop silently */ }
	});

	$effect(() => {
		if (isOpen && inputEl) inputEl.focus();
	});

	$effect(() => {
		if (isOpen && !welcomeShown) {
			welcomeShown = true;
			messages = [
				...messages,
				{
					body: 'Welcome to Watch Reserve. How can we help you find your next timepiece?',
					senderRole: 'agent',
					timestamp: Date.now()
				}
			];
		}
	});

	function toggle() {
		if (showTeaser) {
			teaserDismissed = true;
			showTeaser = false;
		}
		isOpen = !isOpen;
	}

	function dismissTeaser(e) {
		e.stopPropagation();
		teaserDismissed = true;
		showTeaser = false;
	}

	function openFromTeaser() {
		teaserDismissed = true;
		showTeaser = false;
		isOpen = true;
	}

	function sendMessage(e) {
		e.preventDefault();
		const body = input.trim();
		if (!body || !socket?.connected) return;

		const payload = { sessionId, body, senderRole: 'customer' };
		socket.emit('message', payload);
		messages = [...messages, { ...payload, timestamp: Date.now() }];
		input = '';
	}

	function onTeaserKey(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openFromTeaser();
		}
	}

	function formatTime(ts) {
		return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

{#if browser}
<div class="lc-root" class:lc-root-open={isOpen} aria-hidden={!isOpen && !showTeaser ? 'true' : 'false'}>
	{#if showTeaser && !isOpen}
		<div
			class="teaser"
			role="button"
			tabindex="0"
			onclick={openFromTeaser}
			onkeydown={onTeaserKey}
		>
			<span class="teaser-text">
				Hi there! Need help finding the perfect timepiece? Chat with our concierge.
			</span>
			<button
				type="button"
				class="teaser-close"
				onclick={dismissTeaser}
				aria-label="Dismiss"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
		</div>
	{/if}

	<button
		type="button"
		class="bubble"
		class:bubble-open={isOpen}
		class:bubble-hide-mobile={isOpen}
		onclick={toggle}
		aria-label={isOpen ? 'Close chat' : 'Open chat'}
		aria-expanded={isOpen}
	>
		{#if isOpen}
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
			</svg>
		{:else}
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</button>

	{#if isOpen}
		<div class="window" role="dialog" aria-label="Live chat">
			<header class="header">
				<div class="header-text">
					<span class="title">Watch Reserve</span>
					<span class="subtitle">Concierge Team</span>
				</div>
				<div class="header-right">
					<span class="status" data-status={status}>{statusLabels[status]}</span>
					<button
						type="button"
						class="header-close"
						onclick={toggle}
						aria-label="Close chat"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						</svg>
					</button>
				</div>
			</header>

			<div class="messages">
				{#if messages.length === 0}
					<p class="empty">Send a message to start the conversation.</p>
				{/if}
				{#each messages as m, i (i)}
					<div class="message {m.senderRole === 'customer' ? 'outbound' : 'inbound'}">
						<div class="msg-bubble">{m.body}</div>
						<time class="time">{formatTime(m.timestamp)}</time>
					</div>
				{/each}
				<div bind:this={messagesEndEl}></div>
			</div>

			<form class="form" onsubmit={sendMessage}>
				<input
					bind:this={inputEl}
					class="input"
					bind:value={input}
					placeholder={status === 'connected' ? 'Type a message…' : 'Waiting for connection…'}
					disabled={status !== 'connected'}
					maxlength="1000"
					aria-label="Message"
				/>
				<button
					type="submit"
					class="send"
					disabled={!input.trim() || status !== 'connected'}
					aria-label="Send message"
				>
					Send
				</button>
			</form>
		</div>
	{/if}
</div>
{/if}

<style>
	/* ── ROOT (viewport-anchored container) ── */
	.lc-root {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
		pointer-events: none;
		z-index: 800;
	}

	.lc-root-open {
		z-index: 1050;
	}

	.lc-root > * {
		pointer-events: auto;
	}

	/* ── TEASER ── */
	.teaser {
		position: absolute;
		bottom: 96px;
		right: 112px;
		max-width: 280px;
		padding: 14px 38px 14px 16px;
		background: #ffffff;
		color: #160b11;
		border: 1px solid rgba(161, 132, 109, 0.25);
		border-radius: 4px;
		box-shadow: 0 8px 28px rgba(22, 11, 17, 0.18);
		font-family: 'Montserrat', sans-serif;
		font-size: 0.8125rem;
		line-height: 1.5;
		cursor: pointer;
		box-sizing: border-box;
		overflow-wrap: break-word;
		word-wrap: break-word;
		animation: wrTeaserIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.teaser::after {
		content: '';
		position: absolute;
		right: -6px;
		bottom: 22px;
		width: 12px;
		height: 12px;
		background: #ffffff;
		border-right: 1px solid rgba(161, 132, 109, 0.25);
		border-top: 1px solid rgba(161, 132, 109, 0.25);
		transform: rotate(45deg);
	}

	.teaser:hover {
		box-shadow: 0 10px 32px rgba(22, 11, 17, 0.24);
	}

	.teaser:focus-visible {
		outline: 2px solid #a1846d;
		outline-offset: 2px;
	}

	.teaser-text {
		display: block;
		font-weight: 500;
		color: #160b11;
	}

	.teaser-close {
		position: absolute;
		top: 6px;
		right: 6px;
		background: transparent;
		border: none;
		color: #8a7565;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 0;
	}

	.teaser-close:hover {
		color: #160b11;
		background: rgba(161, 132, 109, 0.1);
	}

	@keyframes wrTeaserIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── BUBBLE ── */
	.bubble {
		position: absolute;
		bottom: 32px;
		right: 32px;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: linear-gradient(135deg, #a1846d 0%, #8d7060 100%);
		color: #ffffff;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 6px 20px rgba(22, 11, 17, 0.28), 0 2px 6px rgba(161, 132, 109, 0.35);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.bubble-open {
		background: #160b11;
	}

	.bubble:hover {
		transform: scale(1.06);
		box-shadow: 0 10px 28px rgba(22, 11, 17, 0.34), 0 3px 8px rgba(161, 132, 109, 0.45);
	}

	.bubble:focus-visible {
		outline: 2px solid #a1846d;
		outline-offset: 3px;
	}

	/* ── WINDOW ── */
	.window {
		position: absolute;
		bottom: 112px;
		right: 32px;
		width: 400px;
		height: 580px;
		max-height: calc(100% - 160px);
		background: #ffffff;
		border: 1px solid rgba(161, 132, 109, 0.2);
		border-radius: 4px;
		box-shadow: 0 16px 48px rgba(22, 11, 17, 0.28);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		font-family: 'Montserrat', sans-serif;
		animation: wrWindowIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes wrWindowIn {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── HEADER ── */
	.header {
		padding: 16px 18px;
		background: linear-gradient(180deg, #1e0e19 0%, #160b11 100%);
		color: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(161, 132, 109, 0.25);
	}

	.header-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.title {
		font-weight: 700;
		font-size: 0.8125rem;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.95);
	}

	.subtitle {
		font-size: 0.6875rem;
		letter-spacing: 0.06em;
		color: #b99578;
		font-weight: 500;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.status {
		font-size: 0.6875rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: rgba(255, 255, 255, 0.7);
	}

	.header-close {
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		padding: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: color 0.2s ease, background-color 0.2s ease;
	}

	.header-close:hover {
		color: #ffffff;
		background: rgba(255, 255, 255, 0.08);
	}

	.header-close:focus-visible {
		outline: 2px solid #a1846d;
		outline-offset: 1px;
	}

	.status::before {
		content: '';
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #f59e0b;
	}

	.status[data-status='connected']::before {
		background: #a1846d;
		box-shadow: 0 0 0 0 rgba(161, 132, 109, 0.7);
		animation: wrPulse 2.4s ease-in-out infinite;
	}

	.status[data-status='disconnected']::before {
		background: #ef4444;
	}

	@keyframes wrPulse {
		0% {
			box-shadow: 0 0 0 0 rgba(161, 132, 109, 0.6);
			opacity: 1;
		}
		70% {
			box-shadow: 0 0 0 6px rgba(161, 132, 109, 0);
			opacity: 0.85;
		}
		100% {
			box-shadow: 0 0 0 0 rgba(161, 132, 109, 0);
			opacity: 1;
		}
	}

	/* ── MESSAGES ── */
	.messages {
		flex: 1;
		overflow-y: auto;
		padding: 18px 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		background: #faf7f4;
	}

	.empty {
		color: #8a7565;
		text-align: center;
		margin: auto 0;
		font-size: 0.8125rem;
		letter-spacing: 0.02em;
	}

	.message {
		display: flex;
		flex-direction: column;
		max-width: 80%;
	}

	.outbound {
		align-self: flex-end;
		align-items: flex-end;
	}

	.inbound {
		align-self: flex-start;
		align-items: flex-start;
	}

	.msg-bubble {
		padding: 9px 13px;
		border-radius: 14px;
		font-size: 0.8125rem;
		line-height: 1.45;
		word-wrap: break-word;
		white-space: pre-wrap;
	}

	.outbound .msg-bubble {
		background: linear-gradient(135deg, #a1846d 0%, #8d7060 100%);
		color: #ffffff;
		border-bottom-right-radius: 4px;
	}

	.inbound .msg-bubble {
		background: #ffffff;
		color: #160b11;
		border: 1px solid rgba(161, 132, 109, 0.25);
		border-bottom-left-radius: 4px;
	}

	.time {
		font-size: 0.625rem;
		color: #8a7565;
		margin-top: 4px;
		padding: 0 4px;
		letter-spacing: 0.04em;
	}

	/* ── FORM ── */
	.form {
		display: flex;
		padding: 12px;
		gap: 8px;
		border-top: 1px solid rgba(161, 132, 109, 0.2);
		background: #ffffff;
	}

	.input {
		flex: 1;
		border: 1px solid rgba(161, 132, 109, 0.3);
		border-radius: 4px;
		padding: 10px 14px;
		font-size: 0.8125rem;
		outline: none;
		font-family: 'Montserrat', sans-serif;
		color: #160b11;
		transition: border-color 0.2s ease;
	}

	.input::placeholder {
		color: #b0a092;
	}

	.input:focus {
		border-color: #a1846d;
	}

	.input:disabled {
		background: #faf7f4;
		color: #8a7565;
	}

	.send {
		background: linear-gradient(135deg, #a1846d 0%, #8d7060 100%);
		color: #ffffff;
		border: none;
		border-radius: 4px;
		padding: 10px 18px;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
		font-family: 'Montserrat', sans-serif;
		box-shadow: 0 2px 8px rgba(161, 132, 109, 0.3);
		transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
	}

	.send:hover:not(:disabled) {
		opacity: 0.92;
		transform: translateY(-1px);
		box-shadow: 0 4px 14px rgba(161, 132, 109, 0.42);
	}

	.send:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		box-shadow: none;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 768px) {
		.bubble {
			bottom: 16px;
			right: 16px;
			width: 56px;
			height: 56px;
		}

		.bubble-hide-mobile {
			display: none;
		}

		.teaser {
			right: 16px;
			bottom: 84px;
			max-width: calc(100% - 32px);
			font-size: 0.75rem;
		}

		.teaser::after {
			right: 28px;
			bottom: -6px;
			border: none;
			border-bottom: 1px solid rgba(161, 132, 109, 0.25);
			border-left: 1px solid rgba(161, 132, 109, 0.25);
		}

		.window {
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			max-height: 100%;
			border: none;
			border-radius: 0;
		}
	}
</style>
