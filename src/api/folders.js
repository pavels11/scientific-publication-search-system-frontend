import axiosInstance from './axios';

export const getFolders = async () => {
  const response = await axiosInstance.get('/folders/');

  return response.data;
};

export const createFolder = async (name) => {
  const response = await axiosInstance.post('/folders/create/', {
    name,
  });

  return response.data;
};

export const updateFolder = async ({ folderId, name }) => {
  const response = await axiosInstance.post('/folders/update/', {
    folder_id: folderId,
    name,
  });

  return response.data;
};

export const deleteFolder = async (folderId) => {
  const response = await axiosInstance.post('/folders/delete/', {
    folder_id: folderId,
  });

  return response.data;
};

export const getFolderArticles = async (folderId) => {
  const response = await axiosInstance.get(`/folders/${folderId}/articles/`);

  return response.data;
};

export const addArticleToFolder = async ({ folderId, articleId }) => {
  const response = await axiosInstance.post('/folders/add-article/', {
    folder_id: folderId,
    article_id: articleId,
  });

  return response.data;
};

export const removeArticleFromFolder = async ({ folderId, articleId }) => {
  const response = await axiosInstance.post('/folders/remove-article/', {
    folder_id: folderId,
    article_id: articleId,
  });

  return response.data;
};
