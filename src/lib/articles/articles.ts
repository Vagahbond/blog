import fs from 'fs';
import { compile } from 'mdsvex';
import { createContext } from 'svelte';

export const slugFromPath = (path: string) =>
  path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

export function assertArticleMetaData(
  data: unknown,
  path: string
): asserts data is App.ArticleMetaData {
  if (typeof data !== 'object' || data === null) {
    throw new Error(
      `[${path}] frontmatter must be an object, got ${data === null ? 'null' : typeof data}`
    );
  }

  const d = data as Record<string, unknown>;

  if (typeof d.title !== 'string') {
    throw new Error(`[${path}] frontmatter.title must be a string, got ${typeof d.title}`);
  }
  if (!(d.date instanceof Date) && typeof d.date !== 'string') {
    throw new Error(
      `[${path}] frontmatter.date must be a Date or date string, got ${typeof d.date}`
    );
  }
  if (typeof d.draft !== 'boolean') {
    throw new Error(`[${path}] frontmatter.draft must be a boolean, got ${typeof d.draft}`);
  }
  if (typeof d.tldr !== 'string') {
    throw new Error(`[${path}] frontmatter.tldr must be a string, got ${typeof d.tldr}`);
  }
  if (d.series !== undefined && typeof d.series !== 'string') {
    throw new Error(
      `[${path}] frontmatter.series must be a string if provided, got ${typeof d.series}`
    );
  }
  if (d.index !== undefined && typeof d.index !== 'number') {
    throw new Error(`[${path}] frontmatter.index must be a number, got ${typeof d.index}`);
  }
}

export async function getArticles(): Promise<App.Article[]> {
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

  return articles.sort(
    (a, b) => new Date(a.metadata.date).valueOf() - new Date(b.metadata.date).valueOf()
  );


}

export const [getArticlesContext, setArticlesContext] = createContext<App.Article[]>();
