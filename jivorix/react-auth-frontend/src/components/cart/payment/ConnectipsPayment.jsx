
import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowLeft, FaCheckCircle, FaUniversity, FaInfoCircle } from 'react-icons/fa';

const ConnectipsPayment = ({
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
    customerName: '',
    mobileNumber: '',
    email: '',
    bankAccount: ''
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
    
    if (!paymentDetails.customerName.trim()) {
      newErrors.customerName = 'Please enter your full name';
    }
    
    if (!paymentDetails.mobileNumber || paymentDetails.mobileNumber.length !== 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!paymentDetails.email || !/\S+@\S+\.\S+/.test(paymentDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!paymentDetails.bankAccount.trim()) {
      newErrors.bankAccount = 'Please enter your bank account number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate Connect IPS payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      const transactionData = {
        transactionId: 'CIPS' + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0'),
        date: new Date().toLocaleString(),
        paymentMethod: 'Connect IPS',
        customerName: paymentDetails.customerName,
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
    }, 3000);
  };

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">Your Connect IPS payment has been processed successfully.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-700 font-medium">Amount Paid: ₹{Number(totalAmount).toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h3>
          <p className="text-gray-600 mb-4">Redirecting to your bank's secure portal...</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-700">Connecting to Connect IPS network...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <button onClick={onBack} className="hover:opacity-80">
              <FaArrowLeft className="text-xl" />
            </button>
            <h3 className="text-xl font-bold">Connect IPS Payment</h3>
            <button onClick={onClose} className="hover:opacity-80">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Connect IPS Logo and Info */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/src/components/cart/images/connectips.png" 
                alt="Connect IPS" 
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <FaUniversity className="text-3xl text-blue-600 hidden" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Pay with Connect IPS</h4>
            <p className="text-gray-600">Direct bank transfer through Connect IPS</p>
          </div>

          {/* Payment Amount */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Amount to Pay</p>
              <p className="text-2xl font-bold text-blue-600">₹{Number(totalAmount).toFixed(2)}</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm">
            <div className="flex items-start gap-2">
              <FaInfoCircle className="text-yellow-600 mt-0.5" />
              <div className="text-yellow-800">
                <p className="font-medium">Important:</p>
                <p>You will be redirected to your bank's secure portal to complete the payment. Please have your mobile banking credentials ready.</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="customerName"
                value={paymentDetails.customerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={paymentDetails.mobileNumber}
                onChange={handleInputChange}
                placeholder="98XXXXXXXX"
                maxLength="10"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={paymentDetails.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Bank Account Number
              </label>
              <input
                type="text"
                name="bankAccount"
                value={paymentDetails.bankAccount}
                onChange={handleInputChange}
                placeholder="Enter your account number"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bankAccount ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.bankAccount && (
                <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              <p className="font-medium mb-1">🔒 Bank-Level Security</p>
              <p>Your payment is protected by bank-grade security and encryption.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Continue to Bank Portal
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Supported by major banks in Nepal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectipsPayment;
