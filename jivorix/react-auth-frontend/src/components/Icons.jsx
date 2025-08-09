import React from 'react'
import DividerLine from './DividerLine'
import { FaTruck } from "react-icons/fa";
import { FaGlobeAsia } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";

const Icons = () => {
  return (
    <div>
      <DividerLine />
      <section className='grid grid-cols-5 items-start justify-between Gap max-xl:grid-cols-3 max-sm:grid-cols-2 max-sm:px-5 max-[420px]:px-0 mb20'>
        <li className='flex items-center max-sm:justify-start'>
          <div className='allCenter Gap'>
            <FaTruck className='text-[35px] text-[#B8A38A]' />
            <h4 className='iconText'>NEXT-DAY SHIPPING<br />AVAILABLE</h4>
          </div>
        </li>
        <li className='allCenter max-sm:justify-end'>
          <div className='allCenter Gap'>
            <FaGlobeAsia className='text-[35px] text-[#B8A38A]' />
            <h4 className='iconText'>SHOPPING TO OVER<br />230 OUNTRIES</h4>
          </div>
        </li>
        <li className='allCenter max-xl:justify-end max-sm:justify-start'>
          <div className='allCenter Gap'>
            <IoShieldCheckmark className='text-[35px] text-[#B8A38A]' />
            <h4 className='iconText'>100% SECURE<br />CHECKOUT</h4>
          </div>
        </li>
        <li className='allCenter max-xl:justify-start max-sm:justify-end'>
          <div className='allCenter Gap'>
            <FaStar className='text-[35px] text-[#B8A38A]' />
            <h4 className='iconText'>OVER 3,600<br />APPRAISE REVIEWS</h4>
          </div>
        </li>
        <li className='flex items-center justify-end max-xl:justify-center max-sm:col-span-full max-sm:justify-center'>
          <div className='allCenter Gap'>
            <FaCreditCard className='text-[35px] text-[#B8A38A]' />
            <h4 className='iconText'>Secure Payment<br />& Easy Returns</h4>
          </div>
        </li>
      </section>
      <DividerLine />
    </div>
  )
}

export default Icons
