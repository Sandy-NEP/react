import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader-container">
        <div className="loader">
          <div className="loader-bar" />
        </div>
        <div className="loader-text">Loading...</div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000;
  z-index: 9999;

  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    width: 80%;
    max-width: 500px;
  }

  .loader {
    width: 100%;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    overflow: hidden;
  }

  .loader-bar {
    height: 100%;
    width: 25%;
    background-color: #f8d0a2;
    border-radius: 8px;
    animation: loading 2.5s ease-in-out infinite;
  }

  .loader-text {
    color: white;
    font-size: 24px;
    font-weight: 500;
    animation: textPulse 2s ease-in-out infinite;
  }

  @keyframes loading {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(400%);
    }
  }

  @keyframes textPulse {
    0%, 100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
      text-shadow: 0 0 10px rgba(248, 208, 162, 0.5);
    }
  }

  @media (max-width: 768px) {
    .loader-container {
      gap: 20px;
      width: 90%;
    }
    .loader-text {
      font-size: 20px;
    }
  }
`;

export default Loader;