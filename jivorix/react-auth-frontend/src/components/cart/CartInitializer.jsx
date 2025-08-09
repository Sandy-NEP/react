//src/components/cart/CartInitializer.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadCartAsync } from '../../redux/cart/cartSlice';

const CartInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      // Load cart from database if user is logged in
      dispatch(loadCartAsync());
    }
  }, [dispatch]);

  return null;
};

export default CartInitializer;
