'use client';

import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleTheme, initializeTheme } from '@/lib/store/themeSlice';
import { useEffect } from 'react';

export function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  // Initialize theme on component mount
  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="relative w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun 
          className={`absolute top-0 left-0 w-5 h-5 text-yellow-400 transition-all duration-300 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-75'
          }`}
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`absolute top-0 left-0 w-5 h-5 text-blue-400 transition-all duration-300 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
          }`}
        />
      </div>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 scale-0 transition-all duration-200 active:opacity-20 active:scale-100" />
    </button>
  );
}