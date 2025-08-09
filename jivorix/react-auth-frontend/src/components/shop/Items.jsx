// shop/Items.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeItems, goToPage, nextPage, prevPage } from '../../redux/pagination/paginationSlice';
import { applyCategoryFilter, goToCategoryPage, nextCategoryPage, prevCategoryPage } from '../../redux/category/categoryPaginationSlice';
import { addItemToCartAsync } from '../../redux/cart/cartSlice';
import { items as allItems } from '../../assets/assets';
import { FaHeart, FaStar, FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { addToFavoritesAsync, removeFromFavoritesAsync } from '../../redux/favorite/favoriteSlice';
import { setSelectedItem } from '../../redux/detail/detailSlice';

const Items = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeGender } = useSelector((state) => state.gender);
  const { refreshCount } = useSelector((state) => state.refresh);
  const { favoriteItems } = useSelector((state) => state.favorite);
  const { items: cartItems } = useSelector(state => state.cart);

  const {
    currentPage,
    itemsPerPage,
    randomizedItems
  } = useSelector((state) => state.pagination);

  const {
    categoryFilteredItems,
    currentCategoryPage,
    itemsPerCategoryPage,
    activeCategory
  } = useSelector((state) => state.categoryPagination);

  useEffect(() => {
    dispatch(initializeItems(allItems));
  }, [dispatch]);

  const itemsToUse = activeCategory ? categoryFilteredItems : randomizedItems;
  const filteredItems = activeGender
    ? itemsToUse.filter(item => item.gender === activeGender)
    : itemsToUse;

  const currentPageToUse = activeCategory ? currentCategoryPage : currentPage;
  const itemsPerPageToUse = activeCategory ? itemsPerCategoryPage : itemsPerPage;

  const startIdx = (currentPageToUse - 1) * itemsPerPageToUse;
  const endIdx = startIdx + itemsPerPageToUse;
  const paginatedItems = filteredItems.slice(startIdx, endIdx);

  const maxPage = Math.ceil(filteredItems.length / itemsPerPageToUse);

  const handlePageChange = (pageNum) => {
    if (activeCategory) {
      dispatch(goToCategoryPage(pageNum));
    } else {
      dispatch(goToPage(pageNum));
    }
  };

  const handleNextPage = () => {
    if (activeCategory) {
      dispatch(nextCategoryPage());
    } else {
      dispatch(nextPage());
    }
  };

  const handlePrevPage = () => {
    if (activeCategory) {
      dispatch(prevCategoryPage());
    } else {
      dispatch(prevPage());
    }
  };

  const handleAddToCart = async (e, item) => {
    e.stopPropagation(); // Stop event bubbling

    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const cartItem = {
      _id: item._id,
      name: item.name,
      image: item.image,
      desc: item.desc,
      price: parseFloat(item.sp.replace(',', '')),
      available: item.available
    };

    try {
      await dispatch(addItemToCartAsync({ item: cartItem, selectedSize: 'M' })).unwrap();
      // Success feedback could be added here
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      alert('Failed to add item to cart: ' + error);
    }
  };

  const isItemInFavorites = (itemId) => {
    return favoriteItems.some(item => item._id === itemId);
  };

  const handleFavoriteToggle = async (e, item) => {
    e.stopPropagation(); // Stop event bubbling

    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login to add items to favorites');
      navigate('/login');
      return;
    }

    try {
      if (isItemInFavorites(item._id)) {
        await dispatch(removeFromFavoritesAsync(item._id)).unwrap();
      } else {
        await dispatch(addToFavoritesAsync(item)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('Failed to update favorites: ' + error);
    }
  };

  const handleItemClick = (item) => {
    dispatch(setSelectedItem(item));
    navigate(`/item/${item._id}`);
  };

  const isItemInCart = (itemId) => {
    return cartItems.some(cartItem => cartItem._id === itemId || cartItem.product_id === itemId);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');

    if (category) {
      dispatch(applyCategoryFilter({ items: allItems, category }));
    } else {
      dispatch(applyCategoryFilter({ items: allItems, category: null }));
    }
  }, [location.search, dispatch, activeGender, refreshCount]);

  return (
    <div className='mb30'>
      <section className='grid grid-cols-4 gap-6 max-xl:grid-cols-3 max-md:grid-cols-2 max-md:gap-2 max-md:place-items-center max-md:px-2 mb20 max-md:mb-0'>
        {paginatedItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(item)}
            className='flex flex-col gap-[18px] max-md:gap-2 rounded-[10px] p-3 shadow2 bg-white hover:shadow-md transition-all duration-200 max-sm:w-full'>
            <div className='relative'>
              <span
                className="absolute top-2 right-2 cursor-pointer text-2xl select-none"
                onClick={(e) => handleFavoriteToggle(e, item)}
              >
                <FaHeart className={isItemInFavorites(item._id) ? 'text-[#ff4081]' : 'text-[#CCCCCC]'} />
              </span>
              <img src={item.image} alt={item.desc} loading='lazy' className='w-full bg-white rounded-[5px]' />
            </div>
            <div className='flex flex-col gap-[7px]'>
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
                  <li className='text-[16px] font-medium text5 cursor-pointer hover:underline max-sm:text-[13px]'>₹. {item.sp}</li>
                  <p className='text3 text-[14px] line-through max-sm:text-[10px]'>₹. {item.cp}</p>
                </ul>
              </div>
             <div className='flex justify-between items-center'>
                <div className='text-[15px] text3 flex gap-[8px] max-md:text-[12px]'>Available items: <p className='font-semibold text1'>{item.available}</p></div>
                {isItemInCart(item._id) && (
                  <FaCheckCircle className='text-green-400 text-[19px]' />
                )}
              </div>
              <button
                className='productbtn w-full mt-2'
                onClick={(e) => handleAddToCart(e, item)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Pagination Controls (unchanged) */}
      <section>
        <div className='flex items-end justify-center Gap'>
          {currentPageToUse > 1 && (
            <button onClick={handlePrevPage}
              className="allCenter h-[40px] w-[40px] rounded-full font-semibold text-white hover:border-[#EB7C1B] bg-[#B8A38A] cursor-pointer">
              <FaArrowLeft />
            </button>
          )}

          <ul className='allCenter gap-1'>
            {[...Array(maxPage)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPageToUse;

              if (
                pageNum === 1 ||
                pageNum === maxPage ||
                Math.abs(currentPageToUse - pageNum) <= 1
              ) {
                return (
                  <li key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-[40px] w-[40px] rounded-full font-semibold text-white allCenter cursor-pointer mx-1
                        ${isActive ? 'bg-[#B98C59] border-[#EB7C1B]' : 'bg-[#B8A38A] border-[#B8A38A]'}`}>
                    {pageNum}
                  </li>
                );
              } else if (
                (pageNum === currentPageToUse - 2 || pageNum === currentPageToUse + 2)
              ) {
                return <li key={pageNum} className='flex gap-4 items-center justify-end mt-5'>
                  <span className='w-3 h-3 rounded-full bg-[#B8A38A]'></span>
                  <span className='w-3 h-3 rounded-full bg-[#B8A38A]'></span>
                  <span className='w-3 h-3 rounded-full bg-[#B8A38A]'></span>
                </li>;
              }
              return null;
            })}
          </ul>

          {currentPageToUse < maxPage && (
            <button onClick={handleNextPage}
              className="allCenter h-[40px] w-[40px] rounded-full font-semibold text-white hover:border-[#EB7C1B] bg-[#B8A38A] cursor-pointer">
              <FaArrowRight />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Items;
