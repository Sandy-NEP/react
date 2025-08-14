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

// Add item to cart in database
export const addItemToCartAPI = async (item, selectedSize = 'M') => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/cart/index.php?action=add`, {
      userId: user.id,
      productId: item._id,
      name: item.name,
      image: item.image,
      description: item.desc,
      price: item.price,
      available: item.available,
      size: selectedSize,
      quantity: 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Get cart items from database
export const getCartItemsAPI = async () => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/cart/index.php?action=view&userId=${user.id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting cart items:', error);
    throw error;
  }
};

// Remove item from cart in database
export const removeItemFromCartAPI = async (cartItemId) => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/cart/index.php?action=remove&itemId=${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

// Update item quantity in cart
export const updateCartItemQuantityAPI = async (cartItemId, quantity) => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/cart/index.php?action=update`, {
      itemId: cartItemId,
      quantity: quantity
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

// Get available payment methods
export const getPaymentMethodsAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/payment_methods.php?action=list`);
    return response.data;
  } catch (error) {
    console.error('Error getting payment methods:', error);
    throw error;
  }
};

// Process checkout with selected payment method
export const checkoutAPI = async (checkoutData) => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/cart/checkout.php`, {
      userId: user.id,
      ...checkoutData
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrdersAPI = async () => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/cart/orders.php?action=list&userId=${user.id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};
