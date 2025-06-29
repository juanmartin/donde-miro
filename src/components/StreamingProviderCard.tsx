import React from 'react';
import { ExternalLink, Play, CreditCard, Gift, Tv } from 'lucide-react';
import type { StreamingProvider } from '../types';

interface StreamingProviderCardProps {
  provider: StreamingProvider;
  contentTitle: string;
}

export const StreamingProviderCard: React.FC<StreamingProviderCardProps> = ({
  provider,
  contentTitle
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <Play className="w-4 h-4" />;
      case 'rent':
      case 'buy':
        return <CreditCard className="w-4 h-4" />;
      case 'free':
        return <Gift className="w-4 h-4" />;
      case 'ads':
        return <Tv className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'bg-blue-600/20 text-blue-300 border-blue-500/30';
      case 'rent':
        return 'bg-orange-600/20 text-orange-300 border-orange-500/30';
      case 'buy':
        return 'bg-green-600/20 text-green-300 border-green-500/30';
      case 'free':
        return 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30';
      case 'ads':
        return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-purple-600/20 text-purple-300 border-purple-500/30';
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'Watch Now';
      case 'rent':
        return provider.price ? `Rent ${provider.price}` : 'Rent';
      case 'buy':
        return provider.price ? `Buy ${provider.price}` : 'Buy';
      case 'free':
        return 'Watch Free';
      case 'ads':
        return 'Watch with Ads';
      default:
        return 'Watch';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'Subscription';
      case 'rent':
        return 'Rental';
      case 'buy':
        return 'Purchase';
      case 'free':
        return 'Free';
      case 'ads':
        return 'Ad-supported';
      default:
        return type;
    }
  };

  return (
    <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-200 hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
            {provider.logo ? (
              <img 
                src={provider.logo} 
                alt={provider.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`text-xs font-bold text-white text-center leading-tight ${provider.logo ? 'hidden' : ''}`}>
              {provider.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{provider.name}</h3>
            {provider.quality && (
              <p className="text-slate-400 text-sm">{provider.quality} Quality</p>
            )}
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getTypeColor(provider.type)}`}>
          {getTypeIcon(provider.type)}
          <span>{getTypeLabel(provider.type)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {provider.price && (
          <div className="text-2xl font-bold text-white">
            {provider.price}
          </div>
        )}
        
        <a
          href={provider.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 group-hover:shadow-lg"
        >
          <span>{getActionText(provider.type)}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
        
        <p className="text-xs text-slate-400 text-center">
          Opens {provider.name} in new tab
        </p>
      </div>
    </div>
  );
};