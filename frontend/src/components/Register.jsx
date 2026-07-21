import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Building2, Globe, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Communication Team',
    language: 'English',
    organization: ''
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.fullname.trim()) tempErrors.fullname = 'Full name is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.organization.trim()) {
      tempErrors.organization = 'Organization name is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Omit confirmPassword before sending to api
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      setSuccess(true);
      setLoading(false);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 px-4">
      <div className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-md border border-gray-100 dark:border-[#334155]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Set up your mass communication workspace</p>
        </div>

        {/* Global Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-2.5">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Registration Successful!</p>
              <p className="text-xs mt-0.5">Redirecting you to the Login page...</p>
            </div>
          </div>
        )}

        {/* Server-Side Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to Register</p>
              <p className="text-xs mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                className={`pl-10 w-full rounded-lg border bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white ${errors.fullname ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-[#334155] focus:ring-primary'} p-2.5 text-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.fullname && <p className="text-xs text-red-500 mt-1">{errors.fullname}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@organization.com"
                className={`pl-10 w-full rounded-lg border bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-[#334155] focus:ring-primary'} p-2.5 text-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Phone className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className={`pl-10 w-full rounded-lg border bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white ${errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-[#334155] focus:ring-primary'} p-2.5 text-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`pl-10 w-full rounded-lg border bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-[#334155] focus:ring-primary'} p-2.5 text-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`pl-10 w-full rounded-lg border bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-[#334155] focus:ring-primary'} p-2.5 text-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
            <div className="grid grid-cols-3 gap-3">
              {['Administrator', 'Campaign Manager', 'Communication Team'].map((roleOption) => (
                <button
                  key={roleOption}
                  type="button"
                  onClick={() => handleRoleChange(roleOption)}
                  className={`border rounded-lg p-2.5 text-xs font-semibold text-center transition-all cursor-pointer ${
                    formData.role === roleOption
                      ? 'border-primary bg-blue-50 dark:bg-blue-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-100 dark:ring-blue-900/30'
                      : 'border-gray-200 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 bg-white dark:bg-[#1E293B]'
                  }`}
                >
                  {roleOption}
                </button>
              ))}
            </div>
          </div>

          {/* Language Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language Preference</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Globe className="h-4 w-4" />
              </span>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border border-gray-200 dark:border-[#334155] focus:ring-primary p-2.5 text-sm focus:outline-none focus:ring-2 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Hindi">Hindi</option>
                <option value="Arabic">Arabic</option>
                <option value="Japanese">Japanese</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                ▼
              </div>
            </div>
          </div>

          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Building2 className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Enterprise Inc."
                className={`pl-10 w-full rounded-lg border bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white ${errors.organization ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-[#334155] focus:ring-primary'} p-2.5 text-sm focus:outline-none focus:ring-2`}
              />
            </div>
            {errors.organization && <p className="text-xs text-red-500 mt-1">{errors.organization}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm disabled:opacity-75 disabled:cursor-not-allowed mt-2 cursor-pointer"
          >
            {loading ? 'Registering Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
