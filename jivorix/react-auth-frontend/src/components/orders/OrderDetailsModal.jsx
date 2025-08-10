import React, { useState } from 'react';
import { cancelOrderAPI } from '../../services/orderService';
import { 
  FaTimes, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaGlobe, 
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBox,
  FaExclamationTriangle
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';

const OrderDetailsModal = ({ order, onClose, onOrderUpdate, getStatusColor }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  const handleCancelOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await cancelOrderAPI(order.transaction_id);
      
      if (response.success) {
        // Update the order in the parent component
        onOrderUpdate({
          ...order,
          order_status: 'cancelled',
          can_cancel: false
        });
        
        setShowCancelConfirm(false);
        // Show success message or close modal
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setError(response.message || 'Failed to cancel order');
      }
    } catch (error) {
      setError(error.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-500' },
      processing: { label: 'Processing', color: 'bg-blue-500' },
      shipped: { label: 'Shipped', color: 'bg-purple-500' },
      delivered: { label: 'Delivered', color: 'bg-green-500' },
      cancelled: { label: 'Cancelled', color: 'bg-red-500' }
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-500' };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            {getStatusBadge(order.order_status)}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Order Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaBox className="text-gray-400" />
                  <div>
                    <div className="font-medium">Order ID</div>
                    <div className="text-gray-600">{order.transaction_id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-gray-400" />
                  <div>
                    <div className="font-medium">Order Date</div>
                    <div className="text-gray-600">
                      {order.formatted_date || new Date(order.order_date).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getPaymentIcon(order.payment_method)}
                  <div>
                    <div className="font-medium">Payment Method</div>
                    <div className="text-gray-600">{getPaymentMethodLabel(order.payment_method)}</div>
                  </div>
                </div>

                {/* Additional payment info for credit card */}
                {order.table_source === 'creditcardpayment' && order.card_last_four && (
                  <div className="ml-6 text-sm text-gray-500">
                    Card ending in ****{order.card_last_four}
                    {order.card_type && ` (${order.card_type})`}
                  </div>
                )}

                {/* Additional payment info for online payment */}
                {order.table_source === 'onlinepayment' && order.payment_gateway && (
                  <div className="ml-6 text-sm text-gray-500">
                    Gateway: {order.payment_gateway}
                    {order.gateway_transaction_id && (
                      <div>Transaction ID: {order.gateway_transaction_id}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 mt-1" />
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-gray-600">
                      {order.address}<br />
                      {order.city}, {order.country}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-gray-600">{order.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">{order.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ordered Items</h3>
            <div className="space-y-3">
              {order.products.map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    )}
                    {product.size && (
                      <p className="text-sm text-gray-500">Size: {product.size}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Qty: {product.quantity}</div>
                    <div className="text-gray-600">{formatCurrency(product.price)} each</div>
                    <div className="font-semibold">
                      {formatCurrency(product.price * product.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Product Amount:</span>
                <span>{formatCurrency(order.product_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>{formatCurrency(order.delivery_charge)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {order.applied_promo && `(${order.applied_promo})`}:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>{formatCurrency(order.payment_amount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {order.can_cancel && !showCancelConfirm && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            )}

            {showCancelConfirm && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-red-600">
                  <FaExclamationTriangle />
                  <span className="text-sm">Are you sure you want to cancel this order?</span>
                </div>
                <button
                  onClick={handleCancelOrder}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  No, Keep Order
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;