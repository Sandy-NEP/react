import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeGender: null, // can be 'male', 'female', or null
};

export const genderSlice = createSlice({
  name: 'gender',
  initialState,
  reducers: {
    setGender: (state, action) => {
      // Toggle - if the same gender is clicked again, set to null
      state.activeGender = state.activeGender === action.payload ? null : action.payload;
    },
    resetGender: (state) => {
      state.activeGender = null;
    },
  },
});

export const { setGender, resetGender } = genderSlice.actions;
export default genderSlice.reducer;