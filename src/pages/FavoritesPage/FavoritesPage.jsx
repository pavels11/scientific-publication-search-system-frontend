import { useEffect, useState } from 'react';

import { getFavorites } from '../../api/favorites';
import ArticleCard from '../../components/articles/ArticleCard/ArticleCard';

import styles from './FavoritesPage.module.css';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadFavorites = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getFavorites();

        if (!isActive) {
          return;
        }

        setFavorites(data);
      } catch (requestError) {
        console.error(requestError);

        if (!isActive) {
          return;
        }

        setError('Не удалось загрузить избранное');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      isActive = false;
    };
  }, []);

  const handleFavoriteChange = (favoriteId, isFavorite) => {
    if (!isFavorite) {
      setFavorites((prev) => prev.filter((item) => item.id !== favoriteId));
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.state}>Загрузка избранного...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Избранные научные материалы</h1>

          <p className={styles.subtitle}></p>
        </div>

        {favorites.length === 0 ? (
          <div className={styles.empty}>В избранном пока нет научных материалов.</div>
        ) : (
          <div className={styles.list}>
            {favorites.map((favorite) => (
              <ArticleCard
                key={favorite.id}
                article={favorite.article}
                isFavorite={true}
                onFavoriteChange={(isFavorite) => handleFavoriteChange(favorite.id, isFavorite)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
