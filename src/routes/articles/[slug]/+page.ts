
import { getArticleSeries, slugFromPath } from '$lib/articles/articles';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const modules = import.meta.glob(`/src/articles/*.md`);


  let match: { path?: string; resolver?: App.MdsvexResolver } = {};

  for (const [path, resolver] of Object.entries(modules)) {

    if (slugFromPath(path) === params.slug) {
      match = { path, resolver: resolver as unknown as App.MdsvexResolver };
      break;
    }
  }

  const post = await match?.resolver?.();

  if (!post || post.metadata.draft) {
    throw error(404);
  }

  return {
    component: post.default,
    frontmatter: post.metadata,
    // series: await getArticleSeries(post.metadata.series)
  };
};
