'use client';

import { useState } from 'react';
import { getAllTools, getCategories } from '@/lib/seo';

export default function Sidebar() {
  const tools = getAllTools();
  const categories = getCategories();
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const groupedTools = categories.reduce((acc, cat) => {
    acc[cat] = tools.filter(t => t.category === cat);
    return acc;
  }, {} as Record<string, any[]>);

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      newSet.has(cat) ? newSet.delete(cat) : newSet.add(cat);
      return newSet;
    });
  };

  return (
    <aside className="bg-gray-900 text-gray-100 h-full min-h-screen flex flex-col sticky top-16">
      <div className="p-4 border-b border-gray-700">
        <h2 className="font-bold text-lg text-white">Tools</h2>
        <p className="text-xs text-gray-400 mt-1">{tools.length} Calculators</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {categories.map(category => {
          const isCollapsed = collapsedCategories.has(category);
          const categoryTools = groupedTools[category] || [];
          
          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full text-left px-3 py-2 rounded font-semibold text-sm transition ${
                  isCollapsed
                    ? 'hover:bg-gray-800'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <span className="flex justify-between items-center">
                  {category}
                  <span className="text-xs">{categoryTools.length}</span>
                </span>
              </button>

              {!isCollapsed && (
                <div className="ml-2 space-y-1 mt-2">
                  {categoryTools.map(tool => (
                    <a
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="w-full text-left px-3 py-2 rounded text-sm transition break-words text-gray-300 hover:bg-gray-800 block"
                      title={tool.keyword}
                    >
                      {tool.keyword}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 p-4 text-xs text-gray-400 text-center">
        <p>Updated 2026</p>
      </div>
    </aside>
  );
}
