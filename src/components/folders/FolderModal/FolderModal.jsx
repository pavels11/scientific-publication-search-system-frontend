import { useEffect, useState } from 'react';

import {
  addArticleToFolder,
  createFolder,
  getFolderArticles,
  getFolders,
} from '../../../api/folders';

import styles from './FolderModal.module.css';

const FolderModal = ({ isOpen, onClose, articleId }) => {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  const [loadingFolders, setLoadingFolders] = useState(false);
  const [checkingFolder, setCheckingFolder] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [addingArticle, setAddingArticle] = useState(false);

  const [isArticleInFolder, setIsArticleInFolder] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let ignore = false;

    const loadFolders = async () => {
      try {
        setLoadingFolders(true);
        setError('');
        setIsArticleInFolder(false);

        const data = await getFolders();

        if (ignore) {
          return;
        }

        setFolders(data);

        if (data.length > 0) {
          setSelectedFolderId(String(data[0].id));
        } else {
          setSelectedFolderId('');
        }
      } catch (requestError) {
        console.error(requestError);

        if (!ignore) {
          setError('Не удалось загрузить папки');
        }
      } finally {
        if (!ignore) {
          setLoadingFolders(false);
        }
      }
    };

    loadFolders();

    return () => {
      ignore = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !selectedFolderId) {
      return;
    }

    let ignore = false;

    const checkArticleInFolder = async () => {
      try {
        setCheckingFolder(true);
        setError('');

        const data = await getFolderArticles(selectedFolderId);

        if (ignore) {
          return;
        }

        const articleExists = data.some((item) => String(item.article?.id) === String(articleId));

        setIsArticleInFolder(articleExists);
      } catch (requestError) {
        console.error(requestError);

        if (!ignore) {
          setError('Не удалось проверить содержимое папки');
        }
      } finally {
        if (!ignore) {
          setCheckingFolder(false);
        }
      }
    };

    checkArticleInFolder();

    return () => {
      ignore = true;
    };
  }, [isOpen, selectedFolderId, articleId]);

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();

    if (!name) {
      return;
    }

    try {
      setCreatingFolder(true);
      setError('');

      const folder = await createFolder(name);

      setFolders((prev) => [...prev, folder]);
      setSelectedFolderId(String(folder.id));
      setNewFolderName('');
      setIsArticleInFolder(false);
    } catch (requestError) {
      console.error(requestError);

      setError('Не удалось создать папку');
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleAddToFolder = async () => {
    if (!selectedFolderId || isArticleInFolder || checkingFolder || addingArticle) {
      return;
    }

    try {
      setAddingArticle(true);
      setError('');

      await addArticleToFolder({
        folderId: Number(selectedFolderId),
        articleId,
      });

      setIsArticleInFolder(true);
    } catch (requestError) {
      console.error(requestError);

      setError('Не удалось добавить материал в папку');
    } finally {
      setAddingArticle(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const isAddDisabled =
    loadingFolders || checkingFolder || addingArticle || !selectedFolderId || isArticleInFolder;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Добавить в папку</h2>

          <button type="button" className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {loadingFolders ? (
          <p className={styles.state}>Загрузка папок...</p>
        ) : (
          <>
            {folders.length > 0 ? (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="folder-select">
                  Папка
                </label>

                <select
                  id="folder-select"
                  className={styles.select}
                  value={selectedFolderId}
                  onChange={(event) => setSelectedFolderId(event.target.value)}
                  disabled={checkingFolder || addingArticle}
                >
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>

                {checkingFolder && <p className={styles.hint}>Проверка содержимого папки...</p>}

                {!checkingFolder && isArticleInFolder && (
                  <p className={styles.info}>Эта статья уже находится в выбранной папке.</p>
                )}
              </div>
            ) : (
              <p className={styles.state}>У вас пока нет папок.</p>
            )}

            <div className={styles.createSection}>
              <label className={styles.label} htmlFor="new-folder-name">
                Новая папка
              </label>

              <div className={styles.createRow}>
                <input
                  id="new-folder-name"
                  type="text"
                  className={styles.input}
                  value={newFolderName}
                  onChange={(event) => setNewFolderName(event.target.value)}
                  placeholder="Название папки"
                  disabled={creatingFolder}
                />

                <button
                  type="button"
                  className={styles.createButton}
                  onClick={handleCreateFolder}
                  disabled={creatingFolder || !newFolderName.trim()}
                >
                  {creatingFolder ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Отмена
              </button>

              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddToFolder}
                disabled={isAddDisabled}
              >
                {checkingFolder
                  ? 'Проверка...'
                  : addingArticle
                    ? 'Добавление...'
                    : isArticleInFolder
                      ? 'Уже в папке'
                      : 'Добавить'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FolderModal;
