import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: 'dark', // Default to dark theme for Netflix-like experience
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      // Store in localStorage (if available)
      if (typeof window !== 'undefined') {
        localStorage.setItem('movieflix-theme', action.payload);
        document.documentElement.classList.toggle('dark', action.payload === 'dark');
      }
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      // Store in localStorage (if available)
      if (typeof window !== 'undefined') {
        localStorage.setItem('movieflix-theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    },
    initializeTheme: (state) => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('movieflix-theme') as Theme;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = savedTheme || systemTheme;
        
        state.theme = theme;
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    },
  },
});

export const { setTheme, toggleTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;