import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router'; 
import useAuth from '../hooks/useAuth';
import SocialLogin from './SocialLogin';


const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { SigninUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  const onSubmit = (data) => {
    SigninUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        navigate(from);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-700">Welcome Back</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { required: true, minLength: 6 })}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
            {errors.password?.type === 'required' && (
              <p className="text-red-500 text-sm">Password is required</p>
            )}
            {errors.password?.type === 'minLength' && (
              <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
            )}
          </div>

          {/* Forgot password link */}
          <div className="text-sm text-right">
            <a href="#" className="text-green-600 hover:underline">Forgot password?</a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          New to this website?{' '}
          <Link state={{ from }} to="/register" className="text-green-600 hover:underline">Register</Link>
        </div>

        <div className="pt-4 border-t">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Login;
