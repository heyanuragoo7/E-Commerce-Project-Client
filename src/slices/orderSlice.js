import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '../utils/auth';

export const createOrder = createAsyncThunk('order/createOrder', async (payload) => {
  const response = await fetch(`${auth.BASE_URL}/user/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth.authHeader() },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create order');
  const data = await response.json();
  return data?.data || data;
});

export const createCheckoutSession = createAsyncThunk('order/createCheckoutSession', async (payload) => {
  const response = await fetch(`${auth.BASE_URL}/user/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth.authHeader() },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create checkout session');
  const data = await response.json();
  return data;
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    currentOrder: null,
    checkoutSession: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.checkoutSession = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCheckoutSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.checkoutSession = action.payload;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
