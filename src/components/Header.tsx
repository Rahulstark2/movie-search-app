'use client';

import { Search, Play, Bell, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';
import { useStore } from '@/hooks/useStore';
import { clearMovies, fetchMovies, setSearchQuery } from '@/lib/store/moviesSlice';

export function Header() {
  const { dispatch } = useStore();

  const handleReset = () => {
    dispatch(setSearchQuery(''));
    dispatch(clearMovies());
    dispatch(fetchMovies({ query: 'recent' }));
  };

  return (
    <header className="fixed top-0 w-full bg-black/95 dark:bg-black/95 bg-white/95 backdrop-blur-netflix z-50 border-b border-gray-800/50 dark:border-gray-800/50 border-gray-200/50 transition-colors duration-300 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group" onClick={handleReset}>
          <div className="w-8 h-8 netflix-bg-red rounded flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
          </div>
          <span className="text-2xl font-bold text-white dark:text-white text-gray-900 group-hover:text-red-400 dark:group-hover:text-red-400 group-hover:text-blue-600 transition-colors">
            MovieFlix
          </span>
        </Link>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
