import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import AdminLogin from './admin_login';
import SandeshAi from './SandeshAi';
import OrderDetails from './orderDetail/OrderDetails';

const UserCartSummary = ({ userId, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const API_URL = 'http://localhost/react-auth-backend/admin/admin_api.php';

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/cart?user_id=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        console.log('Cart Items:', data); // Debug API response
        setCartItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders?user_id=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setOrderDetails(data);
      setShowOrderDetails(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed m-auto w-full inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-[100vw] max-w-6xl h-[85vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">User Cart Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        {loading ? (
          <div className="p-4 flex items-center justify-center h-full">
            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2">Loading...</span>
          </div>
        ) : cartItems.length === 0 && !showOrderDetails ? (
          <div className="p-4 flex items-center justify-center h-full">
            <p className="text-gray-600">No items in the cart.</p>
          </div>
        ) : showOrderDetails && orderDetails ? (
          <OrderDetails
            orderDetails={orderDetails}
            userId={userId}
            onBack={() => setShowOrderDetails(false)}
          />
        ) : (
          <div className="overflow-auto p-4">
            <div className="overflow-x-auto h-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border text-gray-600 font-medium">Image</th>
                    <th className="p-2 border text-gray-600 font-medium">Name</th>
                    <th className="p-2 border text-gray-600 font-medium">Quantity</th>
                    <th className="p-2 border text-gray-600 font-medium">Price (₹)</th>
                    <th className="p-2 border text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(cartItems) && cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <tr key={item._id || `cart-item-${index}`} className="border-b hover:bg-gray-50">
                        <td className="p-2 border">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover mx-auto" />
                        </td>
                        <td className="p-2 border">{item.name}</td>
                        <td className="p-2 border">{item.quantity}</td>
                        <td className="p-2 border font-semibold">{(item.price * item.quantity).toFixed(2)}</td>
                        <td className="p-2 border">
                          <button
                            onClick={fetchOrderDetails}
                            className="text-blue-500 hover:underline"
                          >
                            View Order Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-2 text-center text-gray-600">
                        No items available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    date_of_birth: '',
    national_id: '',
    gender: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const draggableRef = useRef(null);

  const API_URL = 'http://localhost/react-auth-backend/admin/admin_api.php';

  const handleAdminLogin = (adminData) => {
    setCurrentAdmin(adminData);
    setIsLoginModalOpen(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersResponse = await fetch(API_URL);
      if (!usersResponse.ok) {
        throw new Error(`HTTP error! status: ${usersResponse.status}`);
      }
      const usersData = await usersResponse.json();
      if (usersData.error) {
        throw new Error(usersData.error);
      }
      console.log('Users:', usersData); // Debug API response
      const usersWithOrders = await Promise.all(
        usersData.map(async (user) => {
          try {
            const ordersResponse = await fetch(`${API_URL}/orders?user_id=${user.id}`);
            if (!ordersResponse.ok) {
              return { ...user, orderQuantity: 0, orderTotalPrice: 0 };
            }
            const ordersData = await ordersResponse.json();
            if (ordersData.error || !ordersData.products) {
              return { ...user, orderQuantity: 0, orderTotalPrice: 0 };
            }
            const orderQuantity = ordersData.products.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const orderTotalPrice = ordersData.products.reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);
            return { ...user, orderQuantity, orderTotalPrice };
          } catch (error) {
            console.error(`Error fetching orders for user ${user.id}:`, error);
            return { ...user, orderQuantity: 0, orderTotalPrice: 0 };
          }
        })
      );
      const sortedUsers = usersWithOrders.sort((a, b) => {
        if (b.orderTotalPrice === a.orderTotalPrice) {
          return b.orderQuantity - a.orderQuantity;
        }
        return b.orderTotalPrice - a.orderTotalPrice;
      });
      setUsers(sortedUsers);
    } catch (error) {
      setMessage('Error fetching users: ' + error.message);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAdmin) {
      fetchUsers();
    }
  }, [currentAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        const response = await fetch(API_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setMessage('User updated successfully!');
        setIsDetailsModalOpen(false);
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setMessage('User created successfully!');
        setIsAddModalOpen(false);
      }
      await fetchUsers();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error: ' + error.message);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        const response = await fetch(API_URL, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setMessage('User deleted successfully!');
        setIsDetailsModalOpen(false);
        await fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting user: ' + error.message);
        setTimeout(() => setMessage(''), 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      city: '',
      state: '',
      postcode: '',
      date_of_birth: '',
      national_id: '',
      gender: ''
    });
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setIsDetailsModalOpen(true);
  };

  const openEditMode = () => {
    setIsEditing(true);
  };

  const openAiModal = () => {
    setIsAiModalOpen(true);
  };

  const openCartModal = async (user) => {
    setSelectedUser(user);
    setIsCartModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    resetForm();
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
    setIsEditing(false);
    resetForm();
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeAiModal = () => {
    setIsAiModalOpen(false);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {isLoginModalOpen && (
        <AdminLogin onLogin={handleAdminLogin} onClose={closeLoginModal} />
      )}

      {isAiModalOpen && <SandeshAi onClose={closeAiModal} />}

      {isCartModalOpen && selectedUser && (
        <UserCartSummary userId={selectedUser.id} onClose={closeCartModal} />
      )}

      <Draggable nodeRef={draggableRef} bounds="parent">
        <button
          ref={draggableRef}
          onClick={openAiModal}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition"
          disabled={!currentAdmin}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-2a2 2 0 012-2h10a2 2 0 012 2v2h-4M12 4a4 4 0 00-4 4h8a4 4 0 00-4-4z"></path>
          </svg>
        </button>
      </Draggable>

      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Admin Panel {currentAdmin ? `(${currentAdmin.admin} - ${currentAdmin.adminId})` : ''}
          </h1>
          <div className='allCenter gap-6'>
            <button
              onClick={() => openCartModal(selectedUser || users[0])}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              disabled={!currentAdmin || users.length === 0}
            >
              Order Details
            </button>
            <button
              onClick={openAddModal}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              disabled={!currentAdmin}
            >
              Add User
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {message && (
          <div className={`mb-4 p-4 rounded-lg shadow-md ${message.includes('Error') ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
            {message}
          </div>
        )}

        {loading && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New User</h2>
                <button
                  onClick={closeAddModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postcode</label>
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">National ID</label>
                  <input
                    type="text"
                    name="national_id"
                    value={formData.national_id}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="mt-1 p-2 w-full border rounded"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="lg:col-span-2 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                  >
                    {loading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDetailsModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{isEditing ? 'Edit User Details' : `Information of ${selectedUser.first_name} ${selectedUser.middle_name} ${selectedUser.last_name}`}</h2>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <input type="hidden" name="id" value={formData.id} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <input
                      type="text"
                      name="middle_name"
                      value={formData.middle_name}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Postcode</label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">National ID</label>
                    <input
                      type="text"
                      name="national_id"
                      value={formData.national_id}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="lg:col-span-2 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={closeDetailsModal}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    >
                      {loading ? 'Updating...' : 'Update User'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className='grid grid-cols-2 max-md:grid-cols-1 gap-3'>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>ID:</strong> {selectedUser.id}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>Gender:</strong> {selectedUser.gender || '-'}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>Phone:</strong> {selectedUser.phone}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>Email:</strong> {selectedUser.email}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>City:</strong> {selectedUser.city || '-'}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>State:</strong> {selectedUser.state || '-'}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>Postcode:</strong> {selectedUser.postcode || '-'}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>National ID:</strong> {selectedUser.national_id || '-'}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>Date of Birth:</strong> {selectedUser.date_of_birth || '-'}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>Address:</strong> {selectedUser.address || '-'}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>Order Quantity:</strong> {selectedUser.orderQuantity || 0}</div>
                    <div className='py-2 border-b-[1px] after-border relative'><strong>Order Total Price:</strong> {selectedUser.orderTotalPrice ? `₹ ${selectedUser.orderTotalPrice.toFixed(2)}` : '₹ 0.00'}</div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={openEditMode}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit User
                    </button>
                    <button
                      onClick={() => handleDelete(selectedUser.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md mt-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">User List</h2>
          </div>
          <section className="grid grid-cols-8 gap-0 p-4 border border-gray-200 rounded-lg">
            <div className="flex flex-col">
              <header className="bg-gray-100 px-6 py-3">
                <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</div>
              </header>
              <div className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <div className="px-6 py-4 text-center text-gray-500 col-span-8">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading users...
                    </div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="px-6 py-4 text-center text-gray-500 col-span-8">
                    No users found. Click "Add User" to create the first user.
                  </div>
                ) : (
                  users.map((user) => (
                    <div key={`id-${user.id}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hover:bg-gray-50">
                      {user.id}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <header className="bg-gray-100 px-6 py-3">
                <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</div>
              </header>
              <div className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <div
                    key={`first-name-${user.id}`}
                    className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 hover:bg-blue-50"
                  >
                    {user.first_name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <header className="bg-gray-100 px-6 py-3">
                <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</div>
              </header>
              <div className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <div
                    key={`last-name-${user.id}`}
                    className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 hover:bg-blue-50"
                  >
                    {user.last_name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <header className="bg-gray-100 px-6 py-3">
                <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</div>
              </header>
              <div className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={`email-${user.id}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hover:bg-gray-50">
                    {user.email}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <header className="bg-gray-100 px-6 py-3">
                <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</div>
              </header>
              <div className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={`phone-${user.id}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hover:bg-gray-50">
                    {user.phone}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <header className="bg-gray-100 px-6 py-3">
                <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Quantity</div>
              </header>
              <div className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={`order-quantity-${user.id}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hover:bg-gray-50">
                    {user.orderQuantity || 0}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <header className="bg-gray-100 px-6 py-3">
                <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Total Price</div>
              </header>
              <div className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={`order-total-price-${user.id}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hover:bg-gray-50">
                    {user.orderTotalPrice ? `₹ ${user.orderTotalPrice.toFixed(2)}` : '₹ 0.00'}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <header className="bg-gray-100 px-6 py-3">
                <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
              </header>
              <div className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={`actions-${user.id}`} className="px-6 py-4 whitespace-nowrap hover:bg-gray-50">
                    <button
                      onClick={() => openDetailsModal(user)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      More+
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;