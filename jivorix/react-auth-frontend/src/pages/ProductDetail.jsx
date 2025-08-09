import React from 'react';
import { useNavigate } from 'react-router-dom';
import Detail from '../components/productDetail/Detail';
import ProductDesc from '../components/productDetail/ProductDesc';
import ProductReview from '../components/productDetail/ProductReview';
import ProductComment from '../components/productDetail/ProductComment';
import { TbArrowBackUp } from "react-icons/tb";

const ProductDetail = () => {
  const navigate = useNavigate();

  return (
    <div className='container relative'>
      <div className='p-2 fixed z-10 cursor-pointer bg-[#B8A38A] rounded-full' onClick={() => navigate(-1)}>
        <TbArrowBackUp className='text-[45px] text1 text-white' />
      </div>
      <Detail />
      <ProductDesc />
      <ProductReview />
      <ProductComment />
    </div>
  );
};

export default ProductDetail;
