import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../types/movie";

interface FavoritesState {
  movies: Movie[];
  isLoading: boolean;
}

const initialState: FavoritesState = {
  movies: [],
  isLoading: false,
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
    },
  },
});

export const {
  startFavoritesLoading,
  finishFavoritesLoading,
  setFavoriteMovies,
  addFavoriteMovie,
  removeFavoriteMovie,
  clearFavoriteMovies,
} = favoritesSlice.actions;

export const favoritesReducer = favoritesSlice.reducer;
