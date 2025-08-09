import React from 'react';
import { HiOutlineRefresh } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { setGender, resetGender } from '../../../redux/gender/genderSlice';
import { incrementRefresh } from '../../../redux/refresh/refreshSlice'; 

const ProductTitle = () => {
  const dispatch = useDispatch();
  const activeGender = useSelector((state) => state.gender.activeGender);

  const handleGenderClick = (gender) => {
    dispatch(setGender(gender));
  };

  const handleRefreshClick = () => {
    dispatch(resetGender());
    dispatch(incrementRefresh()); // This will trigger the refresh
  };

  return (
    <div className='mb20'>
      <section className='flex items-center justify-between gap-4'>
        <div className='flex items-center justify-start gap-2'>
          <h1 className='font-semibold text1 text-[23px] max-lg:text-[18px] max-sm:text-[14px] max-md:text-[16px]'>Jivorix online shopping website</h1>
          <p className='max-xl:hidden text3'>(products available)</p>
        </div>
        <div className='flex items-center justify-end gap-3 max-md:gap-2'>
          <button 
            className={`button1 px-7 max-md:px-3 max-sm:px-2 max-md:text-[13px] ${activeGender === 'male' ? 'bg-[#B8A38A] text-white' : ''}`}
            onClick={() => handleGenderClick('male')}
          >
            Male
          </button>
          <button 
            className={`button1 px-7 max-md:px-3 max-sm:px-2 max-md:text-[13px] ${activeGender === 'female' ? 'bg-[#B8A38A] text-white' : ''}`}
            onClick={() => handleGenderClick('female')}
          >
            Female
          </button>
          <button 
            className="p-3 bg-[#B8A38A] rounded-full text-white text-[20px] max-sm:hidden"
            onClick={handleRefreshClick}
          >
            <HiOutlineRefresh />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductTitle;