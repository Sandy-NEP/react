// homeslice.js
import { createSlice } from '@reduxjs/toolkit';
import { items } from '../../assets/assets';

const initialState = {
  homeProducts: [],
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setRandomHomeProducts: (state) => {
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      state.homeProducts = shuffled.slice(0, 16);
    },
  },
});

export const { setRandomHomeProducts } = homeSlice.actions;
export default homeSlice.reducer;