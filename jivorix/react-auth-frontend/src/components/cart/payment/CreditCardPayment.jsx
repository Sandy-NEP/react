//src/components/cart/payment/CreditCardPayment.jsx
import React, { useState, useEffect } from 'react';
import { FaCcVisa, FaCcMastercard, FaTimes, FaCheck } from 'react-icons/fa';

const CreditCardPayment = ({
  onClose,
  productAmount = 0,
  deliveryCharge = 0,
  discount = 0,
  totalAmount = 0,
  onPaymentSuccess,
  appliedPromo = null
}) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === 'cardNumber') {
      formatted = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    } else if (name === 'expiryDate') {
      formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
    } else if (name === 'cvv') {
      formatted = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardData({ ...cardData, [name]: formatted });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    const { cardNumber, expiryDate, cvv, cardHolderName } = cardData;

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) newErrors.cardNumber = 'Invalid card number';
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) newErrors.expiryDate = 'Invalid expiry format';
    if (!/^\d{3,4}$/.test(cvv)) newErrors.cvv = 'Invalid CVV';
    if (!cardHolderName.trim()) newErrors.cardHolderName = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPaymentSuccess(true);
    
    // Show success for 1 second before closing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Call the success callback with all required data
    onPaymentSuccess({
      transactionId: 'TXN' + Math.floor(Math.random() * 1e10),
      date: new Date().toLocaleString(),
      paymentMethod: 'Credit Card',
      customerName: cardData.cardHolderName,
      mobileNumber: '', // You might want to collect this separately
      paymentAmount: Number(totalAmount),
      productAmount: Number(productAmount),
      deliveryCharge: Number(deliveryCharge),
      discount: Number(discount),
      appliedPromo: appliedPromo?.label || null
    });

    setIsProcessing(false);
  };

  return (
    <div className={`fixed inset-0 z-50 p-6 bg-black/60 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full max-w-3xl rounded-2xl bg-white/10 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/20 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Animated Credit Card Preview */}
        <div className="relative w-full md:w-1/2 p-6 flex items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-600 text-white">
          <div className="w-72 h-44 bg-white/10 border border-white/30 rounded-2xl p-4 backdrop-blur-md shadow-inner animate-pulse">
            <div className="flex justify-between mb-4">
              <span className="text-xs uppercase">Credit Card</span>
              <div className="flex gap-2 text-2xl">
                <FaCcVisa />
                <FaCcMastercard />
              </div>
            </div>
            <div className="text-lg tracking-widest">{cardData.cardNumber || '#### #### #### ####'}</div>
            <div className="flex justify-between mt-4 text-xs">
              <div>
                <p className="text-gray-300">Card Holder</p>
                <p>{cardData.cardHolderName || 'FULL NAME'}</p>
              </div>
              <div>
                <p className="text-gray-300">Expires</p>
                <p>{cardData.expiryDate || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="w-full md:w-1/2 p-6 bg-white text-gray-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payment Info</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={cardData.cardNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 ${errors.cardNumber ? 'border-red-400' : ''}`}
              />
              {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
            </div>
            <div className="flex gap-3">
              <div className="w-1/2">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 ${errors.expiryDate ? 'border-red-400' : ''}`}
                />
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={cardData.cvv}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 ${errors.cvv ? 'border-red-400' : ''}`}
                />
              </div>
            </div>
            <div>
              <input
                type="text"
                name="cardHolderName"
                placeholder="Card Holder Name"
                value={cardData.cardHolderName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 ${errors.cardHolderName ? 'border-red-400' : ''}`}
              />
              {errors.cardHolderName && <p className="text-red-500 text-sm">{errors.cardHolderName}</p>}
            </div>

            {/* Summary */}
            <div className="space-y-2 text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
              <p className="flex justify-between">
                Product: <span>₹{Number(productAmount).toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                Delivery: <span>₹{Number(deliveryCharge).toFixed(2)}</span>
              </p>
              {discount > 0 && (
                <p className="flex justify-between text-green-600">
                  Discount ({appliedPromo?.label}): <span>-₹{Number(discount).toFixed(2)}</span>
                </p>
              )}
              <hr />
              <p className="flex justify-between font-bold">
                Total: <span>₹{Number(totalAmount).toFixed(2)}</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-400 to-indigo-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        </div>
      </div>

      {/* Payment Success Overlay */}
      {paymentSuccess && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl text-center">
            <FaCheck className="text-green-500 text-4xl mx-auto mb-2" />
            <p className="text-lg font-bold">Payment Successful!</p>
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditCardPayment;