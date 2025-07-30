import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { Player } from '@lottiefiles/react-lottie-player';

const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 p-4">

      {/* Top Left Logo + Title */}
      <div className="absolute top-10 left-26 flex items-center space-x-2">
        <NavLink to="/">
          <img className="w-12 h-10 object-contain" src="/logo-k.png" alt="Logo" />
        </NavLink>
        <NavLink to="/">
          <h1 className="font-bold text-lg sm:text-xl text-green-800">KachaBazaar</h1>
        </NavLink>
      </div>

      {/* Main Auth Card */}
      <div className="flex flex-col-reverse lg:flex-row items-center max-w-6xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">

        {/* Left – Form */}
        <div className="w-full lg:w-1/2 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
          <Outlet />
        </div>

        {/* Right – Lottie */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-2 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
          <Player
            autoplay
            loop
            src="https://assets6.lottiefiles.com/packages/lf20_jcikwtux.json"
            style={{ height: '400px', width: '400px' }}
            className="sm:h-[240px] sm:w-[240px] md:h-[260px] md:w-[260px]"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
