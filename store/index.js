import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import libraryReducer from './librarySlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    library: libraryReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
