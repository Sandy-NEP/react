
import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaMobile, FaTimes, FaArrowLeft } from 'react-icons/fa';
import CreditCardPayment from './CreditCardPayment';
import EsewaPayment from './EsewaPayment';
import KhaltiPayment from './KhaltiPayment';
import ImepayPayment from './ImepayPayment';
import ConnectipsPayment from './ConnectipsPayment';
import FonepayPayment from './FonepayPayment';

const PaymentPortal = ({
  onClose,
  productAmount = 0,
  deliveryCharge = 0,
  discount = 0,
  totalAmount = 0,
  appliedPromo = null,
  onPaymentSuccess
}) => {
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const paymentTypes = [
    {
      id: 'online',
      name: 'Digital Wallets',
      description: 'eSewa, Khalti, IME Pay, Connect IPS, Fonepay',
      icon: FaMobile,
      color: 'from-green-500 to-emerald-600',
      features: ['Instant Payment', 'Secure Transaction', 'Mobile Banking']
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, and other cards',
      icon: FaCreditCard,
      color: 'from-blue-500 to-indigo-600',
      features: ['International Cards', 'Secure Payment', 'EMV Compliant']
    }
  ];

  const onlinePaymentMethods = [
    {
      id: 'esewa',
      name: 'eSewa',
      icon: '/src/components/cart/images/esewa.png',
      description: 'Pay securely with your eSewa wallet',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'khalti',
      name: 'Khalti',
      icon: '/src/components/cart/images/khalti.png',
      description: 'Pay with Khalti digital wallet',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'imepay',
      name: 'IME Pay',
      icon: '/src/components/cart/images/imepay.png',
      description: 'Secure payments with IME Pay',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'connectips',
      name: 'Connect IPS',
      icon: '/src/components/cart/images/connectips.png',
      description: 'Direct bank transfer through Connect IPS',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'fonepay',
      name: 'Fonepay',
      icon: '/src/components/cart/images/fonepay.png',
      description: 'Pay through Fonepay payment gateway',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleBackToPaymentTypes = () => {
    setSelectedPaymentType(null);
    setSelectedPaymentMethod(null);
  };

  const handleBackToOnlineMethods = () => {
    setSelectedPaymentMethod(null);
  };

  // Render specific payment method components
  if (selectedPaymentMethod === 'esewa') {
    return (
      <EsewaPayment
        onClose={onClose}
        onBack={handleBackToOnlineMethods}
        productAmount={productAmount}
        deliveryCharge={deliveryCharge}
        discount={discount}
        totalAmount={totalAmount}
        appliedPromo={appliedPromo}
        onPaymentSuccess={onPaymentSuccess}
      />
    );
  }

  if (selectedPaymentMethod === 'khalti') {
    return (
      <KhaltiPayment
        onClose={onClose}
        onBack={handleBackToOnlineMethods}
        productAmount={productAmount}
        deliveryCharge={deliveryCharge}
        discount={discount}
        totalAmount={totalAmount}
        appliedPromo={appliedPromo}
        onPaymentSuccess={onPaymentSuccess}
      />
    );
  }

  if (selectedPaymentMethod === 'imepay') {
    return (
      <ImepayPayment
        onClose={onClose}
        onBack={handleBackToOnlineMethods}
        productAmount={productAmount}
        deliveryCharge={deliveryCharge}
        discount={discount}
        totalAmount={totalAmount}
        appliedPromo={appliedPromo}
        onPaymentSuccess={onPaymentSuccess}
      />
    );
  }

  if (selectedPaymentMethod === 'connectips') {
    return (
      <ConnectipsPayment
        onClose={onClose}
        onBack={handleBackToOnlineMethods}
        productAmount={productAmount}
        deliveryCharge={deliveryCharge}
        discount={discount}
        totalAmount={totalAmount}
        appliedPromo={appliedPromo}
        onPaymentSuccess={onPaymentSuccess}
      />
    );
  }

  if (selectedPaymentMethod === 'fonepay') {
    return (
      <FonepayPayment
        onClose={onClose}
        onBack={handleBackToOnlineMethods}
        productAmount={productAmount}
        deliveryCharge={deliveryCharge}
        discount={discount}
        totalAmount={totalAmount}
        appliedPromo={appliedPromo}
        onPaymentSuccess={onPaymentSuccess}
      />
    );
  }

  if (selectedPaymentType === 'card') {
    return (
      <CreditCardPayment
        onClose={onClose}
        productAmount={productAmount}
        deliveryCharge={deliveryCharge}
        discount={discount}
        totalAmount={totalAmount}
        appliedPromo={appliedPromo}
        onPaymentSuccess={onPaymentSuccess}
      />
    );
  }

  // Show online payment methods selection
  if (selectedPaymentType === 'online') {
    return (
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBackToPaymentTypes}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Choose Digital Wallet</h2>
                <p className="text-green-100 mt-1">Select your preferred payment method</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left Side: Payment Methods */}
            <div className="w-full md:w-2/3 p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Payment Methods</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {onlinePaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg hover:border-indigo-400 hover:scale-105 group transform"
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-16 h-16 bg-white rounded-xl border border-gray-300 flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                        <img
                          src={method.icon}
                          alt={method.name}
                          className="w-14 h-14 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 hidden">
                          <FaMobile className="text-2xl" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {method.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600">💡</div>
                  <div>
                    <h4 className="font-medium text-blue-800">Quick Payment Tips</h4>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Ensure you have sufficient balance in your wallet</li>
                      <li>• Have your mobile number and PIN ready</li>
                      <li>• Payment will be processed instantly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="w-full md:w-1/3 bg-gray-50 p-6 border-t md:border-t-0 md:border-l border-gray-200">
              <div className="rounded-2xl p-6 bg-white shadow-md space-y-4 sticky top-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Order Summary</h4>

                <div className="flex justify-between text-gray-700">
                  <span>Product Amount:</span>
                  <span className="font-medium">₹{Number(productAmount).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charge:</span>
                  <span className="font-medium">₹{Number(deliveryCharge).toFixed(2)}</span>
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
                  <span>Total Amount:</span>
                  <span className="text-green-600">₹{Number(totalAmount).toFixed(2)}</span>
                </div>

                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-700 text-sm font-medium">
                    🔒 All payments are secured with bank-level encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main payment type selection
  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Choose Payment Method</h2>
              <p className="text-indigo-100 mt-1">Secure and convenient payment options for Nepal</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Payment Options */}
          <div className="flex-1 p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Type</h3>
            
            {paymentTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedPaymentType(type.id)}
                  className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-indigo-400 hover:shadow-lg hover:scale-105 transition-all duration-300 group transform"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                      <IconComponent className="text-2xl" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {type.name}
                      </h4>
                      <p className="text-gray-600 mt-1 text-sm">
                        {type.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {type.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 bg-gray-50 p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
            <div className="rounded-2xl p-6 bg-white shadow-md space-y-4">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Order Summary</h4>

              <div className="flex justify-between text-gray-700">
                <span>Product Amount:</span>
                <span className="font-medium">₹{Number(productAmount).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Delivery Charge:</span>
                <span className="font-medium">₹{Number(deliveryCharge).toFixed(2)}</span>
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

              <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                <p className="text-indigo-700 text-sm">
                  Select a payment method above to proceed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortal;
