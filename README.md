# StreamFinder

A beautiful web application to discover where to watch your favorite movies and TV shows across all streaming platforms.

## Features

- 🔍 Search for movies and TV shows
- 🌍 Support for all countries and regions
- 📺 Comprehensive streaming provider information
- 🎬 Rich content details with cast, ratings, and descriptions
- 📱 Responsive design with modern UI
- 🔒 Secure API key management

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

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Add your TMDB API key to the `.env` file:
   ```
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Netlify

1. Connect your repository to Netlify
2. In your Netlify dashboard, go to Site Settings → Environment Variables
3. Add the environment variable:
   - **Key**: `VITE_TMDB_API_KEY`
   - **Value**: Your TMDB API key
4. Deploy your site

### Vercel

1. Connect your repository to Vercel
2. In your Vercel dashboard, go to Project Settings → Environment Variables
3. Add the environment variable:
   - **Name**: `VITE_TMDB_API_KEY`
   - **Value**: Your TMDB API key
4. Deploy your site

### Other Providers

For any other hosting provider that supports environment variables:

1. Set the environment variable `VITE_TMDB_API_KEY` with your API key
2. Build and deploy the application

## Security Notes

- ⚠️ **Never commit your `.env` file to version control**
- ✅ The `.env` file is already included in `.gitignore`
- ✅ Use environment variables for all sensitive configuration
- ✅ The API key is validated at runtime to ensure it's properly configured

## API Usage

This application uses the TMDB API for:
- Movie and TV show search
- Content metadata (cast, ratings, descriptions, etc.)
- Streaming provider availability by region

## License

This project is for educational and personal use. Please respect TMDB's terms of service when using their API.