import { configureStore } from '@reduxjs/toolkit';
import genderReducer from './gender/genderSlice';
import homeReducer from './home/homeSlice';
import refreshReducer from './refresh/refreshSlice';
import paginationReducer from './pagination/paginationSlice';
import categoryReducer from './category/categorySlice';
import categoryPaginationReducer from './category/categoryPaginationSlice';
import cartReducer from './cart/cartSlice';
import favoriteReducer from './favorite/favoriteSlice';
import detailReducer from './detail/detailSlice';
import drawerReducer from './drawer/drawerSlice';

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type.startsWith('cart/')) {
    const cartState = store.getState().cart;
    try {
      const serializedCart = JSON.stringify(cartState);
      localStorage.setItem('reduxCart', serializedCart);
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }
  return result;
};

export const store = configureStore({
  reducer: {
    home: homeReducer,
    gender: genderReducer,
    refresh: refreshReducer,
    pagination: paginationReducer,
    category: categoryReducer,
    categoryPagination: categoryPaginationReducer,
    cart: cartReducer,
    favorite: favoriteReducer,
    detail: detailReducer,
    drawer: drawerReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(localStorageMiddleware),
});