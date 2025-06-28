import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { setTheme, toggleTheme } from '@/lib/store/themeSlice';

export function useTheme() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();

  const setThemeMode = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
  };

  const toggle = () => {
    dispatch(toggleTheme());
  };

  return {
    theme,
    setTheme: setThemeMode,
    toggleTheme: toggle,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}