import React from 'react';
import { Languages } from 'lucide-react';
import type { Language } from '../hooks/useLanguage';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-200"
      title={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
    >
      <Languages className="w-4 h-4" />
      <span className="font-medium">
        {language === 'es' ? 'ES' : 'EN'}
      </span>
    </button>
  );
};