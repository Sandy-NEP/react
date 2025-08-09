import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { CgMail, CgLock } from 'react-icons/cg';
import { IoEyeOff, IoEye } from "react-icons/io5";

function ResetPassword() {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [otpFocused, setOtpFocused] = useState(false);
    const [newPasswordFocused, setNewPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract user data from navigation state
    const { email, userId, name, otp: receivedOtp } = location.state || {};

    // Trigger fade-in animation on component mount
    useEffect(() => {
        setIsVisible(true);
        // Redirect to forget-password if state is missing
        if (!email || !userId || !name) {
            console.error('Missing navigation state:', { email, userId, name });
            navigate('/forget-password');
        }
    }, [email, userId, name, navigate]);

    // OTP validation
    const validateOtp = () => {
        if (!otp.trim() || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            setError('Please enter a valid 6-digit OTP');
            return false;
        }
        return true;
    };

    // Password validation
    const validatePasswords = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!newPassword.trim() || !passwordRegex.test(newPassword)) {
            setError('Password must be at least 8 characters, including uppercase, lowercase, number, and special character');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    // Handle OTP submission
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!validateOtp()) {
            setIsLoading(false);
            return;
        }

        try {
            console.log('Sending OTP verification request:', { userId, email, otp, action: 'verify_otp' });
            const response = await axios.post('http://localhost/react-auth-backend/reset/reset_password.php', {
                userId,
                email,
                otp,
                action: 'verify_otp',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('OTP verification response:', response.data);

            if (response.data.success) {
                setSuccess('OTP verified successfully.');
                setIsOtpVerified(true);
            } else {
                setError(response.data.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            let errorMessage = 'Something went wrong. Please try again.';
            if (err.response) {
                console.error('OTP verification error response:', err.response.data, 'Status:', err.response.status);
                errorMessage = err.response.data.message || `Error ${err.response.status}: ${err.response.statusText}`;
            } else if (err.request) {
                console.error('OTP verification no response:', err.request);
                errorMessage = 'Unable to connect to the server. Please check your network or try again later.';
            } else {
                console.error('OTP verification error:', err.message);
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!validatePasswords()) {
            setIsLoading(false);
            return;
        }

        try {
            console.log('Sending password reset request:', { userId, email, newPassword, action: 'reset_password' });
            const response = await axios.post('http://localhost/react-auth-backend/reset/reset_password.php', {
                userId,
                email,
                newPassword,
                action: 'reset_password',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Password reset response:', response.data);

            if (response.data.success) {
                setSuccess('Password updated successfully.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(response.data.message || 'Password reset failed. Please try again.');
            }
        } catch (err) {
            let errorMessage = 'Something went wrong. Please try again.';
            if (err.response) {
                console.error('Password reset error response:', err.response.data, 'Status:', err.response.status);
                errorMessage = err.response.data.message || `Error ${err.response.status}: ${err.response.statusText}`;
            } else if (err.request) {
                console.error('Password reset no response:', err.request);
                errorMessage = 'Unable to connect to the server. Please check your network or try again later.';
            } else {
                console.error('Password reset error:', err.message);
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen w-full bg-gradient-to-r from-[#FDEDD9] to-[#f8cfa0] flex items-center justify-center p-4 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <style>
                {`
                    @keyframes fade-in {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                    .hiking {
                        animation: fade-in 0.5s ease-in;
                    }
                `}
            </style>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
                <div className="hidden lg:flex items-center justify-center">
                    <img
                        src={assets.forget}
                        alt="Reset password banner"
                        loading="lazy"
                        className="w-full h-auto max-h-[600px] object-contain hiking"
                    />
                </div>
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-10 w-full transition-all duration-500 hiking">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#6f4e37] mb-6">
                        {isOtpVerified ? 'Set New Password' : 'Verify OTP'}
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        {isOtpVerified ? `Enter new password for ${name} (${email})` : `Enter the OTP sent to ${email}`}
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center" aria-live="polite">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center" aria-live="polite">
                            {success}
                        </div>
                    )}

                    {!isOtpVerified ? (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div className="relative">
                                <label className={`absolute left-2 transition-all duration-300 ${
                                    otpFocused || otp ? 'text-xs text-[#6f4e37] -translate-y-5' : 'text-gray-500 top-1/2 -translate-y-1/2'
                                }`}>
                                    OTP*
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    onFocus={() => setOtpFocused(true)}
                                    onBlur={() => !otp && setOtpFocused(false)}
                                    className="w-full pt-5 px-2 pb-2 border-b-2 border-gray-300 focus:border-[#6f4e37] outline-none bg-transparent"
                                    disabled={isLoading}
                                    required
                                    maxLength={6}
                                />
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Back to{' '}
                                    <Link to="/forget-password" className="text-[#6f4e37] hover:underline font-medium">
                                        Forgot Password
                                    </Link>
                                </span>
                                <span className="text-gray-600">
                                    Remembered your password?{' '}
                                    <Link to="/login" className="text-[#6f4e37] hover:underline font-medium">
                                        Login
                                    </Link>
                                </span>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#6f4e37] text-white py-3 px-4 rounded-full hover:bg-[#5a3c2e] shadow-lg transition duration-300 disabled:opacity-70"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordReset} className="space-y-6">
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-gray-600"><strong>Name:</strong> {name}</p>
                                <p className="text-gray-600"><strong>Email:</strong> {email}</p>
                            </div>
                            <div className="relative">
                                <label className={`absolute left-2 transition-all duration-300 ${
                                    newPasswordFocused || newPassword ? 'text-xs text-[#6f4e37] -translate-y-5' : 'text-gray-500 top-1/2 -translate-y-1/2'
                                }`}>
                                    New Password*
                                </label>
                                {newPassword && (
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#6f4e37]"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <IoEyeOff className="text-lg" /> : <IoEye className="text-lg" />}
                                    </button>
                                )}
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onFocus={() => setNewPasswordFocused(true)}
                                    onBlur={() => !newPassword && setNewPasswordFocused(false)}
                                    className="w-full pt-5 px-2 pb-2 border-b-2 border-gray-300 focus:border-[#6f4e37] outline-none bg-transparent"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label className={`absolute left-2 transition-all duration-300 ${
                                    confirmPasswordFocused || confirmPassword ? 'text-xs text-[#6f4e37] -translate-y-5' : 'text-gray-500 top-1/2 -translate-y-1/2'
                                }`}>
                                    Confirm Password*
                                </label>
                                {confirmPassword && (
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#6f4e37]"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <IoEyeOff className="text-lg" /> : <IoEye className="text-lg" />}
                                    </button>
                                )}
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setConfirmPasswordFocused(true)}
                                    onBlur={() => !confirmPassword && setConfirmPasswordFocused(false)}
                                    className="w-full pt-5 px-2 pb-2 border-b-2 border-gray-300 focus:border-[#6f4e37] outline-none bg-transparent"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Back to{' '}
                                    <Link to="/forget-password" className="text-[#6f4e37] hover:underline font-medium">
                                        Forgot Password
                                    </Link>
                                </span>
                                <span className="text-gray-600">
                                    Remembered your password?{' '}
                                    <Link to="/login" className="text-[#6f4e37] hover:underline font-medium">
                                        Login
                                    </Link>
                                </span>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#6f4e37] text-white py-3 px-4 rounded-full hover:bg-[#5a3c2e] shadow-lg transition duration-300 disabled:opacity-70"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Change Password'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;