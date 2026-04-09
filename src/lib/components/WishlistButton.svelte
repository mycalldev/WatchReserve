<script>
	import { wishlist } from '$lib/stores/wishlist.svelte.js';

	let { product } = $props();

	let popping = $state(false);

	const saved = $derived(wishlist.isInWishlist(product.id));

	function handleClick(e) {
		e.preventDefault();
		e.stopPropagation();
		wishlist.toggle(product);
		popping = true;
		setTimeout(() => (popping = false), 320);
	}
</script>

<button
	class="wishlist-btn"
	class:saved
	class:popping
	onclick={handleClick}
	aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
	title={saved ? 'Saved to wishlist' : 'Add to wishlist'}
	type="button"
>
	<svg
		width="15"
		height="15"
		viewBox="0 0 24 24"
		fill={saved ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
	</svg>
</button>

<style>
	.wishlist-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 3;
		width: 32px;
		height: 32px;
		background-color: rgba(255, 255, 255, 0.88);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(22, 11, 17, 0.1);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(22, 11, 17, 0.28);
		transition:
			color 0.2s ease,
			background-color 0.2s ease,
			transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
			border-color 0.2s ease,
			box-shadow 0.2s ease;
		flex-shrink: 0;
	}

	.wishlist-btn:hover {
		background-color: rgba(255, 255, 255, 0.98);
		color: #a1846d;
		border-color: rgba(161, 132, 109, 0.35);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.wishlist-btn.saved {
		color: #a1846d;
		border-color: rgba(161, 132, 109, 0.35);
		background-color: rgba(255, 255, 255, 0.96);
	}

	.wishlist-btn.saved:hover {
		color: #c94040;
		border-color: rgba(201, 64, 64, 0.3);
	}

	.wishlist-btn.popping {
		transform: scale(1.3);
	}
</style>
