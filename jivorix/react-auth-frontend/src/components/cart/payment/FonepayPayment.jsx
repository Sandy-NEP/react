
import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowLeft, FaCheckCircle, FaMobileAlt } from 'react-icons/fa';

const FonepayPayment = ({
  onClose,
  onBack,
  totalAmount = 0,
  productAmount = 0,
  deliveryCharge = 0,
  discount = 0,
  appliedPromo = null,
  onPaymentSuccess
}) => {
  const [paymentDetails, setPaymentDetails] = useState({
    mobileNumber: '',
    fonepayPin: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!paymentDetails.mobileNumber || paymentDetails.mobileNumber.length !== 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!paymentDetails.fonepayPin || paymentDetails.fonepayPin.length < 4) {
      newErrors.fonepayPin = 'Please enter your Fonepay PIN';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate Fonepay payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      const transactionData = {
        transactionId: 'FNP' + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0'),
        date: new Date().toLocaleString(),
        paymentMethod: 'Fonepay',
        customerName: '',
        mobileNumber: paymentDetails.mobileNumber,
        paymentAmount: Number(totalAmount),
        productAmount: Number(productAmount),
        deliveryCharge: Number(deliveryCharge),
        discount: Number(discount),
        appliedPromo: appliedPromo ? appliedPromo.label : null
      };
      
      setTimeout(() => {
        onPaymentSuccess(transactionData);
        onClose();
      }, 2000);
    }, 2500);
  };

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">Your Fonepay payment has been processed successfully.</p>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-orange-700 font-medium">Amount Paid: ₹{Number(totalAmount).toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h3>
          <p className="text-gray-600 mb-4">Please wait while we process your Fonepay payment...</p>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-orange-700">Connecting to Fonepay servers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <button onClick={onBack} className="hover:opacity-80">
              <FaArrowLeft className="text-xl" />
            </button>
            <h3 className="text-xl font-bold">Fonepay Payment</h3>
            <button onClick={onClose} className="hover:opacity-80">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Fonepay Logo and Info */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/src/components/cart/images/fonepay.png" 
                alt="Fonepay" 
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <FaMobileAlt className="text-3xl text-orange-500 hidden" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Pay with Fonepay</h4>
            <p className="text-gray-600">Pay through Fonepay payment gateway</p>
          </div>

          {/* Payment Amount */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Amount to Pay</p>
              <p className="text-2xl font-bold text-orange-500">₹{Number(totalAmount).toFixed(2)}</p>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Fonepay Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={paymentDetails.mobileNumber}
                onChange={handleInputChange}
                placeholder="98XXXXXXXX"
                maxLength="10"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Fonepay PIN
              </label>
              <input
                type="password"
                name="fonepayPin"
                value={paymentDetails.fonepayPin}
                onChange={handleInputChange}
                placeholder="Enter your PIN"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.fonepayPin ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.fonepayPin && (
                <p className="text-red-500 text-sm mt-1">{errors.fonepayPin}</p>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
              <p className="font-medium mb-1">🔒 Secure Payment</p>
              <p>Your payment is protected by Fonepay's trusted security system.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition duration-200"
            >
              Pay ₹{Number(totalAmount).toFixed(2)} with Fonepay
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Need help? Contact Fonepay support at 01-5538701</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FonepayPayment;
