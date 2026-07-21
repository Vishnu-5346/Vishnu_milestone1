import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, AlertCircle, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Recovery process step: 1 = Enter Email, 2 = Enter Code & Reset Password
  const [step, setStep] = useState(1);

  // Inputs
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Simulation code helper
  const [simulatedCode, setSimulatedCode] = useState(null);

  // Validate step 1: Email field
  const validateEmailForm = () => {
    const tempErrors = {};
    if (!email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Validate step 2: Reset Form
  const validateResetForm = () => {
    const tempErrors = {};
    if (!code.trim()) {
      tempErrors.code = 'Verification code is required';
    } else if (code.trim().length !== 6) {
      tempErrors.code = 'Verification code must be 6 digits';
    }

    if (!newPassword) {
      tempErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      tempErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (newPassword !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle Step 1 Submit (Request Reset Code)
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validateEmailForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      setLoading(false);
      if (response.data.success) {
        setSimulatedCode(response.data.code);
        setStep(2);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Error checking email');
      setLoading(false);
    }
  };

  // Handle Step 2 Submit (Verify & Reset Password)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validateResetForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('/auth/reset-password', {
        email,
        code,
        newPassword
      });
      setSuccess(true);
      setLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Reset failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-md border border-gray-100 dark:border-[#334155]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {step === 1 
              ? 'Enter your email to receive a recovery verification code' 
              : 'Enter verification code and your new password'
            }
          </p>
        </div>

        {/* Global Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-2.5">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Password Reset Successful!</p>
              <p className="text-xs mt-0.5">Redirecting to login page...</p>
            </div>
          </div>
        )}

        {/* Server-Side Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to Reset</p>
              <p className="text-xs mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        {/* Simulated Code Email Card (Premium Developer Flow Utility) */}
        {!success && step === 2 && simulatedCode && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl text-blue-800 dark:text-blue-300 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1">
              <KeyRound className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Simulated Reset Code (Mock Delivery)
            </p>
            <p>We generated this security verification code for your email address:</p>
            <p className="text-base font-mono font-bold tracking-wider text-blue-900 dark:text-blue-100 bg-blue-100/60 dark:bg-blue-900/40 px-3 py-1 rounded w-fit select-all mt-1">
              {simulatedCode}
            </p>
          </div>
        )}

        {step === 1 ? (
          /* STEP 1: Enter Email form */
          <form onSubmit={handleRequestCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="example@organization.com"
                  className={`pl-10 w-full rounded-lg border bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white ${
                    errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-[#334155] focus:ring-primary'
                  } p-2.5 text-sm focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm disabled:opacity-75 cursor-pointer"
            >
              {loading ? 'Sending Code...' : 'Request Code'}
            </button>
          </form>
        ) : (
          /* STEP 2: Enter Code and Passwords */
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification Code</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ''));
                    if (errors.code) setErrors({ ...errors, code: '' });
                  }}
                  placeholder="123456"
                  className={`pl-10 w-full rounded-lg border bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white ${
                    errors.code ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-[#334155] focus:ring-primary'
                  } p-2.5 text-sm focus:outline-none focus:ring-2 tracking-widest font-mono`}
                />
              </div>
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                  }}
                  placeholder="••••••••"
                  className={`pl-10 w-full rounded-lg border bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white ${
                    errors.newPassword ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-[#334155] focus:ring-primary'
                  } p-2.5 text-sm focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  placeholder="••••••••"
                  className={`pl-10 w-full rounded-lg border bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white ${
                    errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 dark:border-[#334155] focus:ring-primary'
                  } p-2.5 text-sm focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm disabled:opacity-75 cursor-pointer"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
          <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
