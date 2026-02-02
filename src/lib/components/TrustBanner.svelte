<script>
	const trustItems = [
		{
			id: 1,
			title: 'Trust Pilot'
		},
		{
			id: 2,
			title: 'Finance'
		},
		{
			id: 3,
			title: 'Fast and Secure Delivery'
		}
	];
</script>

<section class="trust-banner">
	<div class="trust-banner-container">
		{#each trustItems as item}
			<div class="trust-item">
				<div class="trust-icon">
					{#if item.id === 1}
						<!-- Trust Pilot Icon -->
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{:else if item.id === 2}
						<!-- Finance Icon -->
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect
								x="3"
								y="4"
								width="18"
								height="16"
								rx="2"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M3 10H21"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M7 15H7.01"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M11 15H13"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{:else if item.id === 3}
						<!-- Delivery Icon -->
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M1 3H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M20 20C20.5523 20 21 19.5523 21 19C21 18.4477 20.5523 18 20 18C19.4477 18 19 18.4477 19 19C19 19.5523 19.4477 20 20 20Z"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M12 8V12M10 10H14"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{/if}
				</div>
				<span class="trust-title">{item.title}</span>
			</div>
		{/each}
	</div>
</section>

<style>
	.trust-banner {
		width: 100%;
		background-color: #f8f8f8;
		border-top: 1px solid #e5e5e5;
		border-bottom: 1px solid #e5e5e5;
		padding: 20px 40px;
		box-sizing: border-box;
	}

	.trust-banner-container {
		max-width: 1400px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 40px;
		align-items: center;
		justify-items: center;
	}

	.trust-item {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.trust-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #a1846d;
		flex-shrink: 0;
	}

	.trust-icon svg {
		width: 24px;
		height: 24px;
	}

	.trust-title {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(0.875rem, 1vw, 0.9375rem);
		font-weight: 500;
		color: #160b11;
		letter-spacing: 0.01em;
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		.trust-banner {
			padding: 16px 20px;
		}

		.trust-banner-container {
			grid-template-columns: 1fr;
			gap: 20px;
		}

		.trust-item {
			justify-content: center;
		}
	}

	@media (max-width: 480px) {
		.trust-banner {
			padding: 14px 15px;
		}

		.trust-banner-container {
			gap: 16px;
		}

		.trust-icon svg {
			width: 20px;
			height: 20px;
		}

		.trust-title {
			font-size: 0.8125rem;
		}
	}
</style>

