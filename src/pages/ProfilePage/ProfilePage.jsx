import ProfileEditForm from '../../components/profile/ProfileEditForm/ProfileEditForm';

import { useAuth } from '../../hooks/useAuth';

import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const handleProfileUpdated = (updatedProfile) => {
    setUser((prev) => ({
      ...prev,
      email: updatedProfile.email,
      full_name: updatedProfile.full_name,
      affiliation: updatedProfile.affiliation,
    }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Профиль</h1>

          <p className={styles.username}>{user?.username}</p>
        </div>

        <ProfileEditForm onProfileUpdated={handleProfileUpdated} />
      </div>
    </div>
  );
};

export default ProfilePage;
