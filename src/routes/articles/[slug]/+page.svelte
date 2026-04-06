<script lang="ts">
	type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>;

	const { data, params } = $props();

	const mArticle = $derived(data.articles.find((a) => a.url === params.slug));

	const Comp = $derived(mArticle?.content as unknown as C);
	const fm = $derived(mArticle?.metadata);

	const date = $derived(
		new Intl.DateTimeFormat('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(fm?.date ?? ''))
	);

	function getRelatedArticle(index: number): App.Article | undefined {
		return data.articles.find(
			(a) =>
				fm &&
				fm.index &&
				a.metadata.index === fm.index + index &&
				a.seriesData?.name === mArticle?.seriesData?.name
		);
	}
</script>

<svelte:head>
	<title>{fm?.title}</title>
</svelte:head>

<article>
	<div class="post-container">
		<!-- Main Content -->
		<div class="post-content">
			{#if mArticle?.seriesData?.articles && fm?.series}
				<div class="series">
					<h2>
						<strong>Série: {fm?.series}</strong>
						{fm?.index}/{mArticle?.seriesData?.articles.length}
					</h2>
					{#if fm.index && fm.index > 1}
						<a href={`/articles/${getRelatedArticle(-1)?.url}`}>&lt Article précédent</a>
					{/if}
					{#if fm.index && fm.index < mArticle?.seriesData?.articles?.length}
						<a href={`/articles/${getRelatedArticle(+1)?.url}`}> Article suivant &gt</a>
					{/if}
				</div>
			{/if}

			<br />
			<div class="title">
				<h1 class="title">
					{fm?.title}
				</h1>

				<div class="meta">Posted on {date}</div>
			</div>
			<div class="tldr">
				<strong>tl;dr: </strong>
				{fm?.tldr}
			</div>
			<br />
			<section class="body">
				<Comp />
			</section>
			<div class="post-tags"></div>
		</div>
	</div>
</article>
