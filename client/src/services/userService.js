import axios from 'axios';

const API_URL = 'http://localhost:4000/api/users';

export const createUser = async (newUser) => {
  try {
    const response = await axios.post(API_URL, newUser);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || 'Error creating user');
  }
};

export const authenticateUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/authenticate`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || 'Error authenticating user');
  }
};