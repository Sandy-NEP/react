import React from 'react'
import { assets } from '../../assets/assets'
import { FaFacebookF } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";

const FooterBottom = () => {
  return (
    <div className='flex justify-between items-center px-8 bg-black max-lg:px-4 w-full py-1 max-lg:grid max-lg:grid-cols-2'>
      <section className='max-lg:hidden'>
        <div className='allCenter Gap'>
          <img src={assets.flag} className='w-[19px] h-auto' alt="Flag..." loading='lazy' />
          <p className='text-[15px] text3 font-semibold text-center bottom-0'>Nepal</p>
        </div>
      </section>
      <section className='max-sm:text-center max-sm:order-2 max-sm:col-span-full'>
        <div>
          <p className='text-[12px] text3 font-semibold'>@ 2025, Jivorix - HTML Ecommerce Template All rights reserved</p>
        </div>
      </section>
      <section className='max-sm:order-1 max-sm:col-span-full max-sm:place-content-center max-sm:justify-center max-sm:mb15'>
        <div className='allCenter Gap '>
          <p className='text-[12px] text3 font-semibold'>Follow Us</p>
          <span className='allCenter Gap max-lg:gap-[8px]'>
            <li className='h-[35px] w-[35px] max-sm:h-[30px] max-sm:w-[30px] max-sm:text-[12px] allCenter rounded-full text3 text-[14px] bg-[#E0D7CC]'><FaFacebookF /></li>
            <li className='h-[35px] w-[35px] max-sm:h-[30px] max-sm:w-[30px] max-sm:text-[12px] allCenter rounded-full text3 text-[14px] bg-[#E0D7CC]'><FaXTwitter /></li>
            <li className='h-[35px] w-[35px] max-sm:h-[30px] max-sm:w-[30px] max-sm:text-[12px] allCenter rounded-full text3 text-[14px] bg-[#E0D7CC]'><FaYoutube /></li>
            <li className='h-[35px] w-[35px] max-sm:h-[30px] max-sm:w-[30px] max-sm:text-[12px] allCenter rounded-full text3 text-[14px] bg-[#E0D7CC]'><IoLogoInstagram /></li>
          </span>
        </div>
      </section>
    </div>
  )
}

export default FooterBottom
