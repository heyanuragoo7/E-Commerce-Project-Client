import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { removeFromWishlist, clearWishlist } from '../slices/wishlistSlice';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import PromoBar from '../components/common/PromoBar';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems = [] } = useSelector(state => state.wishlist);
  const { items: cartItems = [] } = useSelector(state => state.cart);

  const isInCart = (productId) => cartItems.some(item => item.id === productId);

  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist(id));
    toast.success('Removed from wishlist!');
  };

  const handleToggleCart = (item) => {
    if (isInCart(item.id)) {
      dispatch(removeFromCart(item.id));
      toast.success('Removed from cart!');
    } else {
      dispatch(addToCart({ id: item.id, title: item.title, price: item.price, image: item.image }));
      toast.success(`${item.title} added to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <PromoBar />
      <Nav />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            MY WISHLIST
          </h1>
          <div className="h-1 w-24 bg-linear-to-r from-[#8cc63f] to-transparent" />
        </motion.div>

        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-md"
          >
            <FontAwesomeIcon icon={faHeart} className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-6">Your wishlist is empty</p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-[#8cc63f] text-white font-semibold rounded-lg hover:bg-[#7ab02e] transition"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {wishlistItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative bg-gray-100 h-48 overflow-hidden">
                    <Link to={`/product/${item.id}`} className="block w-full h-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>

                    {/* Badge */}
                    <div className="absolute top-3 right-3 bg-[#8cc63f] text-white p-2 rounded-full">
                      <FontAwesomeIcon icon={faHeart} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <Link to={`/product/${item.id}`} className="block mb-2">
                      <h3 className="text-sm font-semibold line-clamp-2 text-gray-900 hover:text-[#8cc63f] transition">
                        {item.title}
                      </h3>
                    </Link>

                    {item.price && (
                      <div className="text-lg font-bold text-[#8cc63f] mb-3">
                        ${item.price}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleToggleCart(item)}
                        className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1 ${
                          isInCart(item.id)
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-[#8cc63f] hover:bg-[#7ab02e] text-white'
                        }`}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {isInCart(item.id) ? 'Remove' : 'Add'}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="bg-gray-100 hover:bg-red-100 text-red-500 p-2 rounded-lg transition"
                        title="Remove from wishlist"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 justify-between items-center bg-white rounded-xl shadow-md p-6"
            >
              <p className="text-gray-700 font-semibold">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in wishlist
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { dispatch(clearWishlist()); toast.success('Wishlist cleared!'); }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition"
                >
                  Clear Wishlist
                </motion.button>

                <Link
                  to="/"
                  className="px-6 py-3 bg-[#8cc63f] hover:bg-[#7ab02e] text-white font-semibold rounded-lg transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
