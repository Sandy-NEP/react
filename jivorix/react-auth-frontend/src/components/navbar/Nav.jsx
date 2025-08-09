import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { MdLocationPin } from "react-icons/md";
import SearchBar from './SearchBar';
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Nav = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.length;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost/react-auth-backend/user/get_user.php', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className='w-full px-3 max-md:px-2 bg-white items-center mb-0'>
      <div className='grid grid-cols-12 items-center max-lg:gap-3 max-md:gap-1 gap-4'>
        
        {/* Logo & Location */}
        <section className='col-span-2 max-2xl:col-span-3 max-sm:col-span-6 max-md:content-center max-sm:order-1'>
          <div className='w-full grid grid-cols-5 content-center max-sm:place-content-start'>
            
            <div className='w-full col-span-3 max-md:col-span-5 content-center max-sm:place-content-start max-sm:mr-[-25px]'>
              <Link to={'/home'}>
                <img src={assets.logo} className='w-full max-sm:h-[40px] max-sm:w-auto' alt="jivorix..." loading="lazy" />
              </Link>
            </div>

            <div className='w-full col-span-2 max-md:hidden'>
              <div className='flex items-center justify-center gap-[10px]'>
                <MdLocationPin className='text-[25px] text3' />
                <ul>
                  <li className='text3 text-[11px] font-medium text-nowrap'>Deliver to</li>
                  <h6 className='text1 text-base text2 font-semibold text-nowrap'>Nepal</h6>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className='col-span-8 max-2xl:col-span-6 max-sm:col-span-full max-md:content-center max-sm:order-3'>
          <SearchBar />
        </section>

        <section className='col-span-2 max-2xl:col-span-3 max-sm:col-span-6 max-md:content-center max-sm:order-2'>
          <div className='w-full flex items-center max-sm:justify-end gap-4 max-sm:gap-8 max-lg:gap-3'>
            
            <div className='w-1/3 max-sm:w-auto allCenter'>
              <Link to="/cart" className="relative group">
                <div className='allCenter absolute top-[-9px] left-5 h-[28px] w-[28px] max-lg:h-[22px] max-lg:w-[22px] bg-[#b8a38a] rounded-full cursor-pointer'>
                  <p className='text-center text-white text-[16px] max-lg:text-[14px]'>
                    {itemCount}
                  </p>
                </div>
                <div className='text-[30px] text2 bottom-0 mt-[8px] col-span-3 max-lg:text-[25px] max-md:col-span-8 cursor-pointer'>
                  <PiShoppingCartSimpleFill className='group-hover:text-[#B8A38A] transition-all duration-300' />
                </div>
              </Link>
            </div>

            <div className='w-2/3 max-sm:w-auto'>
              <Link to={'/profile'}>
                <div className='gap-4 max-lg:gap-2 flex max-sm:justify-end items-center group'>
                  <div className="w-[40px] h-[40px] max-lg:w-[40px] max-lg:h-[40px] rounded-full overflow-hidden shrink-0">
                    <img
                      src={userData?.profileImage || assets.user}
                      className='w-full h-full object-cover'
                      alt="user"
                      loading='lazy'
                    />
                  </div>
                  <ul className='max-sm:hidden'>
                    <li className='text3 text-[11px] font-medium text-nowrap'>Hello</li>
                    <h6 className='text1 text-base text2 font-semibold text-nowrap group-hover:underline transition-all duration-300'>
                      {loading ? '...' : (userData?.firstName || 'Guest')}
                    </h6>
                  </ul>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Nav;
