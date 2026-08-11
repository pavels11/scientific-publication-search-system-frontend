import axiosInstance from './axios';

export const getProfile = async () => {
  const response = await axiosInstance.get('/users/profile/');

  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put('/users/profile/', {
    email: profileData.email,
    full_name: profileData.fullName,
    affiliation: profileData.affiliation,
  });

  return response.data;
};
