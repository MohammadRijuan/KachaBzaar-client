import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import useAxios from '../hooks/useAxios';
import SocialLogin from './SocialLogin';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, updateUser } = useAuth();
  const [profilePic, setProfilePic] = useState('');
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';

  const onSubmit = async (data) => {
    try {
      const result = await createUser(data.email, data.password);
      console.log(result.user);

      const userInfo = {
        email: data.email,
        role: 'user',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString()
      };
      await axiosInstance.post('/users', userInfo);

      const userProfile = {
        displayName: data.name,
        photoURL: profilePic
      };
      await updateUser(userProfile);
      navigate(from);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
    try {
      const res = await axios.post(uploadUrl, formData);
      setProfilePic(res.data.data.url);
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 bg-gradient-to-br from-green-100 to-lime-200 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700">
          Create Your Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter Your Name"
            />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full mt-1 file-input file-input-bordered file-input-sm"
            />
            {profilePic && (
              <img
                src={profilePic}
                alt="Preview"
                className="w-16 h-16 sm:w-20 sm:h-20 mt-3 rounded-full border object-cover"
              />
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="example@email.com"
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
            {errors.password?.type === 'required' && <p className="text-red-500 text-sm">Password is required</p>}
            {errors.password?.type === 'minLength' && (
              <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline">Login</Link>
        </div>

        {/* Social Login */}
        <div className="pt-4 border-t">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Register;
