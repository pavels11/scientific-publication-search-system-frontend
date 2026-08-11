import { useEffect, useState } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { getArticleById } from '../../api/articles';
import { getSummary } from '../../api/summaries';

import SummaryGenerator from '../../components/summaries/SummaryGenerator/SummaryGenerator';
import SummaryPanel from '../../components/summaries/SummaryPanel/SummaryPanel';

import styles from './ArticlePage.module.css';

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

const ArticlePage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [article, setArticle] = useState(null);

  const [articleLoading, setArticleLoading] = useState(true);

  const [articleError, setArticleError] = useState('');

  const [summary, setSummary] = useState(null);

  const [summaryLoading, setSummaryLoading] = useState(false);

  const [summaryError, setSummaryError] = useState('');

  const [summaryType, setSummaryType] = useState('short');

  useEffect(() => {
    let isActive = true;

    const loadArticle = async () => {
      setArticleLoading(true);
      setArticleError('');
      setArticle(null);

      setSummary(null);
      setSummaryError('');

      try {
        const data = await getArticleById(id);

        if (!isActive) {
          return;
        }

        setArticle(data);
      } catch (requestError) {
        console.error(requestError);

        if (!isActive) {
          return;
        }

        setArticleError('Не удалось загрузить научный материал');
      } finally {
        if (isActive) {
          setArticleLoading(false);
        }
      }
    };

    if (id) {
      loadArticle();
    }

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleGenerateSummary = async (nextType) => {
    if (!id) {
      return;
    }

    setSummaryType(nextType);

    setSummaryLoading(true);
    setSummaryError('');
    setSummary(null);

    try {
      const data = await getSummary({
        articleId: id,
        summaryType: nextType,
      });

      setSummary(data);
    } catch (requestError) {
      console.error(requestError);

      setSummaryError('Не удалось сформировать реферат');
    } finally {
      setSummaryLoading(false);
    }
  };

  if (articleLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.state}>Загрузка научного материала...</div>
        </div>
      </div>
    );
  }

  if (articleError) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>{articleError}</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
            Назад
          </button>

          <Link to="/search" className={styles.backLink}>
            Поиск научных материалов
          </Link>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroMain}>
            <p className={styles.kicker}>Научный материал</p>

            <h1 className={styles.title}>{article.title}</h1>

            <p className={styles.authors}>{article.authors || 'Авторы не указаны'}</p>
          </div>

          <div className={styles.chips}>
            {article.category && <span className={styles.chip}>{article.category}</span>}

            {article.publication_type && (
              <span className={styles.chipMuted}>{article.publication_type}</span>
            )}

            {article.source && <span className={styles.chipMuted}>{article.source}</span>}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Сведения о материале</h2>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Дата публикации</div>

              <div className={styles.infoValue}>{formatDate(article.published_date)}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Журнал или конференция</div>

              <div className={styles.infoValue}>{article.journal || '—'}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Источник</div>

              <div className={styles.infoValue}>{article.source || '—'}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Научная дисциплина</div>

              <div className={styles.infoValue}>{article.category || '—'}</div>
            </div>
          </div>

          {article.pdf_url && (
            <a href={article.pdf_url} target="_blank" rel="noreferrer" className={styles.pdfButton}>
              Открыть PDF
            </a>
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Аннотация</h2>

          <p className={styles.abstract}>{article.abstract || 'Аннотация отсутствует'}</p>
        </section>

        <section className={styles.summarySection}>
          <SummaryGenerator
            loading={summaryLoading}
            activeType={summaryType}
            onGenerate={handleGenerateSummary}
          />

          <SummaryPanel summary={summary} loading={summaryLoading} error={summaryError} />
        </section>
      </div>
    </div>
  );
};

export default ArticlePage;
