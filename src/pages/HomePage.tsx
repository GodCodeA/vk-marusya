import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getRandomMovie, getTopMovies } from "../api/moviesApi";
import { Movie } from "../types/movie";

export function HomePage(): JSX.Element {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [loadRandomMovie, setLoadRandomMovie] = useState(false);

  useEffect(() => {
    loadHomePageData();
  }, []);

  async function loadHomePageData(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [randomMovieData, topMoviesData] = await Promise.all([
        getRandomMovie(),
        getTopMovies(),
      ]);

      setRandomMovie(randomMovieData);
      const top = topMoviesData.slice(0, 9);
      setTopMovies(top);
    } catch (error) {
      setErrorMessage("Не удалось загрузить фильмы");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadNextRandomMovie(): Promise<void> {
    try {
      setErrorMessage("");
      setLoadRandomMovie(true);
      const movie = await getRandomMovie();
      setRandomMovie(movie);
    } catch (error) {
      setErrorMessage("Не удалось загрузить случайный фильм");
    } finally {
      setLoadRandomMovie(false);
    }
  }

  function formatRuntime(runtime: number): string {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    if (!hours) {
      return `${minutes} мин`;
    }

    return `${hours} ч ${minutes} мин`;
  }

  function shortMoviePlot(plot: string) {
    if (plot.length <= 160) {
      return plot;
    }

    return plot.slice(0, 160) + "...";
  }

  if (isLoading) {
    return <p>Загружаем главную страницу...</p>;
  }

  if (errorMessage) {
    return (
      <section className="home-page">
        <p>{errorMessage}</p>;
        <button type="button" onClick={loadHomePageData}>
          Повторить
        </button>
      </section>
    );
  }

  return (
    <section className="home-page">
      {randomMovie && (
        <section
          className="hero"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(9, 11, 15, 0.94) 0%, rgba(9, 11, 15, 0.88) 45%, rgba(9, 11, 15, 0.52) 100%), url(${randomMovie.backdropUrl ?? randomMovie.posterUrl})`,
          }}
        >
          <div className="hero__content">
            <p className="hero__eyebrow">
              VK Marusya — выбери фильм за пару секунд
            </p>
            <h1 className="hero__title" title={randomMovie.title}>
              {randomMovie.title}
            </h1>
            <p className="hero__subtitle">
              Случайный фильм, подборки по жанрам и топ‑10 — идеальная идея для
              вечера.
            </p>
            <p className="hero__top-rating" title="Фильм с рейтингом выше 8.5">
              {randomMovie.tmdbRating >= 8.5
                ? `Топ рейтинг • ${randomMovie.tmdbRating}`
                : null}
            </p>

            <div className="hero__meta">
              <span>{randomMovie.releaseYear}</span>
              <span>IMDb {randomMovie.tmdbRating}</span>
              <span>{formatRuntime(randomMovie.runtime)}</span>
            </div>

            <p className="hero__description">
              {shortMoviePlot(randomMovie.plot)}
            </p>

            <div className="hero__genres">
              {randomMovie.genres.slice(0, 4).map((genre) => (
                <span key={genre} className="hero__genre">
                  {genre}
                </span>
              ))}
            </div>

            <div className="hero__actions">
              <Link
                to={`/movie/${randomMovie.id}`}
                className="hero__button hero__button_primary"
                title="Перейти на страницу фильма"
              >
                Открыть фильм
              </Link>

              <button
                type="button"
                className="hero__button hero__button_secondary"
                onClick={loadNextRandomMovie}
                disabled={loadRandomMovie}
                title={
                  !loadRandomMovie
                    ? "Показать другой случайный фильм"
                    : "Загружаем другой фильм"
                }
              >
                {loadRandomMovie === true
                  ? "Загружаем фильм..."
                  : "Другой фильм"}
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="home-section__header">
          <div>
            <p className="home-section__eyebrow">Подборка вечера</p>
            <h2 className="home-section__title">Топ-9 фильмов</h2>
            <p className="home-section__subtitle">
              Быстрый выбор для твоего вечернего кино — фильмы с высоким
              рейтингом.
            </p>
          </div>

          <Link to="/genres" className="home-section__link">
            Смотреть жанры
          </Link>
        </div>

        <div className="top-list">
          <Swiper
            modules={[Navigation]}
            loop={true}
            watchOverflow={false}
            centeredSlides={false}
            slidesPerView={3}
            slidesPerGroup={4}
            spaceBetween={10}
            speed={300}
            navigation
            breakpoints={{
              640: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 18 },
              900: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 18 },
            }}
          >
            {topMovies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <Link to={`/movie/${movie.id}`} className="top-card">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="top-card__image"
                    title={movie.title}
                  />

                  <div className="top-card__content">
                    <h3 className="top-card__title">{movie.title}</h3>
                    <p className="top-card__meta">
                      {movie.releaseYear} • IMDb {movie.tmdbRating}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </section>
  );
}
