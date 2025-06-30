const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
    
    if (!TMDB_API_KEY) {
      console.error('TMDB_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'TMDB API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'TV show ID parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
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

    return new Response(JSON.stringify({ details, watchProviders }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in tmdb-tv function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};