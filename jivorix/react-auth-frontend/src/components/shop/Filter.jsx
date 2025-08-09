// shop/Filter.jsx
import React from 'react';
import { categories } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { applyCategoryFilter, clearCategoryFilter } from '../../redux/category/categoryPaginationSlice';

const Filter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeCategory } = useSelector((state) => state.categoryPagination);
  const { randomizedItems } = useSelector((state) => state.pagination);

  const handleCategoryClick = (category) => {
    if (activeCategory === category) {
      dispatch(clearCategoryFilter());
      navigate('/shop');
    } else {
      dispatch(applyCategoryFilter({ items: randomizedItems, category }));
      navigate(`/shop?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className='mb30'>
      <h1 className='text-[25px] max-md:text-[18px] font-medium text-center mb25 max-md:mb15'>Find with easy way...</h1>
      <section className="flex flex-wrap justify-center Gap px-7 max-sm:p-0 max-md:flex-nowrap sc scroll-smooth max-md:overflow-scroll max-md:justify-start">
        {categories.map((item, index) => (
          <div 
            key={index} 
            className="min-w-[140px] cursor-pointer group"
            onClick={() => handleCategoryClick(item.name.toLowerCase())}
          >
            <div  className="p-2 allCenter flex-col gap-2 max-md:max-w-[220px]">
              <img
                src={item.image}
                className={`rounded-full bg-[#F3EDE5] h-28 w-28 max-md:h-24 max-md:w-24 max-sm:w-20 max-sm:h-20 transition-transform duration-300 group-hover:-translate-y-[5px] group-hover:shadow-[0_0_13px_0_rgb(0,0,0,0.2)] ease-in-out ${
                  activeCategory === item.name.toLowerCase() ? 'ring-[#B98C59]' : ''
                }`}
                alt=""
                loading="lazy"
              />
              <h5 className="text2 font-semibold text-center">{item.name}</h5>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Filter;