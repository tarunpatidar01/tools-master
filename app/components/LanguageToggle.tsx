'use client';

import { FC } from 'react';

interface LanguageToggleProps {
  currentLanguage?: 'en' | 'hi';
  onChange?: (lang: 'en' | 'hi') => void;
}

const LanguageToggle: FC<LanguageToggleProps> = ({ currentLanguage = 'en', onChange }) => (
  <div className="flex gap-2">
    {(['en', 'hi'] as const).map(lang => (
      <button
        key={lang}
        onClick={() => onChange?.(lang)}
        className={`px-4 py-2 rounded-lg font-semibold transition ${
          currentLanguage === lang
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {lang === 'en' ? 'EN' : 'हिन्दी'}
      </button>
    ))}
  </div>
);

export default LanguageToggle;
