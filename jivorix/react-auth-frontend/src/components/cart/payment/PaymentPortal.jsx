
import React, { useState } from 'react';
import { FaCreditCard, FaMobile, FaTimes } from 'react-icons/fa';
import CreditCardPayment from './CreditCardPayment';
import OnlinePayment from './OnlinePayment';

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

  if (selectedPaymentType === 'online') {
    return (
      <OnlinePayment
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
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
                  className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-indigo-400 hover:shadow-lg transition-all duration-200 group"
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
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
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

            {/* Security Information */}
            <div className="bg-gray-50 rounded-xl p-4 mt-6">
              <h4 className="font-semibold text-gray-800 mb-2">🔒 Your payment is secure</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• SSL encrypted transactions</li>
                <li>• PCI DSS compliant processing</li>
                <li>• No card details stored</li>
                <li>• Fraud protection enabled</li>
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 bg-gray-50 p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h4>
              
              <div className="space-y-3">
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
                
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total Amount:</span>
                  <span>₹{Number(totalAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods Accepted */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Accepted in Nepal:</h5>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-100 rounded p-2 text-center">
                    <img src="/src/components/cart/images/esewa.png" alt="eSewa" className="h-6 mx-auto" />
                  </div>
                  <div className="bg-gray-100 rounded p-2 text-center">
                    <img src="/src/components/cart/images/khalti.png" alt="Khalti" className="h-6 mx-auto" />
                  </div>
                  <div className="bg-gray-100 rounded p-2 text-center">
                    <img src="/src/components/cart/images/imepay.png" alt="IME Pay" className="h-6 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortal;
