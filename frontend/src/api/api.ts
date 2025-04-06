import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const fetchUsers = async ({ page = 1, limit = 10 }: { page: number; limit: number }) => {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: { page, limit },
    });
    return response.data;
};

export const createUser = async (userData: any) => {
  const response = await axios.post(`${API_BASE_URL}/users`, userData);
  return response.data;
};

export const updateUser = async (id: number, userData: any) => {
  const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
  return response.data;
};

export const uploadImage = async (formData: FormData) => {
  return await axios.post("http://localhost:5000/users/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchUserById = async (id: number) => {
  const response = await axios.get(`http://localhost:5000/users/${id}`);
  return response.data;
};

