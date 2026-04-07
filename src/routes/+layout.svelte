<script lang="ts">
	import { setArticlesContext } from '$lib/articles/articles.js';
	import Grass from '$lib/grass/grass.svelte';
	import './archie.css';
	import './style.css';

	let { data, children } = $props();
</script>

<div class="content">
	<header>
		<div class="main">
			<img src="/Touches-grasses-logo.png" alt="logo" class="logo" />
			<a href="/">Touches Grasses</a>
		</div>
		<nav>
			<a href="/articles">Articles</a>
		</nav>
	</header>
	<main>
		{@render children()}
	</main>
	<footer>
		<div style="display:flex">
			<a class="soc" href="https://www.instagram.com/touchesgrasses/" rel="me" title="Instagram">
				<img
					alt="Instagram"
					height="24"
					width="24"
					src="https://unpkg.com/simple-icons@v16/icons/instagram.svg"
				/>
				<img
					alt="TikTok"
					height="24"
					width="24"
					src="https://unpkg.com/simple-icons@v16/icons/tiktok.svg"
				/>
			</a>
		</div>
		<div class="footer-info">&nbsp; © Touches Grasses</div>
	</footer>
</div>
<Grass />

<style>
	.soc {
		background-color: transparent;
	}
</style>
