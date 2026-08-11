import { Link } from 'react-router-dom';

import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>

        <h1 className={styles.title}>Страница не найдена</h1>

        <p className={styles.text}></p>

        <Link to="/" className={styles.button}>
          На главную
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
