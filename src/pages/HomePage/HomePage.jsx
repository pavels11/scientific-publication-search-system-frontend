import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

import styles from './HomePage.module.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Информационная система для анализа научных материалов</h1>

          <p className={styles.description}>
            Поиск научных материалов, систематизация выбранных материалов по папкам, ведение списка
            избранного и автоматическое реферирование с переводом на русский язык.
          </p>

          <div className={styles.actions}>
            <Link to="/search" className={styles.primaryButton}>
              Перейти к поиску
            </Link>

            {!isAuthenticated && (
              <Link to="/register" className={styles.secondaryButton}>
                Создать учётную запись
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h2>Поиск научных материалов</h2>

          <p>Поиск научных материалов с применением фильтров.</p>
        </div>

        <div className={styles.featureCard}>
          <h2>Автоматическое реферирование</h2>

          <p>Формирование краткого или развёрнутого реферата научного материала.</p>
        </div>

        <div className={styles.featureCard}>
          <h2>Избранное</h2>

          <p>Сохранение значимых научных материалов для быстрого доступа.</p>
        </div>

        <div className={styles.featureCard}>
          <h2>Папки</h2>

          <p>Систематизация сохранённых научных материалов в личные коллекции.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
