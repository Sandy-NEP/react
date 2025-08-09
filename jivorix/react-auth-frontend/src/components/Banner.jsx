import React from 'react'
import { assets } from '../assets/assets'

const Banner = () => {
  return (
    <div className='w-full mt-[10px]'>
      <section className='relative'>
        <div className='absolute h-full w-full allCenter flex-col gap-7 max-lg:gap-5 max-md:gap-3 max-sm:gap-1'>
          <h3 className='text-white text-[25px] text-nowrap max-lg:text-[20px] max-sm:text-[18px]'>Sale up to 50% OFF</h3>
          <button className='py-2 px-16 max-lg:px-12 rounded-[10px] bg-red-600 text-white max-md:text-[14px]'>Shop Now</button>
        </div>
          <img src={assets.banner} className='w-full' alt="banner..." loading='lazy' />
      </section>
    </div>
  )
}

export default Banner
