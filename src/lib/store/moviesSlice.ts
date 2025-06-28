import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, MovieDetailsResponse } from '@/types/movie';
import { movieApi } from '@/lib/api';

interface MoviesState {
  movies: Movie[];
  currentMovie: MovieDetailsResponse | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  userRatings: Record<string, number>;
  page: number;
  hasMore: boolean;
  loadingGenres: boolean;
  enhancedMovies: Record<string, Partial<Movie>>; // Store enhanced data like genres
}

const initialState: MoviesState = {
  movies: [],
  currentMovie: null,
  loading: false,
  page: 1,
  hasMore: true,
  error: null,
  searchQuery: '',
  userRatings: {},
  loadingGenres: false,
  enhancedMovies: {},
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ query, page = 1 }: { query: string; page?: number }) => {
    if (query === 'popular') {
      const response = await movieApi.getPopularMovies();
      if (response.Response === 'False') {
        throw new Error(response.Error || 'Failed to fetch movies');
      }
      return { ...response, Search: response.Search || [] };
    }
    if (query === 'recent') {
      const response = await movieApi.getRecentMovies(page);
      if (response.Response === 'False') {
        throw new Error(response.Error || 'Failed to fetch movies');
      }
      return { ...response, Search: response.Search || [] };
    }
    const response = await movieApi.searchMovies(query, page);
    if (response.Response === 'False') {
      throw new Error(response.Error || 'Failed to fetch movies');
    }
    return { ...response, Search: response.Search || [] };
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (id: string) => {
    const response = await movieApi.getMovieDetails(id);
    if (response.Response === 'False') {
      throw new Error(response.Error || 'Movie not found');
    }
    return response;
  }
);

// Fetch genres for multiple movies (for enhanced display)
export const fetchMovieGenres = createAsyncThunk(
  'movies/fetchMovieGenres',
  async (movieIds: string[]) => {
    const promises = movieIds.map(async (id) => {
      try {
        const response = await movieApi.getMovieDetails(id);
        if (response.Response === 'True') {
          return {
            imdbID: id,
            Genre: response.Genre,
            Director: response.Director,
            Actors: response.Actors,
            Plot: response.Plot,
            Runtime: response.Runtime,
            imdbRating: response.imdbRating
          };
        }
      } catch (error) {
        console.warn(`Failed to fetch details for movie ${id}:`, error);
      }
      return null;
    });
    
    const results = await Promise.all(promises);
    return results.filter((result): result is NonNullable<typeof result> => result !== null);
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearMovies: (state) => {
      state.movies = [];
      state.page = 1;
      state.hasMore = true;
    },
    setUserRating: (state, action: PayloadAction<{ movieId: string; rating: number }>) => {
      state.userRatings[action.payload.movieId] = action.payload.rating;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearEnhancedMovies: (state) => {
      state.enhancedMovies = {};
    },
    setInitialMovies: (state, action: PayloadAction<{ movies: Movie[], totalResults: string }>) => {
      state.movies = action.payload.movies;
      state.hasMore = action.payload.movies.length < Number(action.payload.totalResults);
      state.page = 2; // Start from the second page for infinite scroll
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.Search) {
          if (state.page === 1) {
            state.movies = action.payload.Search;
          } else {
            const movieIds = new Set(state.movies.map((movie) => movie.imdbID));
            const newMovies = action.payload.Search.filter((movie) => !movieIds.has(movie.imdbID));
            state.movies = [...state.movies, ...newMovies];
          }
        }
        state.hasMore = state.movies.length < Number(action.payload.totalResults);
        state.page += 1;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieGenres.pending, (state) => {
        state.loadingGenres = true;
      })
      .addCase(fetchMovieGenres.fulfilled, (state, action) => {
        state.loadingGenres = false;
        // Update enhanced movie data
        action.payload.forEach((movieData) => {
          state.enhancedMovies[movieData.imdbID] = movieData;
        });
      })
      .addCase(fetchMovieGenres.rejected, (state, action) => {
        state.loadingGenres = false;
        console.warn('Failed to fetch movie genres:', action.error.message);
      });
  },
});

export const { setSearchQuery, setUserRating, clearError, clearMovies, clearEnhancedMovies, setInitialMovies } = moviesSlice.actions;
export default moviesSlice.reducer;