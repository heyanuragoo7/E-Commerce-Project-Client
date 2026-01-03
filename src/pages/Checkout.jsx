import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faUser,
  faTruck,
  faCreditCard,
  faClipboardCheck,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createOrder, createCheckoutSession, clearOrder } from '../slices/orderSlice';
import { clearCart } from '../slices/cartSlice';

const Checkout = () => {
  /** -------------------------
   * STEP SYSTEM
   -------------------------- */
  const steps = [
    {
      id: "step1",
      title: "Checkout Method",
      color: "from-[#8cc63f] to-[#7ab02e]",
      icon: faUser,
    },
    {
      id: "step2",
      title: "Billing Information",
      color: "from-blue-500 to-blue-600",
      icon: faUser,
    },
    {
      id: "step3",
      title: "Shipping Information",
      color: "from-purple-500 to-purple-600",
      icon: faTruck,
    },
    {
      id: "step4",
      title: "Shipping Method",
      color: "from-orange-400 to-orange-500",
      icon: faTruck,
    },
    {
      id: "step5",
      title: "Payment Information",
      color: "from-blue-600 to-blue-700",
      icon: faCreditCard,
    },
    {
      id: "step6",
      title: "Order Review",
      color: "from-green-500 to-green-600",
      icon: faClipboardCheck,
    },
  ];

  /** -------------------------
   * Expanded step control
   -------------------------- */
  const [expandedSteps, setExpandedSteps] = useState({
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
  });

  const toggleStep = (id) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart?.items || []);
  const orderStatus = useSelector(state => state.order?.status || 'idle');

  // Billing form state (minimal fields used for order payload)
  const [billing, setBilling] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBillingChange = (field, value) => setBilling(prev => ({ ...prev, [field]: value }));

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      setIsSubmitting(false);
      return;
    }
    if (!billing.address || !billing.name) {
      toast.error('Please fill required billing fields (name, address)');
      return;
    }

    const payload = {
      products: cartItems.map(item => ({ product: item.id, quantity: item.qty || 1 })),
      address: `${billing.address}, ${billing.city || ''} ${billing.state || ''} ${billing.zip || ''}, ${billing.country || ''}`.trim(),
    };

    try {
      const order = await dispatch(createOrder(payload)).unwrap();
      console.log('[Checkout] createOrder response:', order);
      toast.success('Order created');

      // Try to extract orderId from a few common shapes returned by APIs
      const orderId = order?._id || order?.id || order?.orderId || order?.data?._id || order?.data?.id || (order?.data && order.data.order?._id) || null;
      if (!orderId) {
        console.warn('[Checkout] could not determine orderId from createOrder response', order);
        throw new Error('Order created but orderId not returned by server');
      }

      // create checkout session
      console.log('[Checkout] calling createCheckoutSession with orderId:', orderId);
      const session = await dispatch(createCheckoutSession({ orderId })).unwrap();
      console.log('[Checkout] createCheckoutSession response:', session);
      toast.success('Checkout session created');

      // clear cart and order state and navigate to home (or session.url if provided)
      dispatch(clearCart());
      dispatch(clearOrder());

      // Try multiple possible shapes for the returned session URL
      const sessionUrl = session?.url || session?.data?.url || session?.session?.url || session?.checkout?.url || session?.data?.session?.url || session?.data?.checkout?.url || null;
      if (sessionUrl) {
        // if the API returned a redirect URL (stripe), go there
        window.location.href = sessionUrl;
        return;
      }

      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  /** -------------------------
   * Option selections
   -------------------------- */
  const [customerType, setCustomerType] = useState("guest");

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <div className="h-1 w-24 bg-[#8cc63f]" />
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-12 overflow-x-auto pb-4"
        >
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg bg-linear-to-r ${step.color} shadow-md shrink-0`}
              >
                {idx + 1}
              </motion.div>

              {idx < steps.length - 1 && (
                <div className="w-8 h-1 bg-gray-300 mx-2 shrink-0" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Steps Container */}
        <div className="space-y-4">

          {/* -------------------------
               STEP 1 – Checkout Method
              -------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <button
              onClick={() => toggleStep("step1")}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-linear-to-r from-[#8cc63f] to-[#7ab02e] text-white p-3 rounded-lg">
                  <FontAwesomeIcon icon={faUser} size="lg" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-gray-900">
                    Step 1: Checkout Method
                  </h3>
                  <p className="text-sm text-gray-600">
                    Guest or registered customer
                  </p>
                </div>
              </div>

              <motion.div
                animate={{ rotate: expandedSteps.step1 ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-[#8cc63f]"
                  size="lg"
                />
              </motion.div>
            </button>

            <motion.div
              initial={false}
              animate={{ height: expandedSteps.step1 ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Guest */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setCustomerType("guest")}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      customerType === "guest"
                        ? "border-[#8cc63f] bg-[#8cc63f]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="radio"
                        checked={customerType === "guest"}
                        readOnly
                        className="w-5 h-5"
                      />
                      <h4 className="font-bold text-gray-900">
                        Checkout as Guest
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Fast and simple checkout without creating an account
                    </p>
                  </motion.div>

                  {/* Register */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setCustomerType("register")}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      customerType === "register"
                        ? "border-[#8cc63f] bg-[#8cc63f]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="radio"
                        checked={customerType === "register"}
                        readOnly
                        className="w-5 h-5"
                      />
                      <h4 className="font-bold text-gray-900">Create Account</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Register to enjoy faster checkouts and order tracking
                    </p>
                  </motion.div>
                </div>

                {customerType === "register" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200"
                  >
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border-2 rounded-lg"
                        placeholder="you@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border-2 rounded-lg"
                        placeholder="••••••••"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleStep("step2")}
                  className="mt-6 px-8 py-3 bg-linear-to-r from-[#8cc63f] to-[#7ab02e] text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  Continue to Billing
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* -------------------------
               STEP 2 – Billing
              -------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <button
              onClick={() => toggleStep("step2")}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg">
                  <FontAwesomeIcon icon={faUser} size="lg" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">Step 2: Billing Information</h3>
                  <p className="text-sm text-gray-600">Your billing details</p>
                </div>
              </div>

              <motion.div
                animate={{ rotate: expandedSteps.step2 ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-blue-500"
                  size="lg"
                />
              </motion.div>
            </button>

            <motion.div
              initial={false}
              animate={{ height: expandedSteps.step2 ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-gray-200">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={billing.name} onChange={(e) => handleBillingChange('name', e.target.value)} className="border p-3 rounded-lg" placeholder="Full Name *" />
                  <input value={billing.email} onChange={(e) => handleBillingChange('email', e.target.value)} className="border p-3 rounded-lg" placeholder="Email *" />
                  <input value={billing.phone} onChange={(e) => handleBillingChange('phone', e.target.value)} className="border p-3 rounded-lg" placeholder="Phone *" />
                  <input value={billing.company} onChange={(e) => handleBillingChange('company', e.target.value)} className="border p-3 rounded-lg" placeholder="Company" />
                  <input value={billing.address} onChange={(e) => handleBillingChange('address', e.target.value)} className="border p-3 rounded-lg md:col-span-2" placeholder="Address *" />
                  <input value={billing.city} onChange={(e) => handleBillingChange('city', e.target.value)} className="border p-3 rounded-lg" placeholder="City *" />
                  <input value={billing.state} onChange={(e) => handleBillingChange('state', e.target.value)} className="border p-3 rounded-lg" placeholder="State *" />
                  <input value={billing.zip} onChange={(e) => handleBillingChange('zip', e.target.value)} className="border p-3 rounded-lg" placeholder="Zip Code *" />
                  <select value={billing.country} onChange={(e) => handleBillingChange('country', e.target.value)} className="border p-3 rounded-lg">
                    <option value="">Select Country</option>
                    <option>United States</option>
                    <option>Canada</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleStep("step3")}
                  className="mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  Continue to Shipping
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* -------------------------
               STEPS 3–6 (collapsed)
              -------------------------- */}
          {["step3", "step4", "step5", "step6"].map((id, index) => {
            const step = steps.find((s) => s.id === id);

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleStep(id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`bg-linear-to-r ${step.color} text-white p-3 rounded-lg`}
                    >
                      <FontAwesomeIcon icon={step.icon} size="lg" />
                    </div>

                    <div className="text-left">
                      <h3 className="font-bold text-lg">{step.title}</h3>
                      <p className="text-sm text-gray-600">Complete this step</p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: expandedSteps[id] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} size="lg" />
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: expandedSteps[id] ? "auto" : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t"
                >
                  <div className="p-6 text-center text-gray-600">
                    <p>This step will be filled when you reach it</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlaceOrder}
            disabled={orderStatus === 'loading'}
            className="w-full py-4 mt-8 bg-linear-to-r from-[#8cc63f] to-[#7ab02e] text-white font-bold text-lg rounded-lg hover:shadow-xl transition-all disabled:opacity-60"
          >
            {orderStatus === 'loading' ? 'Placing Order...' : 'Place Order'}
          </motion.button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
