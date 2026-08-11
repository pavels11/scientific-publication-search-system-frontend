import { Routes, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import MainLayout from '../components/layout/MainLayout/MainLayout';

import HomePage from '../pages/HomePage/HomePage';
import SearchPage from '../pages/SearchPage/SearchPage';
import ArticlePage from '../pages/ArticlePage/ArticlePage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import FavoritesPage from '../pages/FavoritesPage/FavoritesPage';
import FoldersPage from '../pages/FoldersPage/FoldersPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/search" element={<SearchPage />} />

        <Route path="/articles/:id" element={<ArticlePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/folders"
          element={
            <PrivateRoute>
              <FoldersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
