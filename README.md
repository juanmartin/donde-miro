# StreamFinder

A beautiful web application to discover where to watch your favorite movies and TV shows across all streaming platforms.

## Features

- 🔍 Search for movies and TV shows
- 🌍 Support for all countries and regions
- 📺 Comprehensive streaming provider information
- 🎬 Rich content details with cast, ratings, and descriptions
- 📱 Responsive design with modern UI
- 🔒 Secure API key management with serverless functions

## Setup

### Prerequisites

- Node.js 18+ 
- A TMDB API key (free registration required)

### Getting Your TMDB API Key

1. Go to [TMDB](https://www.themoviedb.org/) and create a free account
2. Navigate to your account settings
3. Go to the "API" section
4. Request an API key (choose "Developer" for personal use)
5. Copy your API key

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Netlify CLI for local development:
   ```bash
   npm install -g netlify-cli
   ```

4. Create a `.env` file in the root directory and add your TMDB API key:
   ```
   TMDB_API_KEY=your_actual_api_key_here
   ```

5. Start the development server with Netlify functions:
   ```bash
   netlify dev
   ```

   This will start both the frontend and the serverless functions locally.

## Deployment

### Netlify (Recommended)

1. **Connect your repository to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub/GitLab repository

2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

3. **Add your API key as an environment variable:**
   - In your Netlify dashboard, go to Site Settings → Environment Variables
   - Add a new variable:
     - **Key**: `TMDB_API_KEY`
     - **Value**: Your TMDB API key

4. **Deploy your site:**
   - Netlify will automatically build and deploy your site
   - Your serverless functions will be available at `/.netlify/functions/`

### Vercel

1. **Connect your repository to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Import your repository

2. **Add environment variable:**
   - In your Vercel dashboard, go to Project Settings → Environment Variables
   - Add:
     - **Name**: `TMDB_API_KEY`
     - **Value**: Your TMDB API key

3. **Create Vercel functions:**
   - Create an `api` folder in your project root
   - Move the functions from `netlify/functions` to `api` folder
   - Update the function format for Vercel (if needed)

### Other Providers

For any other hosting provider that supports serverless functions:

1. Set the environment variable `TMDB_API_KEY` with your API key
2. Configure the serverless functions according to your provider's requirements
3. Build and deploy the application

## Architecture

This application uses a secure serverless architecture:

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Netlify Edge Functions (serverless)
- **API**: TMDB API (accessed securely through backend functions)

### Security Features

- ✅ API key is stored securely as an environment variable
- ✅ API key is never exposed to the client-side code
- ✅ All TMDB API calls are proxied through secure serverless functions
- ✅ CORS headers properly configured
- ✅ Error handling and validation

### API Endpoints

The application creates three serverless functions:

- `/.netlify/functions/tmdb-search` - Search for movies and TV shows
- `/.netlify/functions/tmdb-movie` - Get movie details and streaming providers
- `/.netlify/functions/tmdb-tv` - Get TV show details and streaming providers

## Development

### Local Development with Functions

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Start local development server with functions
netlify dev
```

This will start:
- Frontend development server on `http://localhost:8888`
- Serverless functions at `http://localhost:8888/.netlify/functions/`

### Testing Functions Locally

You can test the functions directly:

```bash
# Search for content
curl "http://localhost:8888/.netlify/functions/tmdb-search?query=breaking%20bad"

# Get movie details
curl "http://localhost:8888/.netlify/functions/tmdb-movie?id=550"

# Get TV show details
curl "http://localhost:8888/.netlify/functions/tmdb-tv?id=1396"
```

## Security Notes

- ⚠️ **Never commit your `.env` file to version control**
- ✅ The `.env` file is already included in `.gitignore`
- ✅ Use environment variables for all sensitive configuration
- ✅ API calls are made server-side to protect your API key
- ✅ Client-side code never has access to the API key

## API Usage

This application uses the TMDB API through secure serverless functions for:
- Movie and TV show search
- Content metadata (cast, ratings, descriptions, etc.)
- Streaming provider availability by region

## License

This project is for educational and personal use. Please respect TMDB's terms of service when using their API.