import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../hooks/useAuth';

import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}></Link>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Главная
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Поиск
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                Избранное
              </NavLink>

              <NavLink
                to="/folders"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                Папки
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                Профиль
              </NavLink>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <span className={styles.username}>{user?.username}</span>

              <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.authLink}>
                Вход
              </Link>

              <Link to="/register" className={styles.registerButton}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
