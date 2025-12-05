import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '../utils/auth';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await fetch(`${auth.BASE_URL}/get-all-categories`, {
    method: 'GET',
    headers: {
      ...auth.authHeader(),
    },
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  const data = await response.json();
  
  // Map API response to match category card structure
  // Handle both array response and nested data response
  const categories = Array.isArray(data) ? data : (data.data || data.categories || []);
  
  return categories.map((cat) => {
    let image = cat.image || cat.icon || cat.picture || '';
    // if (typeof image === 'string') {
    //   // strip backend base path if present so frontend can use relative paths
    //   // image = image.replace('http://localhost:5000/api/v1/', '').replace('https://localhost:5000/api/v1/', '');
    //   // console.log('Processed category image path:', image);
    // }
    return {
      _id: cat._id || cat.id,
      name: cat.name || cat.title || cat.categoryName,
      image,
      description: cat.description || '',
    };
  });
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default categoriesSlice.reducer;
