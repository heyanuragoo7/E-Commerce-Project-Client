import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '../utils/auth';

export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async (productId) => {
  const response = await fetch(`${auth.BASE_URL}/user/get-product-reviews/${productId}`, {
    method: 'GET',
    headers: { ...auth.authHeader() }
  });
  if (!response.ok) throw new Error('Failed to fetch reviews');
  const data = await response.json();
  return data?.data || [];
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default reviewsSlice.reducer;
