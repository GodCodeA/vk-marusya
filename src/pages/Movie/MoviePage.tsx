import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addMovieToFavorites,
  getMovieById,
  removeMovieFromFavorites,
} from "../../api/moviesApi";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  addFavoriteMovie,
  removeFavoriteMovie,
} from "../../store/favoritesSlice";
import { Movie } from "../../types/movie";
import { TrailerModal } from "../../components/TrailerModal";
import "./index.css";

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
      setErrorMessage("Failed to load movie");
    } finally {
      setIsLoading(false);
    }
  }

  function openTrailer(): void {
    if (!movie?.trailerYouTubeId) {
      setErrorMessage("Trailer for this movie is unavailable");
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
          ? "Failed to remove movie from favorites"
          : "Failed to add movie to favorites",
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  if (isLoading) {
    return <p>Loading movie...</p>;
  }

  if (errorMessage && !movie) {
    return <p>{errorMessage}</p>;
  }

  if (!movie) {
    return <p>Movie not found</p>;
  }

  const isFavorite = favoriteMovies.some(
    (favoriteMovie) => favoriteMovie.id === movie.id,
  );

  return (
    <section className="movie">
      <div className="movie__poster-wrapper">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie__poster"
          title={movie.title}
        />
      </div>

      <div className="movie__info">
        <h1 className="movie__title" title={movie.title}>
          {movie.title}
        </h1>

        <p className="movie__text">
          <strong>Original title:</strong> {movie.originalTitle}
        </p>
        <p className="movie__text">
          <strong>Year:</strong> {movie.releaseYear}
        </p>
        <p className="movie__text">
          <strong>Rating:</strong> {movie.tmdbRating}
        </p>
        <p className="movie__text">
          <strong>Language:</strong> {movie.language}
        </p>
        <p className="movie__text">
          <strong>Genres:</strong> {movie.genres.join(", ")}
        </p>
        <p className="movie__text">
          <strong>Status:</strong> {movie.status}
        </p>
        <p className="movie__description">{movie.plot}</p>

        {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

        <div className="movie__actions">
          <button
            type="button"
            className="movie__button-trailer"
            onClick={openTrailer}
            disabled={!movie.trailerYouTubeId}
            title={
              !movie.trailerYouTubeId
                ? "Trailer unavailable for this movie"
                : "Open movie trailer"
            }
          >
            {movie.trailerYouTubeId ? "Open trailer" : "Trailer unavailable"}
          </button>

          <button
            type="button"
            className="movie__button-favorite"
            onClick={toggleFavoriteMovie}
            disabled={isFavoriteLoading}
            title={
              isFavoriteLoading
                ? isFavorite
                  ? "Removing movie from favorites"
                  : "Adding movie to favorites"
                : isFavorite
                  ? "Remove movie from favorites"
                  : "Add movie to favorites"
            }
          >
            {isFavoriteLoading
              ? isFavorite
                ? "Removing..."
                : "Adding..."
              : isFavorite
                ? "Remove from favorites"
                : "Add to favorites"}
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
