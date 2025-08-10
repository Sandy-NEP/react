import React from 'react';
import { FaCalendarAlt, FaCreditCard, FaMoneyBillWave, FaGlobe, FaBox } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';

const OrderCard = ({ order, onClick, getStatusColor }) => {
  const getPaymentIcon = (paymentMethod) => {
    switch (paymentMethod) {
      case 'paymentondelivery':
        return <FaMoneyBillWave className="text-green-600" />;
      case 'creditcardpayment':
        return <FaCreditCard className="text-blue-600" />;
      case 'onlinepayment':
        return <FaGlobe className="text-purple-600" />;
      default:
        return <MdPayment className="text-gray-600" />;
    }
  };

  const getPaymentMethodLabel = (paymentMethod) => {
    switch (paymentMethod) {
      case 'paymentondelivery':
        return 'Cash on Delivery';
      case 'creditcardpayment':
        return 'Credit Card';
      case 'onlinepayment':
        return 'Online Payment';
      default:
        return paymentMethod;
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section - Order Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.transaction_id}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.order_status)}`}>
              {order.order_status?.charAt(0).toUpperCase() + order.order_status?.slice(1) || 'Pending'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
              <span>{order.formatted_date || new Date(order.order_date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {getPaymentIcon(order.payment_method)}
              <span>{getPaymentMethodLabel(order.payment_method)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FaBox className="text-gray-400" />
              <span>{order.item_count} item{order.item_count !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Products Preview */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {order.products.slice(0, 3).map((product, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-6 h-6 rounded object-cover"
                    />
                  )}
                  <span className="text-sm text-gray-700 truncate max-w-32">
                    {product.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ×{product.quantity}
                  </span>
                </div>
              ))}
              {order.products.length > 3 && (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg px-3 py-1">
                  <span className="text-sm text-gray-600">
                    +{order.products.length - 3} more
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Amount and Actions */}
        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(order.payment_amount)}
            </div>
            <div className="text-sm text-gray-500">
              Total Amount
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
            
            {order.can_cancel && (
              <span className="px-3 py-2 bg-yellow-100 text-yellow-800 text-xs rounded-lg">
                Can Cancel
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Delivery to:</span> {order.customer_name}
        </div>
        <div className="text-sm text-gray-500 truncate">
          {order.address}, {order.city}, {order.country}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;