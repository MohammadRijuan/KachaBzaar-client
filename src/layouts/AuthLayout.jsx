import React from 'react';
import { Outlet } from 'react-router';
import { Player } from '@lottiefiles/react-lottie-player';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 p-4">
      <div className="flex flex-col-reverse lg:flex-row items-center max-w-6xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Left Side – Register/Login Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10">
          <Outlet />
        </div>

        {/* Right Side – Lottie Animation */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-10">
          <Player
            autoplay
            loop
            src="https://assets6.lottiefiles.com/packages/lf20_jcikwtux.json" // Auth-themed animation
            style={{ height: '300px', width: '300px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
