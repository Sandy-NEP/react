import React, { useEffect } from 'react';
import { FaHeart, FaStar, FaCheckCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setRandomHomeProducts } from '../../../redux/home/homeSlice'
import { useNavigate } from 'react-router-dom';
import { setSelectedItem } from '../../../redux/detail/detailSlice';
import { addToFavoritesAsync, removeFromFavoritesAsync } from '../../../redux/favorite/favoriteSlice';

const HomeProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const homeProducts = useSelector((state) => state.home.homeProducts);
  const activeGender = useSelector((state) => state.gender.activeGender);
  const refreshCount = useSelector((state) => state.refresh.refreshCount);
  const { favoriteItems } = useSelector((state) => state.favorite);
  const { items: cartItems } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(setRandomHomeProducts());
  }, [dispatch, refreshCount]);

  useEffect(() => {
    dispatch(setRandomHomeProducts());
  }, [dispatch]);

  // Filter items based on active gender
  const filteredItems = activeGender
    ? homeProducts.filter(item => item.gender === activeGender)
    : homeProducts;

  const isItemInFavorites = (itemId) => {
    return favoriteItems.some(item => item._id === itemId);
  };

  const handleFavoriteToggle = (item) => {
    if (isItemInFavorites(item._id)) {
      dispatch(removeFromFavoritesAsync(item._id));
    } else {
      dispatch(addToFavoritesAsync(item));
    }
  };

  const handleItemClick = (item) => {
    dispatch(setSelectedItem(item));
    navigate(`/item/${item._id}`);
  };

  const isItemInCart = (itemId) => {
    return cartItems.some(cartItem => cartItem._id === itemId);
  };

  return (
    <div className='mb35'>
      <section className='grid grid-cols-4 gap-6 max-xl:grid-cols-3 max-md:grid-cols-2 max-md:gap-2 max-md:place-items-center max-md:px-2 mb20 max-md:mb-0'>
        {filteredItems.map((item) => (
            <div key={item._id} onClick={() => handleItemClick(item)} className='flex flex-col gap-[18px] max-md:gap-2 rounded-[10px] p-3 shadow2 bg-white hover:shadow-md transition-all duration-200 max-sm:w-full'>
              <div className='relative'>
                <span
                  className="absolute top-2 right-2 cursor-pointer text-2xl select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(item);
                  }}
                >
                  <FaHeart className={isItemInFavorites(item._id) ? 'text-[#ff4081]' : 'text-[#CCCCCC]'} />
                </span>
                <img src={item.image} alt={item.desc} loading='lazy' className='w-full rounded-[5px]' />
              </div>

              <div className='flex flex-col gap-[7px] max-md:gap-1'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text3 text-[11px] max-[449px]:text-[8px]'>{item.category}</p>
                  <p className='text-sm text3 text-[11px] max-[449px]:text-[8px]'>{item.gender}</p>
                </div>
                <h2 className='font-semibold text1 text-[24px] truncate max-sm:text-[18px]'>{item.name}</h2>
                <p className='font-medium text3 text-[13px] truncate max-sm:hidden'>{item.desc}</p>
                <div className='flex items-center justify-between w-full'>
                  <span className='flex gap-1 text-yellow-400'>
                    <FaStar className='max-sm:text-[12px]' />
                    <FaStar className='max-sm:text-[12px]' />
                    <FaStar className='max-sm:text-[12px]' />
                  </span>
                  <ul className='flex gap-2'>
                    <li className='text-[16px] font-medium text5 cursor-pointer hover:underline max-sm:text-[13px]'>Rs. {item.sp}</li>
                    <p className='text3 text-[14px] line-through max-sm:text-[10px]'>Rs. {item.cp}</p>
                  </ul>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='text-[15px] text3 flex gap-[8px] max-md:text-[12px]'>Available items: <p className='font-semibold text1'>{item.available}</p></div>
                  {isItemInCart(item._id) && (
                    <FaCheckCircle className='text-green-400 text-[19px]' />
                  )}
                </div>
              </div>
            </div>
        ))}

        <div className='flex items-center justify-center w-full col-span-full'>
          <Link to={'/shop'} >
            <button className="py-2 px-12 bg-[#B8A38A] text-white text-[18px] font-medium hover:bg-[#fff] hover:text-[#B8A38A] hover:ease-in-out duration-500 border border-[#B8A38A]  max-md:text-[16px] rounded-full">
              More...
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomeProduct;
