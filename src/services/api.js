import axios from 'axios';

const API_URL = 'http://localhost:3500';  // Change as per your backend URL

// Set up the token in headers for requests that require authentication
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
     Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// Login User
export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth`, data);
    return response.data;
  } catch (error) {
    console.error('Error logging in', error);
    throw error;
  }
};

// Register User
export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error) {
    console.error('Error registering', error);
    throw error;
  }
};

// Add Expense
export const addExpense = async (data) => {
  try {
    const response = await axiosInstance.post('/expenses', data);
    return response.data;
  } catch (error) {
    console.error('Error adding expense', error);
    throw error;
  }
};

// Get Expenses
export const getExpenses = async () => {
  try {
    const response = await axiosInstance.get('/expenses');
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses', error);
    throw error;
  }
};

// Delete Expense
export const deleteExpense = async (id) => {
  try {
    const response = await axiosInstance.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting expense', error);
    throw error;
  }
};

// Update Expense
export const updateExpense = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/expenses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating expense', error);
    throw error;
  }
};
