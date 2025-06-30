import { useState, useEffect } from 'react';

export type Language = 'es' | 'en';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('donde-miro-language');
    if (saved && (saved === 'es' || saved === 'en')) {
      return saved as Language;
    }
    
    // Detect from browser locale
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) {
      return 'es';
    }
    
    // Default to English for other languages
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('donde-miro-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  return { language, setLanguage, toggleLanguage };
};