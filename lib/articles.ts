import articles from '@/data/articles.json';

export type ArticleSection = {
  heading: string;
  content: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  keywords: string[];
  relatedTools: string[];
  sections: ArticleSection[];
};

export const getAllArticles = (): Article[] =>
  [...(articles as Article[])].sort((a, b) =>
    (b.updatedAt || b.publishedAt).localeCompare(a.updatedAt || a.publishedAt)
  );

export const getArticleBySlug = (slug: string): Article | undefined =>
  (articles as Article[]).find((a) => a.slug === slug);
