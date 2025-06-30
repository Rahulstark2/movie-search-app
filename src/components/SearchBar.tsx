'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useStore } from '@/hooks/useStore';
import { fetchMovies, setSearchQuery, clearMovies } from '@/lib/store/moviesSlice';

export function SearchBar() {
  const { dispatch } = useStore();
  const searchQuery = useSelector((state: RootState) => state.movies.searchQuery);
  const [query, setQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(query, 500);
  const isResetting = useRef(false);

  useEffect(() => {
    setQuery(searchQuery);
    // If searchQuery is being reset to empty, mark as resetting to prevent debounced search
    if (searchQuery === '') {
      isResetting.current = true;
      // Reset the flag after a short delay
      setTimeout(() => {
        isResetting.current = false;
      }, 100);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Skip the debounced search if we're in the middle of a reset
    if (isResetting.current) return;
    
    if (debouncedQuery === searchQuery) return;

    dispatch(setSearchQuery(debouncedQuery));
    dispatch(clearMovies());

    const trimmedQuery = debouncedQuery.trim();
    if (trimmedQuery) {
      if (trimmedQuery.length >= 3) {
        dispatch(fetchMovies({ query: trimmedQuery, page: 1 }));
      } else {
        dispatch(fetchMovies({ query: 'recent', page: 1 }));
      }
    } else {
      dispatch(fetchMovies({ query: 'recent', page: 1 }));
    }
  }, [debouncedQuery, dispatch, searchQuery]);

  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 text-gray-600 w-5 h-5 transition-colors duration-300" />
      <Input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 bg-gray-800 dark:bg-gray-800 bg-white border-gray-700 dark:border-gray-700 border-gray-300 text-white dark:text-white text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 placeholder-gray-500 focus:border-red-500 dark:focus:border-red-500 focus:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300"
      />
    </div>
  );
}
