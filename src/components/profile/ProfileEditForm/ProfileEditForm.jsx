import { useEffect, useState } from 'react';

import { getProfile, updateProfile } from '../../../api/profile';

import styles from './ProfileEditForm.module.css';

const ProfileEditForm = ({ onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    affiliation: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      try {
        setError('');

        const data = await getProfile();

        if (ignore) {
          return;
        }

        setFormData({
          email: data.email || '',
          fullName: data.full_name || '',
          affiliation: data.affiliation || '',
        });
      } catch {
        if (!ignore) {
          setError('Не удалось загрузить профиль');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updatedProfile = await updateProfile(formData);

      setSuccess('Профиль обновлён');

      if (onProfileUpdated) {
        onProfileUpdated(updatedProfile);
      }
    } catch (error) {
      setError(
        error.response?.data?.email || error.response?.data?.detail || 'Не удалось обновить профиль'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Загрузка профиля...</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Электронная почта</label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label>Имя и фамилия</label>

        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label>Место работы или учёбы</label>

        <input
          type="text"
          name="affiliation"
          value={formData.affiliation}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <button type="submit" className={styles.button} disabled={saving}>
        {saving ? 'Сохранение...' : 'Сохранить профиль'}
      </button>
    </form>
  );
};

export default ProfileEditForm;
