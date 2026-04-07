import { assertArticleMetaData, getArticles } from '$lib/articles/articles';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async () => {
  return { articles: await getArticles() };
};
