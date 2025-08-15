import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedItemsTotal, selectSelectedItemsCount, setPaymentSuccess } from '../../redux/cart/cartSlice';
import { checkoutAPI } from '../../services/cartService';
import { FaMapLocationDot, FaCity, FaTag, FaPhone } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import CreditCardPayment from './payment/CreditCardPayment';
import OnlinePayment from './payment/OnlinePayment';
import PaymentSuccess from './payment/PaymentSuccess';
import PaymentPortal from './payment/PaymentPortal'; // Import the new PaymentPortal
import { useNavigate } from 'react-router-dom';

const PROMO_CODES = {
  'WELCOME10': { type: 'percentage', value: 10, label: '10% off' },
  'SAVE20': { type: 'percentage', value: 20, label: '20% off' },
  'FREESHIP': { type: 'fixed', value: 0, label: 'Free shipping' },
  'HOLIDAY25': { type: 'percentage', value: 25, label: '25% off' },
  'SANDESH': { type: 'fullDiscount', value: 100, label: '100% off everything' }
};

const CartRight = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const selectedItemsTotal = useSelector(selectSelectedItemsTotal);
  const selectedItemsCount = useSelector(selectSelectedItemsCount);

  const [formData, setFormData] = useState({
    country: 'Nepal',
    city: '',
    address: '',
    phone: '',
    promoCode: '',
    customerName: ''
  });

  const [errors, setErrors] = useState({
    country: '',
    city: '',
    address: '',
    phone: '',
    promoCode: '',
    customerName: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('payment on deliver');
  const [showCreditCardPayment, setShowCreditCardPayment] = useState(false);
  const [showOnlinePayment, setShowOnlinePayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showNoItemsSelected, setShowNoItemsSelected] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(selectedItemsCount * 50);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(selectedItemsTotal + (selectedItemsCount * 50));

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFetchError('Please log in to proceed');
        return;
      }

      const response = await fetch('http://localhost:8000/user/get_user.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user data');
      }

      if (data.success && data.data) {
        const { firstName, middleName, lastName, city, address, phone, profileImage } = data.data;
        const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
        setFormData(prev => ({
          ...prev,
          customerName: fullName,
          city: city || '',
          address: address || '',
          phone: phone || '',
          profileImage: profileImage || null
        }));
        setFetchError('');
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (error) {
      setFetchError(error.message || 'Error fetching user data');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    let newDeliveryCharge = selectedItemsCount * 50;
    let newDiscount = 0;

    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        newDiscount = (selectedItemsTotal * appliedPromo.value) / 100;
      } else if (appliedPromo.type === 'fixed') {
        newDeliveryCharge = 0;
      } else if (appliedPromo.type === 'fullDiscount') {
        newDiscount = selectedItemsTotal;
        newDeliveryCharge = 0;
      }
    }

    setDeliveryCharge(newDeliveryCharge);
    setDiscount(newDiscount);
    setTotalAmount(selectedItemsTotal - newDiscount + newDeliveryCharge);
  }, [selectedItemsTotal, selectedItemsCount, appliedPromo]);

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const applyPromoCode = () => {
    const promoCode = formData.promoCode.trim().toUpperCase();

    if (!promoCode) {
      setErrors(prev => ({ ...prev, promoCode: 'Please enter a promo code' }));
      return;
    }

    if (appliedPromo) {
      setErrors(prev => ({ ...prev, promoCode: 'A promo code is already applied' }));
      return;
    }

    if (PROMO_CODES[promoCode]) {
      setAppliedPromo(PROMO_CODES[promoCode]);
      setErrors(prev => ({ ...prev, promoCode: '' }));
    } else {
      setErrors(prev => ({ ...prev, promoCode: 'Invalid promo code' }));
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setFormData(prev => ({ ...prev, promoCode: '' }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      country: '',
      city: '',
      address: '',
      phone: '',
      promoCode: '',
      customerName: ''
    };

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
      valid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      valid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address should be at least 10 characters';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      valid = false;
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const generateTransactionId = () => {
    return 'TXN' + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0');
  };

  const processCheckout = async (paymentMethodType, additionalData = {}) => {
    setIsProcessingCheckout(true);
    try {
      const selectedItems = cartItems.filter(item => item.selected);

      // Map payment method names to backend format
      const paymentMethodMap = {
        'payment on deliver': 'paymentondelivery',
        'Online payment': 'onlinepayment',
        'Credit Card payment': 'creditcardpayment'
      };

      const checkoutData = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: localStorage.getItem('userEmail') || 'user@example.com', // Get from localStorage or user data
        country: formData.country,
        city: formData.city,
        address: formData.address,
        paymentMethod: paymentMethodMap[paymentMethodType] || 'paymentondelivery',
        deliveryCharge: deliveryCharge,
        discount: discount,
        appliedPromo: appliedPromo ? appliedPromo.label : null,
        ...additionalData
      };

      const response = await checkoutAPI(checkoutData);

      if (response.success) {
        showPaymentSuccessModal({
          transactionId: response.data.transactionId,
          paymentMethod: paymentMethodType,
          paymentAmount: response.data.paymentAmount,
          ...response.data
        });
      } else {
        throw new Error(response.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setFetchError(error.message || 'Failed to process checkout');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const showPaymentSuccessModal = (paymentData = {}) => {
    const transactionDate = new Date().toLocaleString();
    const selectedItems = cartItems.filter(item => item.selected);

    const paymentDetails = {
      transactionId: paymentData.transactionId || generateTransactionId(),
      date: paymentData.date || transactionDate,
      paymentMethod: paymentData.paymentMethod || paymentMethod,
      customerName: paymentData.customerName || formData.customerName,
      mobileNumber: paymentData.mobileNumber || formData.phone,
      paymentAmount: paymentData.paymentAmount || totalAmount,
      productAmount: selectedItemsTotal,
      deliveryCharge: deliveryCharge,
      discount: discount,
      appliedPromo: appliedPromo ? appliedPromo.label : null
    };

    const orderDetails = {
      user: {
        clientId: `CODI${Math.floor(Math.random() * 1000)}`,
        username: formData.customerName,
        phone: formData.phone,
        location: `${formData.country}, ${formData.city}, ${formData.address}`,
        avatar: formData.profileImage || 'path/to/default/avatar.jpg'
      },
      products: selectedItems.map(item => ({
        _id: item._id,
        image: item.image,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: (item.price * item.quantity).toFixed(2)
      }))
    };

    dispatch(setPaymentSuccess({
      success: true,
      details: paymentDetails,
      orderDetails: orderDetails
    }));

    setShowPaymentSuccess(true);
  };

  // Handler for the new PaymentPortal
  const handlePaymentSuccess = async (paymentDetails) => {
    // Process checkout with additional payment details
    const additionalData = {};

    if (paymentMethod === 'Credit Card payment') {
      additionalData.cardLastFour = paymentDetails.cardLastFour;
      additionalData.cardType = paymentDetails.cardType;
      additionalData.paymentProcessor = paymentDetails.paymentProcessor || 'stripe';
      additionalData.processorTransactionId = paymentDetails.processorTransactionId;
      additionalData.paymentStatus = paymentDetails.paymentStatus || 'completed';
    } else if (paymentMethod === 'Online payment') {
      additionalData.paymentGateway = paymentDetails.paymentGateway || 'default';
      additionalData.gatewayTransactionId = paymentDetails.gatewayTransactionId;
      additionalData.paymentStatus = paymentDetails.paymentStatus || 'completed';
    }

    await processCheckout(paymentMethod, additionalData);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    // Close other payment modals when a new method is selected
    setShowCreditCardPayment(false);
    setShowOnlinePayment(false);
  };

  const handleOrderSelected = async (e) => {
    e.preventDefault();

    if (selectedItemsCount === 0) {
      setShowNoItemsSelected(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (paymentMethod === 'Credit Card payment') {
      setShowCreditCardPayment(true);
    } else if (paymentMethod === 'Online payment') {
      setShowOnlinePayment(true);
    } else {
      // Direct payment on delivery - process checkout immediately
      await processCheckout(paymentMethod);
    }
  };

  // Close all payment modals and reset form if user cancels
  const handleCloseAllPaymentModals = () => {
    setShowCreditCardPayment(false);
    setShowOnlinePayment(false);
    // Optionally reset form or show a confirmation to the user
  };

  // Function to close the Payment Portal
  const handleClosePaymentPortal = () => {
    setShowCreditCardPayment(false);
    setShowOnlinePayment(false);
  };

  const handlePaymentSuccessClose = () => {
    setShowPaymentSuccess(false);
    setFormData({
      country: 'Nepal',
      city: '',
      address: '',
      phone: '',
      promoCode: '',
      customerName: ''
    });
    setAppliedPromo(null);
    fetchUserData(); // Refetch user data after reset
    navigate('/order-details');
  };

  return (
    <section className='bg-white p-6 max-md:p-4 max-sm:p-3 rounded-[15px] shadow-[0_0_6px_0_rgb(0,0,0,0.2)] w-full'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className="text-xl font-semibold text-gray-800 max-sm:text-[18px]">Shopping Cart</h2>
        <h2 className='text-xl font-semibold text-green-500 max-sm:text-[18px]'>{selectedItemsCount} Items</h2>
      </div>
      <hr className='w-full h-1 bg-gray-300 mb-5' />

      {showNoItemsSelected && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
          <span>Please select at least one item before proceeding</span>
          <button
            onClick={() => setShowNoItemsSelected(false)}
            className="text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {fetchError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
          <span>{fetchError}</span>
          <button
            onClick={() => setFetchError('')}
            className="text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      <div className="p-3 flex flex-col gap-4 items-center w-full justify-center rounded-[10px] shadow-[0_0_10px_0_rgba(0,0,0,0.1)] mb-6">
        <ul className='flex items-center justify-between w-full'>
          <li className="text-lg font-medium text-gray-700 max-md:text-[14px]">Product Amount:</li>
          <li className="text-lg font-semibold text-gray-700 max-md:text-[14px]">₹ {selectedItemsTotal.toFixed(2)}</li>
        </ul>

        <ul className='flex items-center justify-between w-full'>
          <li className="text-lg font-medium text-gray-700 max-md:text-[14px]">Selected Items:</li>
          <li className="text-lg font-semibold text-gray-700 max-md:text-[14px]">
            {selectedItemsCount}
          </li>
        </ul>

        <ul className='flex items-center justify-between w-full'>
          <li className="text-lg font-medium text-gray-700 max-md:text-[14px]">Delivery Charge:</li>
          <li className="text-lg font-semibold text-gray-700 max-md:text-[14px]">
            {appliedPromo?.type === 'fixed' ? (
              <span className="text-green-500 line-through">₹ {deliveryCharge.toFixed(2)}</span>
            ) : (
              `₹ ${deliveryCharge.toFixed(2)}`
            )}
          </li>
        </ul>

        {appliedPromo && (
          <ul className='flex items-center justify-between w-full'>
            <li className="text-lg font-medium text-gray-700 max-md:text-[14px]">
              Discount ({appliedPromo.label}):
            </li>
            <li className="text-lg font-semibold text-green-500 max-md:text-[14px]">
              -₹ {discount.toFixed(2)}
            </li>
          </ul>
        )}

        <hr className='w-full h-[2px] bg-gray-300 mx-1' />

        <ul className='flex items-center justify-between w-full'>
          <li className="text-lg font-medium text-gray-700 max-md:text-[14px]">Total Amount:</li>
          <li className="text-lg font-semibold text-gray-700 max-md:text-[14px]">₹ {totalAmount.toFixed(2)}</li>
        </ul>
      </div>

      <form className='mb-5' onSubmit={handleOrderSelected}>
        <ul className='flex flex-col justify-center gap-5 w-full'>
          <li>
            <h4 className='text-gray-700 text-xl font-medium mb-2 max-sm:text-[18px]'>Customer Name</h4>
            <div className='relative w-full h-auto'>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder='Your full name'
                className={`px-5 py-2 text-[15px] text-gray-700 rounded-[5px] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] w-full ${errors.customerName ? 'border-red-500 border-2' : ''}`}
              />
              {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
            </div>
          </li>

          <li>
            <h4 className='text-gray-700 text-xl font-medium mb-2 max-sm:text-[18px]'>Country</h4>
            <div className='relative w-full h-auto'>
              <FaMapLocationDot className="absolute text-gray-500 right-4 top-1/2 transform -translate-y-1/2" />
              <input
               _grp_type="text"
                name="country"
                value={formData.country}
                readOnly
                className={`px-5 py-2 text-[15px] text-gray-700 rounded-[5px] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] w-full bg-gray-100 ${errors.country ? 'border-red-500 border-2' : ''}`}
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
          </li>

          <li>
            <h4 className='text-gray-700 text-xl font-medium mb-2 max-sm:text-[18px]'>City</h4>
            <div className='relative w-full h-auto'>
              <FaCity className="absolute text-gray-500 right-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder='Kathmandu'
                className={`px-5 py-2 text-[15px] text-gray-700 rounded-[5px] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] w-full ${errors.city ? 'border-red-500 border-2' : ''}`}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
          </li>

          <li>
            <h4 className='text-gray-700 text-xl font-medium mb-2 max-sm:text-[18px]'>Address</h4>
            <div className='relative w-full h-auto'>
              <IoHome className="absolute text-gray-500 right-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder='State, colony, home number'
                className={`px-5 py-2 text-[15px] text-gray-700 rounded-[5px] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] w-full ${errors.address ? 'border-red-500 border-2' : ''}`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
          </li>

          <li>
            <h4 className='text-gray-700 text-xl font-medium mb-2 max-sm:text-[18px]'>Phone Number</h4>
            <div className='relative w-full h-auto'>
              <FaPhone className="absolute text-gray-500 right-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder='9876543210'
                maxLength="10"
                className={`px-5 py-2 text-[15px] text-gray-700 rounded-[5px] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] w-full ${errors.phone ? 'border-red-500 border-2' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </li>

          <li>
            <h4 className='text-gray-700 text-xl font-medium mb-2 max-sm:text-[18px]'>Promo Code</h4>
            <div className='relative w-full h-auto'>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  placeholder='Enter promo code'
                  disabled={!!appliedPromo}
                  className={`px-5 py-2 text-[15px] text-gray-700 rounded-[5px] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] w-full ${
                    errors.promoCode ? 'border-red-500 border-2' : ''
                  } ${appliedPromo ? 'bg-gray-100' : ''}`}
                />
                {appliedPromo ? (
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="px-3 bg-red-500 text-white rounded hover:bg-red-600 whitespace-nowrap"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="px-3 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
                  >
                    Apply
                  </button>
                )}
              </div>
              {errors.promoCode && (
                <p className="text-red-500 text-sm mt-1">{errors.promoCode}</p>
              )}
              {appliedPromo && (
                <p className="text-green-500 text-sm mt-1">
                  Promo applied: {appliedPromo.label}
                </p>
              )}
              {!appliedPromo && (
                <p className="text-gray-500 text-xs mt-1">
                  Try: WELCOME10, SAVE20, FREESHIP, HOLIDAY25
                </p>
              )}
            </div>
          </li>
        </ul>

        <span className='mt-6 block'>
          <h5 className='text-gray-800 text-xl font-semibold mb-4'>Payment Method</h5>
          <div className='rounded-[10px] shadow-[0_0_10px_0_rgba(0,0,0,0.1)]'>
            <label className='flex gap-5 py-4 px-3 items-center text-gray-700 text-lg font-medium cursor-pointer hover:bg-gray-100 rounded-t-[10px]'>
              <input
                type="radio"
                className='w-4 h-4'
                name="paymentOption"
                value="payment on deliver"
                checked={paymentMethod === 'payment on deliver'}
                onChange={() => handlePaymentMethodChange('payment on deliver')}
                required
              />
              Payment On Delivery
            </label>
            <hr className='w-full h-[2px] bg-gray-300' />
            <label className='flex gap-5 py-4 px-3 items-center text-gray-700 text-lg font-medium cursor-pointer hover:bg-gray-100'>
              <input
                type="radio"
                className='w-4 h-4'
                name="paymentOption"
                value="Online payment"
                checked={paymentMethod === 'Online payment'}
                onChange={() => handlePaymentMethodChange('Online payment')}
                required
              />
              Online Payment
            </label>
            <hr className='w-full h-[2px] bg-gray-300' />
            <label className='flex gap-5 py-4 px-3 items-center text-gray-700 text-lg font-medium cursor-pointer hover:bg-gray-100 rounded-b-[10px]'>
              <input
                type="radio"
                className='w-4 h-4'
                name="paymentOption"
                value="Credit Card payment"
                checked={paymentMethod === 'Credit Card payment'}
                onChange={() => handlePaymentMethodChange('Credit Card payment')}
                required
              />
              Credit Card Payment
            </label>
          </div>
        </span>

        <div className='w-full mt-6'>
          <button
            type="submit"
            disabled={isProcessingCheckout}
            className="px-3 py-3 bg-green-500 text-white rounded-[5px] w-full hover:bg-green-600 transition-colors duration-300 font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessingCheckout ? 'Processing...' : (paymentMethod === 'Credit Card payment' ? 'Proceed to Payment' : 'Place Order')}
          </button>
        </div>
      </form>

      {/* Payment Portal */}
      {(showCreditCardPayment || showOnlinePayment) && (
        <PaymentPortal
          onClose={handleClosePaymentPortal}
          productAmount={selectedItemsTotal}
          deliveryCharge={deliveryCharge}
          discount={discount} // Corrected from discountAmount to discount
          totalAmount={totalAmount} // Corrected from finalTotal to totalAmount
          appliedPromo={appliedPromo}
          onPaymentSuccess={handlePaymentSuccess}
          // Pass the currently selected payment method to PaymentPortal
          paymentMethod={paymentMethod === 'Credit Card payment' ? 'Credit Card' : 'Online'}
        />
      )}

      {showPaymentSuccess && (
        <PaymentSuccess
          onClose={handlePaymentSuccessClose}
        />
      )}
    </section>
  );
};

export default CartRight;
