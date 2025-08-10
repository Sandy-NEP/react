import React from 'react';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PaymentSuccess = ({ onClose }) => {
  const navigate = useNavigate();
  const { paymentSuccess, paymentDetails } = useSelector((state) => state.cart);

  // If paymentSuccess is false, redirect to shop or cart
  if (!paymentSuccess) {
    navigate('/shop');
    return null;
  }

  const {
    transactionId = 'N/A',
    date = new Date().toLocaleString(),
    paymentMethod = 'N/A',
    customerName = 'Guest',
    mobileNumber = 'N/A',
    paymentAmount = 0,
    productAmount = 0,
    deliveryCharge = 0,
    discount = 0,
    appliedPromo = ''
  } = paymentDetails;

  const handleContinueShopping = () => {
    onClose(); // Close the modal first
    navigate('/shop'); // Then navigate to the shop page
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-green-500 p-6 text-white text-center">
          <FaCheckCircle className="text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="text-lg mt-2">Thank you for your purchase</p>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Transaction ID</p>
                <p className="font-medium">{transactionId}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Date</p>
                <p className="font-medium">{date}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Payment Method</p>
                <p className="font-medium">{paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Customer Name</p>
                <p className="font-medium">{customerName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Mobile Number</p>
                <p className="font-medium">{mobileNumber}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Product Amount:</span>
                <span className="font-medium">₹{Number(productAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Delivery Charge:</span>
                <span className="font-medium">₹{Number(deliveryCharge).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Discount {appliedPromo ? `(${appliedPromo})` : ''}:</span>
                  <span className="font-medium text-green-600">-₹{Number(discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-200">
                <span>Total Paid:</span>
                <span>₹{Number(paymentAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinueShopping}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
            <FaShoppingBag /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;