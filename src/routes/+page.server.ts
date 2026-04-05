import type { PageServerLoad } from "./$types";
import { getArticlesData } from "$lib/articles/articles";

export const load: PageServerLoad = async () => {
  const articles = await getArticlesData();

  return {
    article: articles.filter(a => a?.date && !a.draft)
      .sort((a, b) => new Date(b!.date).getSeconds() - new Date(a!.date).getSeconds())
      .pop()
  };
};
