import ArticleCard from '../ArticleCard/ArticleCard';

import styles from './ArticleList.module.css';

const ArticleList = ({
  articles = [],
  loading = false,
  error = '',
  emptyMessage = 'Ничего не найдено',
}) => {
  if (loading) {
    return <div className={styles.state}>Загрузка научных материалов...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!articles.length) {
    return <div className={styles.state}>{emptyMessage}</div>;
  }

  return (
    <div className={styles.list}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;
