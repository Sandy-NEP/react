// redux/category/categoryPaginationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categoryFilteredItems: [], // Items filtered by category (with category items first)
  currentCategoryPage: 1,
  itemsPerCategoryPage: 30,
  totalCategoryItems: 0,
  activeCategory: null,
};

const shuffleArray = (array) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const categoryPaginationSlice = createSlice({
  name: 'categoryPagination',
  initialState,
  reducers: {
    initializeCategoryItems: (state, action) => {
      const allItems = action.payload;
      state.categoryFilteredItems = shuffleArray(allItems);
      state.totalCategoryItems = allItems.length;
      state.currentCategoryPage = 1;
      state.activeCategory = null;
    },
    applyCategoryFilter: (state, action) => {
      const { items, category } = action.payload;
      
      if (!category) {
        // If no category selected, show all items shuffled
        state.categoryFilteredItems = shuffleArray(items);
        state.activeCategory = null;
      } else {
        // Filter items by category and put them first
        const categoryItems = items.filter(item => item.category === category);
        const otherItems = items.filter(item => item.category !== category);
        state.categoryFilteredItems = [...categoryItems, ...shuffleArray(otherItems)];
        state.activeCategory = category;
      }
      
      state.totalCategoryItems = state.categoryFilteredItems.length;
      state.currentCategoryPage = 1;
    },
    goToCategoryPage: (state, action) => {
      state.currentCategoryPage = action.payload;
    },
    nextCategoryPage: (state) => {
      const maxPage = Math.ceil(state.totalCategoryItems / state.itemsPerCategoryPage);
      if (state.currentCategoryPage < maxPage) {
        state.currentCategoryPage += 1;
      }
    },
    prevCategoryPage: (state) => {
      if (state.currentCategoryPage > 1) {
        state.currentCategoryPage -= 1;
      }
    },
    clearCategoryFilter: (state) => {
      state.activeCategory = null;
      state.categoryFilteredItems = shuffleArray(state.categoryFilteredItems);
      state.currentCategoryPage = 1;
    },
  },
});

export const { 
  initializeCategoryItems,
  applyCategoryFilter,
  goToCategoryPage,
  nextCategoryPage,
  prevCategoryPage,
  clearCategoryFilter
} = categoryPaginationSlice.actions;

export default categoryPaginationSlice.reducer;