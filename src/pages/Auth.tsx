import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    login, 
    register, 
    isLoading,
    loginLoading,
    registerLoading,
    loginError,
    registerError
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'customer-login' | 'customer-register' | 'admin-login' | 'admin-register'>('customer-login');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Form states
  const [customerLoginData, setCustomerLoginData] = useState({ email: '', password: '' });
  const [customerRegisterData, setCustomerRegisterData] = useState({ email: '', password: '', name: '', phone: '' });
  const [adminLoginData, setAdminLoginData] = useState({ email: '', password: '' });
  const [adminRegisterData, setAdminRegisterData] = useState({ email: '', password: '', name: '', phone: '' });

  useEffect(() => {
    if (user) {
      const intendedPath = location.state?.from?.pathname || '/dashboard';
      navigate(intendedPath);
    }
  }, [user, navigate, location]);

  // Handle errors
  useEffect(() => {
    if (loginError) {
      setError(loginError.message || 'Login failed');
    }
  }, [loginError]);

  useEffect(() => {
    if (registerError) {
      setError(registerError.message || 'Registration failed');
    }
  }, [registerError]);

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    login(customerLoginData);
  };

  const handleCustomerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    register(customerRegisterData);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    login(adminLoginData);
  };

  const handleAdminRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    register(adminRegisterData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">FixMy Home Pro</h1>
          <p className="text-gray-600">Professional Home Services Platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Section */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-600">Customer Portal</CardTitle>
              <CardDescription>Book services and manage your home maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="customer-login">Login</TabsTrigger>
                  <TabsTrigger value="customer-register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="customer-login" className="space-y-4">
                  <form onSubmit={handleCustomerLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="customer-email">Email</Label>
                      <Input
                        id="customer-email"
                        type="email"
                        value={customerLoginData.email}
                        onChange={(e) => setCustomerLoginData({ ...customerLoginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-password">Password</Label>
                      <Input
                        id="customer-password"
                        type="password"
                        value={customerLoginData.password}
                        onChange={(e) => setCustomerLoginData({ ...customerLoginData, password: e.target.value })}
                        required
                      />
                    </div>
                                         <Button type="submit" className="w-full" disabled={loginLoading}>
                       {loginLoading ? 'Signing In...' : 'Sign In as Customer'}
                     </Button>
                  </form>
                </TabsContent>

                <TabsContent value="customer-register" className="space-y-4">
                  <form onSubmit={handleCustomerRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="customer-register-name">Full Name</Label>
                      <Input
                        id="customer-register-name"
                        type="text"
                        value={customerRegisterData.name}
                        onChange={(e) => setCustomerRegisterData({ ...customerRegisterData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-register-email">Email</Label>
                      <Input
                        id="customer-register-email"
                        type="email"
                        value={customerRegisterData.email}
                        onChange={(e) => setCustomerRegisterData({ ...customerRegisterData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-register-phone">Phone (Optional)</Label>
                      <Input
                        id="customer-register-phone"
                        type="tel"
                        value={customerRegisterData.phone}
                        onChange={(e) => setCustomerRegisterData({ ...customerRegisterData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer-register-password">Password</Label>
                      <Input
                        id="customer-register-password"
                        type="password"
                        value={customerRegisterData.password}
                        onChange={(e) => setCustomerRegisterData({ ...customerRegisterData, password: e.target.value })}
                        required
                      />
                    </div>
                                         <Button type="submit" className="w-full" disabled={registerLoading}>
                       {registerLoading ? 'Creating Account...' : 'Create Customer Account'}
                     </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Admin Section */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-600">Admin Portal</CardTitle>
              <CardDescription>Manage users, bookings, and technician applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="admin-login">Login</TabsTrigger>
                  <TabsTrigger value="admin-register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="admin-login" className="space-y-4">
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={adminLoginData.email}
                        onChange={(e) => setAdminLoginData({ ...adminLoginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-password">Admin Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminLoginData.password}
                        onChange={(e) => setAdminLoginData({ ...adminLoginData, password: e.target.value })}
                        required
                      />
                    </div>
                                         <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loginLoading}>
                       {loginLoading ? 'Signing In...' : 'Sign In as Admin'}
                     </Button>
                  </form>
                </TabsContent>

                <TabsContent value="admin-register" className="space-y-4">
                  <form onSubmit={handleAdminRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="admin-register-name">Admin Name</Label>
                      <Input
                        id="admin-register-name"
                        type="text"
                        value={adminRegisterData.name}
                        onChange={(e) => setAdminRegisterData({ ...adminRegisterData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-register-email">Admin Email</Label>
                      <Input
                        id="admin-register-email"
                        type="email"
                        value={adminRegisterData.email}
                        onChange={(e) => setAdminRegisterData({ ...adminRegisterData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-register-phone">Admin Phone (Optional)</Label>
                      <Input
                        id="admin-register-phone"
                        type="tel"
                        value={adminRegisterData.phone}
                        onChange={(e) => setAdminRegisterData({ ...adminRegisterData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-register-password">Admin Password</Label>
                      <Input
                        id="admin-register-password"
                        type="password"
                        value={adminRegisterData.password}
                        onChange={(e) => setAdminRegisterData({ ...adminRegisterData, password: e.target.value })}
                        required
                      />
                    </div>
                                         <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={registerLoading}>
                       {registerLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
                     </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Quick Navigation */}
        <div className="mt-8 text-center">
          <Separator className="my-4" />
          <p className="text-sm text-gray-600">
            Need help? Contact support at support@fixmyhomepro.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
