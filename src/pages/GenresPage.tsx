import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGenres } from "../api/moviesApi";
import { Genre } from "../types/genre";
import { getGenreImage } from "../utils/genreImages";

export function GenresPage(): JSX.Element {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadGenres();
  }, []);

  async function loadGenres(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const genresData = await getGenres();
      const preparedGenres = genresData.map((genreName) => ({
        name: genreName,
        imageUrl: getGenreImage(genreName),
      }));

      setGenres(preparedGenres);
    } catch (error) {
      setErrorMessage("Не удалось загрузить жанры");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <p>Загрузка жанров...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <section>
      <h1>Жанры</h1>

      <div className="genres-grid">
        {genres.map((genre) => (
          <Link
            key={genre.name}
            to={`/genres/${genre.name}`}
            className="genre-card"
          >
            <img
              src={genre.imageUrl}
              alt={genre.name}
              className="genre-card__image"
            />
            <span className="genre-card__title">{genre.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
