import { MovieSearchResponse, MovieDetailsResponse } from '@/types/movie';

// Use different environment variable names
const BASE_URL = process.env.OMDB_BASE_URL || 'https://www.omdbapi.com/';
const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY; // Remove NEXT_PUBLIC_ prefix

console.log(BASE_URL)
console.log(API_KEY)

// Add validation for environment variables
if (!API_KEY) {
  console.error('Missing OMDB API key. Please set OMDB_API_KEY environment variable.');
}

export const movieApi = {
  getRecentMovies: async (page: number = 1): Promise<MovieSearchResponse> => {
    const currentYear = new Date().getFullYear();
    return movieApi.searchMovies('movie', page, currentYear.toString());
  },
  
  searchMovies: async (query: string, page: number = 1, year?: string): Promise<MovieSearchResponse> => {
    if (!API_KEY) {
      throw new Error('API key is missing. Please check environment variables.');
    }
    
    let url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`;
    if (year) {
      url += `&y=${year}`;
    }
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Response === 'False') {
        throw new Error(data.Error || 'API returned an error');
      }
      
      return data;
    } catch (error) {
      console.error('Search movies error:', error);
      throw error;
    }
  },

  getMovieDetails: async (id: string): Promise<MovieDetailsResponse> => {
    if (!API_KEY) {
      throw new Error('API key is missing. Please check environment variables.');
    }
    
    try {
      const response = await fetch(
        `${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.Response === 'False') {
        throw new Error(data.Error || 'Movie not found');
      }
      
      return data;
    } catch (error) {
      console.error('Get movie details error:', error);
      throw error;
    }
  },

  getPopularMovies: async (): Promise<MovieSearchResponse> => {
    const popularSearches = ['batman', 'spider', 'star wars', 'marvel', 'avengers'];
    const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)];
    return movieApi.searchMovies(randomSearch);
  }
};