import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserIcon, MailIcon, PhoneIcon, BuildingIcon } from 'lucide-react';

export default function LoginPage() {
  const { user, login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: 'buyer' as 'buyer' | 'seller' | 'agent' | 'fsbo',
    bio: '',
    reacNumber: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Redirect if already logged in
  if (user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(loginData.email, loginData.password);
      toast({
        title: 'Welcome back!',
        description: 'You have been logged in successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    if (registerData.password.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { confirmPassword, ...registrationData } = registerData;
      await register(registrationData);
      toast({
        title: 'Account Created!',
        description: 'Your account has been created successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to create account.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserTypeDescription = (type: string) => {
    const descriptions = {
      buyer: 'Looking to purchase property',
      seller: 'Selling property directly',
      agent: 'Licensed real estate agent',
      fsbo: 'For Sale By Owner seller'
    };
    return descriptions[type as keyof typeof descriptions] || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to BeeDab
          </CardTitle>
          <CardDescription>
            Botswana's premier real estate marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <LoadingSpinner /> : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="+267 1234 5678"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userType">Account Type</Label>
                  <Select
                    value={registerData.userType}
                    onValueChange={(value: 'buyer' | 'seller' | 'agent' | 'fsbo') => 
                      setRegisterData({ ...registerData, userType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">
                        <div className="flex flex-col text-left">
                          <span>Buyer</span>
                          <span className="text-xs text-gray-500">Looking to purchase property</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="seller">
                        <div className="flex flex-col text-left">
                          <span>Seller</span>
                          <span className="text-xs text-gray-500">Selling property directly</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="agent">
                        <div className="flex flex-col text-left">
                          <span>Agent</span>
                          <span className="text-xs text-gray-500">Licensed real estate agent</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="fsbo">
                        <div className="flex flex-col text-left">
                          <span>FSBO</span>
                          <span className="text-xs text-gray-500">For Sale By Owner seller</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {getUserTypeDescription(registerData.userType)}
                  </p>
                </div>
                
                {registerData.userType === 'agent' && (
                  <div className="space-y-2">
                    <Label htmlFor="reacNumber">REAC License Number</Label>
                    <div className="relative">
                      <BuildingIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reacNumber"
                        placeholder="REAC-12345"
                        value={registerData.reacNumber}
                        onChange={(e) => setRegisterData({ ...registerData, reacNumber: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <Input
                      id="registerPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <LoadingSpinner /> : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}