<script>
	import Button from '$lib/components/Button.svelte';

	let formData = $state({
		name: '',
		email: '',
		message: ''
	});

	let isSubmitting = $state(false);
	let submitSuccess = $state(false);
	let submitError = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();
		isSubmitting = true;
		submitError = false;
		submitSuccess = false;

		try {
			// TODO: Replace with actual form submission endpoint
			// const response = await fetch('/api/contact', {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify(formData)
			// });

			// Simulate API call for now
			await new Promise((resolve) => setTimeout(resolve, 1000));

			submitSuccess = true;
			formData = { name: '', email: '', message: '' };

			// Reset success message after 5 seconds
			setTimeout(() => {
				submitSuccess = false;
			}, 5000);
		} catch (error) {
			submitError = true;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form class="contact-form" onsubmit={handleSubmit}>
	<div class="form-group">
		<label for="name" class="form-label">Name</label>
		<input
			type="text"
			id="name"
			name="name"
			class="form-input"
			required
			bind:value={formData.name}
			placeholder="Your name"
		/>
	</div>

	<div class="form-group">
		<label for="email" class="form-label">Email</label>
		<input
			type="email"
			id="email"
			name="email"
			class="form-input"
			required
			bind:value={formData.email}
			placeholder="your.email@example.com"
		/>
	</div>

	<div class="form-group">
		<label for="message" class="form-label">Message</label>
		<textarea
			id="message"
			name="message"
			class="form-textarea"
			required
			rows="6"
			bind:value={formData.message}
			placeholder="Your message"
		></textarea>
	</div>

	<p class="form-disclaimer">
		By filling in this form you accept our
		<a href="/privacy-policy" class="form-link">Terms and Policies</a>
	</p>

	{#if submitSuccess}
		<div class="form-message form-success">
			Thank you! Your message has been sent. We'll get back to you shortly.
		</div>
	{/if}

	{#if submitError}
		<div class="form-message form-error">
			Something went wrong. Please try again or contact us directly.
		</div>
	{/if}

	<Button type="submit" className="form-submit" disabled={isSubmitting}>
		{isSubmitting ? 'Submitting...' : 'Submit'}
	</Button>
</form>

<style>
	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 24px;
		width: 100%;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-label {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #160b11;
		letter-spacing: 0.01em;
	}

	.form-input,
	.form-textarea {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		color: #160b11;
		padding: 12px 16px;
		border: 1px solid #d0d0d0;
		border-radius: 8px;
		background-color: #ffffff;
		transition: all 0.3s ease;
		width: 100%;
		box-sizing: border-box;
	}

	.form-input:focus,
	.form-textarea:focus {
		outline: none;
		border-color: #a1846d;
		box-shadow: 0 0 0 3px rgba(161, 132, 109, 0.1);
	}

	.form-input::placeholder,
	.form-textarea::placeholder {
		color: #999;
	}

	.form-textarea {
		resize: vertical;
		min-height: 120px;
		font-family: inherit;
		line-height: 1.5;
	}

	.form-disclaimer {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.875rem;
		color: #666;
		line-height: 1.5;
		margin: 0;
	}

	.form-link {
		color: #160b11;
		text-decoration: underline;
		transition: color 0.3s ease;
	}

	.form-link:hover {
		color: #a1846d;
	}

	.form-message {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 0.875rem;
		padding: 12px 16px;
		border-radius: 8px;
		line-height: 1.5;
	}

	.form-success {
		background-color: #f0f9f0;
		color: #2d5016;
		border: 1px solid #c8e6c8;
	}

	.form-error {
		background-color: #fff5f5;
		color: #8b2635;
		border: 1px solid #ffcccc;
	}

	.form-submit {
		background-color: #a1846d;
		color: #ffffff;
		width: 100%;
		margin-top: 8px;
		font-weight: 500;
	}

	.form-submit:hover:not(:disabled) {
		background-color: #8a6f59;
	}

	.form-submit:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	@media (max-width: 768px) {
		.contact-form {
			gap: 20px;
		}

		.form-submit {
			max-width: 100%;
		}
	}
</style>

