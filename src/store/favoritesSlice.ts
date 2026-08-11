import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../types/movie";

interface FavoritesState {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  movies: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    startFavoritesLoading(state) {
      state.isLoading = true;
    },
    finishFavoritesLoading(state) {
      state.isLoading = false;
    },
    setFavoriteMovies(state, action: PayloadAction<Movie[]>) {
      state.movies = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setFavoritesError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearFavoritesError(state) {
      state.error = null;
    },
    addFavoriteMovie(state, action: PayloadAction<Movie>) {
      state.movies.unshift(action.payload);
    },
    removeFavoriteMovie(state, action: PayloadAction<number>) {
      state.movies = state.movies.filter(
        (movie) => movie.id !== action.payload,
      );
    },
    clearFavoriteMovies(state) {
      state.movies = [];
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  startFavoritesLoading,
  finishFavoritesLoading,
  setFavoriteMovies,
  setFavoritesError,
  clearFavoritesError,
  addFavoriteMovie,
  removeFavoriteMovie,
  clearFavoriteMovies,
} = favoritesSlice.actions;

export const favoritesReducer = favoritesSlice.reducer;
