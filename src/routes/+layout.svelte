<script lang="ts">
	import './archie.css';
	import './style.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
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

	{@render children()}
</div>
