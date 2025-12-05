import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faTrash, faArrowRight, faTruck, faGift } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { updateQty, removeFromCart, clearCart } from '../slices/cartSlice';
import { createOrder, createCheckoutSession, clearOrder } from '../slices/orderSlice';
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import PromoBar from '../components/common/PromoBar';
import images from "../assets/images.js";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems = [] } = useSelector(state => state.cart);

  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQty({ id, qty: newQty }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart!');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal > 5000 ? 0 : 99.99;
  const discount = 0;
  const grandTotal = subtotal + shipping - discount;
  const [isProcessing, setIsProcessing] = useState(false);

  const extractOrderId = (order) => {
    return order?.newOrder._id || order?.id || order?.orderId || order?.data?._id || order?.data?.id || null;
  };

  const extractSessionUrl = (session) => {
    return session?.url || session?.data?.url || session?.session?.url || session?.checkout?.url || session?.data?.session?.url || session?.data?.checkout?.url || null;
  };

  const handleProceedToCheckout = async () => {
    if (isProcessing) return;
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    // ask for shipping address (simple prompt fallback)
    const address = window.prompt('Enter shipping address', '123 Main Street, New York, NY');
    if (!address) {
      toast.error('Shipping address is required');
      return;
    }

    const payload = {
      products: cartItems.map(item => ({ product: item.id, quantity: item.qty || 1 })),
      address,
    };

    try {
      setIsProcessing(true);
      const order = await dispatch(createOrder(payload)).unwrap();
      console.log('[Cart] createOrder response:', order);
      toast.success('Order created');
      const orderId = extractOrderId(order);
      if (!orderId) throw new Error('Order created but no orderId returned');

      const session = await dispatch(createCheckoutSession({ orderId })).unwrap();
      console.log('[Cart] createCheckoutSession response:', session);
      toast.success('Checkout session created');

      const sessionUrl = extractSessionUrl(session);
      // clear cart and order
      dispatch(clearCart());
      dispatch(clearOrder());
      if (sessionUrl) {
        window.location.href = sessionUrl;
        return;
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to proceed to checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* <PromoBar /> */}
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
            YOUR SHOPPING CART
          </h1>
          <div className="h-1 w-24 bg-linear-to-r from-[#8cc63f] to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {cartItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FontAwesomeIcon icon={faShoppingBag} className="text-4xl text-gray-300 mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <motion.div 
                        whileHover={{ scale: 1.05 }} 
                        className="relative cursor-pointer"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        <img src={item.image} alt={item.title} className="h-24 w-32 object-cover rounded-lg" />
                      </motion.div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 
                          className="text-lg font-bold text-gray-900 mb-1 cursor-pointer hover:text-[#8cc63f] transition"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          {item.title}
                        </h3>

                        {/* Price & Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-[#8cc63f]">
                            ${(item.price * item.qty).toFixed(2)}
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleQtyChange(item.id, item.qty - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition"
                            >
                              −
                            </motion.button>
                            <input type="text" value={item.qty} readOnly className="w-10 text-center font-semibold bg-transparent" />
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleQtyChange(item.id, item.qty + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition"
                            >
                              +
                            </motion.button>
                          </div>

                          {/* Remove */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:text-red-700 text-xl transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Continue Shopping Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 px-6 py-3 bg-[#8cc63f] hover:bg-[#7ab02e] text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowRight} className="rotate-180" />
              Continue Shopping
            </motion.button>
          </motion.div>

          {/* Sidebar - Summary & Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Shipping */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faTruck} className="text-[#8cc63f]" />
                Estimate Shipping
              </h3>
              <div className="space-y-3">
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#8cc63f] focus:outline-none transition">
                  <option>Select Country</option>
                  <option>United States</option>
                  <option>Canada</option>
                </select>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#8cc63f] focus:outline-none transition">
                  <option>Select State/Province</option>
                  <option>California</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Postal Code" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#8cc63f] focus:outline-none transition"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 bg-linear-to-r from-[#8cc63f] to-[#7ab02e] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Calculate Shipping
                </motion.button>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faGift} className="text-[#8cc63f]" />
                Apply Promo Code
              </h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter coupon code" 
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#8cc63f] focus:outline-none transition"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 bg-[#8cc63f] hover:bg-[#7ab02e] text-white font-semibold rounded-lg transition-colors"
                >
                  Apply
                </motion.button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-[#8cc63f]' : ''}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Discount</span>
                    <span className="font-semibold text-red-400">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 bg-[#8cc63f]/20 rounded-lg p-4 border-l-4 border-[#8cc63f]">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Grand Total</span>
                  <span className="text-3xl font-bold text-[#8cc63f]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(140, 198, 63, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToCheckout}
                disabled={isProcessing}
                className="w-full px-6 py-4 bg-linear-to-r from-[#8cc63f] to-[#7ab02e] text-white font-bold rounded-lg uppercase tracking-wider transition-all disabled:opacity-60"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </motion.button>
            </div>

            {/* Info Cards */}
            <div className="grid gap-3 text-sm text-gray-600">
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-[#8cc63f]">
                <p className="font-semibold text-gray-900 mb-1">Free Shipping</p>
                <p className="text-xs">On orders over $5000</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="font-semibold text-gray-900 mb-1">Secure Checkout</p>
                <p className="text-xs">100% secure payment</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShoppingCart;
