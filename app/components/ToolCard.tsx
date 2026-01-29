// app/components/ToolCard.tsx
'use client'

import React from 'react';

interface ToolCardProps {
  id: number;
  keyword: string;
  category: string;
  monthlySearches: number;
  onClick: () => void;
}

export default function ToolCard({ keyword, category, monthlySearches, onClick }: ToolCardProps) {
  const categoryColors = {
    Loan: 'from-blue-500 to-blue-600',
    Bank: 'from-green-500 to-green-600',
    Vehicle: 'from-orange-500 to-orange-600',
  };

  const bgColor = categoryColors[category as keyof typeof categoryColors] || 'from-gray-500 to-gray-600';

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-lg shadow hover:shadow-lg transition group"
    >
      <div className={`bg-gradient-to-r ${bgColor} h-24 relative`}>
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition" />
        <div className="p-4 text-white relative z-10">
          <p className="text-xs font-semibold opacity-90">{category}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition break-words">
          {keyword}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          <span className="font-semibold text-gray-900">
            {(monthlySearches / 1000).toFixed(0)}K
          </span>
          {' '}searches/month
        </p>
      </div>
    </button>
  );
}
