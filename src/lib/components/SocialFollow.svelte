<script>
	// Social Follow component
</script>

<section class="social-follow-section">
	<div class="social-follow-container">
		<div class="social-follow-text">
			<h2 class="social-follow-heading">Stay updated on new releases</h2>
		</div>
		<div class="social-follow-buttons">
			<a
				href="https://youtube.com/@thewatchreserve"
				target="_blank"
				rel="noopener noreferrer"
				class="social-btn social-btn-youtube"
			>
				Follow Us on Youtube
			</a>
			<a
				href="https://instagram.com/thewatchreserve"
				target="_blank"
				rel="noopener noreferrer"
				class="social-btn social-btn-instagram"
			>
				Follow Us on Instagram
			</a>
		</div>
	</div>
</section>

<style>
	.social-follow-section {
		width: 100%;
		background-color: #422635;
		padding: 60px 40px;
		margin: 0;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	.social-follow-container {
		max-width: 1400px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 40px;
		box-sizing: border-box;
	}

	.social-follow-text {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.social-follow-heading {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		font-weight: 400;
		color: #e5e5e5;
		margin: 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	.social-follow-buttons {
		display: flex;
		flex-direction: row;
		gap: 16px;
		flex-shrink: 0;
	}

	.social-btn {
		display: inline-block;
		padding: 14px 32px;
		border-radius: 8px;
		text-decoration: none;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		text-align: center;
		transition: all 0.3s ease;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.social-btn-youtube {
		background-color: #a1846d;
		color: #ffffff;
	}

	.social-btn-youtube:hover {
		background-color: #8a6f59;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.social-btn-instagram {
		background-color: #e5e5e5;
		color: #160b11;
	}

	.social-btn-instagram:hover {
		background-color: #d0d0d0;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	@media (max-width: 1024px) {
		.social-follow-section {
			padding: 50px 30px;
		}

		.social-follow-container {
			gap: 30px;
		}
	}

	@media (max-width: 768px) {
		.social-follow-section {
			padding: 40px 20px;
		}

		.social-follow-container {
			flex-direction: column;
			align-items: center;
			gap: 30px;
		}

		.social-follow-text {
			width: 100%;
			text-align: center;
		}

		.social-follow-buttons {
			width: 100%;
			flex-direction: row;
			justify-content: center;
			flex-wrap: wrap;
			gap: 12px;
		}

		.social-btn {
			flex: 1;
			min-width: 0;
			padding: 12px 20px;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.social-follow-section {
			padding: 35px 15px;
		}

		.social-follow-heading {
			font-size: 1.5rem;
		}

		.social-follow-buttons {
			gap: 10px;
		}

		.social-btn {
			padding: 12px 16px;
			font-size: 0.85rem;
			flex: 1;
			min-width: 140px;
		}
	}
</style>

