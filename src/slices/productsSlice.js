import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '../utils/auth';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params = {}) => {
  const { page = 1, limit = 10, sort = 'desc', priceFrom = 0, priceTo = 10000, categoryId = '' } = params;
  const url = new URL('http://localhost:5000/api/v1/get-all-products');
  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);
  url.searchParams.append('sort', sort);
  url.searchParams.append('priceFrom', priceFrom);
  url.searchParams.append('priceTo', priceTo);
  if (categoryId) url.searchParams.append('categoryId', categoryId);
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      ...auth.authHeader(),
    },
  });
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();

  // Extract products from nested API response: data.data.products
  let products = [];
  if (Array.isArray(data)) {
    products = data;
  } else if (data.data && data.data.products && Array.isArray(data.data.products)) {
    products = data.data.products;
  } else if (data.products && Array.isArray(data.products)) {
    products = data.products;
  }

  // Map products to simplified shape and fix image paths
  return products.map(p => {
    let image = p.image || p.picture || '';
    if (typeof image === 'string') {
      image = image.replace('http://localhost:5000/api/v1/', '').replace('https://localhost:5000/api/v1/', '');
    }
    return {
      _id: p._id || p.id,
      name: p.name || p.title,
      price: p.price || p.originalPrice || null,
      image,
      quantity: p.quantity ?? p.qty ?? p.stock ?? 0,
      raw: p
    };
  });
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
