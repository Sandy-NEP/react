import React from 'react';
import Filter from '../components/shop/Filter';
import Items from '../components/shop/Items';
import Icons from '../components/Icons';
import Banner from '../components/Banner';
import ProductTitle from '../components/home/right/ProductTitle';

const Shop = () => {
  return (
    <div>
      <Filter />
      <ProductTitle />
      <Items />
      <Icons />
      <Banner />
    </div>
  );
};

export default Shop;
