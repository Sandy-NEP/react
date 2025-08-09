import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedItem: null,
  selectedSize: 'M',
  isZoomed: false
};

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    setIsZoomed: (state, action) => {
      state.isZoomed = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    }
  }
});

export const { setSelectedItem, setSelectedSize, setIsZoomed, clearSelectedItem } = detailSlice.actions;
export default detailSlice.reducer;