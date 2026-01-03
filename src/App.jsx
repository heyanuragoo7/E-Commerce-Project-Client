import './App.css'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Error from './pages/Error';
import Home from './pages/Home';
import SingleProduct from './pages/SingleProduct';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';
import Blog from './pages/Blog';
import SinglePost from './pages/SinglePost';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {

  return (
    <>
      <Toaster position="top-right" />
      <div>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/product/:id' element={<SingleProduct/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/cart' element={<ShoppingCart/>} />
          <Route path='/wishlist' element={<Wishlist/>} />
          <Route path='/checkout' element={<Checkout/>} />
          <Route path='/blog' element={<Blog/>} />
          <Route path='/post' element={<SinglePost/>} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </>
  )
}

export default App
