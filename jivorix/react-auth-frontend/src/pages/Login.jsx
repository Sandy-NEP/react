import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets';
import { CgMail } from "react-icons/cg";
import { IoEyeOff, IoEye } from "react-icons/io5";

function Login() {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!emailOrPhone.trim() || !password) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost/react-auth-backend/login.php', {
                emailOrPhone: emailOrPhone.trim(),
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Login response:', response.data);

            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                localStorage.setItem('token', response.data.data.token);
                console.log('Stored token:', response.data.data.token);
                navigate('/home', { state: { fromLogin: true } });
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            let errorMessage = 'Login failed. Please try again.';
            
            if (err.response) {
                console.error('Login error response:', err.response.data); 
                switch (err.response.status) {
                    case 400:
                        errorMessage = err.response.data.message || 'Invalid input data';
                        break;
                    case 401:
                        errorMessage = err.response.data.message || 'Invalid credentials';
                        break;
                    case 404:
                        errorMessage = err.response.data.message || 'User not found';
                        break;
                    case 500:
                        errorMessage = err.response.data.message || 'Server error';
                        break;
                    default:
                        errorMessage = err.response.data.message || 'Unexpected error';
                }
            } else if (err.request) {
                errorMessage = 'No response from server. Check your connection.';
            }
            
            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-[#FDEDD9] to-[#f8cfa0] flex items-center justify-center p-4 animate-fade-in">
            <style>
                {`
                    @keyframes fade-in {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.5s ease-in;
                    }
                `}
            </style>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
                <div className="hidden lg:flex items-center justify-center">
                    <img
                        src={assets.login}
                        alt="Login banner"
                        loading="lazy"
                        className="w-full h-auto max-h-[600px] object-contain animate-fade-in"
                    />
                </div>
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-10 w-full transition-all duration-500 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#6f4e37] mb-6">Welcome Back</h1>
                    <p className="text-center text-gray-600 mb-8">Login to continue your Shopping</p>

                    {location?.state?.message && (
                        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                            {location.state.message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label className={`absolute left-2 transition-all duration-300 ${
                                (emailFocused || emailOrPhone) 
                                    ? 'text-xs text-[#6f4e37] -translate-y-5' 
                                    : 'text-gray-500 top-1/2 -translate-y-1/2'
                            }`}>
                                Email or Phone*
                            </label>
                            <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                                (emailFocused || emailOrPhone) ? 'text-[#6f4e37]' : 'text-gray-400'
                            }`}>
                                <CgMail className="text-lg" />
                            </div>
                            <input
                                type="text"
                                value={emailOrPhone}
                                onChange={(e) => setEmailOrPhone(e.target.value)}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => !emailOrPhone && setEmailFocused(false)}
                                className="w-full pt-5 px-2 pb-2 border-b-2 border-gray-300 focus:border-[#6f4e37] outline-none bg-transparent"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="relative">
                            <label className={`absolute left-2 transition-all duration-300 ${
                                (passwordFocused || password) 
                                    ? 'text-xs text-[#6f4e37] -translate-y-5' 
                                    : 'text-gray-500 top-1/2 -translate-y-1/2'
                            }`}>
                                Password*
                            </label>
                            <button
                                type="button"
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                                    (passwordFocused || password) ? 'text-[#6f4e37]' : 'text-gray-400'
                                }`}
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? <IoEyeOff className="text-lg" /> : <IoEye className="text-lg" />}
                            </button>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => !password && setPasswordFocused(false)}
                                className="w-full pt-5 px-2 pb-2 border-b-2 border-gray-300 focus:border-[#6f4e37] outline-none bg-transparent"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-[#6f4e37] hover:underline font-medium">
                                    Sign up
                                </Link>
                            </span>
                            <Link to="/forgot-password" className="text-[#6f4e37] hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#6f4e37] text-white py-3 px-4 rounded-full hover:bg-[#5a3c2e] shadow-lg transition duration-300 disabled:opacity-70"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative flex items-center mb-6">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-500">or continue with</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <div className="flex justify-center gap-6">
                            <button
                                onClick={() => alert('Google login not implemented')}
                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <img className="w-6 h-6" src={assets.google} alt="google" loading="lazy" />
                            </button>
                            <button
                                onClick={() => alert('Facebook login not implemented')}
                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <img className="w-6 h-6" src={assets.facebook} alt="facebook" loading="lazy" />
                            </button>
                            <button
                                onClick={() => alert('Instagram login not implemented')}
                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <img className="w-6 h-6" src={assets.instagram} alt="instagram" loading="lazy" />
                            </button>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default Login;