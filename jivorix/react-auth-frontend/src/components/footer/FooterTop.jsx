import React from 'react'
import { assets } from '../../assets/assets'
import { FaLocationDot } from "react-icons/fa6";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaPhone } from "react-icons/fa6";

const FooterTop = () => {
  return (
    <div className='grid grid-cols-12 Gap px-8 w-full py-8 max-lg:px-4 max-sm:px-2 bg-[#F0E9E0]'>
      <section className='col-span-3 max-lg:order-1 max-lg:col-span-6 max-lg:margin max-sm:col-span-full'>
        <div className='flex flex-col gap-[40px]'>
          <div className='w-[55%] max-sm:w-[50%] max-sm:m-auto'>
            <img src={assets.logo} className='w-full h-auto cursor-pointer' alt="logo..." loading='lazy' />
          </div>
          <div className='flex flex-col gap-[25px]'>
            <p className='text3 text-[16px] font-medium max-sm:text-center'>Elite Fashion Haven:<br /> World’s Finest Curated Digital Storefront</p>
            <ul className='flex flex-col gap-[15px] max-sm:items-center'>
              <li className='flex Gap text3 items-center justify-start'>
                <FaLocationDot className='text-[20px] text2' />
                <p className='hover:underline hover:text-[#b8a38a] cursor-pointer max-2xl:text-[14px]'>Address: 369Y Clametaoyow Ghol</p>
              </li>
              <li className='flex Gap text3 items-center justify-start'>
                <RiSendPlaneFill className='text-[22px] text2' />
                <p className='hover:underline hover:text-[#b8a38a] cursor-pointer max-2xl:text-[14px]'>Email: jivorix.nep@gmail.com</p>
              </li>
              <li className='flex Gap text3 items-center justify-start'>
                <FaPhone className='text-[19px] text2' />
                <p className='hover:underline hover:text-[#b8a38a] cursor-pointer max-2xl:text-[14px]'>Contact us: (+977) 540-025-124553</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className='col-span-7 max-xl:col-span-6 max-lg:col-span-full max-lg:order-3 max-lg:place-content-center max-lg:margin max-sm:col-span-full'>
        <span className='grid grid-cols-3'>
          <div className='flex flex-col gap-[30px] max-sm:col-span-full max-sm:margin'>
            <h1 className='footerHead'>Account</h1>
            <ul className='flex flex-col items-start justify-center no-underline Gap'>
              <li className='footerList'>About us</li>
              <li className='footerList'>Reviews</li>
              <li className='footerList'>Terms & Conditions</li>
              <li className='footerList'>Privacy & Policy</li>
              <li className='footerList'>Help Services</li>
              <li className='footerList'>Sitemap</li>
              <li className='footerList'>Support hub</li>
            </ul>
          </div>

          <div className='flex flex-col gap-[30px] max-sm:col-span-full max-sm:margin'>
            <h1 className='footerHead'>Corporate</h1>
            <ul className='flex flex-col items-start justify-center no-underline Gap'>
              <li className='footerList'>View Cart</li>
              <li className='footerList'>Favourite list</li>
              <li className='footerList'>Track my Order</li>
              <li className='footerList'>Shopping details</li>
              <li className='footerList'>Delivery Services</li>
              <li className='footerList'>Delivery Details</li>
              <li className='footerList'>Accessibility</li>
            </ul>
          </div>

          <div className='flex flex-col gap-[30px] max-sm:col-span-full'>
            <h1 className='footerHead'>Category</h1>
            <u className='flex flex-col items-start justify-center no-underline Gap'>
              <li className='footerList'>Seasonal collection</li>
              <li className='footerList'>Occasion based</li>
              <li className='footerList'>Style based</li>
              <li className='footerList'>Special collection</li>
              <li className='footerList'>Casual wares</li>
              <li className='footerList'>Sports & Activewear</li>
              <li className='footerList'>Traditional wear</li>
            </u>
          </div>
        </span>
      </section>

      <section className='col-span-2 max-xl:col-span-3 max-lg:col-span-6 max-lg:order-2 max-lg:place-content-center max-lg:margin max-sm:col-span-full'>
        <div className='flex flex-col gap-[30px]'>
          <h1 className='text-[18px] text1 font-semibold leading-3 max-sm:text-center'>Install App</h1>
          <div className='flex items-center justify-between Gap max-sm:justify-center'>
            <div>
              <img src={assets.app_store} className='w-full max-md:max-w-[150px]' alt="app_store..." loading='lazy' />
            </div>
            <div>
              <img src={assets.google_play} className='w-full max-md:max-w-[150px]' alt="google_play..." loading='lazy' />
            </div>
          </div>
          <h5 className='text1 font-medium text-[18px] max-sm:text-center'>Secured Payment Gateways</h5>
          <p className='text3 text-[14px] max-sm:text-center'>It is a long established will be distracted by the readable of a page when looking at its layout. The point of using Lorem Ipsum is that it has a making it look like readable English.</p>
        </div>
      </section>
    </div>
  )
}

export default FooterTop
