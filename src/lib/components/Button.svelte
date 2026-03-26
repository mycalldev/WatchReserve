<script>
	let { children, onClick, className = '', ...rest } = $props();
</script>

<button class="button" class:className onclick={onClick} {...rest}>
	{@render children()}
</button>

<style>
	.button {
		background-color: #ffffff;
		color: #160B11;
		border: none;
		padding: 14px 32px;
		border-radius: 8px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s ease;
		letter-spacing: 0.01em;
	}

	.button:hover {
		background-color: #f0f0f0;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.button:active {
		transform: translateY(0);
	}

	@media (max-width: 768px) {
		.button {
			width: 100%;
			max-width: 300px;
		}
	}
</style>

