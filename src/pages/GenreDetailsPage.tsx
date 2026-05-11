import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getMoviesByGenre } from "../api/moviesApi";
import { Movie } from "../types/movie";

const MOVIES_PORTION_SIZE = 10;

export function GenreDetailsPage(): JSX.Element {
  const { genreName = "" } = useParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [visibleMoviesCount, setVisibleMoviesCount] =
    useState(MOVIES_PORTION_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadMoviesByGenre();
  }, [genreName]);

  useEffect(() => {
    if (!observerTargetRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry.isIntersecting) {
          return;
        }

        setVisibleMoviesCount((currentValue) => {
          if (currentValue >= movies.length) {
            return currentValue;
          }

          return currentValue + MOVIES_PORTION_SIZE;
        });
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(observerTargetRef.current);

    return () => observer.disconnect();
  }, [movies.length]);

  async function loadMoviesByGenre(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setVisibleMoviesCount(MOVIES_PORTION_SIZE);

      const moviesData = await getMoviesByGenre(genreName);
      const sortedMovies = [...moviesData].sort((firstMovie, secondMovie) => {
        return secondMovie.tmdbRating - firstMovie.tmdbRating;
      });

      setMovies(sortedMovies);
    } catch (error) {
      setErrorMessage("Не удалось загрузить фильмы жанра");
    } finally {
      setIsLoading(false);
    }
  }

  const visibleMovies = movies.slice(0, visibleMoviesCount);
  const hasMoreMovies = visibleMoviesCount < movies.length;

  if (isLoading) {
    return <p>Загрузка фильмов</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }
  return (
    <section>
      <h1>Жанр: {genreName}</h1>

      <div className="movies-grid">
        {visibleMovies.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="movie-card__image"
            />
            <div className="movie-card__content">
              <h2 className="movie-card__title">{movie.title}</h2>
              <p className="movie-card__rating">Рейтинг: {movie.tmdbRating}</p>
              <p className="movie-card__year">{movie.releaseYear}</p>
            </div>
          </Link>
        ))}
      </div>

      {hasMoreMovies && (
        <div ref={observerTargetRef} className="movies-loader-trigger">
          Загружаем ещё фильмы...
        </div>
      )}
    </section>
  );
}
