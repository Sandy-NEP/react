import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addItemToCartAPI, getCartItemsAPI, removeItemFromCartAPI, updateCartItemQuantityAPI } from '../../services/cartService';
import { items } from '../../assets/assets';

// Async thunks for API calls
export const addItemToCartAsync = createAsyncThunk(
  'cart/addItemToCartAsync',
  async ({ item, selectedSize = 'M' }, { rejectWithValue }) => {
    try {
      const response = await addItemToCartAPI(item, selectedSize);
      return { response, item: { ...item, selectedSize } };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loadCartAsync = createAsyncThunk(
  'cart/loadCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCartItemsAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeItemFromCartAsync = createAsyncThunk(
  'cart/removeItemFromCartAsync',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await removeItemFromCartAPI(cartItemId);
      return { cartItemId, response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCartItemQuantityAsync = createAsyncThunk(
  'cart/updateCartItemQuantityAsync',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await updateCartItemQuantityAPI(cartItemId, quantity);
      return { cartItemId, quantity, response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: [],
  paymentSuccess: false,
  paymentDetails: {},
  orderDetails: { user: {}, products: [] },
  loading: false,
  error: null,
  inventory: items.reduce((acc, item) => {
    acc[item._id] = item.available;
    return acc;
  }, {}),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Keep some local-only actions for UI state
    toggleItemSelection: (state, action) => {
      const item = state.items.find(item => item.product_id === action.payload);
      if (item) {
        item.selected = !item.selected;
      }
    },
    selectAllItems: (state, action) => {
      const shouldSelect = action.payload !== undefined ? action.payload : !state.items.every(item => item.selected);
      state.items.forEach(item => {
        item.selected = shouldSelect;
      });
    },
    setPaymentSuccess: (state, action) => {
      state.paymentSuccess = action.payload.success;
      state.paymentDetails = action.payload.details || {};
      state.orderDetails = action.payload.orderDetails || { user: {}, products: [] };
    },
    clearError: (state) => {
      state.error = null;
    },
    reduceInventory: (state, action) => {
      // Reduce inventory when order is placed
      const { orderedItems } = action.payload;
      orderedItems.forEach(item => {
        if (state.inventory[item.product_id] !== undefined) {
          state.inventory[item.product_id] = Math.max(0, state.inventory[item.product_id] - item.quantity);
        }
      });
    },
    updateInventory: (state, action) => {
      // Update inventory for a specific item
      const { itemId, newQuantity } = action.payload;
      if (state.inventory[itemId] !== undefined) {
        state.inventory[itemId] = newQuantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Add item to cart
      .addCase(addItemToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Add the item to local state for immediate UI feedback
        const newItem = {
          ...action.payload.item,
          id: action.payload.response.data.cartItemId,
          product_id: action.payload.item._id,
          quantity: 1,
          selected: false
        };
        state.items.push(newItem);
      })
      .addCase(addItemToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load cart
      .addCase(loadCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Map database items to match frontend structure
        state.items = action.payload.items.map(item => ({
          ...item,
          _id: item.product_id,
          selected: false
        }));
      })
      .addCase(loadCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove item from cart
      .addCase(removeItemFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload.cartItemId);
      })
      .addCase(removeItemFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update quantity
      .addCase(updateCartItemQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantityAsync.fulfilled, (state, action) => {
        state.loading = false;
        const item = state.items.find(item => item.id === action.payload.cartItemId);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      .addCase(updateCartItemQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectCartTotal = (state) => {
  return state.cart.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );
};

export const selectSelectedItemsTotal = (state) => {
  return state.cart.items.reduce((total, item) => {
    if (item.selected) {
      return total + Number(item.price) * item.quantity;
    }
    return total;
  }, 0);
};

export const selectSelectedItemsTotalAmount = (state) => {
  return state.cart.items
    .filter(item => item.selected)
    .reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
};

export const selectSelectedItemsCount = (state) => {
  return state.cart.items.filter(item => item.selected).length;
};

export const selectIsItemInStock = (state, itemId) => {
  const item = state.cart.items.find(item => item._id === itemId || item.product_id === itemId);
  if (!item) return false;
  return item.quantity <= item.available;
};

export const selectItemInventory = (state, itemId) => {
  return state.cart.inventory[itemId] || 0;
};

export const selectIsItemAvailable = (state, itemId, requestedQuantity = 1) => {
  const availableQuantity = state.cart.inventory[itemId] || 0;
  return availableQuantity >= requestedQuantity;
};

// Export regular actions
export const {
  toggleItemSelection,
  selectAllItems,
  setPaymentSuccess,
  clearError,
  reduceInventory,
  updateInventory,
} = cartSlice.actions;

export default cartSlice.reducer;
