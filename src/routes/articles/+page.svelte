<script lang="ts">
	import Fuse from 'fuse.js';

	const { data } = $props();

	let search: string = $state('');

	let filtered = $derived.by(() => {
		if (search.length === 0) return data.articles;
		return fuseIndex.search(search).map((a) => a.item);
	});

	let fuseIndex: Fuse<App.Article> = $derived.by(() => {
		return new Fuse(data.articles, {
			keys: ['metadata.title', 'metadata.tldr', 'seriesData.name'],
			threshold: 0.3
		});
	});

	let series: { [series: string]: Array<App.Article> } = $derived.by(() => {
		return filtered
			.filter((a) => a.seriesData)
			.sort(
				(a, b) =>
					new Date(b.metadata.date ?? '').valueOf() - new Date(a.metadata.date ?? '').valueOf()
			)
			.reduce((pr: { [series: string]: Array<App.Article> }, cur) => {
				if (!cur.seriesData?.name) return {};

				if (!pr[cur.seriesData?.name]) {
					pr[cur.seriesData?.name] = [cur];
				} else {
					pr[cur.seriesData?.name].push(cur);
				}

				return pr;
			}, {});
	});

	let loneArticles: Array<App.Article> = $derived.by(() => {
		return filtered
			.filter((a) => !a.seriesData)
			.sort(
				(a, b) =>
					new Date(b.metadata.date ?? '').valueOf() - new Date(a.metadata.date ?? '').valueOf()
			);
	});

	function sortArticlesSeries(articles: Array<App.Article>): Array<App.Article> {
		return articles.sort((a, b) => {
			if (!a.metadata.index || !b.metadata.index)
				throw `Tried to sort a series of articles, in which an article has no series: ${a.metadata.title}`;
			return a.metadata.index - b.metadata.index;
		});
	}

	function formatDate(date: string): string {
		return new Intl.DateTimeFormat('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(date ?? ''));
	}
</script>

<input class="search" type="search" placeholder="Rechercher" bind:value={search} />

<h1 class="title">Séries</h1>

{#each Object.entries(series) as [name, serie] (name)}
	<section class="list-item">
		<h2 class="title">{name}</h2>
		{#each sortArticlesSeries(serie) as article, key (key)}
			{article.metadata.index}. <a href={`/articles/${article.url}`}>{article.metadata.title}</a>
			<time>{formatDate(article.metadata.date)}</time>
			<br />
		{/each}
	</section>
{/each}
<br />
<div class="divider"></div>

<h1 class="title">Articles seuls</h1>

<section class="list-item">
	{#each loneArticles as article, key (key)}
		<h2 class="title">
			<a href={`/articles/${article.url}`}>{article.metadata.title}</a>
		</h2>
		<div class="subtitle">
			{article.metadata.tldr}
			<time>{formatDate(article.metadata.date)}</time>
		</div>
	{/each}
</section>

<style>
	.search {
		width: 100%;
		padding: 0.5rem;
		border: 3px solid var(--color-primary);
		margin: 1rem;
		font-family: DepartureMono;
	}

	.search:focus {
		outline: none;
	}
</style>
