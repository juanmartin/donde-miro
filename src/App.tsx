import React, { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { DisambiguationModal } from './components/DisambiguationModal';
import { ContentResults } from './components/ContentResults';
import { RegionSelector } from './components/RegionSelector';
import { LanguageToggle } from './components/LanguageToggle';
import { Tv, Sparkles } from 'lucide-react';
import { TMDBService } from './services/tmdb';
import { ALL_REGIONS } from './data/regions';
import { useLanguage } from './hooks/useLanguage';
import { t } from './utils/translations';
import type { Content, SearchResult, Region } from './types';

function App() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showDisambiguation, setShowDisambiguation] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region>(ALL_REGIONS[0]); // Default to US
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language, toggleLanguage } = useLanguage();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await TMDBService.searchContent(query);
      
      if (results.length === 0) {
        setError(t('noResults', language));
        setSearchResults([]);
      } else if (results.length === 1) {
        // If only one result, fetch details immediately
        await handleContentSelect(results[0]);
      } else {
        // Multiple results, show disambiguation
        setSearchResults(results);
        setShowDisambiguation(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(t('searchError', language));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentSelect = async (result: SearchResult) => {
    setShowDisambiguation(false);
    setIsLoading(true);
    setError(null);
    
    try {
      let content: Content | null = null;
      
      if (result.type === 'movie') {
        content = await TMDBService.getMovieDetails(result.id);
      } else {
        content = await TMDBService.getTVDetails(result.id);
      }
      
      if (content) {
        setSelectedContent(content);
      } else {
        setError(t('detailsError', language));
      }
    } catch (error) {
      console.error('Content details error:', error);
      setError(t('detailsError', language));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
  };

  const handleNewSearch = () => {
    setSelectedContent(null);
    setSearchResults([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 32 32%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern id=%22pattern%22 patternUnits=%22userSpaceOnUse%22 width=%2232%22 height=%2232%22%3E%3Ccircle cx=%2216%22 cy=%2216%22 r=%221%22 fill=%22%23ffffff08%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22url(%23pattern)%22/%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/20">
              <Tv className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {t('appName', language)}
            </h1>
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
            {t('tagline', language)}
          </p>
          
          {/* Language Toggle */}
          <div className="flex justify-center">
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          </div>
        </div>

        {/* Region Selector */}
        <div className="mb-8">
          <RegionSelector 
            selectedRegion={selectedRegion} 
            onRegionChange={handleRegionChange}
            language={language}
          />
        </div>

        {/* Search Form */}
        <div className="mb-12">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} language={language} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Content Results */}
        {selectedContent && (
          <ContentResults 
            content={selectedContent} 
            region={selectedRegion}
            onNewSearch={handleNewSearch}
            language={language}
          />
        )}

        {/* Disambiguation Modal */}
        {showDisambiguation && (
          <DisambiguationModal
            results={searchResults}
            onSelect={handleContentSelect}
            onClose={() => setShowDisambiguation(false)}
            language={language}
          />
        )}
      </div>
    </div>
  );
}

export default App;