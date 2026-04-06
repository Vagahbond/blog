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
//
// export async function getArticlesData(): Promise<Array<App.BlogPost | null>> {
//   const articles = fs.readdirSync("src/lib/articles").filter(f => f.endsWith(".md")).map(f => fs.readFileSync(`src/lib/articles/${f}`).toString());
//
//   const compiled = await Promise.all(articles.map(a => compile(a)));
//
//   return compiled.map(c => c?.data?.fm as App.BlogPost)
//
// }
//
// export async function getArticleSeries(series: string): Promise<App.SeriesInfo> {
//   const articles = await getArticlesData();
//
//   const nb = articles.filter(a => a?.series === series).length
//
//   return { len: nb, name: series }
// }
//
// export async function getSingleArticle(name: string): Promise<any> {
//   const article = fs.readFileSync(`src/lib/articles/${name}`)?.toString();
//
//   if (!article) {
//     throw `Article ${name} does not exist !`
//
//
//     return await compile(article)
//   }

// export async function getArticles(): Promise<App.Article[]> {
//
//   const articles = fs.readdirSync("src/lib/articles").filter(f => f.endsWith(".md")).map(f => fs.readFileSync(`src/lib/articles/${f}`).toString());
//
//   const compiled = await Promise.all(articles.map(a => compile(a)));
//
//   const series: { [key: string]: App.ArticleMetaData[] } = {};
//
//   compiled.forEach(a => {
//     const cur_series: string | null = (a?.data?.fm as App.ArticleMetaData).series
//     if (!cur_series) return;
//
//     if (series[cur_series]) {
//       series[cur_series].push(a?.data?.fm as App.ArticleMetaData)
//     } else {
//       series[cur_series] = [a?.data?.fm as App.ArticleMetaData];
//
//     }
//   }
//   )
//
//   return compiled.map(a => {
//     return {
//       metadata: a?.data?.fm as App.ArticleMetaData,
//       content: a?.data,
//       seriesData: {
//         articles: series[(a?.data?.fn as App.ArticleMetaData).series],
//         name: (a?.data?.fn as App.ArticleMetaData).series
//       }
//
//     }
//
//   })
//     .sort((a, b) => new Date(b.metadata.date).getSeconds() - new Date(a.metadata.date).getSeconds())
//
// }

export const [getArticlesContext, setArticlesContext] = createContext<App.Article[]>();
