'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Movie } from '@/types/movie';
import { useStore } from '@/hooks/useStore';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import { fetchMovies, clearMovies, fetchMovieGenres, setInitialMovies } from '@/lib/store/moviesSlice';


interface MovieGridProps {
  initialMovies: Movie[];
  totalResults: string;
}

export function MovieGrid({ initialMovies, totalResults }: MovieGridProps) {
  const { dispatch } = useStore();
  const { movies: moviesFromStore, loading, error, page, hasMore, searchQuery, enhancedMovies, loadingGenres } = useSelector((state: RootState) => state.movies);
  
  // Add a ref to track which movies we've already tried to fetch genres for
  const attemptedGenresFetch = useRef<Set<string>>(new Set());
  
  const moviesToRender = searchQuery
    ? moviesFromStore
    : moviesFromStore.length > initialMovies.length
    ? moviesFromStore
    : initialMovies;

  // Effect to hydrate the store with initial server-side props
  useEffect(() => {
    if (initialMovies.length > 0 && moviesFromStore.length === 0 && !searchQuery) {
      dispatch(setInitialMovies({ movies: initialMovies, totalResults }));
    }
  }, [initialMovies, totalResults, moviesFromStore, searchQuery, dispatch]);

  // Effect to handle client-side searches
  useEffect(() => {
    if (searchQuery) {
      dispatch(clearMovies());
      dispatch(fetchMovies({ query: searchQuery, page: 1 }));
      // Reset the attempted genres fetch when search changes
      attemptedGenresFetch.current.clear();
    }
  }, [searchQuery, dispatch]);

  // Effect to fetch genres for displayed movies
  useEffect(() => {
    if (moviesToRender.length > 0 && !loadingGenres) {
      // Get movie IDs that don't have enhanced data yet
      const movieIdsNeedingGenres = moviesToRender
        .filter(movie => !enhancedMovies[movie.imdbID])
        .map(movie => movie.imdbID);
      
      // Process movies in batches of 20 to avoid overwhelming the API
      const batchSize = 20;
      for (let i = 0; i < movieIdsNeedingGenres.length; i += batchSize) {
        const batch = movieIdsNeedingGenres.slice(i, i + batchSize);
        if (batch.length > 0) {
          console.log(`Fetching enhanced data for batch ${Math.floor(i/batchSize) + 1}:`, batch);
          dispatch(fetchMovieGenres(batch));
        }
      }
    }
  }, [dispatch, moviesToRender, enhancedMovies, loadingGenres]);

  const loadMoreMovies = useCallback(() => {
    if (loading || !hasMore) return;

    // Clear the ref before fetching new movies
    attemptedGenresFetch.current.clear();

    const query = searchQuery || 'recent';
    dispatch(fetchMovies({ query, page }));
  }, [dispatch, loading, hasMore, page, searchQuery]);

  // Effect to handle infinite scrolling with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Clear any existing timeout
      clearTimeout(timeoutId);
      
      // Debounce the scroll event
      timeoutId = setTimeout(() => {
        const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
        const documentHeight = document.documentElement.offsetHeight;
        
        if (scrollPosition >= documentHeight - 100) {
          loadMoreMovies();
        }
      }, 200); // 200ms debounce
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [loadMoreMovies]);

  if (loading && moviesToRender.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        {error === 'Too many results.' ? (
          <>
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-2xl font-bold text-white mb-2">Too Many Results</h2>
            <p className="text-gray-400">Please try a more specific search term.</p>
          </>
        ) : error === 'Movie not found!' ? (
          <>
            <div className="mb-6">
              <div className="text-7xl mb-2">🎬</div>
            </div>
            <h2 className="text-3xl font-bold text-black dark:text-white mb-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              No Movies Found
            </h2>
            <p className="text-gray-400 text-lg mb-4 max-w-md">
              We couldn&apos;t find any movies matching your search. Try different keywords or check the spelling!
            </p>
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>💡</span>
              <span>Try searching for: &quot;Avengers&quot;, &quot;Inception&quot;, or &quot;Batman&quot;</span>
            </div>
          </>
        ) : (
          <>
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="light:text-black mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    );
  }

  if (!moviesToRender || moviesToRender.length === 0) {
    // Show elegant loading state for initial load or when search returns no results
    if (searchQuery && !loading) {
      // Only show "no results" for actual searches
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold mb-2 light:text-black">
            No movies found
          </h2>
          <p className="light:text-gray-400">Try searching for a different movie title</p>
        </div>
      );
    }
    
    // For initial load, show a welcoming discovery message
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="relative mb-6">
          <div className="text-7xl mb-2 animate-pulse">🎭</div>
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce delay-300">✨</div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
          Discovering Amazing Movies
        </h2>
        <p className="text-gray-400 text-lg mb-4">Curating the perfect collection for you...</p>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8 p-4">
      {moviesToRender.map((movie) => {
        // Merge basic movie data with enhanced data (including genres)
        const enhancedMovie = {
          ...movie,
          ...enhancedMovies[movie.imdbID],
          // Prioritize enhanced IMDb rating over basic movie data
          imdbRating: enhancedMovies[movie.imdbID]?.imdbRating || movie.imdbRating
        };
        
        const isLoadingGenresForMovie = loadingGenres && !enhancedMovies[movie.imdbID];
        return (
          <div key={movie.imdbID} className="mb-4">
            <MovieCard 
              movie={enhancedMovie} 
              isLoadingGenres={isLoadingGenresForMovie}
            />
          </div>
        );
      })}
      {loading && hasMore && (
        <>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="mb-4">
              <MovieCardSkeleton />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
