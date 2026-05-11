import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { GenreDetailsPage } from "../pages/GenreDetailsPage";
import { GenresPage } from "../pages/GenresPage";
import { HomePage } from "../pages/HomePage";
import { MoviePage } from "../pages/MoviePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProfilePage } from "../pages/ProfilePage";

export function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="genres" element={<GenresPage />} />
        <Route path="genres/:genreName" element={<GenreDetailsPage />} />
        <Route path="movie/:movieId" element={<MoviePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
