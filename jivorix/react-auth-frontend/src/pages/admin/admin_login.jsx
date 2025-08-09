import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin, onClose }) => {
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [adminName, setAdminName] = useState('');
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const adminNameInputRef = useRef(null);

  // Focus on the adminName input when the form appears
  useEffect(() => {
    if (selectedAdmin && adminNameInputRef.current) {
      adminNameInputRef.current.focus();
    }
  }, [selectedAdmin]);

  const handleAdminSelect = (admin) => {
    setSelectedAdmin(admin);
    setError('');
    setAdminName('');
    setAdminId('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!adminId || !password) {
      setError('Please enter both Admin ID and Password');
      return;
    }

    try {
      const response = await fetch('http://localhost/react-auth-backend/admin/admin_login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: adminId,
          password: password,
          adminType: selectedAdmin,
          adminName: adminName || '',
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      if (result.success) {
        setLoginAttempts(0); // Reset attempts on successful login
        onLogin({ admin: selectedAdmin, adminId, adminName: adminName || null });
        onClose();
      } else {
        const newAttempts = (result.attempts || loginAttempts + 1);
        setLoginAttempts(newAttempts);
        setError(result.message);

        if (result.maxAttemptsReached || newAttempts >= 3) {
          navigate('/signup');
        }
      }
    } catch (err) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      setError('Error: ' + err.message);

      if (newAttempts >= 3) {
        navigate('/signup');
      }
    }
  };

  const handleClose = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {selectedAdmin ? `${selectedAdmin} Login` : 'Select Admin'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        {!selectedAdmin ? (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleAdminSelect('Admin1')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Admin1
            </button>
            <button
              onClick={() => handleAdminSelect('Admin2')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Admin2
            </button>
            <button
              onClick={() => handleAdminSelect('Admin3')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Admin3
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded border border-red-200">
                {error} {loginAttempts > 0 && `(Attempt ${loginAttempts}/3)`}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Admin Name (Optional)
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ref={adminNameInputRef}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Admin ID
              </label>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setSelectedAdmin(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;