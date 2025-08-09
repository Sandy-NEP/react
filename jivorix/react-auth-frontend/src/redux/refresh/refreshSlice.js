import { createSlice } from '@reduxjs/toolkit';

const refreshSlice = createSlice({
  name: 'refresh',
  initialState: {
    refreshCount: 0
  },
  reducers: {
    incrementRefresh: (state) => {
      state.refreshCount += 1;
    }
  }
});

export const { incrementRefresh } = refreshSlice.actions;
export default refreshSlice.reducer;