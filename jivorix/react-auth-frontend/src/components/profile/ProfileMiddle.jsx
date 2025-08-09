import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileMiddle = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token:', token); // Debug: Log token
                if (!token) {
                    setError('No user logged in');
                    setLoading(false);
                    return;
                }
                const response = await axios.get('http://localhost/react-auth-backend/user/get_user.php', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Response:', response.data); // Debug: Log response
                if (response.data.success) {
                    setUserData(response.data.data);
                    setError('');
                } else {
                    setError(response.data.message || 'Failed to fetch user data');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching user data');
                console.error('Fetch user error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <section className='flex w-full items-start justify-start'>
                <div className='flex flex-col gap-6 w-full p-3 sm:p-4'>
                    <p className="text-[#6f4e37] text-sm sm:text-base">Loading...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className='flex w-full items-start justify-start'>
                <div className='flex flex-col gap-6 w-full p-3 sm:p-4'>
                    <p className='text-red-500 text-sm sm:text-base'>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className='flex w-full items-start justify-start'>
            <div className='flex flex-col gap-6 w-full p-3 sm:p-4'>
                <h4 className='text1 text-2xl max-md:text-xl max-sm:text-[18px] font-medium'>Profile details</h4>

                <div className='flex flex-col gap-4 max-sm:gap-3 w-full max-w-lg'>
                    <div className='flex items-center gap-6'>
                        <div className='flex flex-col gap-2'>
                            <h5 className='profileHead'>First Name</h5>
                            <p className='profileText'>{userData?.firstName || 'N/A'}</p>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <h5 className='profileHead'>Last Name</h5>
                            <p className='profileText'>{userData?.lastName || 'N/A'}</p>
                        </div>
                    </div>
                    <div className='h-[2px] w-full bg-[#E0D7CC] my-4'></div>

                    <div className='flex flex-col gap-2'>
                        <h5 className='profileHead'>Email</h5>
                        <p className='profileText'>{userData?.email || 'N/A'}</p>
                        <div className='h-[2px] w-full bg-[#E0D7CC] my-4'></div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <h5 className='profileHead'>Phone</h5>
                        <p className='profileText'>{userData?.phone || 'N/A'}</p>
                        <div className='h-[2px] w-full bg-[#E0D7CC] my-4'></div>
                    </div>

                    <div>
                        <div className='flex flex-col gap-2 justify-center'>
                            <h4 className='text3 text-[16px] max-sm:text-[10px]'>Shipping Address</h4>
                            <p className='text2 max-sm:text-[14px] font-medium hover:underline'>
                                {userData?.address ? `${userData.address}, ${userData.city}, ${userData.state} ${userData.postcode}` : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileMiddle;