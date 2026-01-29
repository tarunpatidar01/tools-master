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
