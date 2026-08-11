import { useEffect, useState } from 'react';

import { loginUser, logoutUser, registerUser } from '../api/auth';
import { getProfile } from '../api/profile';

import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem('token'));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);

        return;
      }

      try {
        const profile = await getProfile();

        setUser(profile);
      } catch (error) {
        console.error(error);

        localStorage.removeItem('token');

        setToken(null);

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem('token', data.token);

    setToken(data.token);

    const profile = await getProfile();

    setUser(profile);
  };

  const register = async (userData) => {
    const data = await registerUser(userData);

    localStorage.setItem('token', data.token);

    setToken(data.token);

    const profile = await getProfile();

    setUser(profile);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('token');

      setToken(null);

      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
