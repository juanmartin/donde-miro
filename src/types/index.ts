export interface Region {
  code: string;
  name: string;
  flag: string;
}

export interface SearchResult {
  id: string;
  title: string;
  year: number;
  type: 'movie' | 'tv';
  poster: string;
  overview?: string;
}

export interface StreamingProvider {
  name: string;
  type: 'subscription' | 'rent' | 'buy' | 'free' | 'ads';
  logo: string;
  url: string;
  quality?: string;
  price?: string;
  provider_id: number;
}

export interface Content {
  id: string;
  title: string;
  year: number;
  type: 'movie' | 'tv';
  poster: string;
  backdrop?: string;
  description: string;
  rating: number;
  genre: string[];
  cast: string[];
  runtime?: number;
  seasons?: number;
  streamingProviders: Record<string, StreamingProvider[]>;
}

export interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  overview?: string;
  media_type?: string;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime: number;
  credits: {
    cast: { name: string }[];
  };
}

export interface TMDBTVDetails {
  id: number;
  name: string;
  first_air_date: string;
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  number_of_seasons: number;
  credits: {
    cast: { name: string }[];
  };
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProvidersResponse {
  results: Record<string, {
    link?: string;
    flatrate?: WatchProvider[];
    rent?: WatchProvider[];
    buy?: WatchProvider[];
    ads?: WatchProvider[];
    free?: WatchProvider[];
  }>;
}