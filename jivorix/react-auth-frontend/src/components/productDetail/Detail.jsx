import React from 'react';
import { Star, ZoomIn, ZoomOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCartAsync } from '../../redux/cart/cartSlice';
import { setSelectedSize, setIsZoomed } from '../../redux/detail/detailSlice';
import { IoChatboxEllipses } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosShareAlt } from "react-icons/io";
import { select } from 'framer-motion/client';

export default function Detail() {
  const dispatch = useDispatch();
  const { selectedItem } = useSelector((state) => state.detail);
  const { selectedSize, isZoomed } = useSelector((state) => state.detail);

  const sizes = ["S", "M", "L", "XL", "2XL"];

  const handleSizeSelect = (size) => {
    dispatch(setSelectedSize(size));
  };

  const toggleZoom = () => {
    dispatch(setIsZoomed(!isZoomed));
  };

  const handleAddToCart = async () => {
    if (!selectedItem) return;

    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    const cartItem = {
      _id: selectedItem._id,
      name: selectedItem.name,
      image: selectedItem.image,
      desc: selectedItem.desc,
      price: parseFloat(selectedItem.sp.replace(',', '')),
      available: selectedItem.available
    };

    try {
      await dispatch(addItemToCartAsync({ item: cartItem, selectedSize })).unwrap();
      // Success feedback could be added here
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      alert('Failed to add item to cart: ' + error);
    }
  };

  if (!selectedItem) {
    return (
      <div className="min-h-screen bg-[#f9f5f0] p-8 flex justify-center items-center mt-[120px]">
        <p>No product selected</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f5f0] flex justify-center">
      <div className="w-full grid grid-cols-2 max-sm:grid-cols-1 gap-8 max-lg:gap-6 max-md:gap-4">
        <div className="relative allCenter bg-white rounded-[15px] overflow-hidden">
          <img
            src={selectedItem.image}
            alt={selectedItem.desc}
            className={`rounded-2xl w-auto shadow-md transition-transform duration-300 ${isZoomed ? 'scale-[1.7] cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={toggleZoom}
          />
          <button
            onClick={toggleZoom}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
            aria-label="Zoom"
          >
            {isZoomed ? (
              <ZoomOut className="h-7 w-7 max-md:w-5 max-md:h-5 text1" />
            ) : (
              <ZoomIn className="h-7 w-7 max-md:w-5 max-md:h-5 text1" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-4 max-lg:gap-3 max-md:gap-2 max-sm:gap-2">
          <div className='flex flex-col gap-6 max-md:gap-3 max-sm:gap-1'>
            <h1 className="text-6xl max-xl:text-5xl max-lg:text-4xl max-md:text-2xl font-bold text1">{selectedItem.name}</h1>
            <p className='text-2xl max-lg:text-xl max-md:text-[14px] max-sm:text-[11px] text3 truncate'>{selectedItem.desc}</p>
          </div>

          <div className='flex gap-1 items-center justify-between'>
            <p className='max-md:text-[10px]'>11k + sold</p>
            <div className='h-3 w-3 max-md:h-2 max-md:w-2 bg1 rounded-full'></div>
            <span className="flex items-center gap-1 text3 text-xl max-md:text-[10px]">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              ))}
              3/3
            </span>
            <div className='h-3 w-3 max-md:h-2 max-md:w-2 bg1 rounded-full'></div>
            <p className='max-md:text-[10px]'>132 Reviews</p>
          </div>

          <div className='flex justify-between items-center gap-4 max-lg:gap-2 mb-16 max-lg:mb-2'>
            <div className="flex items-center gap-4 max-lg:gap-2 max-lg:flex-col max-lg:items-start">
              <div className=' flex items-center justify-center gap-4'>
                <div className='h-3 w-3 bg3 rounded-full'></div>
                <span className='text3 text-xl max-md:text-[12px]'>{selectedItem.category}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-4 max-lg:gap-2 max-lg:flex-col max-lg:items-end">
              <span className='text-[30px] max-lg:text-[24px] max-md:text-[20px] font-medium text6 cursor-pointer max-sm:text-[16px]'>Rs. {selectedItem.sp}</span>
              <span className='text3 text-[20px] line-through max-sm:text-[10px]'>Rs. {selectedItem.cp}</span>
            </div>
          </div>

          <div>
            <p className="text3 max-md:text-[14px] max-sm:text-[12px]">Available: {selectedItem.available} items</p>
          </div>

          <div className='flex flex-col gap-4'>
            <div className="flex justify-between items-center">
              <span className="text3 text-xl font-medium max-md:text-[20px] max-sm:text-[15px]">Select Size</span>
              <a href="#" className="text-xl text3 hovere:underlin max-md:text-[20px] max-sm:text-[15px]">Size Guide</a>
            </div>
            <div className="flex gap-3">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`rounded-[10px] px-5 py-2 max-md:px-4 border transition-colors duration-300 text-[18px] max-md:text-[14px] ${
                    selectedSize === size
                      ? "bg-[#B8A38A] text-white border-[#B8A38A]"
                      : "bg-white text-[#B8A38A] border-[#B8A38A] hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-4'>
            <button
              onClick={handleAddToCart}
              className="button1 w-full"
            >
              Add to Cart
            </button>
          </div>

          <div className='flex gap-2 items-center justify-between py-5'>
            <span className='flex items-center justify-center gap-3 max-lg:gap-2 max-md:gap-1 text2 text-2xl max-lg:text-[20px] max-md:text-[17px] font-medium'>
              <IoChatboxEllipses />
              Chat
            </span>
            <div className='h-full w-[2px] bg-[#E0D7CC]'></div>
            <span className='flex items-center justify-center gap-3 max-lg:gap-2 max-md:gap-1 text2 text-2xl max-lg:text-[20px] max-md:text-[17px] font-medium'>
              <IoMdHeartEmpty />
              Favourite
            </span>
            <div className='h-full w-[2px] bg-[#E0D7CC]'></div>
            <span className='flex items-center justify-center gap-3 max-lg:gap-2 max-md:gap-1 text2 text-2xl max-lg:text-[20px] max-md:text-[17px] font-medium'>
              <IoIosShareAlt />
              Share
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
