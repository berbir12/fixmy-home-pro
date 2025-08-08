import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Calendar,
  Wrench,
  FileText,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX,
  AlertCircle,
  BarChart3,
  Activity
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'technician' | 'admin';
  created_at: string;
}

interface Booking {
  id: string;
  service_name: string;
  user_name: string;
  technician_name: string;
  status: string;
  scheduled_date: string;
  price: number;
  created_at: string;
}

interface TechnicianApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  specialties: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [applications, setApplications] = useState<TechnicianApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setUsers([
        { id: '1', email: 'john@example.com', name: 'John Doe', role: 'customer', created_at: '2024-01-15' },
        { id: '2', email: 'jane@example.com', name: 'Jane Smith', role: 'technician', created_at: '2024-01-10' },
        { id: '3', email: 'bob@example.com', name: 'Bob Johnson', role: 'customer', created_at: '2024-01-20' },
      ]);
      
      setBookings([
        { id: '1', service_name: 'Plumbing Repair', user_name: 'John Doe', technician_name: 'Jane Smith', status: 'confirmed', scheduled_date: '2024-02-15', price: 150, created_at: '2024-01-25' },
        { id: '2', service_name: 'Electrical Work', user_name: 'Bob Johnson', technician_name: 'Mike Wilson', status: 'pending', scheduled_date: '2024-02-20', price: 200, created_at: '2024-01-26' },
      ]);
      
      setApplications([
        { id: '1', name: 'Alice Brown', email: 'alice@example.com', phone: '+1234567890', experience: '5 years', specialties: ['Plumbing', 'Electrical'], status: 'pending', created_at: '2024-01-28' },
        { id: '2', name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1234567891', experience: '3 years', specialties: ['HVAC'], status: 'approved', created_at: '2024-01-25' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleApplicationAction = (applicationId: string, action: 'approve' | 'reject') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' }
          : app
      )
    );
    
    toast({
      title: `Application ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The technician application has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="w-8 h-8 animate-spin mx-auto" />
          <p>Loading admin dashboard...</p>
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
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.name}
              </span>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Applications</span>
            </TabsTrigger>
            <TabsTrigger value="technicians" className="flex items-center space-x-2">
              <Wrench className="w-4 h-4" />
              <span>Technicians</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,350</div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {applications.filter(app => app.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Need review
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{booking.service_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.user_name} • {booking.scheduled_date}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customers</span>
                      <span className="text-sm font-medium">
                        {users.filter(u => u.role === 'customer').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technicians</span>
                      <span className="text-sm font-medium">
                        {users.filter(u => u.role === 'technician').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Admins</span>
                      <span className="text-sm font-medium">
                        {users.filter(u => u.role === 'admin').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">User Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Users</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Booking Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Booking
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.service_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.user_name} • {booking.technician_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.scheduled_date} • ${booking.price}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Technician Applications</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {applications.filter(app => app.status === 'pending').length} Pending
                </Badge>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Review Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{application.name}</p>
                          <p className="text-sm text-muted-foreground">{application.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {application.experience} • {application.specialties.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                        {application.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApplicationAction(application.id, 'approve')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApplicationAction(application.id, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technicians Tab */}
          <TabsContent value="technicians" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Technician Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Technician
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Technicians</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(u => u.role === 'technician').map((technician) => (
                    <div key={technician.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{technician.name}</p>
                          <p className="text-sm text-muted-foreground">{technician.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Active • 4.8★ rating
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Active</Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
