import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

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

// Add item to favorites in database
export const addItemToFavoritesAPI = async (item) => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/favorites/add_favorite.php`, {
      userId: user.id,
      product_id: item._id,
      name: item.name,
      image: item.image,
      desc: item.desc,
      sp: item.sp,
      cp: item.cp,
      category: item.category,
      gender: item.gender,
      available: item.available
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error adding item to favorites:', error);
    throw error;
  }
};

// Get favorite items from database
export const getFavoriteItemsAPI = async () => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/favorites/get_favorites.php?userId=${user.id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting favorite items:', error);
    throw error;
  }
};

// Remove item from favorites in database
export const removeItemFromFavoritesAPI = async (productId) => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/favorites/remove_favorite.php`, {
      userId: user.id,
      product_id: productId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error removing item from favorites:', error);
    throw error;
  }
};

// Clear all favorites
export const clearAllFavoritesAPI = async () => {
  const user = getUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/favorites/clear_favorites.php`, {
      userId: user.id
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
};