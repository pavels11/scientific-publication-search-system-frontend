import styles from './SummaryPanel.module.css';

const SUMMARY_TYPE_LABELS = {
  short: 'краткий',
  detailed: 'развёрнутый',
};

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const SummaryPanel = ({ summary = null, loading = false, error = '' }) => {
  const hasSummary = Boolean(summary);

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Результат</p>

          <h2 className={styles.title}>Сформированный реферат</h2>
        </div>

        {hasSummary && (
          <span className={styles.badge}>
            {SUMMARY_TYPE_LABELS[summary.summary_type] || summary.summary_type}
          </span>
        )}
      </div>

      {loading && <div className={styles.state}>Формирование реферата...</div>}

      {!loading && error && <div className={styles.error}>{error}</div>}

      {!loading && !error && !hasSummary && (
        <div className={styles.state}>
          Выберите тип реферата, чтобы сформировать реферат для данного научного материала.
        </div>
      )}

      {!loading && hasSummary && (
        <div className={styles.content}>
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Реферат на английском языке</h3>

            <p className={styles.text}>{summary.summary_text_en || '—'}</p>
          </div>

          {summary.summary_text_ru && (
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Реферат на русском языке</h3>

              <p className={styles.text}>{summary.summary_text_ru}</p>
            </div>
          )}

          <div className={styles.meta}>
            <strong>Дата формирования:</strong> {formatDate(summary.created_at)}
          </div>
        </div>
      )}
    </section>
  );
};

export default SummaryPanel;
