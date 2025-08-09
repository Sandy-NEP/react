import React from 'react'
import { assets } from '../../assets/assets'

const ContactInfo = () => {
  return (
    <section className='p-4 max-md:p-2'>
      <div className='flex flex-col gap-8 max-lg:gap-6 max-md:gap-5 max-sm:gap-4'>
        <h1 className='text1 font-bold text-3xl max-lg:text-2xl max-md:text-xl max-sm:text-[17px]'>Contact Us</h1>
        <div className='flex gap-5 items-center'>
          <img src={assets.landline} className='w-24 max-md:w-16 cursor-pointer' alt="" loading='lazy' />
          <p className='text-xl font-medium text3'>01-54654963</p>
        </div>
        <div>
          <li className='contactLi group'>
            <p className='contactp1'>Support:</p>
            <p className='contactp1'>166646468658</p>
          </li>
          <li className='contactLi group'>
            <p className='contactp2'>Toll Free (NTC) :</p>
            <p className='contactp2'>01-54654963</p>
          </li>
          <li className='contactLi group'>
            <p className='contactp2'>Inside Valley and Banepa :</p>
            <p className='contactp2'>01-54654963</p>
          </li>
          <li className='contactLi group'>
            <p className='contactp2'>Bagmati (Outside Valley) and Gandaki :</p>
            <p className='contactp2'>01-54654963</p>
          </li>
          <li className='contactLi group'>
            <p className='contactp2'>Province 1 and Madhesh Pradesh :</p>
            <p className='contactp2'>01-54654963</p>
          </li>
          <li className='contactLi group'>
            <p className='contactp2'>Lumbini, Karnali and Sudurpashchim :</p>
            <p className='contactp2'>01-54654963</p>
          </li>
        </div>
      </div>
    </section>
  )
}

export default ContactInfo
