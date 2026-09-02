/**
 * Client-safe tool index.
 *
 * Imports data/tools-meta.json (~11 KB) instead of data/tools.json (~176 KB),
 * so client components can list/search tools without shipping every tool's
 * long-form article body to the browser. Regenerate with
 * `node scripts/generate-tools-meta.mjs` (runs automatically on `npm run build`).
 *
 * Server code that needs section/FAQ content should use `lib/seo.ts` instead.
 */
import toolsMeta from '@/data/tools-meta.json';

export interface ToolMeta {
  id: number;
  slug: string;
  keyword: string;
  hindi: string;
  category: string;
  title: string;
  description: string;
  monthlySearches: number;
}

const tools = toolsMeta as ToolMeta[];

const sortBySearches = (arr: ToolMeta[]) => arr.sort((a, b) => b.monthlySearches - a.monthlySearches);

export const getAllToolsMeta = () => sortBySearches([...tools]);

export const getToolMetaBySlug = (slug: string) => tools.find((tool) => tool.slug === slug);

export const getMetaCategories = () =>
  Array.from(new Set(tools.map((tool) => tool.category))).sort();

export const getToolsMetaByCategory = (category: string) =>
  sortBySearches(tools.filter((tool) => tool.category === category));

export const searchToolsMeta = (query: string) => {
  const searchTerm = query.trim().toLowerCase();
  if (!searchTerm) return [];
  return sortBySearches(
    tools.filter(
      (tool) =>
        tool.keyword.toLowerCase().includes(searchTerm) ||
        tool.hindi.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm) ||
        tool.slug.includes(searchTerm)
    )
  );
};
