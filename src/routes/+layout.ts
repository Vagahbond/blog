import { assertArticleMetaData } from '$lib/articles/articles';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async () => {
  const modules = import.meta.glob(`/src/articles/*.md`) as { [path: string]: App.MdsvexResolver };

  const series: { [key: string]: App.ArticleMetaData[] } = {};

  const articles: Array<App.Article> = [];

  for (const [path, resolver] of Object.entries(modules)) {
    const article = await resolver();

    const metadata = article.metadata as unknown as App.ArticleMetaData;

    assertArticleMetaData(metadata, path);

    const cur_series: string | null = article.metadata?.series;

    if (cur_series) {
      if (series[cur_series]) {
        series[cur_series].push(metadata);
      } else {
        series[cur_series] = [metadata];
      }
    }

    articles.push({
      metadata,
      filename: path,
      url: path.split("/").at(-1) ?? "",
      content: article.default,
      seriesData: cur_series
        ? {
          articles: series[cur_series],
          name: cur_series
        }
        : undefined
    });
  }

  const sorted = articles.sort(
    (a, b) => new Date(a.metadata.date).valueOf() - new Date(b.metadata.date).valueOf()
  );

  return { articles: sorted };
};
