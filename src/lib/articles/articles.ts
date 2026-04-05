import fs from 'fs'
import { compile } from 'mdsvex';


export const slugFromPath = (path: string) =>
  path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

export async function getArticlesData(): Promise<Array<App.BlogPost | null>> {
  const articles = fs.readdirSync("src/lib/articles").filter(f => f.endsWith(".md")).map(f => fs.readFileSync(`src/lib/articles/${f}`).toString());

  const compiled = await Promise.all(articles.map(a => compile(a)));

  return compiled.map(c => c?.data?.fm as App.BlogPost)

}

export async function getArticleSeries(series: string): Promise<App.SeriesInfo> {
  const articles = await getArticlesData();

  const nb = articles.filter(a => a?.series === series).length

  return { len: nb, name: series }
}

export async function getSingleArticle(name: string): Promise<any> {
  const article = fs.readFileSync(`src/lib/articles/${name}`)?.toString();

  if (!article) {
    throw `Article ${name} does not exist !`
  }

  return await compile(article)
}
