import { logoutUser } from "../api/authApi";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearUser } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { clearFavoriteMovies } from "../store/favoritesSlice";

export function ProfilePage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthorized } = useAppSelector((state) => state.user);
  const favoriteMovies = useAppSelector((state) => state.favorites.movies);

  async function handleLogout(): Promise<void> {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error logging out");
    } finally {
      dispatch(clearUser());
      dispatch(clearFavoriteMovies());
      navigate("/");
    }
  }

  if (!isAuthorized || !user) {
    return <h1>User is not authorized</h1>;
  }

  return (
    <section className="profile-page">
      <h1 className="profile-page__title">Account</h1>

      <div className="profile-card">
        <p className="profile-card__text">
          <strong>First name:</strong> {user.name}
        </p>
        <p className="profile-card__text">
          <strong>Last name:</strong> {user.surname}
        </p>
        <p className="profile-card__text" title={user.email}>
          <strong>Email:</strong> {user.email}
        </p>
        <p className="profile-card__small-text">Used for sign in</p>
        <p className="profile-card__text">
          <strong>User ID:</strong> {user.id}
        </p>

        <button
          type="button"
          className="profile-card__button"
          onClick={handleLogout}
          title="Log out"
        >
          Log out
        </button>
      </div>

      <div className="profile-favorites">
        <h2 className="profile-favorites__title">
          {favoriteMovies.length >= 1
            ? `Favorite movies: ${favoriteMovies.length}`
            : "Favorite movies"}
        </h2>
        {favoriteMovies.length >= 1 && (
          <p className="profile-favorites__subtitle">
            {favoriteMovies.length === 1
              ? `You have saved ${favoriteMovies.length} movie`
              : `You have saved ${favoriteMovies.length} movies`}
          </p>
        )}
        {favoriteMovies.length === 0 ? (
          <p>
            It is empty here for now. Save a movie to favorites and it will appear here.
          </p>
        ) : (
          <div className="movies-grid">
            {favoriteMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="movie-card"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="movie-card__image"
                  title={movie.title}
                />
                <div className="movie-card__content">
                  <h3 className="movie-card__title">{movie.title}</h3>
                  <p className="movie-card__rating">
                    Rating: {movie.tmdbRating}
                  </p>
                  <p className="movie-card__text">
                    <strong>Release year:</strong> {movie.releaseYear}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
