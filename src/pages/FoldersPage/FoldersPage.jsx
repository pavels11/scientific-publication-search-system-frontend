import { useCallback, useEffect, useState } from 'react';

import { getFavorites } from '../../api/favorites';
import {
  deleteFolder,
  getFolderArticles,
  getFolders,
  removeArticleFromFolder,
  updateFolder,
} from '../../api/folders';

import ArticleCard from '../../components/articles/ArticleCard/ArticleCard';
import FolderList from '../../components/folders/FolderList/FolderList';

import styles from './FoldersPage.module.css';

const FoldersPage = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [error, setError] = useState('');

  const loadFolderArticles = useCallback(async (folderId, isActive = () => true) => {
    try {
      setLoadingArticles(true);
      setError('');

      const data = await getFolderArticles(folderId);

      if (!isActive()) {
        return;
      }

      const normalizedArticles = data.map((item) => item.article);

      setArticles(normalizedArticles);
    } catch {
      if (isActive()) {
        setError('Не удалось загрузить научные материалы');
      }
    } finally {
      if (isActive()) {
        setLoadingArticles(false);
      }
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadInitialData = async () => {
      try {
        setLoadingFolders(true);
        setError('');

        const [foldersData, favoritesData] = await Promise.all([getFolders(), getFavorites()]);

        if (ignore) {
          return;
        }

        setFolders(foldersData);

        const favoriteIdsSet = new Set(favoritesData.map((favorite) => favorite.article.id));

        setFavoriteIds(favoriteIdsSet);

        if (foldersData.length > 0) {
          const firstFolderId = foldersData[0].id;

          setSelectedFolderId(firstFolderId);

          await loadFolderArticles(firstFolderId, () => !ignore);
        } else {
          setSelectedFolderId(null);
          setArticles([]);
        }
      } catch {
        if (!ignore) {
          setError('Не удалось загрузить данные');
        }
      } finally {
        if (!ignore) {
          setLoadingFolders(false);
        }
      }
    };

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, [loadFolderArticles]);

  const handleSelectFolder = async (folderId) => {
    if (folderId === selectedFolderId) {
      return;
    }

    setSelectedFolderId(folderId);

    await loadFolderArticles(folderId);
  };

  const handleDeleteFolder = async (folderId) => {
    const confirmed = window.confirm('Удалить эту папку?');

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      await deleteFolder(folderId);

      const updatedFolders = folders.filter((folder) => folder.id !== folderId);

      setFolders(updatedFolders);

      if (updatedFolders.length === 0) {
        setSelectedFolderId(null);
        setArticles([]);

        return;
      }

      const nextFolderId = updatedFolders[0].id;

      setSelectedFolderId(nextFolderId);

      await loadFolderArticles(nextFolderId);
    } catch {
      setError('Не удалось удалить папку');
    }
  };

  const handleEditFolder = async (folder) => {
    const newName = window.prompt('Новое название папки', folder.name);

    if (!newName?.trim()) {
      return;
    }

    try {
      setError('');

      await updateFolder({
        folderId: folder.id,
        name: newName.trim(),
      });

      setFolders((prev) =>
        prev.map((item) =>
          item.id === folder.id
            ? {
                ...item,
                name: newName.trim(),
              }
            : item
        )
      );
    } catch {
      setError('Не удалось переименовать папку');
    }
  };

  const handleRemoveArticle = async (articleId) => {
    if (!selectedFolderId) {
      return;
    }

    try {
      setError('');

      await removeArticleFromFolder({
        folderId: selectedFolderId,
        articleId,
      });

      setArticles((prev) => prev.filter((article) => article.id !== articleId));
    } catch {
      setError('Не удалось удалить материал из папки');
    }
  };

  const handleFavoriteChange = (articleId, isFavorite) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);

      if (isFavorite) {
        next.add(articleId);
      } else {
        next.delete(articleId);
      }

      return next;
    });
  };

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <h1 className={styles.title}>Мои папки</h1>

        {loadingFolders ? (
          <p className={styles.state}>Загрузка папок...</p>
        ) : (
          <FolderList
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelect={handleSelectFolder}
            onEdit={handleEditFolder}
            onDelete={handleDeleteFolder}
          />
        )}
      </aside>

      <main className={styles.content}>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : loadingArticles ? (
          <p className={styles.state}>Загрузка научных материалов...</p>
        ) : articles.length === 0 ? (
          <p className={styles.state}>В папке нет научных материалов</p>
        ) : (
          <div className={styles.articles}>
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isFavorite={favoriteIds.has(article.id)}
                onFavoriteChange={(isFavorite) => handleFavoriteChange(article.id, isFavorite)}
                hideFolderButton
                extraAction={
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveArticle(article.id)}
                  >
                    Удалить из папки
                  </button>
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FoldersPage;
