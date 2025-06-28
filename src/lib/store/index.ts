import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;