import axiosInstance from './axios';

export const getSummary = async ({ articleId, summaryType = 'short' }) => {
  const response = await axiosInstance.post('/summaries/get/', {
    article_id: articleId,
    summary_type: summaryType,
  });

  return response.data;
};
