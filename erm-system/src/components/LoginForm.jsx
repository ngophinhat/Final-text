import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [buttonPos, setButtonPos] = useState('');

  const shiftButton = () => {
    // Ví dụ đơn giản, có thể cải tiến sau
    setButtonPos('shift');
  };

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validateOnMount: true,
    validationSchema: Yup.object({
      username: Yup.string().required('Enter Username'),
      password: Yup.string().required('Enter Password'),
    }),
    onSubmit: (values) => {
      // Thay vì gọi API backend, ta kiểm tra thông tin đăng nhập trong localStorage
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const userFound = users.find(
        (user) =>
          user.username === values.username && user.password === values.password
      );
      if (userFound) {
        // Đăng nhập thành công: lưu token dummy, dispatch login và chuyển hướng
        localStorage.setItem('token', 'dummy-token');
        dispatch(login('dummy-token'));
        navigate('/patients');
      } else {
        alert('Thông tin đăng nhập không hợp lệ');
        shiftButton();
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {/* Form Container */}
      <div className="bg-gray-800 p-8 rounded shadow-md w-80 sm:w-96">
        {/* Icon User */}
        <div className="flex justify-center mb-4">
          <svg
            className="h-16 w-16 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.667 0 4-2 4-6s-1.333-6-4-6-4 2-4 6 1.333 6 4 6zm0 2c-2.666 0-8 1.333-8 4v2h16v-2c0-2.667-5.334-4-8-4z" />
          </svg>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl text-white text-center mb-2">LOGIN</h2>
        <p className="text-red-500 text-center mb-4">
          Please fill the input fields before proceeding
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-gray-200 mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
                className="w-full rounded py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
              <span className="absolute right-3 top-2 text-gray-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7c0-2.239-1.791-4-4-4s-4 1.761-4 4 1.791 4 4 4 4-1.761 4-4zM4 20c0-3 4-5 8-5s8 2 8 5v1H4v-1z" />
                </svg>
              </span>
            </div>
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 mt-1">{formik.errors.username}</div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-200 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full rounded py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <span className="absolute right-3 top-2 text-gray-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.654 0-3 1.346-3 3v7c0 1.654 1.346 3 3 3h12c1.653 0 3-1.346 3-3v-7c0-1.654-1.347-3-3-3h-1V7c0-2.757-2.243-5-5-5z" />
                </svg>
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 mt-1">{formik.errors.password}</div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-gray-300">
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" />
              <span className="text-sm">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`bg-blue-500 text-white py-1 px-3 text-sm rounded hover:bg-blue-600 transition ${buttonPos}`}
              onMouseEnter={() => {
                if (!formik.isValid) {
                  shiftButton();
                }
              }}
            >
              Đăng nhập
            </button>
          </div>
        </form>

        {/* Footer - Đăng ký */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
