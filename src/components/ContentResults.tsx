import React from 'react';
import { Calendar, Star, Users, Film, Tv, ArrowLeft, Clock, Layers } from 'lucide-react';
import { StreamingProviderCard } from './StreamingProviderCard';
import { t } from '../utils/translations';
import type { Content, Region } from '../types';
import type { Language } from '../hooks/useLanguage';

interface ContentResultsProps {
  content: Content;
  region: Region;
  onNewSearch: () => void;
  language: Language;
}

export const ContentResults: React.FC<ContentResultsProps> = ({
  content,
  region,
  onNewSearch,
  language
}) => {
  const providers = content.streamingProviders[region.code] || [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onNewSearch}
        className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors duration-200 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>{t('searchSomethingElse', language)}</span>
      </button>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
        {/* Content Header */}
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={content.poster}
                  alt={content.title}
                  className="w-64 h-96 object-cover rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 p-2 bg-black/70 rounded-lg">
                  {content.type === 'movie' ? (
                    <Film className="w-5 h-5 text-white" />
                  ) : (
                    <Tv className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
            </div>

            {/* Content Info */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-3">{content.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-300 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{content.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold">{content.rating}/10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {content.type === 'movie' ? (
                      <>
                        <Film className="w-4 h-4" />
                        <span>{t('movie', language)}</span>
                      </>
                    ) : (
                      <>
                        <Tv className="w-4 h-4" />
                        <span>{t('tvSeries', language)}</span>
                      </>
                    )}
                  </div>
                  {content.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{content.runtime} min</span>
                    </div>
                  )}
                  {content.seasons && (
                    <div className="flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      <span>
                        {content.seasons} {content.seasons === 1 ? t('season', language) : t('seasons', language)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {content.genre.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm border border-purple-500/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                {content.description}
              </p>

              {/* Cast */}
              {content.cast.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-300" />
                    {t('cast', language)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {content.cast.map((actor, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm border border-white/20"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Streaming Providers Section */}
        <div className="border-t border-white/20 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('whereToWatch', language)} {region.flag} {region.name}
            </h2>
            <p className="text-slate-300">
              {t('availableOn', language)} {providers.length} {providers.length === 1 ? t('platform', language) : t('platforms', language)}
            </p>
          </div>

          {providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider, index) => (
                <StreamingProviderCard 
                  key={`${provider.provider_id}-${provider.type}-${index}`} 
                  provider={provider}
                  contentTitle={content.title}
                  language={language}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('notAvailable', language)} {region.name}
              </h3>
              <p className="text-slate-300 mb-4">
                {t('notAvailableDesc', language)}
              </p>
              <p className="text-sm text-slate-400">
                {t('tryDifferentRegion', language)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};