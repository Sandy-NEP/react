import React, { useState, useEffect } from 'react';
import { getUserOrderHistoryAPI, getOrdersByStatusAPI } from '../services/orderService';
import OrderCard from '../components/orders/OrderCard';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';
import { FaHistory, FaFilter, FaSearch } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    hasMore: false
  });

  const statusOptions = [
    { value: 'all', label: 'All Orders', color: 'bg-gray-500' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-500' },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-500' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async (loadMore = false) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        limit: pagination.limit,
        offset: loadMore ? pagination.offset + pagination.limit : 0
      };

      let response;
      if (statusFilter === 'all') {
        response = await getUserOrderHistoryAPI(params);
      } else {
        response = await getOrdersByStatusAPI(statusFilter, params);
      }

      if (response.success) {
        if (loadMore) {
          setOrders(prev => [...prev, ...response.data.orders]);
          setPagination(prev => ({
            ...prev,
            offset: prev.offset + prev.limit,
            hasMore: response.data.pagination.hasMore
          }));
        } else {
          setOrders(response.data.orders);
          setPagination({
            limit: response.data.pagination.limit,
            offset: response.data.pagination.offset,
            hasMore: response.data.pagination.hasMore
          });
        }
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(prev => prev.map(order => 
      order.transaction_id === updatedOrder.transaction_id 
        ? { ...order, order_status: updatedOrder.order_status, can_cancel: updatedOrder.can_cancel }
        : order
    ));
  };

  const handleRefresh = () => {
    setPagination(prev => ({ ...prev, offset: 0 }));
    fetchOrders();
  };

  const handleLoadMore = () => {
    fetchOrders(true);
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      order.transaction_id.toLowerCase().includes(searchLower) ||
      order.customer_name.toLowerCase().includes(searchLower) ||
      order.products.some(product => 
        product.name.toLowerCase().includes(searchLower)
      )
    );
  });

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaHistory className="text-2xl text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              <MdRefresh className={`${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
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

        {/* Loading State */}
        {loading && orders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!loading && filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaHistory className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? "No orders match your search criteria." 
                : statusFilter !== 'all' 
                  ? `No orders with status "${statusFilter}".`
                  : "You haven't placed any orders yet."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={`${order.table_source}-${order.id}`}
                order={order}
                onClick={() => handleOrderClick(order)}
                getStatusColor={getStatusColor}
              />
            ))}

            {/* Load More Button */}
            {pagination.hasMore && !loading && (
              <div className="text-center py-6">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load More Orders
                </button>
              </div>
            )}

            {/* Loading More */}
            {loading && orders.length > 0 && (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <span className="text-gray-600 mt-2 block">Loading more orders...</span>
              </div>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderDetails(false);
              setSelectedOrder(null);
            }}
            onOrderUpdate={handleOrderUpdate}
            getStatusColor={getStatusColor}
          />
        )}
      </div>
    </div>
  );
};

export default OrderHistory;