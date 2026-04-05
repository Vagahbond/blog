<script lang="ts">
	type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>;

	const { data } = $props();

	const Comp = $derived(data.component as unknown as C);
	const fm = $derived(data.frontmatter);
	// const series = $derived(data.series);
</script>

<svelte:head>
	<title>{fm.title}</title>
</svelte:head>

<main>
	<article>
		<div class="post-container">
			<!-- Main Content -->
			<div class="post-content">
				<!-- {#if fm.series} -->
				<!-- 	<div class="series"> -->
				<!-- 		<h2> -->
				<!-- 			<strong>Série: {fm.series}</strong> -->
				<!-- 			{fm.series} -->
				<!-- 			{fm.index}/{series.len} -->
				<!-- 		</h2> -->
				<!-- 		{#if Number.parseInt(fm.index) >= 1} -->
				<!-- 			<a href="#">&lt Article précédent</a> -->
				<!-- 		{/if} -->
				<!-- 		{#if Number.parseInt(fm.index) <= 1} -->
				<!-- 			<a href="#"> Article suivant &gt</a> -->
				<!-- 		{/if} -->
				<!-- 	</div> -->
				<!-- {/if} -->

				<br />
				<div class="title">
					<h1 class="title">
						{fm.title}
					</h1>

					<div class="meta">Posted on</div>
				</div>
				<div class="tldr">
					<strong>tl;dr: </strong>{fm.tldr}
				</div>
				<br />
				<section class="body">
					<Comp />
				</section>
				<div class="post-tags"></div>
			</div>
		</div>
	</article>
</main>
