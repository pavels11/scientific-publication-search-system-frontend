import axiosInstance from './axios';

export const searchArticles = async (params = {}) => {
  const response = await axiosInstance.get('/articles/', {
    params,
  });

  return response.data;
};

export const getArticleById = async (articleId) => {
  const response = await axiosInstance.get(`/articles/${articleId}/`);

  return response.data;
};

export const importFromArxiv = async (data) => {
  const response = await axiosInstance.post('/articles/import/', data);

  return response.data;
};
