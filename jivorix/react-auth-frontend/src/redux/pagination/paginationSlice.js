// redux/pagination/paginationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 1,
  itemsPerPage: 30,
  totalItems: 0,
  randomizedItems: [],
};

const shuffleArray = (array) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    initializeItems: (state, action) => {
      const shuffled = shuffleArray(action.payload);
      state.randomizedItems = shuffled;
      state.totalItems = shuffled.length;
      state.currentPage = 1;
    },
    goToPage: (state, action) => {
      state.currentPage = action.payload;
    },
    nextPage: (state) => {
      const maxPage = Math.ceil(state.totalItems / state.itemsPerPage);
      if (state.currentPage < maxPage) {
        state.currentPage += 1;
      }
    },
    prevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
  },
});

export const { initializeItems, goToPage, nextPage, prevPage, maxPage } = paginationSlice.actions;
export default paginationSlice.reducer;
