const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async (request: Request) => {
  // Handle preflight requests
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
    const query = url.searchParams.get('query');
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Searching TMDB for:', query);

    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );

    if (!tmdbResponse.ok) {
      console.error('TMDB API error:', tmdbResponse.status, tmdbResponse.statusText);
      throw new Error(`TMDB API error: ${tmdbResponse.statusText}`);
    }

    const data = await tmdbResponse.json();
    console.log('TMDB search results:', data.results?.length || 0, 'items');
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in tmdb-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};