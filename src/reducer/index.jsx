import { combineReducers } from 'redux';
import productsReducer from '../slices/productsSlice';
import singleProductReducer from '../slices/singleProductSlice';
import categoriesReducer from '../slices/categoriesSlice';
import cartReducer from '../slices/cartSlice';
import wishlistReducer from '../slices/wishlistSlice';
import reviewsReducer from '../slices/reviewsSlice';
import orderReducer from '../slices/orderSlice';

const rootReducer = combineReducers({
  products: productsReducer,
  singleProduct: singleProductReducer,
  categories: categoriesReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  reviews: reviewsReducer,
  order: orderReducer,
});

export default rootReducer;
