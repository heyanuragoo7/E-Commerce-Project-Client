import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from 'react-redux';
import auth from '../../utils/auth';
import {
  faUser,
  faShoppingCart,
  faArrowRight,
  faSearch,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import images from "../../assets/images";

const Nav = () => {
  const navigate = useNavigate();
  const { items: cartItems = [] } = useSelector(state => state.cart);
  const { items: wishlistItems = [] } = useSelector(state => state.wishlist);
  const [isAuth, setIsAuth] = useState(!!auth.getToken());

  useEffect(() => {
    const onStorage = () => setIsAuth(!!auth.getToken());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0).toFixed(2);
  const cartCount = cartItems.length;
  const wishlistCount = wishlistItems.length;

  return (
    <div>
        {/* QUICK ACCESS small row */}
        <div className="w-full bg-[#8cc63f] text-white text-sm py-3">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-8">
            {isAuth ? (
              <Link to="/profile" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition">
                <FontAwesomeIcon icon={faUser} />
                <span>My Account</span>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition">
                  <span>Register</span>
                </Link>
              </div>
            )}

            <Link to="/wishlist" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition relative">
              <FontAwesomeIcon icon={faHeart} />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>

          {/* CENTER BANNER */}
          <div className="flex-1 flex justify-center">
            <Link to="/product" className="cursor-pointer hover:opacity-90 transition">
              <span className="text-white font-bold uppercase tracking-wide">
                Hurry! Last Few Hours to Save Big!
              </span>
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-8">
            <Link to="/checkout" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition">
              <FontAwesomeIcon icon={faArrowRight} />
              <span>Checkout</span>
            </Link>

            {isAuth && (
              <button
                onClick={() => {
                  auth.removeToken();
                  setIsAuth(false);
                  navigate('/');
                }}
                className="ml-3 px-3 py-1 bg-[#8cc63f] text-white rounded hover:bg-[#7ab02e]"
              >
                Logout
              </button>
            )}
          </div>

        </div>
      </div>

      {/* LOGO + SEARCH */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <Link to="/" className="flex items-center gap-4 shrink-0">
            <img src={images.logo} alt="logo" className="h-16 w-auto object-contain"/>
          </Link>

          <div className="flex items-center gap-6 flex-1 ml-8">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm flex-1">
              <input className="px-4 py-2 w-full outline-none text-sm" placeholder="Type and hit enter" />
              <button className="px-4 text-gray-600 hover:text-gray-800 transition">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {/* Compare Button */}
                <button className="w-10 h-10 bg-[#8cc63f] text-white rounded hover:bg-[#7ab02e] transition flex items-center justify-center text-base shadow-sm">
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </button>

                {/* Cart Button */}
                <Link to="/cart" className="w-10 h-10 bg-[#8cc63f] text-white rounded hover:bg-[#7ab02e] transition flex items-center justify-center text-base shadow-sm relative">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              <div className="text-gray-700 font-semibold whitespace-nowrap">
                {cartCount} item(s) - ${cartTotal}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav className="nav-wrap relative z-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <ul className="nav-menu">
            <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink></li>
            <li><NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>Shopping Cart</NavLink></li>
            <li><NavLink to="/checkout" className={({ isActive }) => isActive ? 'active' : ''}>Checkout</NavLink></li>
            <li><NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>Blog</NavLink></li>
            <li><NavLink to="/post" className={({ isActive }) => isActive ? 'active' : ''}>Single Post</NavLink></li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
