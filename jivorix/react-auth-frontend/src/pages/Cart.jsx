// pages/Cart.jsx
import React from 'react';
import CartLeft from '../components/cart/CartLeft';
import CartRight from '../components/cart/CartRight';

const Cart = () => {
  return (
    <div className="mb30">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        <div className="lg:w-2/3">
          <CartLeft />
        </div>
        <div className="lg:w-1/3">
          <CartRight />
        </div>
      </div>
    </div>
  );
};

export default Cart;