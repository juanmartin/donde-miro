import { Handler } from '@netlify/functions';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const handler: Handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    
    if (!TMDB_API_KEY) {
      console.error('TMDB_API_KEY environment variable is not set');
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'TMDB API key not configured' }),
      };
    }

    const id = event.queryStringParameters?.id;
    
    if (!id) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Movie ID parameter is required' }),
      };
    }

    console.log('Fetching movie details for ID:', id);

    const [detailsResponse, watchProvidersResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`),
      fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`)
    ]);

    if (!detailsResponse.ok || !watchProvidersResponse.ok) {
      console.error('TMDB API error:', detailsResponse.status, watchProvidersResponse.status);
      throw new Error('Failed to fetch movie data from TMDB');
    }

    const [details, watchProviders] = await Promise.all([
      detailsResponse.json(),
      watchProvidersResponse.json()
    ]);

    console.log('Movie details fetched successfully for:', details.title);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ details, watchProviders }),
    };

  } catch (error) {
    console.error('Error in tmdb-movie function:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};