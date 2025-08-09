import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { CgMail } from 'react-icons/cg';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    // Trigger fade-in animation on component mount
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Email validation
    const validateInputs = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setError('Please enter your email address');
            return false;
        }
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!validateInputs()) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost/react-auth-backend/reset/forgot_password.php', {
                email: email.trim(),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Forgot password response:', response.data);

            if (response.data.success) {
                setSuccess('OTP generated successfully.');
                // Display OTP in an alert
                alert(`Your OTP is: ${response.data.data.otp}`);
                // Navigate to reset-password page after a short delay
                setTimeout(() => {
                    navigate('/reset-password', {
                        state: {
                            email: email.trim(),
                            userId: response.data.data.userId,
                            name: response.data.data.name,
                        },
                    });
                }, 2000);
            } else {
                setError(response.data.message || 'Password reset request failed. Please try again.');
            }
        } catch (err) {
            let errorMessage = 'Something went wrong. Please try again.';
            if (err.response) {
                console.error('Forgot password error response:', err.response.data);
                errorMessage = err.response.data.message || errorMessage;
                switch (err.response.status) {
                    case 400:
                        errorMessage = err.response.data.message || 'Invalid email format';
                        break;
                    case 404:
                        errorMessage = err.response.data.message || 'No account found with this email';
                        break;
                    case 429:
                        errorMessage = err.response.data.message || 'Too many attempts. Please try again later.';
                        break;
                    case 500:
                        errorMessage = err.response.data.message || 'Server error. Please try again later.';
                        break;
                    default:
                        errorMessage = err.response.data.message || 'Unexpected error occurred';
                }
            } else if (err.request) {
                errorMessage = 'Unable to connect to the server. Please check your network or try again later.';
            }
            setError(errorMessage);
            console.error('Forgot password error:', err);
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
                        src={assets.forgot}
                        alt="Forgot password banner"
                        loading="lazy"
                        className="w-full h-auto max-h-[600px] object-contain hiking"
                    />
                </div>
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-10 w-full transition-all duration-500 hiking">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#6f4e37] mb-6">Reset Your Password</h1>
                    <p className="text-center text-gray-600 mb-8">Enter your email to receive a password reset OTP</p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label className={`absolute left-2 transition-all duration-300 ${
                                emailFocused || email ? 'text-xs text-[#6f4e37] -translate-y-5' : 'text-gray-500 top-1/2 -translate-y-1/2'
                            }`}>
                                Email*
                            </label>
                            <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                                emailFocused || email ? 'text-[#6f4e37]' : 'text-gray-400'
                            }`}>
                                <CgMail className="text-lg" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => !email && setEmailFocused(false)}
                                className="w-full pt-5 px-2 pb-2 border-b-2 border-gray-300 focus:border-[#6f4e37] outline-none bg-transparent"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                Remembered your password?{' '}
                                <Link to="/login" className="text-[#6f4e37] hover:underline font-medium">
                                    Login
                                </Link>
                            </span>
                            <span className="text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-[#6f4e37] hover:underline font-medium">
                                    Sign up
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
                                'Send Reset OTP'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;