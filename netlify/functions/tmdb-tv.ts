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
        body: JSON.stringify({ error: 'TV show ID parameter is required' }),
      };
    }

    console.log('Fetching TV show details for ID:', id);

    const [detailsResponse, watchProvidersResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`),
      fetch(`https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${TMDB_API_KEY}`)
    ]);

    if (!detailsResponse.ok || !watchProvidersResponse.ok) {
      console.error('TMDB API error:', detailsResponse.status, watchProvidersResponse.status);
      throw new Error('Failed to fetch TV show data from TMDB');
    }

    const [details, watchProviders] = await Promise.all([
      detailsResponse.json(),
      watchProvidersResponse.json()
    ]);

    console.log('TV show details fetched successfully for:', details.name);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ details, watchProviders }),
    };

  } catch (error) {
    console.error('Error in tmdb-tv function:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};