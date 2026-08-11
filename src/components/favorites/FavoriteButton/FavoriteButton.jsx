import { useState } from 'react';
import { Link } from 'react-router-dom';

import { addFavorite, removeFavorite } from '../../../api/favorites';
import { useAuth } from '../../../hooks/useAuth';

import styles from './FavoriteButton.module.css';

const FavoriteButton = ({ articleId, isFavorite = false, onChange }) => {
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      if (isFavorite) {
        await removeFavorite(articleId);
        onChange?.(false);
      } else {
        await addFavorite(articleId);
        onChange?.(true);
      }
    } catch (error) {
      console.error('Favorite error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Link to="/login" className={styles.loginLink}>
        Войдите, чтобы сохранить
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={isFavorite ? `${styles.button} ${styles.active}` : styles.button}
      onClick={handleToggleFavorite}
      disabled={loading}
      aria-pressed={isFavorite}
    >
      {isFavorite ? 'В избранном' : 'В избранное'}
    </button>
  );
};

export default FavoriteButton;
