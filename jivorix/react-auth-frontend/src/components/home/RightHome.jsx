import React from 'react';
import Hero from './right/Hero';
import ProductTitle from './right/ProductTitle';
import HomeProduct from './right/HomeProduct';
import Icons from '../Icons';
import Banner from '../Banner';
// import { ImOffice, ImStumbleupon } from 'react-icons/im';

const RightHome = () => {
  return (
    <div>
      <Hero />
      <ProductTitle />
      <HomeProduct />
      <Icons />
      <Banner />
    </div>
  );
};

export default RightHome;
