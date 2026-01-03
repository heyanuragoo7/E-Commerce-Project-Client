import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('wishlist') || '[]') : []
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const prod = action.payload;
      const exists = state.items.find(i => i.id === prod.id);
      if (exists) {
        state.items = state.items.filter(i => i.id !== prod.id);
      } else {
        state.items.push(prod);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    clearWishlist: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    }
  }
});

export const { toggleWishlist, clearWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
