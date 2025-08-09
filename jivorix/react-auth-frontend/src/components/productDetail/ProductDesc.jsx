import React from 'react'

const ProductDesc = () => {
  return (
    <section className='mt-[30px] mb30'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-3xl max-lg:text-2xl max-md:text-xl max-sm:text-[18px] font-semibold'>Product Details</h1>
        
        <div className='flex gap-4 max-sm:flex-col'>
          <span className='w-1/2 max-sm:w-full pr-3 max-lg:pr-2 max-sm:order-2 max-sm:pl-3'>
            <p className=' text3 text-[15px] max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]'>Stay cool, comfortable, and stylish on and off the course with the Ben Hogan Men's Solid Ottoman Golf Polo. Crafted from durable textured Ottoman fabric, this polo features moisture-wicking technology to keep you dry and SPF protection to shield you from harmful UV rays. The classic ribbed collar and three-button placket offer timeless appeal, while the stretchy, easy-care fabric ensures all-day comfort.</p>
            <ul className='mt-4'>
              <li className='flex gap-2 text3 text-[16px] max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]'>
                <p>Package Dimensions</p>
                <div>:</div>
                <p>27.3 x 24.8 x 4.9 cm</p>
              </li>
              <li className='flex gap-2 text3 text-[16px] max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]'>
                <p>Weight</p>
                <div>:</div>
                <p>180 g</p>
              </li>
              <li className='flex gap-2 text3 text-[16px] max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]'>
                <p>Department</p>
                <div>:</div>
                <p>Men's</p>
              </li>
            </ul>
          </span>
          <span className='w-1/2 max-sm:w-full pl-3 max-lg:pl-2 max-sm:order-1'>
            <li className='li list-disc text3 text-[15px] max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]'>Moisture-wicking fabric keeps you dry</li>
            <li className='li list-disc text3 text-[15px] max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]'>UPF sun protection for added safety</li>
            <li className='li list-disc text3 text-[15px] max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]'>Stretchy, breathable material for unrestricted movement</li>
            <li className='li list-disc text3 text-[15px] max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]'>Low-maintenance and machine-washable</li>
            <li className='li list-disc text3 text-[15px] max-lg:text-[14px] max-md:text-[12px] max-sm:text-[10px]'>Versatile solid color pairs effortlessly with any outfit</li>
          </span>
        </div>
      </div>
    </section>
  )
}

export default ProductDesc
