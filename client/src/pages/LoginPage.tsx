
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: ''
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          login(data.user, data.token);
          navigate(redirectTo);
        } else {
          alert('Invalid credentials');
        }
      } else {
        // Registration logic
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            location: formData.location,
          }),
        });

        if (response.ok) {
          setEmailSent(true);
        } else {
          const error = await response.json();
          alert(error.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-beedab-lightblue via-white to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Check Your Email</h2>
          <p className="text-neutral-600 mb-6">
            We've sent a confirmation link to <strong>{formData.email}</strong>. 
            Please click the link to activate your account.
          </p>
          <button
            onClick={() => setIsLogin(true)}
            className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beedab-lightblue via-white to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Form */}
          <div className="flex-1 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-neutral-600">
                {isLogin 
                  ? 'Sign in to access your BeeDaB account' 
                  : 'Join thousands of Batswana finding their dream properties'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                        placeholder="+267 1234 5678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <select
                        required
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      >
                        <option value="">Select your location</option>
                        <option value="gaborone">Gaborone</option>
                        <option value="francistown">Francistown</option>
                        <option value="molepolole">Molepolole</option>
                        <option value="kanye">Kanye</option>
                        <option value="serowe">Serowe</option>
                        <option value="mahalapye">Mahalapye</option>
                        <option value="mogoditshane">Mogoditshane</option>
                        <option value="mochudi">Mochudi</option>
                        <option value="maun">Maun</option>
                        <option value="lobatse">Lobatse</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-beedab-blue hover:text-beedab-darkblue transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>
          </div>

          {/* Right side - Image/Info */}
          <div className="flex-1 bg-gradient-to-br from-beedab-blue to-beedab-darkblue p-8 text-white flex items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                {isLogin ? 'Your Property Journey Awaits' : 'Join BeeDaB Today'}
              </h3>
              <p className="text-blue-100 mb-6">
                {isLogin 
                  ? 'Access exclusive property listings, connect with verified agents, and find your dream home in Botswana.'
                  : 'Get verified access to seller contacts, exclusive listings, and personalized property recommendations.'
                }
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-3" />
                  <span>Verified property listings</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-3" />
                  <span>Direct agent/seller communication</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-3" />
                  <span>Secure transaction platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
