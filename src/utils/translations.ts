export type Language = 'es' | 'en';

export const translations = {
  es: {
    // Header
    appName: 'Donde Miro',
    tagline: 'Descubre dónde ver tus películas y series favoritas en todas las plataformas de streaming',
    
    // Search
    searchPlaceholder: 'Buscar películas, series...',
    searchButton: 'Buscar',
    searching: 'Buscando...',
    
    // Region
    autoDetectLocation: 'Detectar mi ubicación automáticamente',
    detectingLocation: 'Detectando tu ubicación...',
    searchCountries: 'Buscar países...',
    popularRegions: 'Regiones Populares',
    allRegions: 'Todas las Regiones',
    
    // Content types
    movie: 'Película',
    tvSeries: 'Serie de TV',
    season: 'temporada',
    seasons: 'temporadas',
    
    // Content details
    cast: 'Reparto',
    whereToWatch: 'Dónde ver en',
    availableOn: 'Disponible en',
    platform: 'plataforma',
    platforms: 'plataformas',
    notAvailable: 'No Disponible en',
    notAvailableDesc: 'Este contenido no está disponible para streaming en tu región actualmente.',
    tryDifferentRegion: 'Prueba seleccionando una región diferente o vuelve más tarde.',
    
    // Provider types
    subscription: 'Suscripción',
    rental: 'Alquiler',
    purchase: 'Compra',
    free: 'Gratis',
    adSupported: 'Con anuncios',
    
    // Actions
    watchNow: 'Ver Ahora',
    rent: 'Alquilar',
    buy: 'Comprar',
    watchFree: 'Ver Gratis',
    watchWithAds: 'Ver con Anuncios',
    opens: 'Abre',
    inNewTab: 'en nueva pestaña',
    
    // Navigation
    searchSomethingElse: 'Buscar algo más',
    newSearch: 'Nueva búsqueda',
    
    // Disambiguation
    multipleResults: 'Múltiples Resultados Encontrados',
    multipleResultsDesc: 'Encontramos varias coincidencias. Por favor selecciona la que buscas:',
    
    // Errors
    noResults: 'No se encontraron resultados. Prueba con un término de búsqueda diferente.',
    searchError: 'Error al buscar contenido. Por favor intenta de nuevo.',
    detailsError: 'Error al cargar los detalles del contenido. Por favor intenta de nuevo.',
    
    // Quality
    quality: 'Calidad',
    
    // Suggestions
    suggestions: [
      'El Juego del Calamar',
      'La Casa de Papel',
      'Stranger Things',
      'Juego de Tronos',
      'The Mandalorian',
      'Friends',
      'The Crown',
      'Ozark'
    ]
  },
  en: {
    // Header
    appName: 'Donde Miro',
    tagline: 'Discover where to watch your favorite movies and TV shows across all streaming platforms',
    
    // Search
    searchPlaceholder: 'Search for movies, TV shows...',
    searchButton: 'Search',
    searching: 'Searching...',
    
    // Region
    autoDetectLocation: 'Auto-detect my location',
    detectingLocation: 'Detecting your location...',
    searchCountries: 'Search countries...',
    popularRegions: 'Popular Regions',
    allRegions: 'All Regions',
    
    // Content types
    movie: 'Movie',
    tvSeries: 'TV Series',
    season: 'season',
    seasons: 'seasons',
    
    // Content details
    cast: 'Cast',
    whereToWatch: 'Where to Watch in',
    availableOn: 'Available on',
    platform: 'platform',
    platforms: 'platforms',
    notAvailable: 'Not Available in',
    notAvailableDesc: 'This content is not currently available for streaming in your region.',
    tryDifferentRegion: 'Try selecting a different region or check back later.',
    
    // Provider types
    subscription: 'Subscription',
    rental: 'Rental',
    purchase: 'Purchase',
    free: 'Free',
    adSupported: 'Ad-supported',
    
    // Actions
    watchNow: 'Watch Now',
    rent: 'Rent',
    buy: 'Buy',
    watchFree: 'Watch Free',
    watchWithAds: 'Watch with Ads',
    opens: 'Opens',
    inNewTab: 'in new tab',
    
    // Navigation
    searchSomethingElse: 'Search for something else',
    newSearch: 'New search',
    
    // Disambiguation
    multipleResults: 'Multiple Results Found',
    multipleResultsDesc: 'We found multiple matches. Please select the one you\'re looking for:',
    
    // Errors
    noResults: 'No results found. Try a different search term.',
    searchError: 'Failed to search for content. Please try again.',
    detailsError: 'Failed to load content details. Please try again.',
    
    // Quality
    quality: 'Quality',
    
    // Suggestions
    suggestions: [
      'Breaking Bad',
      'The Office',
      'Stranger Things',
      'Game of Thrones',
      'The Mandalorian',
      'Friends',
      'The Crown',
      'Ozark'
    ]
  }
};

export const t = (key: string, lang: Language): string => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};