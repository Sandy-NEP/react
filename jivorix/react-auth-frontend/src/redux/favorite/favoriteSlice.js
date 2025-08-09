import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addItemToFavoritesAPI, getFavoriteItemsAPI, removeItemFromFavoritesAPI, clearAllFavoritesAPI } from '../../services/favoritesService';

// Async thunks for API calls
export const addToFavoritesAsync = createAsyncThunk(
  'favorite/addToFavoritesAsync',
  async (item, { rejectWithValue }) => {
    try {
      const response = await addItemToFavoritesAPI(item);
      return { response, item };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loadFavoritesAsync = createAsyncThunk(
  'favorite/loadFavoritesAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFavoriteItemsAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromFavoritesAsync = createAsyncThunk(
  'favorite/removeFromFavoritesAsync',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await removeItemFromFavoritesAPI(productId);
      return { productId, response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const clearFavoritesAsync = createAsyncThunk(
  'favorite/clearFavoritesAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearAllFavoritesAPI();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  favoriteItems: [],
  loading: false,
  error: null,
};

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to favorites
      .addCase(addToFavoritesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavoritesAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Add the item to local state for immediate UI feedback
        const itemExists = state.favoriteItems.some(item => item._id === action.payload.item._id);
        if (!itemExists) {
          state.favoriteItems.push(action.payload.item);
        }
      })
      .addCase(addToFavoritesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load favorites
      .addCase(loadFavoritesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFavoritesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteItems = action.payload.items || [];
      })
      .addCase(loadFavoritesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove from favorites
      .addCase(removeFromFavoritesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteItems = state.favoriteItems.filter(item => item._id !== action.payload.productId);
      })
      .addCase(removeFromFavoritesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear favorites
      .addCase(clearFavoritesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearFavoritesAsync.fulfilled, (state) => {
        state.loading = false;
        state.favoriteItems = [];
      })
      .addCase(clearFavoritesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = favoriteSlice.actions;
export default favoriteSlice.reducer;
