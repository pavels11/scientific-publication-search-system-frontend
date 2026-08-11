import axiosInstance from './axios';

export const getFavorites = async () => {
  const response = await axiosInstance.get('/favorites/');

  return response.data;
};

export const addFavorite = async (articleId) => {
  const response = await axiosInstance.post('/favorites/add/', {
    article_id: articleId,
  });

  return response.data;
};

export const removeFavorite = async (articleId) => {
  const response = await axiosInstance.post('/favorites/remove/', {
    article_id: articleId,
  });

  return response.data;
};
