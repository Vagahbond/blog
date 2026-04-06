// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {

    interface MdsvexFile {
      default: import('svelte/internal').SvelteComponent;
      metadata: Record<string, string>;
    }

    type MdsvexResolver = () => Promise<MdsvexFile>;

    interface ArticleMetaData {
      title: string,
      date: Date,
      draft: boolean,
      tldr: string,
      series?: string,
      index?: number
    }

    interface SeriesData {
      name: string,
      articles: Array<ArticleMetaData>
    }

    interface Article {
      filename: string,
      url: string,
      metadata: ArticleMetaData,
      seriesData?: SeriesData,
      content?: any,

    }


    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
