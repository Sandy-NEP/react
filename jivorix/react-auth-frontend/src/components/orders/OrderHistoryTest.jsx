import React, { useState } from 'react';
import { getUserOrderHistoryAPI, cancelOrderAPI } from '../../services/orderService';

const OrderHistoryTest = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testFetchOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getUserOrderHistoryAPI();
      console.log('Order history response:', response);
      
      if (response.success) {
        setOrders(response.data.orders);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const testCancelOrder = async (transactionId) => {
    try {
      const response = await cancelOrderAPI(transactionId);
      console.log('Cancel order response:', response);
      
      if (response.success) {
        // Update the order status in the list
        setOrders(prev => prev.map(order => 
          order.transaction_id === transactionId 
            ? { ...order, order_status: 'cancelled', can_cancel: false }
            : order
        ));
      } else {
        setError(response.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError(error.message || 'Failed to cancel order');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Order History Test</h2>
      
      <div className="mb-4">
        <button
          onClick={testFetchOrders}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Test Fetch Orders'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold">Orders ({orders.length}):</h3>
        {orders.map((order, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">Order #{order.transaction_id}</h4>
                <p className="text-sm text-gray-600">Status: {order.order_status}</p>
                <p className="text-sm text-gray-600">Amount: ₹{order.payment_amount}</p>
                <p className="text-sm text-gray-600">Date: {order.formatted_date}</p>
                <p className="text-sm text-gray-600">Items: {order.item_count}</p>
              </div>
              <div>
                {order.can_cancel && (
                  <button
                    onClick={() => testCancelOrder(order.transaction_id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {orders.length === 0 && !loading && (
          <p className="text-gray-500">No orders found. Try placing an order first.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryTest;