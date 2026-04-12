<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';

	const status = $derived($page.status);
	const error = $derived($page.error);

	let countdown = $state(5);
	let intervalId;

	function goHome() {
		if (intervalId) {
			clearInterval(intervalId);
		}
		goto('/');
	}

	onMount(() => {
		if (status === 404) {
			intervalId = setInterval(() => {
				countdown--;
				if (countdown <= 0) {
					clearInterval(intervalId);
					goHome();
				}
			}, 1000);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	});
</script>

{#if status === 404}
	<section class="error-page">
		<div class="error-container">
			<div class="error-content">
				<h1 class="error-title">404</h1>
				<h2 class="error-heading">Page Not Found</h2>
				<p class="error-message">
					This Page Does not Exist. You will be returned to the Home Page in
					<span class="countdown">{countdown}</span> second{countdown !== 1 ? 's' : ''}.
				</p>
				<div class="error-actions">
					<Button onclick={goHome}>Return to Home Page</Button>
				</div>
			</div>
		</div>
	</section>
{:else}
	<section class="error-page">
		<div class="error-container">
			<div class="error-content">
				<h1 class="error-title">{status || 'Error'}</h1>
				<h2 class="error-heading">Something went wrong</h2>
				<p class="error-message">
					{error?.message || 'An unexpected error occurred'}
				</p>
				<div class="error-actions">
					<Button onclick={() => goto('/')}>Return to Home Page</Button>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.error-page {
		width: 100%;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
		padding: 40px 20px;
		box-sizing: border-box;
	}

	.error-container {
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
		text-align: center;
	}

	.error-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
	}

	.error-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(4rem, 10vw, 8rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1;
		letter-spacing: -0.05em;
	}

	.error-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		letter-spacing: -0.02em;
	}

	.error-message {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		line-height: 1.7;
		color: #4a4a4a;
		margin: 0;
		font-weight: 400;
		max-width: 500px;
	}

	.countdown {
		font-weight: 600;
		color: #a1846d;
		font-size: 1.2em;
		display: inline-block;
		min-width: 2ch;
		text-align: center;
	}

	.error-actions {
		margin-top: 8px;
		display: flex;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.error-page {
			padding: 60px 20px;
		}

		.error-content {
			gap: 20px;
		}

		.error-message {
			text-align: center;
		}
	}

	@media (max-width: 480px) {
		.error-page {
			padding: 40px 15px;
		}

		.error-content {
			gap: 16px;
		}
	}
</style>

