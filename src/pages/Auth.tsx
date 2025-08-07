import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";

type AuthMode = "login" | "register" | "otp";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    login,
    register,
    sendOtp,
    verifyOtp,
    loginLoading,
    registerLoading,
    sendOtpLoading,
    verifyOtpLoading,
    loginError,
    registerError,
    sendOtpError,
    verifyOtpError,
  } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    login({ email: formData.email, password: formData.password });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    console.log('Attempting registration with:', {
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
    });

    register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
    });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 4) {
      toast({
        title: "Error",
        description: "Please enter a valid 4-digit OTP",
        variant: "destructive",
      });
      return;
    }

    verifyOtp({ email: formData.email, otp: otpString });
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Coming Soon",
      description: `${provider} login will be available soon`,
    });
  };

  // Handle errors
  if (loginError) {
    toast({
      title: "Login Failed",
      description: loginError.message || "Invalid email or password",
      variant: "destructive",
    });
  }

  if (registerError) {
    toast({
      title: "Registration Failed",
      description: registerError.message || "Registration failed",
      variant: "destructive",
    });
  }

  if (sendOtpError) {
    toast({
      title: "OTP Send Failed",
      description: sendOtpError.message || "Failed to send OTP",
      variant: "destructive",
    });
  }

  if (verifyOtpError) {
    toast({
      title: "OTP Verification Failed",
      description: verifyOtpError.message || "Invalid OTP",
      variant: "destructive",
    });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to FixNow</h1>
          <p className="text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs value={mode} onValueChange={(value) => setMode(value as AuthMode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="remember" className="rounded" />
                      <Label htmlFor="remember" className="text-sm">Remember me</Label>
                    </div>
                    <Button variant="link" className="text-sm p-0">
                      Forgot password?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loginLoading}>
                    {loginLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <Separator />

                {/* Social Login */}
                <div className="space-y-3">
                  <p className="text-center text-sm text-muted-foreground">Or continue with</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleSocialLogin("google")}
                      className="w-full"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSocialLogin("apple")}
                      className="w-full"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Apple
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="rounded" />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the <Button variant="link" className="text-sm p-0">Terms of Service</Button> and{" "}
                      <Button variant="link" className="text-sm p-0">Privacy Policy</Button>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={registerLoading}>
                    {registerLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              {/* OTP Tab */}
              <TabsContent value="otp" className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">Verify Your Phone</h3>
                  <p className="text-muted-foreground">
                    We've sent a 4-digit code to {formData.phone}
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Enter Verification Code</Label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="w-12 h-12 text-center text-lg font-semibold"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?{" "}
                      <Button variant="link" className="text-sm p-0">
                        Resend
                      </Button>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Code expires in 5:00
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={verifyOtpLoading}>
                    {verifyOtpLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Security Features */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Bank-level security</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4" />
            <span>256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
