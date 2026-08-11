import styles from './SummaryGenerator.module.css';

const SummaryGenerator = ({ loading = false, activeType = 'short', onGenerate }) => {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <p className={styles.kicker}></p>

        <h2 className={styles.title}>Формирование реферата</h2>

        <p className={styles.text}></p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={activeType === 'short' ? styles.buttonActive : styles.button}
          onClick={() => onGenerate('short')}
          disabled={loading}
        >
          {loading && activeType === 'short' ? 'Формирование...' : 'Краткий реферат'}
        </button>

        <button
          type="button"
          className={activeType === 'detailed' ? styles.buttonActive : styles.button}
          onClick={() => onGenerate('detailed')}
          disabled={loading}
        >
          {loading && activeType === 'detailed' ? 'Формирование...' : 'Развёрнутый реферат'}
        </button>
      </div>
    </section>
  );
};

export default SummaryGenerator;
