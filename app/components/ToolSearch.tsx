'use client';

import { useState } from 'react';
import { searchTools } from '@/lib/seo';

interface ToolSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolSearch({ isOpen, onClose }: ToolSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    setResults(q.trim().length > 0 ? searchTools(q) : []);
  };

  const handleSelect = (slug: string) => {
    window.location.href = `/tools/${slug}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 bg-white rounded-lg shadow-xl z-50" onClick={e => e.stopPropagation()}>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search tools..."
            value={query}
            onChange={handleSearch}
            autoFocus
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {results.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleSelect(tool.slug)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 transition"
              >
                <div className="font-semibold text-gray-900">{tool.keyword}</div>
                <div className="text-sm text-gray-600">{tool.monthlySearches.toLocaleString()} searches/month</div>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No tools found matching "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
