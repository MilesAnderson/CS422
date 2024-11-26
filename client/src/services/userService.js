import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

export const createUser = async (newUser) => {
  try {
    const response = await axios.post(`${API_URL}/signUp`, newUser);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || 'Error creating user');
  }
};

export const authenticateUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/signIn`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || 'Error authenticating user');
  }
};