import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Building,
  UserCheck,
  Users,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    // Trim whitespace from inputs
    const trimmedEmail = data.email?.trim();
    const trimmedPassword = data.password?.trim();

    // Validate required fields
    if (!trimmedEmail || !trimmedPassword) {
      toast.error('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      console.log('LoginPage: Attempting login...');
      // Use AuthContext login function
      await login(trimmedEmail, trimmedPassword);
      console.log('LoginPage: Login successful!');
      toast.success('Login successful!');
      navigate(redirectPath);
    } catch (error) {
      console.error('Auth error:', error);

      // Show specific error messages
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beedab-lightblue via-white to-beedab-blue/10">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center text-beedab-blue hover:text-beedab-darkblue transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <h1 className="text-2xl font-bold text-neutral-900">Welcome Back</h1>
              </div>
              <p className="text-neutral-600">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email'
                      }
                    })}
                    className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message as string}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message as string}</p>
                )}
              </div>

              {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-beedab-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </button>
            </form>

            {/* Browse Plans Button */}
            <div className="mt-4">
              <Link
                to="/pricing"
                className="w-full bg-gray-100 text-beedab-blue py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Browse Plans First
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link
                to="/pricing"
                className="text-beedab-blue hover:text-beedab-darkblue font-medium"
              >
                Choose a plan to register
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;