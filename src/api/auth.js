import axiosInstance from './axios';

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/users/register/', userData);

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/users/login/', credentials);

  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post('/users/logout/');

  return response.data;
};
