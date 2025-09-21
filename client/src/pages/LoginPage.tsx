import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  CheckCircle,
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

            {/* Google Authentication */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">Or continue with</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  // TODO: Implement Google OAuth
                  alert('Google authentication will be implemented soon');
                }}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

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