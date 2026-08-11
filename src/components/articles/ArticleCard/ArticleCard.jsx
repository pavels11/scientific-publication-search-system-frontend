import { useState } from 'react';
import { Link } from 'react-router-dom';

import FavoriteButton from '../../favorites/FavoriteButton/FavoriteButton';
import FolderModal from '../../folders/FolderModal/FolderModal';

import styles from './ArticleCard.module.css';

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ru-RU').format(date);
};

const ArticleCard = ({
  article,
  isFavorite = false,
  onFavoriteChange,
  hideFolderButton = false,
  extraAction = null,
}) => {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const abstract =
    article.abstract && article.abstract.length > 320
      ? `${article.abstract.slice(0, 320)}...`
      : article.abstract;

  return (
    <>
      <article className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badges}>
            {article.category && <span className={styles.badge}>{article.category}</span>}

            {article.publication_type && (
              <span className={styles.badgeMuted}>{article.publication_type}</span>
            )}
          </div>

          <h3 className={styles.title}>
            <Link to={`/articles/${article.id}`} className={styles.titleLink}>
              {article.title}
            </Link>
          </h3>

          <p className={styles.authors}>{article.authors || 'Авторы не указаны'}</p>
        </div>

        <p className={styles.abstract}>{abstract || 'Аннотация отсутствует'}</p>

        <div className={styles.meta}>
          {article.journal && (
            <span>
              <strong>Журнал:</strong> {article.journal}
            </span>
          )}

          <span>
            <strong>Дата публикации:</strong> {formatDate(article.published_date)}
          </span>

          {article.source && (
            <span>
              <strong>Источник:</strong> {article.source}
            </span>
          )}
        </div>

        <div className={styles.actions}>
          <div className={styles.leftActions}>
            <FavoriteButton
              articleId={article.id}
              isFavorite={isFavorite}
              onChange={onFavoriteChange}
            />

            {!hideFolderButton && (
              <button
                type="button"
                className={styles.folderButton}
                onClick={() => setIsFolderModalOpen(true)}
              >
                Добавить в папку
              </button>
            )}

            {extraAction}
          </div>

          {article.pdf_url && (
            <a href={article.pdf_url} target="_blank" rel="noreferrer" className={styles.pdfButton}>
              Открыть PDF
            </a>
          )}
        </div>
      </article>

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        articleId={article.id}
      />
    </>
  );
};

export default ArticleCard;
