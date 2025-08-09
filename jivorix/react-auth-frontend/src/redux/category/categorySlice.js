// redux/category/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCategory: null,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    clearActiveCategory: (state) => {
      state.activeCategory = null;
    },
  },
});

export const { setActiveCategory, clearActiveCategory } = categorySlice.actions;
export default categorySlice.reducer;