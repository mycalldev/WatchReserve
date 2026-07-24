<script>
	let { href = '/', children, className = '', ...rest } = $props();
</script>

<a href={href} class="link-button" class:className {...rest}>
	{@render children()}
	<span class="arrow-icon">
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="8" cy="8" r="7.5" stroke="currentColor" />
			<path
				d="M6 4L10 8L6 12"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</span>
</a>

<style>
	.link-button {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		color: #4a4a4a;
		text-decoration: none;
		font-family: 'acumin-pro', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		transition: all 0.3s ease;
		letter-spacing: 0.01em;
	}

	.link-button:hover {
		color: #2a2a2a;
		gap: 16px;
	}

	.arrow-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background-color: #ffffff;
		border-radius: 0;
		border: 1px solid #4a4a4a;
		transition: all 0.3s ease;
	}

	.link-button:hover .arrow-icon {
		background-color: #f5f5f5;
		transform: translateX(4px);
	}

	.arrow-icon svg {
		width: 16px;
		height: 16px;
	}

	.arrow-icon circle,
	.arrow-icon path {
		stroke: #4a4a4a;
	}

	@media (max-width: 768px) {
		.link-button {
			justify-content: center;
		}
	}
</style>

