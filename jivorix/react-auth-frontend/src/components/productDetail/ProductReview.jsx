import React from 'react'
import RatingSummary from './reviews/RatingSummary'
import RatingBar from './reviews/RatingBar'

const ProductReview = () => {

  const totalRatings = 362; 

  const ratings = [
    { stars: 3, count: 250 },
    { stars: 2, count: 99 },
    { stars: 1, count: 13 },
  ];

  return (
    <section className='mb30'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-3xl max-lg:text-2xl max-md:text-xl max-sm:text-[18px] font-semibold'>Customer Reviews</h1>

        <div className='relative flex gap-8 max-md:gap-5 max-md:flex-col items-center max-sm:flex-col'>
          <div className='w-1/2 max-md:w-full h-full bg-white px-5 py-6 rounded-[10px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.1)]'>
            <RatingSummary />
          </div>
          <div className='w-1/2 max-md:w-full flex flex-col gap-2 bg-white p-5 rounded-[10px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.1)]'>
            {ratings.map(r => (
              <RatingBar key={r.stars} stars={r.stars} count={r.count} total={totalRatings} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductReview
