import { MovieSearchResponse, MovieDetailsResponse } from '@/types/movie';

const BASE_URL = process.env.NEXT_PUBLIC_OMDB_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export const movieApi = {
  getRecentMovies: async (page: number = 1): Promise<MovieSearchResponse> => {
    const currentYear = new Date().getFullYear();
    return movieApi.searchMovies('movie', page, currentYear.toString());
  },
  searchMovies: async (query: string, page: number = 1, year?: string): Promise<MovieSearchResponse> => {
    let url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`;
    if (year) {
      url += `&y=${year}`;
    }
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    
    return response.json();
  },

  getMovieDetails: async (id: string): Promise<MovieDetailsResponse> => {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    return response.json();
  },

  getPopularMovies: async (): Promise<MovieSearchResponse> => {
    // Since OMDB doesn't have a "popular" endpoint, we'll search for common terms
    const popularSearches = ['batman', 'spider', 'star wars', 'marvel', 'avengers'];
    const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)];
    return movieApi.searchMovies(randomSearch);
  }
};