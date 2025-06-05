import React, { useState } from 'react';
import axiosInstance from '../util/axiosInstance';

const Signin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      const { token } = response.data;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = (payload.role || 'USER').replace('ROLE_', '');
      const username = payload.sub;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', username);
      sessionStorage.setItem('role', role);

      alert('✅ Login successful!');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Invalid username or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Sign In</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.username ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-3 text-sm text-gray-600 dark:text-gray-300 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* General Error */}
      {errors.general && (
        <div className="mt-4 text-sm text-center text-red-600">
          {errors.general}
        </div>
      )}
    </div>
  );
};

export default Signin;
