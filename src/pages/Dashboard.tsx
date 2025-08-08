import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  User,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Wrench,
  BookOpen,
  HelpCircle,
  Bell,
  CreditCard,
  Shield,
  Save,
  Trash2,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

interface Booking {
  id: string;
  service_name: string;
  technician_name: string;
  status: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  price: number;
  rating?: number;
  review?: string;
  created_at: string;
}

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isPrivacySettingsOpen, setIsPrivacySettingsOpen] = useState(false);
  const [isPaymentMethodsOpen, setIsPaymentMethodsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is not admin (should be redirected to admin dashboard)
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
      return;
    }
  }, [user, navigate]);

  // Load user bookings
  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.getCustomerBookings(user.id);
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        console.error('Failed to load bookings:', response.error);
        toast({
          title: "Error",
          description: "Failed to load your bookings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load your bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const response = await api.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setIsEditingProfile(false);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      // Update booking status to cancelled
      const response = await api.updateBooking(bookingId, { status: 'cancelled' });
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Booking cancelled successfully",
        });
        loadBookings(); // Reload bookings
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to cancel booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const handleRateService = async () => {
    if (!selectedBooking) return;

    try {
      const response = await api.updateBooking(selectedBooking.id, {
        rating,
        review,
        status: 'completed'
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Thank you for your review!",
        });
        setIsRatingDialogOpen(false);
        setSelectedBooking(null);
        setRating(5);
        setReview('');
        loadBookings(); // Reload bookings
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to submit review",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  const handleContactTechnician = (booking: Booking) => {
    // Open chat or contact modal
    toast({
      title: "Contact Technician",
      description: `Contacting ${booking.technician_name} for ${booking.service_name}`,
    });
    // Navigate to chat or open contact modal
    navigate('/chat');
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
    toast({
      title: "Notifications",
      description: showNotifications ? "Notifications disabled" : "Notifications enabled",
    });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      // This would typically call an API to change password
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setIsChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    }
  };

  const handlePrivacySettings = () => {
    setIsPrivacySettingsOpen(true);
    toast({
      title: "Privacy Settings",
      description: "Privacy settings opened",
    });
  };

  const handlePaymentMethods = () => {
    setIsPaymentMethodsOpen(true);
    toast({
      title: "Payment Methods",
      description: "Payment methods opened",
    });
  };

  const handleNotificationSettings = () => {
    setIsNotificationSettingsOpen(true);
    toast({
      title: "Notification Settings",
      description: "Notification settings opened",
    });
  };

  const handleSupportContact = (method: string) => {
    const contactInfo = {
      phone: "1-800-FIXNOW",
      email: "support@fixnow.com",
      chat: "Live Chat"
    };

    toast({
      title: "Contact Support",
      description: `Opening ${method}: ${contactInfo[method as keyof typeof contactInfo]}`,
    });
  };

  const handleHelpTopic = (topic: string) => {
    const helpTopics = {
      "How to Book a Service": "Navigate to Services page and select your desired service",
      "Reschedule a Booking": "Go to My Bookings and click Reschedule on any active booking",
      "Cancel a Booking": "Go to My Bookings and click Cancel on any active booking",
      "Rate a Service": "For completed services, click Rate Service to leave a review"
    };

    toast({
      title: topic,
      description: helpTopics[topic as keyof typeof helpTopics] || "Help topic information",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'in_progress': return <Wrench className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending' || b.status === 'in_progress');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Account</h1>
                <p className="text-muted-foreground">Manage your bookings and profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNotifications}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    All time bookings
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently scheduled
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalSpent}</div>
                  <p className="text-xs text-muted-foreground">
                    All time spending
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No bookings yet</p>
                      <Button onClick={() => navigate('/services')} className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Your First Service
                      </Button>
                    </div>
                  ) : (
                    bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{booking.service_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.scheduled_date} at {booking.scheduled_time}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">{booking.status}</span>
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => navigate('/services')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Book New Service
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('profile')}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('support')}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Get Help
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={handlePrivacySettings}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Bookings</h2>
              <Button onClick={() => navigate('/services')}>
                <Plus className="w-4 h-4 mr-2" />
                Book New Service
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Wrench className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by booking your first service
                    </p>
                    <Button onClick={() => navigate('/services')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Book a Service
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Wrench className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{booking.service_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Technician: {booking.technician_name}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {booking.scheduled_date} at {booking.scheduled_time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{booking.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">${booking.price}</span>
                          </div>
                          {booking.rating && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{booking.rating}/5 stars</span>
                            </div>
                          )}
                        </div>
                        
                        {booking.review && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm italic">"{booking.review}"</p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 mt-4">
                          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactTechnician(booking)}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                          {booking.status === 'completed' && !booking.rating && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsRatingDialogOpen(true);
                              }}
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Rate Service
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Profile Settings</h2>
              <Button 
                variant="outline"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{user?.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm capitalize">{user?.role}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setIsChangePasswordOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={handleNotificationSettings}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Preferences
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={handlePrivacySettings}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={handlePaymentMethods}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Methods
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Support & Help</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleSupportContact('phone')}
                  >
                    <Phone className="w-5 h-5 text-primary mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-muted-foreground">1-800-FIXNOW</p>
                    </div>
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleSupportContact('email')}
                  >
                    <Mail className="w-5 h-5 text-primary mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@fixnow.com</p>
                    </div>
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleSupportContact('chat')}
                  >
                    <HelpCircle className="w-5 h-5 text-primary mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleHelpTopic('How to Book a Service')}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    How to Book a Service
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleHelpTopic('Reschedule a Booking')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Reschedule a Booking
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleHelpTopic('Cancel a Booking')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel a Booking
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleHelpTopic('Rate a Service')}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Rate a Service
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Rating Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex items-center space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review">Review (Optional)</Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your experience..."
                className="mt-2"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleRateService} className="flex-1">
                <Star className="w-4 h-4 mr-2" />
                Submit Review
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsRatingDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleChangePassword} className="flex-1">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsChangePasswordOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Settings Dialog */}
      <Dialog open={isPrivacySettingsOpen} onOpenChange={setIsPrivacySettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Share Location</p>
                  <p className="text-sm text-muted-foreground">Allow technicians to see your location</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Share Contact Info</p>
                  <p className="text-sm text-muted-foreground">Share phone number with technicians</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-muted-foreground">Receive promotional emails</p>
                </div>
                <Button variant="outline" size="sm">Disable</Button>
              </div>
            </div>
            <Button 
              onClick={() => setIsPrivacySettingsOpen(false)}
              className="w-full"
            >
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Methods Dialog */}
      <Dialog open={isPaymentMethodsOpen} onOpenChange={setIsPaymentMethodsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Methods</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Visa ending in 1234</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
              <Button className="w-full" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
            <Button 
              onClick={() => setIsPaymentMethodsOpen(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={isNotificationSettingsOpen} onOpenChange={setIsNotificationSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive booking updates via SMS</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </div>
            <Button 
              onClick={() => setIsNotificationSettingsOpen(false)}
              className="w-full"
            >
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
