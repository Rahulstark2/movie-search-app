'use client';

import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleTheme, initializeTheme } from '@/lib/store/themeSlice';
import { useEffect } from 'react';

export function ThemeToggleSwitch() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black ${
        theme === 'dark' ? 'bg-red-600' : 'bg-gray-600'
      }`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        <span className="flex h-full w-full items-center justify-center">
          {theme === 'dark' ? (
            <Moon className="h-3 w-3 text-red-600" />
          ) : (
            <Sun className="h-3 w-3 text-yellow-500" />
          )}
        </span>
      </span>
    </button>
  );
}