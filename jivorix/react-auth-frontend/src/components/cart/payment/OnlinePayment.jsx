//src/components/cart/payment/OnlinePayment.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OnlinePayment = ({
  onClose,
  productAmount = 0,
  deliveryCharge = 0,
  discount = 0,
  totalAmount = 0,
  appliedPromo = null,
  onPaymentSuccess // Add this prop
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showSpecificPayment, setShowSpecificPayment] = useState(false); // Renamed from showPaymentPage
  const [paymentDetails, setPaymentDetails] = useState({
    customerName: '',
    mobileNumber: '',
    email: '',
    additionalInfo: ''
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  const PAYMENT_OPTIONS = [
    {
      id: 'esewa',
      name: 'eSewa',
      icon: 'src/components/cart/images/esewa.png',
      description: 'Pay securely with your eSewa wallet',
      fields: ['mobileNumber'],
      primaryColor: '#55C22B',
      secondaryColor: '#E8F5E9',
      textColor: '#ffffff'
    },
    {
      id: 'khalti',
      name: 'Khalti',
      icon: 'src/components/cart/images/khalti.png',
      description: 'Pay with Khalti digital wallet',
      fields: ['mobileNumber'],
      primaryColor: '#5C2D91',
      secondaryColor: '#F3E5F5',
      textColor: '#ffffff'
    },
    {
      id: 'imepay',
      name: 'IME Pay',
      icon: 'src/components/cart/images/imepay.png',
      description: 'Secure payments with IME Pay',
      fields: ['mobileNumber'],
      primaryColor: '#E31937',
      secondaryColor: '#FFEBEE',
      textColor: '#ffffff'
    },
    {
      id: 'connectips',
      name: 'Connect IPS',
      icon: 'src/components/cart/images/connectips.png',
      description: 'Direct bank transfer through Connect IPS',
      fields: ['customerName', 'mobileNumber', 'email'],
      primaryColor: '#0056B3',
      secondaryColor: '#E3F2FD',
      textColor: '#ffffff'
    },
    {
      id: 'fonepay',
      name: 'Fonepay',
      icon: 'src/components/cart/images/fonepay.png',
      description: 'Pay through Fonepay payment gateway',
      fields: ['mobileNumber'],
      primaryColor: '#FF6D00',
      secondaryColor: '#FFF3E0',
      textColor: '#ffffff'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProceed = () => {
    if (!selectedMethod) return;
    setShowSpecificPayment(true);
  };

  const handleBackToMethods = () => {
    setShowSpecificPayment(false);
    setSelectedMethod(null);
  };

const processPayment = () => {
  setPaymentProcessing(true);

  setTimeout(() => {
    setPaymentProcessing(false);
    setPaymentSuccess(true);

    const transactionData = {
      transactionId: 'TXN' + Math.floor(Math.random() * 1000000000).toString().padStart(10, '0'),
      date: new Date().toLocaleString(),
      paymentMethod: selectedMethod.name,
      customerName: paymentDetails.customerName,
      mobileNumber: paymentDetails.mobileNumber,
      paymentAmount: Number(totalAmount),
      appliedPromo: appliedPromo ? appliedPromo.label : null,
      productAmount: Number(productAmount),
      deliveryCharge: Number(deliveryCharge),
      discount: Number(discount)
    };

    // Show success for 2 seconds, then call onPaymentSuccess
    setTimeout(() => {
      onPaymentSuccess(transactionData);
      onClose();
    }, 2000);
  }, 2000);
};



  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    processPayment();
  };

  const renderPaymentPage = () => {
    if (!selectedMethod) return null;

    const methodConfig = PAYMENT_OPTIONS.find(m => m.id === selectedMethod.id);

    if (paymentSuccess) {
      return (
        <div
          className="flex flex-col items-center justify-center p-8 text-center"
          style={{ backgroundColor: methodConfig.secondaryColor }}
        >
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
          <p className="text-gray-600">Your transaction has been completed successfully.</p>
        </div>
      );
    }

    if (paymentProcessing) {
      return (
        <div
          className="flex flex-col items-center justify-center p-8 text-center"
          style={{ backgroundColor: methodConfig.secondaryColor }}
        >
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4"
            style={{ borderColor: methodConfig.primaryColor }}
          ></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h3>
          <p className="text-gray-600">Please wait while we process your payment...</p>
        </div>
      );
    }

    return (
      <div
        className="min-h-full"
        style={{ backgroundColor: methodConfig.secondaryColor }}
      >
        <div
          className="p-5"
          style={{
            backgroundColor: methodConfig.primaryColor,
            color: methodConfig.textColor
          }}
        >
          <button
            onClick={handleBackToMethods}
            className="flex items-center hover:opacity-80"
          >
            <FaArrowLeft className="mr-2" /> Back to payment methods
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 bg-white rounded-xl border border-gray-300 flex items-center justify-center shadow"
              style={{ borderColor: methodConfig.primaryColor }}
            >
              <img
                src={methodConfig.icon}
                alt={methodConfig.name}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/payments/default.png';
                }}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Pay with {methodConfig.name}</h3>
              <p className="text-gray-600">Amount to pay: ₹{Number(totalAmount).toFixed(2)}</p>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit}>
            {methodConfig.fields.includes('customerName') && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={paymentDetails.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}

            {methodConfig.fields.includes('mobileNumber') && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={paymentDetails.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}

            {methodConfig.fields.includes('email') && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={paymentDetails.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}

            {methodConfig.id === 'connectips' && (
              <div
                className="mb-6 p-4 rounded-md"
                style={{ backgroundColor: methodConfig.primaryColor + '20' }}
              >
                <h4 className="font-medium mb-2" style={{ color: methodConfig.primaryColor }}>
                  Connect IPS Instructions
                </h4>
                <p className="text-sm" style={{ color: methodConfig.primaryColor }}>
                  After submitting, you will be redirected to your banking portal to complete the payment.
                  Please have your mobile banking credentials ready.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 text-white rounded-xl font-semibold tracking-wide hover:opacity-90 transition"
              style={{ backgroundColor: methodConfig.primaryColor }}
            >
              Pay ₹{Number(totalAmount).toFixed(2)} with {methodConfig.name}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all duration-300 ease-in-out scale-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className="p-5 flex justify-between items-center"
          style={showSpecificPayment && selectedMethod ? {
            backgroundColor: PAYMENT_OPTIONS.find(m => m.id === selectedMethod.id)?.primaryColor || '#6366F1',
            color: PAYMENT_OPTIONS.find(m => m.id === selectedMethod.id)?.textColor || '#ffffff'
          } : {
            background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
            color: '#ffffff'
          }}
        >
          <h3 className="text-2xl font-bold">
            {showSpecificPayment ? `Pay with ${selectedMethod?.name}` : 'Choose Payment Method'}
          </h3>
          <button onClick={onClose} className="hover:opacity-80 transition">
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {showSpecificPayment ? (
          renderPaymentPage()
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Left Side: Payment Options */}
            <div className="w-full md:w-1/2 p-6 space-y-4">
              {PAYMENT_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition duration-200 shadow-sm hover:shadow-md ${
                    selectedMethod?.id === option.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-400'
                  }`}
                  onClick={() => setSelectedMethod(option)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 bg-white rounded-xl border border-gray-300 flex items-center justify-center shadow"
                      style={{ borderColor: option.primaryColor }}
                    >
                      <img
                        src={option.icon}
                        alt={option.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/payments/default.png';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{option.name}</h4>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side: Order Summary */}
            <div className="w-full md:w-1/2 bg-gray-50 p-6 border-t md:border-t-0 md:border-l border-gray-200">
              <div className="rounded-2xl p-6 bg-white shadow-md space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Order Summary</h4>

                <div className="flex justify-between text-gray-700">
                  <span>Product Amount:</span>
                  <span className="font-medium">₹{Number(productAmount).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charge:</span>
                  <span className="font-medium">
                    {appliedPromo?.type === 'fixed' ? (
                      <span className="text-green-500 line-through">₹{Number(deliveryCharge).toFixed(2)}</span>
                    ) : (
                      `₹${Number(deliveryCharge).toFixed(2)}`
                    )}
                  </span>
                </div>

                {(discount > 0 || appliedPromo) && (
                  <div className="flex justify-between text-gray-700">
                    <span>
                      Discount {appliedPromo ? `(${appliedPromo.label})` : ''}:
                    </span>
                    <span className="font-medium text-green-600">-₹{Number(discount).toFixed(2)}</span>
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between font-semibold text-gray-900 text-lg">
                  <span>Total:</span>
                  <span>₹{Number(totalAmount).toFixed(2)}</span>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={!selectedMethod}
                  className={`w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold tracking-wide transition ${
                    !selectedMethod ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  Proceed with {selectedMethod?.name || 'Payment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlinePayment;