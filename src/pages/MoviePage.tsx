import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addMovieToFavorites,
  getMovieById,
  removeMovieFromFavorites,
} from "../api/moviesApi";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addFavoriteMovie, removeFavoriteMovie } from "../store/favoritesSlice";
import { Movie } from "../types/movie";
import { TrailerModal } from "../components/TrailerModal";

export function MoviePage(): JSX.Element {
  const { movieId = "" } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const isAuthorized = useAppSelector((state) => state.user.isAuthorized);
  const favoriteMovies = useAppSelector((state) => state.favorites.movies);

  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);

  useEffect(() => {
    loadMovie();
  }, [movieId]);

  async function loadMovie(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const movieData = await getMovieById(movieId);
      setMovie(movieData);
    } catch (error) {
      setErrorMessage("Не удалось загрузить фильм");
    } finally {
      setIsLoading(false);
    }
  }

  function openTrailer(): void {
    if (!movie?.trailerYouTubeId) {
      setErrorMessage("Трейлер для этого фильма недоступен");
      return;
    }
    setIsTrailerModalOpen(true);
  }

  function closeTrailerModal(): void {
    setIsTrailerModalOpen(false);
  }

  async function toggleFavoriteMovie(): Promise<void> {
    if (!movie) {
      return;
    }

    if (!isAuthorized) {
      navigate(`/movie/${movie.id}`, {
        state: { openAuthModal: true },
      });
      return;
    }

    try {
      setIsFavoriteLoading(true);
      setErrorMessage("");

      if (isFavorite) {
        await removeMovieFromFavorites(String(movie.id));
        dispatch(removeFavoriteMovie(movie.id));
        return;
      }

      await addMovieToFavorites(String(movie.id));
      dispatch(addFavoriteMovie(movie));
    } catch (error: any) {
      setErrorMessage(
        isFavorite
          ? "Не удалось удалить фильм из избранного"
          : "Не удалось добавить фильм в избранное",
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  if (isLoading) {
    return <p>Загрузка фильма...</p>;
  }

  if (errorMessage && !movie) {
    return <p>{errorMessage}</p>;
  }

  if (!movie) {
    return <p>Фильм не найден</p>;
  }

  const isFavorite = favoriteMovies.some(
    (favoriteMovie) => favoriteMovie.id === movie.id,
  );

  return (
    <section className="movie-details">
      <div className="movie-details__poster-wrapper">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-details__poster"
          title={movie.title}
        />
      </div>

      <div className="movie-details__info">
        <h1 className="movie-details__title" title={movie.title}>
          {movie.title}
        </h1>

        <p className="movie-details__text">
          <strong>Оригинальное название:</strong> {movie.originalTitle}
        </p>
        <p className="movie-details__text">
          <strong>Год:</strong> {movie.releaseYear}
        </p>
        <p className="movie-details__text">
          <strong>Рейтинг:</strong> {movie.tmdbRating}
        </p>
        <p className="movie-details__text">
          <strong>Язык:</strong> {movie.language}
        </p>
        <p className="movie-details__text">
          <strong>Жанры:</strong> {movie.genres.join(", ")}
        </p>
        <p className="movie-details__text">
          <strong>Статус:</strong> {movie.status}
        </p>
        <p className="movie-details__description">{movie.plot}</p>

        {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

        <div className="movie-details__actions">
          <button
            type="button"
            className="movie-details__button-trailer"
            onClick={openTrailer}
            disabled={!movie.trailerYouTubeId}
            title={
              !movie.trailerYouTubeId
                ? "Для этого фильма трейлер недоступен"
                : "Открыть трейлер фильма"
            }
          >
            {movie.trailerYouTubeId ? "Открыть трейлер" : "Трейлер недоступен"}
          </button>

          <button
            type="button"
            className="movie-details__button-favorite"
            onClick={toggleFavoriteMovie}
            disabled={isFavoriteLoading}
            title={
              isFavoriteLoading
                ? isFavorite
                  ? "Удаляем фильм из избранного"
                  : "Добавляем фильм в избранное"
                : isFavorite
                  ? "Удалить фильм из избранного"
                  : "Добавить фильм в избранное"
            }
          >
            {isFavoriteLoading
              ? isFavorite
                ? "Удаляем..."
                : "Добавляем..."
              : isFavorite
                ? "Удалить из избранного"
                : "Добавить в избранное"}
          </button>
        </div>
      </div>
      <TrailerModal
        isOpen={isTrailerModalOpen}
        trailerYouTubeId={movie.trailerYouTubeId}
        movieTitle={movie.title}
        onClose={closeTrailerModal}
      />
    </section>
  );
}
