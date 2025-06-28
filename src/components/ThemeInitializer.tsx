'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeTheme } from '@/lib/store/themeSlice';

export function ThemeInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  return null; // This component doesn't render anything
}