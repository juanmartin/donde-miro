import React from 'react';
import { X, Calendar, Film, Tv } from 'lucide-react';
import type { SearchResult } from '../types';

interface DisambiguationModalProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  onClose: () => void;
}

export const DisambiguationModal: React.FC<DisambiguationModalProps> = ({
  results,
  onSelect,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Multiple Results Found</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Results */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          <p className="text-slate-300 mb-6">
            We found multiple matches. Please select the one you're looking for:
          </p>
          
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => onSelect(result)}
              className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-4">
                <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                  <img
                    src={result.poster}
                    alt={result.title}
                    className="w-16 h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2 p-1 bg-black/50 rounded">
                    {result.type === 'movie' ? (
                      <Film className="w-3 h-3 text-white" />
                    ) : (
                      <Tv className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {result.title}
                  </h3>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{result.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {result.type === 'movie' ? (
                        <>
                          <Film className="w-4 h-4" />
                          <span>Movie</span>
                        </>
                      ) : (
                        <>
                          <Tv className="w-4 h-4" />
                          <span>TV Series</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};