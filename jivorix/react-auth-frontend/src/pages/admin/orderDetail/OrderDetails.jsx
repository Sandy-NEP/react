import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrderDetails = ({ onBack }) => {
  const navigate = useNavigate();
  const { paymentSuccess, paymentDetails, orderDetails } = useSelector((state) => state.cart);

  // If paymentSuccess is false, return a placeholder
  if (!paymentSuccess) {
    return (
      <section className="fixed m-auto w-full inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-[100vw] max-w-6xl h-[85vh] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="p-4 flex items-center justify-center h-full">
            <p className="text-gray-600">No order details available. Complete a payment to view details.</p>
          </div>
        </div>
      </section>
    );
  }

  const { user, products } = orderDetails;

  return (
    <section className="fixed m-auto w-full inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-[100vw] max-w-6xl h-[85vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="overflow-auto p-4">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-gray-600 font-medium">SN</th>
                  <th className="p-2 border text-gray-600 font-medium">Client ID</th>
                  <th className="p-2 border text-gray-600 font-medium">User Avatar</th>
                  <th className="p-2 border text-gray-600 font-medium">Username</th>
                  <th className="p-2 border text-gray-600 font-medium">Phone</th>
                  <th className="p-2 border text-gray-600 font-medium">Location</th>
                  <th className="p-2 border text-gray-600 font-medium">Product Image</th>
                  <th className="p-2 border text-gray-600 font-medium">Product Name</th>
                  <th className="p-2 border text-gray-600 font-medium">Quantity</th>
                  <th className="p-2 border text-gray-600 font-medium">Total Price</th>
                  <th className="p-2 border text-gray-600 font-medium">Payment Time</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{user.clientId || 'N/A'}</td>
                    <td className="p-2 border">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-8 h-8 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400">*a*</span>
                      )}
                    </td>
                    <td className="p-2 border">{user.username || 'N/A'}</td>
                    <td className="p-2 border">{user.phone || 'N/A'}</td>
                    <td className="p-2 border max-w-[150px] truncate" title={user.location}>
                      {user.location ? user.location.replace(/, ([^,]+)$/, ', c..') : 'N/A'}
                    </td>
                    <td className="p-2 border">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-2 border">{item.name || '-'}</td>
                    <td className="p-2 border">{item.quantity || '-'}</td>
                    <td className="p-2 border font-semibold">
                      {item.totalPrice ? `₹ ${item.totalPrice}` : '₹ NaN'}
                    </td>
                    <td className="p-2 border">{paymentDetails.date || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;