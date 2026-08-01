<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let submitting = $state(false);
	let expandedRow = $state(null);

	function toggleRow(rowIndex) {
		expandedRow = expandedRow === rowIndex ? null : rowIndex;
	}
</script>

<svelte:head>
	<title>Internal &middot; WatchReserve</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="internal">
	{#if !data.authenticated}
		<section class="login-panel">
			<p class="eyebrow">WatchReserve</p>
			<h1>Internal Access</h1>

			{#if form?.error}
				<div class="notice notice-err" role="alert">{form.error}</div>
			{/if}

			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
					};
				}}
			>
				<label class="field">
					<span>Username</span>
					<input name="username" type="text" autocomplete="username" required />
				</label>

				<label class="field">
					<span>Password</span>
					<input name="password" type="password" autocomplete="current-password" required />
				</label>

				<button class="submit" type="submit" disabled={submitting}>
					{submitting ? 'Signing in…' : 'Sign In'}
				</button>
			</form>
		</section>
	{:else}
		<header class="dash-head">
			<p class="eyebrow">WatchReserve</p>
			<h1>Tech Subscription Review</h1>
			<form method="POST" action="?/logout" use:enhance>
				<button class="logout" type="submit">Log out</button>
			</form>
		</header>

		{#if data.loadError}
			<div class="notice notice-err" role="alert">{data.loadError}</div>
		{:else}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							{#each data.headers as header (header)}
								<th>{header}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each data.rows as row, rowIndex (rowIndex)}
							<tr
								class="row-toggle"
								class:expanded={expandedRow === rowIndex}
								onclick={() => toggleRow(rowIndex)}
								aria-expanded={expandedRow === rowIndex}
							>
								{#each row.cells as cell, cellIndex (cellIndex)}
									<td>{cell}</td>
								{/each}
							</tr>
							{#if expandedRow === rowIndex}
								<tr class="row-detail">
									<td colspan={data.headers.length}>
										{row.note ?? 'No additional notes for this row.'}
									</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}
</main>

<style>
	.internal {
		max-width: 1100px;
		margin: 0 auto;
		padding: 60px 24px 100px;
	}

	.eyebrow {
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: 0.72rem;
		color: #a1846d;
		margin: 0 0 8px;
	}

	.login-panel {
		max-width: 380px;
		margin: 80px auto;
		border: 1px solid #e7ded6;
		padding: 40px;
		background: #fdfbf9;
	}

	.login-panel h1 {
		font-size: 1.6rem;
		font-weight: 600;
		margin: 0 0 24px;
	}

	.dash-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 32px;
	}

	.dash-head h1 {
		font-size: 2rem;
		font-weight: 600;
		margin: 0;
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

	.field input {
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

	.field input:focus {
		outline: none;
		border-color: #a1846d;
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

	.logout {
		border: 1px solid #d8ccc0;
		background: #fff;
		color: #160b11;
		padding: 10px 18px;
		font-family: inherit;
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		cursor: pointer;
		border-radius: 0;
	}

	.logout:hover {
		border-color: #a1846d;
		color: #a1846d;
	}

	.notice {
		padding: 14px 16px;
		margin-bottom: 24px;
		font-size: 0.88rem;
		line-height: 1.5;
	}

	.notice-err {
		background: #fbe9e7;
		color: #7a2b1f;
		border: 1px solid #e6b8ae;
	}

	.table-wrap {
		overflow-x: auto;
		border: 1px solid #e7ded6;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.88rem;
	}

	th,
	td {
		text-align: left;
		padding: 12px 14px;
		border-bottom: 1px solid #e7ded6;
		white-space: nowrap;
	}

	th {
		background: #fdfbf9;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: #422635;
	}

	.row-toggle {
		cursor: pointer;
	}

	.row-toggle:hover {
		background: #fdfbf9;
	}

	.row-toggle.expanded {
		background: #f5efe9;
	}

	.row-detail td {
		background: #fdfbf9;
		color: #5b4f56;
		line-height: 1.6;
		white-space: normal;
		border-bottom: 1px solid #e7ded6;
	}
</style>
