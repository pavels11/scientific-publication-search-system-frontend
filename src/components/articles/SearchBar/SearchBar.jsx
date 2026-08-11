import { useState } from 'react';

import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, loading = false }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputRow}>
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={styles.input}
          placeholder="Поиск"
        />

        {value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            disabled={loading}
          >
            Очистить
          </button>
        )}
      </div>

      <button type="submit" className={styles.searchButton} disabled={loading}>
        {loading ? 'Поиск...' : 'Искать'}
      </button>
    </form>
  );
};

export default SearchBar;
