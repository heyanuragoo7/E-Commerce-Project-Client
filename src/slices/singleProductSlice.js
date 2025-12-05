import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '../utils/auth';

export const fetchSingleProduct = createAsyncThunk('singleProduct/fetchSingleProduct', async (id) => {
  const response = await fetch(`${auth.BASE_URL}/get-product/${id}`, {
    method: 'GET',
    headers: {
      ...auth.authHeader(),
    },
  });
  if (!response.ok) throw new Error('Failed to fetch product');
  const data = await response.json();
  // API returns { success, message, data: { ...product } }
  if (data && data.data) return data.data;
  // fallback: if top-level contains product fields
  return data;
});

const singleProductSlice = createSlice({
  name: 'singleProduct',
  initialState: {
    item: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.item = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default singleProductSlice.reducer;
