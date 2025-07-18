import api from './api'; // or '../api' depending on your structure

export const getProtectedData = async () => {
  const response = await api.get('/protected-route');
  return response.data;
};
