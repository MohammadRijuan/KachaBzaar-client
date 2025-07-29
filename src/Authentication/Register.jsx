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

  const onSubmit = data => {
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);
        // Store in MongoDB
        const userInfo = {
          email: data.email,
          role: 'user',
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString()
        };
        await axiosInstance.post('/users', userInfo);

        // Firebase user profile update
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic
        };
        await updateUser(userProfile);
        navigate(from);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
    try {
      const res = await axios.post(uploadUrl, formData);
      console.log(res.data)
      setProfilePic(res.data.data.url);
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-700">Create Your Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <img src={profilePic} alt="Preview" className="w-20 h-20 mt-2 rounded-full border object-cover" />
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

          {/* Submit */}
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition">
            Register
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline">Login</Link>
        </div>

        <div className="pt-4 border-t">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Register;
