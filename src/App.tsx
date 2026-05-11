import { AppRouter } from "./router/AppRouter";
import { useEffect } from "react";
import { getFavoriteMovies } from "./api/moviesApi";
import { getCurrentUser } from "./api/authApi";
import { useAppDispatch } from "./hooks/redux";
import {
  clearUser,
  finishUserLoading,
  setUser,
  startUserLoading,
} from "./store/userSlice";
import { clearFavoriteMovies, setFavoriteMovies } from "./store/favoritesSlice";

function App(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkUserSession();
  }, []);

  async function checkUserSession(): Promise<void> {
    try {
      dispatch(startUserLoading());

      const user = await getCurrentUser();
      dispatch(setUser(user));

      const favoriteMovies = await getFavoriteMovies();
      dispatch(setFavoriteMovies(favoriteMovies));
    } catch (error) {
      dispatch(clearUser());
      dispatch(clearFavoriteMovies());
    } finally {
      dispatch(finishUserLoading());
    }
  }
  return <AppRouter />;
}

export default App;
