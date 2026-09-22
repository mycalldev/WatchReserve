<script>
	let { title = 'Request Received!', message = 'A member of our team will be in touch shortly.' } =
		$props();
</script>

<div class="form-success" role="status" aria-live="polite">
	<div class="form-success-icon" aria-hidden="true">
		<svg
			width="28"
			height="28"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	</div>
	<p class="form-success-title">{title}</p>
	<p class="form-success-msg">{message}</p>
</div>

<style>
	.form-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 16px;
		padding: 24px 0 8px;
	}

	.form-success-icon {
		width: 56px;
		height: 56px;
		background-color: #a1846d;
		color: #ffffff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.form-success-title {
		font-family: 'freight-display-pro', 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.375rem, 1.6vw, 1.625rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
	}

	.form-success-msg {
		font-family: 'acumin-pro', sans-serif;
		font-size: clamp(0.875rem, 0.8vw, 1rem);
		color: rgba(22, 11, 17, 0.6);
		line-height: 1.65;
		margin: 0;
		max-width: 360px;
	}
</style>
