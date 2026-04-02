<script>
	import LuxuryForm from '$lib/components/LuxuryForm.svelte';
</script>

<section class="contact-page">
	<div class="contact-container">
		<div class="contact-info">
			<h1 class="contact-title">
				Contact the <em>Watch Reserve</em> Team
			</h1>
			<p class="contact-intro">
				Whether you're looking to enquire about a specific timepiece, book a viewing, or speak to a
				specialist, we're here to help. Complete the form below and our team will get back to you shortly.
			</p>

			<div class="contact-details">
				<div class="contact-detail-item">
					<svg
						class="contact-icon"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<polyline
							points="22,6 12,13 2,6"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<a href="mailto:info@thewatchreserve.co.uk" class="contact-link"
						>info@thewatchreserve.co.uk</a
					>
				</div>

				<div class="contact-detail-item">
					<svg
						class="contact-icon"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9841 21.5573 21.2126 21.3518 21.4012C21.1463 21.5898 20.9033 21.7345 20.6371 21.8261C20.3709 21.9178 20.0872 21.9544 19.805 21.9339C16.7426 21.6542 13.7869 20.6406 11.19 19C8.32982 17.1786 6.10219 14.6024 4.74002 11.59C3.10602 7.97997 2.40502 3.98997 2.80502 0.0199746C2.7846 -0.262218 2.82126 -0.545887 2.91289 -0.812052C3.00453 -1.07822 3.14916 -1.32119 3.33775 -1.52667C3.52633 -1.73215 3.75484 -1.89572 4.00978 -2.00729C4.26472 -2.11886 4.54045 -2.17588 4.81902 -2.17497H7.81902C8.56302 -2.12097 9.25702 -1.72097 9.68702 -1.08497L11.287 1.41497C11.8559 2.48997 11.753 3.79997 11.019 4.75997L9.81902 6.33997C9.63502 6.57097 9.56702 6.87497 9.63502 7.16497C9.70302 7.45497 9.89902 7.69997 10.179 7.83997C12.179 8.83997 14.179 10.84 15.179 12.84C15.319 13.12 15.564 13.316 15.854 13.384C16.144 13.452 16.448 13.384 16.679 13.2L18.259 12C19.219 11.266 20.529 11.163 21.604 11.732L24.084 13.332C24.72 13.762 25.12 14.456 25.174 15.2V18.2C25.175 18.4785 25.118 18.7542 25.0065 19.0092C24.8949 19.2641 24.7313 19.4926 24.5258 19.6812C24.3203 19.8698 24.0773 20.0145 23.8111 20.1061C23.5449 20.1978 23.2612 20.2344 22.979 20.2139Z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<a href="tel:+447850250984" class="contact-link">0208 150 1987</a>
				</div>

				<div class="contact-detail-item">
					<svg
						class="contact-icon"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<circle
							cx="12"
							cy="10"
							r="3"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span class="contact-text">25 Cabot Square, Canary Wharf, London E14 4QA</span>
				</div>
			</div>
		</div>

		<div class="contact-form-wrapper">
			<LuxuryForm />
		</div>
	</div>
</section>

<style>
	.contact-page {
		width: 100%;
		background-color: #ffffff;
		padding: 100px 40px;
		min-height: calc(100vh - 200px);
		box-sizing: border-box;
	}

	.contact-container {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: start;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.contact-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 400;
		color: #160b11;
		margin: 0;
		line-height: 1.2;
		letter-spacing: -0.03em;
	}

	.contact-title em {
		font-style: italic;
		font-weight: 400;
	}

	.contact-intro {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1rem, 1.2vw, 1.125rem);
		line-height: 1.7;
		color: #4a4a4a;
		margin: 0;
		font-weight: 400;
	}

	.contact-details {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 8px;
	}

	.contact-detail-item {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.contact-icon {
		flex-shrink: 0;
		color: #160b11;
		width: 20px;
		height: 20px;
	}

	.contact-link,
	.contact-text {
		font-family: 'Montserrat', sans-serif;
		font-size: 1rem;
		color: #160b11;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.contact-link:hover {
		color: #a1846d;
	}

	.contact-form-wrapper {
		width: 100%;
	}

	@media (max-width: 968px) {
		.contact-container {
			grid-template-columns: 1fr;
			gap: 60px;
		}

		.contact-page {
			padding: 80px 30px;
		}
	}

	@media (max-width: 768px) {
		.contact-page {
			padding: 60px 20px;
		}

		.contact-container {
			gap: 50px;
		}

		.contact-info {
			gap: 24px;
		}

		.contact-details {
			gap: 18px;
		}
	}

	@media (max-width: 480px) {
		.contact-page {
			padding: 40px 15px;
		}

		.contact-container {
			gap: 40px;
		}
	}
</style>


