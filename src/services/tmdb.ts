const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

import type { 
  TMDBSearchResult, 
  TMDBMovieDetails, 
  TMDBTVDetails, 
  WatchProvidersResponse,
  SearchResult,
  Content,
  StreamingProvider
} from '../types';

export class TMDBService {
  private static getBaseURL(): string {
    // Use the current domain for production, localhost for development
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:8888'; // Netlify dev server default
  }

  private static async fetchFromFunction(endpoint: string, params: URLSearchParams): Promise<any> {
    const baseURL = this.getBaseURL();
    const url = `${baseURL}/.netlify/functions/${endpoint}?${params.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }
    return response.json();
  }

  static async searchContent(query: string): Promise<SearchResult[]> {
    try {
      const params = new URLSearchParams({ query });
      const data = await this.fetchFromFunction('tmdb-search', params);
      
      return data.results
        .filter((item: TMDBSearchResult) => 
          (item.media_type === 'movie' || item.media_type === 'tv') && 
          item.poster_path
        )
        .slice(0, 10)
        .map((item: TMDBSearchResult) => ({
          id: item.id.toString(),
          title: item.title || item.name || '',
          year: new Date(item.release_date || item.first_air_date || '').getFullYear() || 0,
          type: item.media_type as 'movie' | 'tv',
          poster: `${TMDB_IMAGE_BASE_URL}${item.poster_path}`,
          overview: item.overview
        }));
    } catch (error) {
      console.error('Error searching TMDB:', error);
      throw error;
    }
  }

  static async getMovieDetails(id: string): Promise<Content | null> {
    try {
      const params = new URLSearchParams({ id });
      const { details, watchProviders } = await this.fetchFromFunction('tmdb-movie', params);

      return this.formatMovieContent(details, watchProviders);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  static async getTVDetails(id: string): Promise<Content | null> {
    try {
      const params = new URLSearchParams({ id });
      const { details, watchProviders } = await this.fetchFromFunction('tmdb-tv', params);

      return this.formatTVContent(details, watchProviders);
    } catch (error) {
      console.error('Error fetching TV details:', error);
      throw error;
    }
  }

  private static formatMovieContent(details: TMDBMovieDetails, watchProviders: WatchProvidersResponse): Content {
    return {
      id: details.id.toString(),
      title: details.title,
      year: new Date(details.release_date).getFullYear(),
      type: 'movie',
      poster: `${TMDB_IMAGE_BASE_URL}${details.poster_path}`,
      backdrop: details.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${details.backdrop_path}` : undefined,
      description: details.overview,
      rating: Math.round(details.vote_average * 10) / 10,
      genre: details.genres.map(g => g.name),
      cast: details.credits.cast.slice(0, 5).map(c => c.name),
      runtime: details.runtime,
      streamingProviders: this.formatWatchProviders(watchProviders, details.id, 'movie')
    };
  }

  private static formatTVContent(details: TMDBTVDetails, watchProviders: WatchProvidersResponse): Content {
    return {
      id: details.id.toString(),
      title: details.name,
      year: new Date(details.first_air_date).getFullYear(),
      type: 'tv',
      poster: `${TMDB_IMAGE_BASE_URL}${details.poster_path}`,
      backdrop: details.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${details.backdrop_path}` : undefined,
      description: details.overview,
      rating: Math.round(details.vote_average * 10) / 10,
      genre: details.genres.map(g => g.name),
      cast: details.credits.cast.slice(0, 5).map(c => c.name),
      seasons: details.number_of_seasons,
      streamingProviders: this.formatWatchProviders(watchProviders, details.id, 'tv')
    };
  }

  private static formatWatchProviders(watchProviders: WatchProvidersResponse, contentId: number, type: 'movie' | 'tv'): Record<string, StreamingProvider[]> {
    const formatted: Record<string, StreamingProvider[]> = {};

    Object.entries(watchProviders.results).forEach(([countryCode, providers]) => {
      const countryProviders: StreamingProvider[] = [];

      // Add subscription providers
      if (providers.flatrate) {
        providers.flatrate.forEach(provider => {
          countryProviders.push({
            name: provider.provider_name,
            type: 'subscription',
            logo: `${TMDB_IMAGE_BASE_URL}${provider.logo_path}`,
            url: this.getProviderURL(provider.provider_name, contentId, type),
            provider_id: provider.provider_id
          });
        });
      }

      // Add rental providers
      if (providers.rent) {
        providers.rent.forEach(provider => {
          countryProviders.push({
            name: provider.provider_name,
            type: 'rent',
            logo: `${TMDB_IMAGE_BASE_URL}${provider.logo_path}`,
            url: this.getProviderURL(provider.provider_name, contentId, type),
            provider_id: provider.provider_id
          });
        });
      }

      // Add purchase providers
      if (providers.buy) {
        providers.buy.forEach(provider => {
          countryProviders.push({
            name: provider.provider_name,
            type: 'buy',
            logo: `${TMDB_IMAGE_BASE_URL}${provider.logo_path}`,
            url: this.getProviderURL(provider.provider_name, contentId, type),
            provider_id: provider.provider_id
          });
        });
      }

      // Add ad-supported providers
      if (providers.ads) {
        providers.ads.forEach(provider => {
          countryProviders.push({
            name: provider.provider_name,
            type: 'ads',
            logo: `${TMDB_IMAGE_BASE_URL}${provider.logo_path}`,
            url: this.getProviderURL(provider.provider_name, contentId, type),
            provider_id: provider.provider_id
          });
        });
      }

      // Add free providers
      if (providers.free) {
        providers.free.forEach(provider => {
          countryProviders.push({
            name: provider.provider_name,
            type: 'free',
            logo: `${TMDB_IMAGE_BASE_URL}${provider.logo_path}`,
            url: this.getProviderURL(provider.provider_name, contentId, type),
            provider_id: provider.provider_id
          });
        });
      }

      if (countryProviders.length > 0) {
        formatted[countryCode] = countryProviders;
      }
    });

    return formatted;
  }

  private static getProviderURL(providerName: string, contentId: number, type: 'movie' | 'tv'): string {
    // Map provider names to their direct URLs when possible
    const providerURLs: Record<string, string> = {
      'Netflix': 'https://www.netflix.com',
      'Amazon Prime Video': 'https://www.amazon.com/gp/video',
      'Disney Plus': 'https://www.disneyplus.com',
      'Hulu': 'https://www.hulu.com',
      'HBO Max': 'https://www.hbomax.com',
      'Apple TV Plus': 'https://tv.apple.com',
      'Paramount Plus': 'https://www.paramountplus.com',
      'Peacock': 'https://www.peacocktv.com',
      'Crunchyroll': 'https://www.crunchyroll.com',
      'YouTube': `https://www.youtube.com/results?search_query=${type}+${contentId}`,
      'Google Play Movies & TV': 'https://play.google.com/store/movies',
      'Vudu': 'https://www.vudu.com',
      'Microsoft Store': 'https://www.microsoft.com/en-us/store/movies-and-tv',
      'iTunes': 'https://tv.apple.com'
    };

    return providerURLs[providerName] || '#';
  }
}