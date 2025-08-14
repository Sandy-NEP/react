import axios from 'axios';

// Use the current running backend server for development
const API_BASE_URL = 'http://localhost/react-auth-backend';

// Get user from localStorage
const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
    return null;
  }
};

// Get user order history
export const getUserOrderHistoryAPI = async (params = {}) => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const queryParams = new URLSearchParams({
      action: 'list',
      userId: user.id,
      ...params
    });

    const response = await axios.get(`${API_BASE_URL}/cart/order_management.php?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error getting order history:', error);
    throw error;
  }
};

// Get specific order details
export const getOrderDetailsAPI = async (transactionId) => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/cart/order_management.php?action=details&transactionId=${transactionId}&userId=${user.id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting order details:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatusAPI = async (transactionId, status) => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/cart/order_management.php?action=status`, {
      transactionId,
      userId: user.id,
      status
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Cancel order
export const cancelOrderAPI = async (transactionId) => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/cart/order_management.php?action=cancel&transactionId=${transactionId}&userId=${user.id}`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

// Get orders by status
export const getOrdersByStatusAPI = async (status, params = {}) => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const queryParams = new URLSearchParams({
      action: 'list',
      userId: user.id,
      status,
      ...params
    });

    const response = await axios.get(`${API_BASE_URL}/cart/order_management.php?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error getting orders by status:', error);
    throw error;
  }
};
