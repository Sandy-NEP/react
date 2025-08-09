import React from 'react';
import { IoStar } from "react-icons/io5";
import { comment } from '../../assets/assets';
import {AiFillDislike, AiFillLike } from "react-icons/ai";

const ProductComment = () => {
  return (
    <section className='mb30'>
      <div className='grid grid-cols-2 max-md:grid-cols-1 gap-5 mb20'>
        {
          comment.map((comment, index) => (
            <div key={index} className='flex flex-col gap-4 bg-white p-5 rounded-[10px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.1)]'>
              <div>

                <div className='flex items-center justify-between mb20'>
                  <div className='allCenter gap-3 text-[#DE7921] text-[22px] max-md:text-[20px]'>
                    <IoStar />
                    <IoStar />
                    <IoStar />
                  </div>
                  <div className='text3 max-lg:text-[14px] max-sm:text-[10px]'>{comment.date}</div>
                </div>

                <div className='flex flex-col gap-2 mb20'>
                  <h3 className='text1 text-2xl max-lg:text-xl max-md:text-[18px] max-sm:text-[17px] font-semibold'>{comment.title}</h3>
                  <div className='flex gap-5 items-center'>
                    <p className='text3 max-lg:text-[14px] max-sm:text-[10px]'>Color : {comment.color}</p>
                    <div className='h-2 w-2 bg3 rounded-full'></div>
                    <p className='text3 max-lg:text-[14px] max-sm:text-[10px]'>Size : {comment.size}</p>
                  </div>
                </div>

                <div className='mb20'>
                  <p className='text3 text-[14px] max-sm:text-[10px]'>{comment.cmt}</p>
                </div>

                <div className='flex gap-10 items-center'>
                  <span className='text3 flex gap-3 items-center group'>
                    <AiFillLike className='text-[24px] max-md:text-[22px] max-sm:text-[20px] group-hover:text-[#c0a98f]' />
                    <p className='max-md:text-[14px] max-sm:text-[12px] group-hover:text-[#c0a98f] transition-all duration-300'>{comment.like}</p>
                  </span>
                  <span className='text3 flex gap-3 items-center group'>
                    <AiFillDislike className='text-[24px] max-md:text-[22px] max-sm:text-[20px] group-hover:text-[#c0a98f]' />
                    <p className='max-md:text-[14px] max-sm:text-[12px] group-hover:text-[#c0a98f] transition-all duration-300'>{comment.unlike}</p>
                  </span>
                </div>

              </div>
            </div>
          ))
        }
      </div>
      <div className='allCenter w-full'>
        <button className='button2 px-8 max-md:text-[14px] max-md:px-6 max-sm:text-[12px]'>See All Reviews...</button>
      </div>
    </section>
  )
}

export default ProductComment
