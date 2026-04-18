import tools from '@/data/tools.json';

const sortBySearches = (arr: typeof tools) => arr.sort((a, b) => b.monthlySearches - a.monthlySearches);

export const getToolBySlug = (slug: string) => tools.find(tool => tool.slug === slug);

export const getAllTools = () => sortBySearches([...tools]);

export const getToolsByCategory = (category: string) => 
  sortBySearches(tools.filter(tool => tool.category === category));

export const searchTools = (query: string) => {
  const searchTerm = query.toLowerCase();
  return sortBySearches(tools.filter(tool => 
    tool.keyword.toLowerCase().includes(searchTerm) || 
    tool.hindi.toLowerCase().includes(searchTerm)
  ));
};

export const getCategories = () =>
  Array.from(new Set(tools.map(tool => tool.category))).sort();

export const getRelatedTools = (slug: string, limit = 6) => {
  const current = tools.find(t => t.slug === slug);
  if (!current) return [];
  return sortBySearches(tools.filter(t => t.slug !== slug && t.category === current.category))
    .slice(0, limit);
};
