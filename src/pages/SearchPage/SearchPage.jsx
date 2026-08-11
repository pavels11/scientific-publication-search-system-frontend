import { useEffect, useMemo, useState } from 'react';

import { searchArticles } from '../../api/articles';
import { getFavorites } from '../../api/favorites';

import { useAuth } from '../../hooks/useAuth';

import { PAGE_SIZE } from '../../utils/constants';

import ArticleCard from '../../components/articles/ArticleCard/ArticleCard';
import Pagination from '../../components/articles/Pagination/Pagination';
import SearchBar from '../../components/articles/SearchBar/SearchBar';
import SearchFilters from '../../components/articles/SearchFilters/SearchFilters';

import styles from './SearchPage.module.css';

const DEFAULT_FILTERS = {
  category: '',
  publication_type: '',
  journal: '',
  author: '',
  date_from: '',
  date_to: '',
  has_pdf: false,
  sort: 'relevance',
};

const hasActiveFilters = (filters) => {
  return Boolean(
    filters.category.trim() ||
    filters.publication_type.trim() ||
    filters.journal.trim() ||
    filters.author.trim() ||
    filters.date_from ||
    filters.date_to ||
    filters.has_pdf
  );
};

const normalizeFilters = (filters) => ({
  category: filters.category.trim(),
  publication_type: filters.publication_type.trim(),
  journal: filters.journal.trim(),
  author: filters.author.trim(),
  date_from: filters.date_from,
  date_to: filters.date_to,
  has_pdf: Boolean(filters.has_pdf),
  sort: filters.sort || 'relevance',
});

const formatResultLabel = (count) => {
  if (count === 0) {
    return 'Ничего не найдено';
  }

  const remainder100 = count % 100;

  if (remainder100 >= 11 && remainder100 <= 14) {
    return `Найдено ${count} материалов`;
  }

  const remainder10 = count % 10;

  if (remainder10 === 1) {
    return `Найден ${count} материал`;
  }

  if (remainder10 >= 2 && remainder10 <= 4) {
    return `Найдено ${count} материала`;
  }

  return `Найдено ${count} материалов`;
};

const SearchPage = () => {
  const { isAuthenticated } = useAuth();

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [articles, setArticles] = useState([]);
  const [count, setCount] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(count / PAGE_SIZE));
  }, [count]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let ignore = false;

    const loadFavorites = async () => {
      try {
        const favorites = await getFavorites();

        if (ignore) {
          return;
        }

        const ids = new Set(favorites.map((item) => item.article.id));

        setFavoriteIds(ids);
      } catch (error) {
        if (!ignore) {
          console.error(error);
        }
      }
    };

    loadFavorites();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!hasSearched) {
      return;
    }

    let ignore = false;

    const loadArticles = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {
          page,
          page_size: PAGE_SIZE,
          sort: filters.sort,
        };

        if (query.trim()) {
          params.q = query.trim();
        }

        if (filters.category) {
          params.category = filters.category;
        }

        if (filters.publication_type) {
          params.publication_type = filters.publication_type;
        }

        if (filters.journal) {
          params.journal = filters.journal;
        }

        if (filters.author) {
          params.author = filters.author;
        }

        if (filters.date_from) {
          params.date_from = filters.date_from;
        }

        if (filters.date_to) {
          params.date_to = filters.date_to;
        }

        if (filters.has_pdf) {
          params.has_pdf = 'true';
        }

        const data = await searchArticles(params);

        if (ignore) {
          return;
        }

        setArticles(data.results || []);
        setCount(data.count || 0);
      } catch (requestError) {
        console.error(requestError);

        if (!ignore) {
          setError('Не удалось загрузить научные материалы');
          setArticles([]);
          setCount(0);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      ignore = true;
    };
  }, [query, filters, page, hasSearched]);

  const handleSearch = (nextQuery) => {
    const normalizedQuery = nextQuery.trim();

    if (!normalizedQuery && !hasActiveFilters(filters)) {
      setError('Введите поисковый запрос или задайте хотя бы один фильтр');

      setArticles([]);
      setCount(0);
      setHasSearched(false);

      return;
    }

    setError('');
    setQuery(normalizedQuery);
    setPage(1);
    setHasSearched(true);
  };

  const handleApplyFilters = (nextFilters) => {
    const normalizedFilters = normalizeFilters(nextFilters);

    if (!query.trim() && !hasActiveFilters(normalizedFilters)) {
      setError('Введите поисковый запрос или задайте хотя бы один фильтр');

      setArticles([]);
      setCount(0);
      setHasSearched(false);

      return;
    }

    setError('');
    setFilters(normalizedFilters);
    setPage(1);
    setHasSearched(true);
  };

  const handleResetFilters = () => {
    if (!query.trim()) {
      setError('Введите поисковый запрос или задайте хотя бы один фильтр');

      setFilters(DEFAULT_FILTERS);
      setArticles([]);
      setCount(0);
      setPage(1);
      setHasSearched(false);

      return;
    }

    setError('');
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setHasSearched(true);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || loading) {
      return;
    }

    setPage(nextPage);
  };

  const handleFavoriteChange = (articleId, isFavorite) => {
    setFavoriteIds((prev) => {
      const updated = new Set(prev);

      if (isFavorite) {
        updated.add(articleId);
      } else {
        updated.delete(articleId);
      }

      return updated;
    });
  };

  const resultLabel = formatResultLabel(count);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Научные материалы</p>

          <h1 className={styles.title}>Поиск и анализ научных материалов</h1>

          <p className={styles.subtitle}></p>
        </section>

        <section className={styles.panel}>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </section>

        <section className={styles.panel}>
          <SearchFilters
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            loading={loading}
          />
        </section>

        {error && <div className={styles.error}>{error}</div>}

        {hasSearched && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>{resultLabel}</span>

            <span className={styles.summaryMeta}>
              Страница {page} из {Math.max(1, totalPages)}
            </span>
          </div>
        )}

        <div className={styles.results}>
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorite={isAuthenticated && favoriteIds.has(article.id)}
              onFavoriteChange={(isFavorite) => handleFavoriteChange(article.id, isFavorite)}
            />
          ))}
        </div>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default SearchPage;
