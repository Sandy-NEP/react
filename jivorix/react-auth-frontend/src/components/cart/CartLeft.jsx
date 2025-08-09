// src/components/cart/CartLeft.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeItemFromCartAsync,
  updateCartItemQuantityAsync,
  toggleItemSelection,
  selectAllItems,
  selectCartTotal,
  selectIsItemInStock,
} from '../../redux/cart/cartSlice';
import { IoAddCircle } from "react-icons/io5";
import { FaCircleMinus } from "react-icons/fa6";
import { RiDeleteBin6Fill } from "react-icons/ri";
import DividerLine from '../DividerLine';
import { Link } from 'react-router-dom';


const CartLeft = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector(selectCartTotal);

  const allItemsSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  const handleRemoveSelected = async () => {
    const selectedItems = cartItems.filter(item => item.selected);
    for (const item of selectedItems) {
      try {
        await dispatch(removeItemFromCartAsync(item.id)).unwrap();
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    }
  };

  const handleSelectAll = () => {
    dispatch(selectAllItems(!allItemsSelected));
  };

  return (
    <section className="w-full bg-white p-6 max-md:p-4 max-sm:p-3 rounded-[15px] shadow-[0_0_6px_0_rgb(0,0,0,0.2)]">
      <div className=" flex justify-between max-sm:flex-col items-center mb-4">
        <h2 className="text-xl font-semibold text1 max-sm:text-[17px] text-start max-sm:w-full">Your Cart ({cartItems.length})</h2>
        <div className="flex gap-4 max-sm:gap-2 max-sm:justify-between max-sm:w-full">
          <aside
            className='flex items-center gap-2 cursor-pointer'
            onClick={handleSelectAll}
          >
            <input
              type="checkbox"
              className='h-5 w-5 cursor-pointer'
              checked={allItemsSelected}
              onChange={handleSelectAll}
              onClick={(e) => e.stopPropagation()}
            />
            <p className='select-none'>Select All</p>
          </aside>
          <button onClick={handleRemoveSelected} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Remove All
          </button>
        </div>
      </div>
      <hr className='w-full h-1 bg-[#D9D9D9] mb-5' />

      {cartItems.length === 0 ? (
        <div>
          <p className="text-center w-full py-10">Your cart is empty</p>
          <Link to={'/shop'} className='allCenter' >
            <button className="py-2 px-12 bg-[#B8A38A] text-white text-[18px] font-medium hover:bg-[#fff] hover:text-[#B8A38A] hover:ease-in-out duration-500 border border-[#B8A38A]  max-md:text-[16px] rounded-full">
              Shop Now...
            </button>
          </Link>
        </div>
      ) : (
        <div className="max-sm:grid max-sm:grid-cols-2 max-sm:gap-2">
          {cartItems.map((item) => (
            <section key={item._id} className='max-sm:p-3 max-sm:shadow-[0_0_10px_0_rgb(0,0,0,0.1)] max-sm:mb-5 max-sm:rounded-[15px] mb20'>
                <div className="w-full flex max-sm:flex-col max-sm:gap-2 max-sm:w-full gap-4">
                  <div className="w-2/6 max-sm:w-full relative">
                      <input
                        type="checkbox"
                        checked={item.selected || false}
                        onChange={() => dispatch(toggleItemSelection(item.product_id || item._id))}
                        className="h-5 w-5 absolute"
                        />
                      <img src={item.image} alt={item.name} className="w-full h-auto max-md:h-32 max-sm:h-auto max-sm:w-full object-cover rounded" />
                  </div>

                  <div className="w-4/6 max-sm:w-full relative">
                    <div className='h-full flex flex-col justify-evenly max-md:gap-2'>
                      <div className="flex flex-col gap-3 max-sm:gap-1">
                        <h3 className="font-semibold text-[20px] max-md:text-[17px] max-sm:text-[16px]">{item.name}</h3>
                        <p className="text-sm text3 max-md:text-[14px] max-sm:text-[10px] truncate">{item.desc}</p>
                      </div>

                      <div className='flex gap-5 items-center'>
                        <p className="font-medium text-[#B8A38A] max-sm:text-[13px] max-[479px]:hidden">₹. {item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => {
                            if (item.quantity > 1) {
                              dispatch(updateCartItemQuantityAsync({ cartItemId: item.id, quantity: item.quantity - 1 }));
                            }
                          }} className="text-red-500">
                            <FaCircleMinus className='h-6 w-6 max-md:h-5 max-md:w-5' />
                          </button>
                          <span className='allCenter w-10 h-8 max-md:h-6 max-md:w-8 max-sm:h-6 max-sm:w-6 max-md:text-[16px] max-sm:text-[14px] mx-2 text-xl text-[#B8A38A] ring-1 ring-[#B8A38A] rounded-[5px]'>{item.quantity}</span>
                          <button onClick={() => {
                            if (item.quantity < item.available) {
                              dispatch(updateCartItemQuantityAsync({ cartItemId: item.id, quantity: item.quantity + 1 }));
                            }
                          }} className="text-green-500 text-3xl">
                            <IoAddCircle className='max-md:h-6 max-md:w-6' />
                          </button>
                        </div>
                        <div>
                          {item.quantity <= item.available ? (
                            <p className='text-green-600 text-sm max-sm:text-xs'>Item is in stock</p>
                          ) : (
                            <p className='text-red-600 text-sm max-sm:text-xs'>Item is not in stock</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-2/6 max-sm:w-full relative">
                    <span className='flex flex-col max-sm:flex-row max-sm:mt-3 items-end justify-evenly max-sm:items-center max-sm:justify-between h-full'>
                      <p className="font-semibold max-sm:text-[14px]">₹. {(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => dispatch(removeItemFromCartAsync(item.id))}
                        className="p-1 text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                        <RiDeleteBin6Fill className='h-6 w-6 max-sm:h-4 max-sm:w-4' />
                        Delete
                      </button>
                    </span>
                  </div>
                </div>
                <hr className='w-full h-[2px] bg-[#D9D9D9] max-sm:hidden' />
            </section>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-6">
        <div className="text-right flex gap-4 items-center">
          <h3 className="text-lg font-semibold text1 max-sm:text-[18px]">Cart Amount: ₹. {cartTotal.toFixed(2)}</h3>
        </div>
      </div>
    </section>
  );
};

export default CartLeft;
