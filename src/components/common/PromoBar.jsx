import React from 'react';
import { useLocation } from 'react-router-dom';

const promoText = {
  '/': 'FREE SHIPPING Offered by Online Sale - We will bring your desired Products at your house, for free!',
  '/cart': 'Your Shopping Cart - Review and checkout securely!',
  '/checkout': 'Checkout - Complete your purchase!',
  '/product': 'Product Details - See features and reviews!',
  '/products': 'Browse Products - Find your favorites!',
  '/blog': 'Blog - Latest news and updates!',
  '/post': 'Post - Read and comment!',
};

const PromoBar = () => {
  const location = useLocation();
  const text = promoText[location.pathname] || promoText['/'];
  return (
    <div style={{ background: '#8cc63f', color: '#fff' }} className="w-full">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <i className="fa fa-truck" aria-hidden="true" style={{ fontSize: 20 }} />
          <div>
            <strong style={{ fontWeight: 700 }}>FURNITURE</strong>
            <span className="ml-2"> {text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBar;
