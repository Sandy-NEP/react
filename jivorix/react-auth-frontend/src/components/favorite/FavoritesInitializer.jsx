//src/components/favorite/FavoritesInitializer.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadFavoritesAsync } from '../../redux/favorite/favoriteSlice';

const FavoritesInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      // Load favorites from database if user is logged in
      dispatch(loadFavoritesAsync());
    }
  }, [dispatch]);

  return null;
};

export default FavoritesInitializer;