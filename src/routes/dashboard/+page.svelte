<script>
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	let { data, form } = $props();

	let submitting = $state(false);

	const statusOptions = ['new arrival', 'in stock', 'reserved', 'sold'];

	function gbp(value, currency = 'GBP') {
		return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(value);
	}
</script>

<svelte:head>
	<title>Add a Watch &middot; WatchReserve Dashboard</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="dashboard">
	<header class="dash-head">
		<p class="eyebrow">WatchReserve</p>
		<h1>Add a Watch</h1>
		<p class="lead">
			Create a new timepiece in the catalogue. New watches are saved as a draft in Shopify so you
			can review images and details before publishing.
		</p>
	</header>

	<div class="grid">
		<section class="panel">
			{#if form?.success}
				<div class="notice notice-ok" role="status">{form.message}</div>
			{:else if form?.error}
				<div class="notice notice-err" role="alert">{form.error}</div>
			{/if}

			<form
				method="POST"
				action="?/addWatch"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
					};
				}}
			>
				<label class="field">
					<span>Title</span>
					<input
						name="title"
						type="text"
						required
						placeholder="Rolex Submariner Date 126610LN"
						value={form?.values?.title ?? ''}
					/>
				</label>

				<div class="row">
					<label class="field">
						<span>Brand</span>
						<input
							name="vendor"
							type="text"
							placeholder="Rolex"
							value={form?.values?.vendor ?? ''}
						/>
					</label>

					<label class="field">
						<span>Price (GBP)</span>
						<input
							name="price"
							type="number"
							min="0"
							step="0.01"
							required
							placeholder="12750.00"
							value={form?.values?.price ?? ''}
						/>
					</label>
				</div>

				<label class="field">
					<span>Status</span>
					<select name="status" value={form?.values?.status ?? 'new arrival'}>
						{#each statusOptions as opt (opt)}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
				</label>

				<label class="field">
					<span>Description</span>
					<textarea
						name="description"
						rows="4"
						placeholder="Condition, box &amp; papers, reference details..."
						>{form?.values?.description ?? ''}</textarea
					>
				</label>

				<button type="submit" class="submit" disabled={submitting}>
					{submitting ? 'Adding...' : 'Add Watch'}
				</button>
			</form>
		</section>

		<section class="panel">
			<h2>Recently listed</h2>
			{#if data.recent.length === 0}
				<p class="muted">
					No published watches yet. New drafts appear here once published in Shopify.
				</p>
			{:else}
				<ul class="recent">
					{#each data.recent as p (p.id)}
						<li>
							{#if p.image}
								<img src={p.image} alt={p.imageAlt} />
							{:else}
								<div class="thumb-placeholder" aria-hidden="true"></div>
							{/if}
							<div class="recent-meta">
								<a href={resolve('/shop/[handle]', { handle: p.handle })} class="recent-title"
									>{p.title}</a
								>
								<span class="recent-vendor">{p.vendor}</span>
							</div>
							<span class="recent-price">{gbp(p.price, p.currencyCode)}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</main>

<style>
	.dashboard {
		max-width: 1080px;
		margin: 0 auto;
		padding: 64px 24px 96px;
		font-family: 'acumin-pro', sans-serif;
		color: #160b11;
	}

	.dash-head {
		margin-bottom: 40px;
	}

	.eyebrow {
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: 0.72rem;
		color: #a1846d;
		margin: 0 0 8px;
	}

	.dash-head h1 {
		font-size: 2.1rem;
		font-weight: 600;
		margin: 0 0 12px;
	}

	.lead {
		max-width: 52ch;
		color: #5b4f56;
		line-height: 1.6;
		margin: 0;
	}

	.grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 32px;
		align-items: start;
	}

	.panel {
		border: 1px solid #e7ded6;
		padding: 32px;
		background: #fdfbf9;
	}

	.panel h2 {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 20px;
	}

	.field {
		display: block;
		margin-bottom: 20px;
	}

	.field span {
		display: block;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		margin-bottom: 8px;
		color: #422635;
	}

	.field input,
	.field select,
	.field textarea {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #d8ccc0;
		background: #fff;
		padding: 12px 14px;
		font-family: inherit;
		font-size: 0.95rem;
		color: #160b11;
		border-radius: 0;
	}

	.field input:focus,
	.field select:focus,
	.field textarea:focus {
		outline: none;
		border-color: #a1846d;
	}

	.field textarea {
		resize: vertical;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.submit {
		width: 100%;
		border: none;
		background: #160b11;
		color: #fff;
		padding: 15px;
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
		border-radius: 0;
		transition: background 0.2s ease;
	}

	.submit:hover:not(:disabled) {
		background: #a1846d;
	}

	.submit:disabled {
		opacity: 0.6;
		cursor: default;
	}

	.notice {
		padding: 14px 16px;
		margin-bottom: 24px;
		font-size: 0.88rem;
		line-height: 1.5;
	}

	.notice-ok {
		background: #efe9e2;
		border-left: 3px solid #a1846d;
		color: #422635;
	}

	.notice-err {
		background: #f7ebe9;
		border-left: 3px solid #a14d4d;
		color: #6b2f2f;
	}

	.recent {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.recent li {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 0;
		border-bottom: 1px solid #ece4dc;
	}

	.recent li:last-child {
		border-bottom: none;
	}

	.recent img,
	.thumb-placeholder {
		width: 48px;
		height: 48px;
		object-fit: cover;
		flex-shrink: 0;
		background: #ece4dc;
	}

	.recent-meta {
		flex: 1;
		min-width: 0;
	}

	.recent-title {
		display: block;
		font-size: 0.88rem;
		font-weight: 600;
		color: #160b11;
		text-decoration: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.recent-title:hover {
		color: #a1846d;
	}

	.recent-vendor {
		font-size: 0.75rem;
		color: #8a7d72;
	}

	.recent-price {
		font-size: 0.85rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.muted {
		color: #8a7d72;
		font-size: 0.88rem;
		line-height: 1.6;
	}

	@media (max-width: 820px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
