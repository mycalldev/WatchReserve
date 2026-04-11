<script>
	let { children, onClick, href, className = '', ...rest } = $props();
</script>

{#if href}
	<a {href} class="button" class:className {...rest}>
		{@render children()}
	</a>
{:else}
	<button class="button" class:className onclick={onClick} {...rest}>
		{@render children()}
	</button>
{/if}

<style>
	.button {
		display: inline-block;
		background-color: #ffffff;
		color: #160B11;
		border: none;
		padding: 14px 32px;
		border-radius: 0;
		font-family: 'Montserrat', sans-serif;
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
		text-decoration: none;
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

