// shop/LeftHome.jsx
import React, { useState, useEffect } from 'react';
import { FaCaretRight } from "react-icons/fa";
import { assets } from '../../assets/assets';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { applyCategoryFilter } from '../../redux/category/categoryPaginationSlice';
import { items } from '../../assets/assets';

const LeftHome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { randomizedItems } = useSelector((state) => state.pagination);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No user logged in');
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
          setError('');
        } else {
          setError(response.data.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching user data');
        console.error('Fetch user error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCategoryClick = (category) => {
    const encodedCategory = encodeURIComponent(category.toLowerCase());
    navigate(`/shop?category=${encodedCategory}`);
  };

  const categoryList = [
    "Seasonal collection",
    "Occasion based",
    "Style based",
    "Special collection",
    "Casual wares",
    "Sports & Activewear",
    "Traditional Wear"
  ];

  if (loading) {
    return (
      <aside className="p-5 mb-5 max-xl:p-3 rounded-[15px] shadow1 bg-white">
        <p className="text3 text-sm">Loading...</p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="p-5 mb-5 max-xl:p-3 rounded-[15px] shadow1 bg-white">
        <p className="text-red-500 text-sm">{error}</p>
      </aside>
    );
  }

  return (
    <aside className='p-5 max-xl:p-3 rounded-[15px] shadow1 bg-white'>
      <div className='flex flex-col gap-[30px]'>

        <section className='flex flex-col Gap'>
          <div className='w-full flex flex-col Gap'>
            <h1 className='text1 text-[26px] font-medium'>Categories</h1>
            <span className='h-[2px] w-full rounded-full bg3'></span>
          </div>
          <ul className='flex flex-col no-underline Gap mb15'>
            {categoryList.map((category, idx) => (
              <li
                key={idx}
                onClick={() => handleCategoryClick(category)}
                className='group categoryBox text3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition rounded px-2 py-1'
              >
                <p className='text-[16px] max-md:text-[14px] font-medium'>{category}</p>
                <FaCaretRight className='group-hover:translate-x-1 transition-all ease-in-out duration-300' />
              </li>
            ))}
          </ul>
          <Link to="/shop">
            <button className='button1 w-full max-md:text-[16px]'>Shop Now</button>
          </Link>
        </section>

        <section className='flex flex-col Gap'>
          <div className='w-full flex flex-col Gap'>
            <h1 className='text1 text-[26px] font-medium'>Help & Support</h1>
            <span className='h-[2px] w-full rounded-full bg3'></span>
          </div>
          <ul className='flex flex-col items-start justify-center no-underline Gap mb10'>
            {["Help", "About", "FAQ Questions", "Terms & Conditions", "Privacy Policy", "Contact Us"].map((item, idx) => (
              <li key={idx} className='footerList'>{item}</li>
            ))}
          </ul>
          <div className='flex Gap items-center'>
            <Link to={'/profile'} className='flex items-center gap-2'>
              <img
                src={userData?.profileImage || assets.user}
                className='w-[60px] h-[60px] rounded-full object-cover'
                alt="user profile"
                loading='lazy'
              />
              <ul>
                <h6 className='text1 text-base text2 font-semibold text-nowrap'>
                  {userData?.firstName || 'Guest'}
                </h6>
                <li className='text3 text-[11px] font-medium text-nowrap'>
                  #{userData?.id || 'N/A'}
                </li>
              </ul>
            </Link>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default LeftHome;
