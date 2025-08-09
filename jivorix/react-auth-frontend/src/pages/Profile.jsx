import React from 'react'
import ProfileLeft from '../components/profile/ProfileLeft'
import ProfileRight from '../components/profile/ProfileRight'
import ProfileMiddle from '../components/profile/ProfileMiddle'
import LeftHome from '../components/home/LeftHome'

const Profile = () => {
  return (
    <section>
      <div className='mb20'>
        <div>
          <div className='flex max-lg:flex-col gap-4 max-lg:gap-6'>
            <div className='w-[31%] max-lg:w-full'>
              <ProfileLeft />
            </div>
            <div className='w-[34.5%] max-lg:w-full'>
              <ProfileMiddle />
            </div>
            <div className='w-[34.5%] max-lg:w-full'>
              <ProfileRight />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Profile