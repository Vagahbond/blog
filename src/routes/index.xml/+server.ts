import { getArticles } from "$lib/articles/articles";
import { readFile } from "fs/promises";
import { create } from 'xmlbuilder2';

const BLOG_URL = "https://touches-grasses.fr"
const BLOG_TITLE = "Touches Grasses"
const BLOG_AUTHOR = "Nicolas Zogueur"
const BLOG_AUTHOR_EMAIL = "contact@touches-grasses.fr"
const BLOG_COPYRIGHT = "© Touches Grasses"
const BLOG_DESCRIPTION = `
  Contenu recent sur Touches Grasses.
`;

export const prerender = true;

export async function GET() {
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml'
  };
  return new Response(await getRssXml(), { headers });
}

// prettier-ignore
async function getRssXml(): Promise<string> {
  const allPosts = await getArticles();
  const rssPosts = allPosts.slice(0, 10);
  const rssUrl = `${BLOG_URL}/rss.xml`;
  const root = create({ version: '1.0', encoding: 'utf-8' })
    .ele('rss', {
      version: "2.0"
    })
    .ele('channel')
    .ele('title').txt(BLOG_TITLE).up()
    .ele('link').txt(BLOG_URL).up()
    .ele('description').txt(BLOG_DESCRIPTION).up()
    .ele('generator').txt("HOUSEMADE").up()
    .ele('language').txt("fr").up()
    .ele('updated').txt(new Date().toISOString()).up()
    .ele('copyright').txt(BLOG_COPYRIGHT).up()
    .ele('atom', 'atom:link', { href: `${BLOG_URL}/index.xml`, rel: 'self', type: 'application/rss+xml' }).up()
    .ele('author')
    .ele('name').txt(BLOG_AUTHOR).up()
    .ele('email').txt(BLOG_AUTHOR_EMAIL).up()
    .up()

  for await (const post of rssPosts) {
    const pubDate = post.metadata.date;
    const postUrl = `${BLOG_URL}/articles/${post.url}`;
    const summary = post.metadata.tldr;

    root.ele('item')
      .ele('title').txt(post.metadata.title).up()
      .ele('link').txt(postUrl).up()
      .ele('pubDate').txt(pubDate).up()
      .ele('guid').txt(postUrl).up()
      .ele('desciption').txt(summary).up()
      .up();
  }

  return root.end()
}


