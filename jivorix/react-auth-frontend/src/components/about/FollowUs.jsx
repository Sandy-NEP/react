import React from 'react'
import { FaYoutube, FaLinkedinIn, FaTiktok, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { assets } from '../../assets/assets';

const FollowUs = () => {
  return (
    <section className='p-4 max-md:p-2 flex flex-col gap-8 max-lg:gap-6 max-md:gap-5 max-sm:gap-4'>
      <div className='flex flex-col gap-8 max-lg:gap-6 max-md:gap-5 max-sm:gap-4'>
        <h1 className='text1 font-bold text-3xl max-lg:text-2xl max-md:text-xl max-sm:text-[17px]'>Follow Us</h1>
        <aside className='flex gap-3'>
          <div className='allCenter p-3 max-sm:p-2 cursor-pointer rounded-full button1'><FaYoutube /></div>
          <div className='allCenter p-3 max-sm:p-2 cursor-pointer rounded-full button1'><FaLinkedinIn /></div>
          <div className='allCenter p-3 max-sm:p-2 cursor-pointer rounded-full button1'><FaTiktok /></div>
          <div className='allCenter p-3 max-sm:p-2 cursor-pointer rounded-full button1'><FaFacebookF /></div>
          <div className='allCenter p-3 max-sm:p-2 cursor-pointer rounded-full button1'><FaInstagram /></div>
          <div className='allCenter p-3 max-sm:p-2 cursor-pointer rounded-full button1'><FaTwitter /></div>
        </aside>
      </div>      

      <div className='flex flex-col gap-8 max-lg:gap-6 max-md:gap-5 max-sm:gap-4'>
        <h1 className='text1 font-semibold text-2xl max-lg:text-xl max-md:text-[18px] max-sm:text-[16px]'>Download Jivorix mobile App</h1>
          <div className='flex items-center gap-8 max-md:gap-4'>
            <div>
              <img src={assets.app_store} className='max-w-[150px] cursor-pointer' alt="app_store..." loading='lazy' />
            </div>
            <div>
              <img src={assets.google_play} className='max-w-[150px] cursor-pointer' alt="google_play..." loading='lazy' />
            </div>
          </div>
      </div>      
    </section>
  )
}

export default FollowUs
