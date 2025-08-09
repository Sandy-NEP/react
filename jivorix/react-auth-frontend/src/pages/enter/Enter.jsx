import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import styled, { keyframes } from 'styled-components';

// Fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const FadeContainer = styled.div`
  animation: ${fadeIn} 1.5s ease-out forwards;
`;

const Enter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show loader for 5 seconds
    const loaderTimer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true); // Trigger content fade-in
    }, 5000);

    return () => clearTimeout(loaderTimer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {showContent && (
        <FadeContainer>
          <div className="h-screen w-full relative overflow-hidden">
            {/* Background Image */}
            <img 
              className="h-full w-full absolute object-cover"
              src={assets.enter} 
              alt="Welcome to our fashion store" 
              loading="eager"
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-[50px] md:gap-[100px] px-6 md:px-[150px]">
              <div className="text-center max-w-4xl">
                <h1 className="text-[#fffbf9] text-4xl md:text-[55px] font-extrabold leading-[1.3] md:leading-[1.5]">
                  Dress to Express
                </h1>
                <h3 className="text-[#fffbf9] text-xl md:text-[30px] font-bold my-6 md:mb-[50px]">
                  Appeals to Identity and Individuality
                </h3>
                <p className="text-sm md:text-[15px] text-[#dfe0ff] font-light tracking-wide md:tracking-[1.5px] leading-relaxed">
                  Welcome to <span className="font-medium">Jivorix</span> – your destination for effortless style! 
                  Discover curated collections designed to inspire your perfect look. 
                  Sign up now for exclusive early access to new arrivals, members-only deals, 
                  and personalized recommendations.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 md:gap-[20px] w-full sm:w-auto px-4">
                <button 
                  onClick={() => navigate('/login')} 
                  className="w-full sm:w-[180px] md:w-[200px] py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition duration-300 text-sm md:text-base"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')} 
                  className="w-full sm:w-[180px] md:w-[200px] py-3 bg-[#f8d0a2] text-black rounded-full hover:bg-[#e5b887] transition duration-300 text-sm md:text-base"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </FadeContainer>
      )}
    </>
  );
};

export default Enter;