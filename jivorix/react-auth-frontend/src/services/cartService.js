import axios from 'axios';

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
    const response = await axios.post(`${API_BASE_URL}/cart/item.php`, {
      userId: user.id,
      product_id: item._id,
      name: item.name,
      image: item.image,
      desc: item.desc,
      price: item.price,
      available: item.available,
      selectedSize: selectedSize
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
    const response = await axios.get(`${API_BASE_URL}/cart/get_cart.php?userId=${user.id}`);
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
    const response = await axios.post(`${API_BASE_URL}/cart/remove_item.php`, {
      userId: user.id,
      cartItemId: cartItemId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

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
    const response = await axios.post(`${API_BASE_URL}/cart/update_quantity.php`, {
      userId: user.id,
      cartItemId: cartItemId,
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