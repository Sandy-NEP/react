import axios from 'axios';

const API_BASE_URL = 'http://localhost/react-auth-backend';

// Get inventory for a specific item
export const getItemInventory = async (itemId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/inventory.php?itemId=${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item inventory:', error);
    throw error;
  }
};

// Get all inventory
export const getAllInventory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/inventory.php`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all inventory:', error);
    throw error;
  }
};

// Update inventory for a specific item
export const updateItemInventory = async (itemId, quantity) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/inventory.php`, {
      itemId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error updating item inventory:', error);
    throw error;
  }
};

// Reduce inventory for multiple items (used after order placement)
export const reduceInventory = async (items) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/cart/inventory.php`, {
      items
    });
    return response.data;
  } catch (error) {
    console.error('Error reducing inventory:', error);
    throw error;
  }
};

// Initialize inventory with items from assets
export const initializeInventory = async (items) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/init_inventory.php`, {
      items
    });
    return response.data;
  } catch (error) {
    console.error('Error initializing inventory:', error);
    throw error;
  }
};
