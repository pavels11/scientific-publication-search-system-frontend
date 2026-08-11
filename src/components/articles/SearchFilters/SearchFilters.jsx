import { useState } from 'react';

import styles from './SearchFilters.module.css';

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

const SearchFilters = ({ onApply, onReset, loading = false }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedFilters = normalizeFilters(filters);

    setFilters(normalizedFilters);
    onApply(normalizedFilters);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onReset();
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label}>Научная дисциплина</label>

          <input
            className={styles.input}
            name="category"
            value={filters.category}
            onChange={handleChange}
            placeholder="например, информатика, физика"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Тип публикации</label>

          <input
            className={styles.input}
            name="publication_type"
            value={filters.publication_type}
            onChange={handleChange}
            placeholder="например, статья, препринт"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Журнал или конференция</label>

          <input
            className={styles.input}
            name="journal"
            value={filters.journal}
            onChange={handleChange}
            placeholder="например, Nature, NeurIPS"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Автор</label>

          <input
            className={styles.input}
            name="author"
            value={filters.author}
            onChange={handleChange}
            placeholder="например, Иванов, Smith"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Дата публикации с</label>

          <input
            className={styles.input}
            type="date"
            name="date_from"
            value={filters.date_from}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Дата публикации до</label>

          <input
            className={styles.input}
            type="date"
            name="date_to"
            value={filters.date_to}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Сортировка</label>

          <select className={styles.input} name="sort" value={filters.sort} onChange={handleChange}>
            <option value="relevance">По релевантности</option>
            <option value="newest">По дате публикации</option>
          </select>
        </div>

        <label className={styles.checkbox}>
          <input type="checkbox" name="has_pdf" checked={filters.has_pdf} onChange={handleChange} />

          <span>Только с полным текстом в формате PDF</span>
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.applyButton} disabled={loading}>
          {loading ? 'Применение...' : 'Применить фильтры'}
        </button>

        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}
          disabled={loading}
        >
          Сбросить
        </button>
      </div>
    </form>
  );
};

export default SearchFilters;
