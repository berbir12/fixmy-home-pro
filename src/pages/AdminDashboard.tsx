import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Users,
  Wrench,
  Calendar,
  DollarSign,
  MessageSquare,
  Settings,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  TrendingUp,
  AlertTriangle,
  LogOut,
  ArrowLeft,
  Filter,
  Search,
  Download,
  Edit,
  Trash2,
  Plus,
  UserPlus,
  FileText,
  BarChart3
} from "lucide-react";

interface TechnicianApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  experience: string;
  hourly_rate: number;
  specialties: string[];
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'hired';
  created_at: string;
  admin_notes?: string;
}

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingApplications: number;
  activeTechnicians: number;
  completedJobs: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState<TechnicianApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApplications: 0,
    activeTechnicians: 0,
    completedJobs: 0
  });
  const [selectedApplication, setSelectedApplication] = useState<TechnicianApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      navigate("/auth");
      return;
    }

    if (!isLoading && user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
      navigate("/dashboard");
      return;
    }
  }, [user, isAuthenticated, isLoading, navigate, toast]);

  // Load admin data
  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load technician applications
      const applicationsResponse = await api.getTechnicianApplications();
      if (applicationsResponse.success) {
        setApplications(applicationsResponse.data || []);
      }

      // Load dashboard stats (mock data for now)
      setStats({
        totalUsers: 156,
        totalBookings: 89,
        totalRevenue: 15420.50,
        pendingApplications: applicationsResponse.success ? (applicationsResponse.data || []).filter(app => app.status === 'pending').length : 0,
        activeTechnicians: 12,
        completedJobs: 67
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatusUpdate = async (applicationId: string, status: string, notes?: string) => {
    try {
      const response = await api.updateTechnicianApplication(applicationId, {
        status: status as any,
        adminNotes: notes
      });

      if (response.success) {
        toast({
          title: "Application Updated",
          description: `Application status updated to ${status}`,
        });

        // Refresh applications
        loadAdminData();
        setSelectedApplication(null);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update application",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-success text-success-foreground";
      case "hired": return "bg-primary text-primary-foreground";
      case "rejected": return "bg-destructive text-destructive-foreground";
      case "reviewing": return "bg-warning text-warning-foreground";
      case "pending": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "hired": return <UserPlus className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "reviewing": return <Eye className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch = app.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-2xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-primary">Admin Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingApplications}</div>
                  <p className="text-xs text-muted-foreground">
                    Require review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeTechnicians}</div>
                  <p className="text-xs text-muted-foreground">
                    Available for jobs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedJobs}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New technician application received</p>
                      <p className="text-xs text-muted-foreground">John Doe applied for Computer Repair position</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Booking completed</p>
                      <p className="text-xs text-muted-foreground">Computer repair job completed by Sarah Johnson</p>
                    </div>
                    <span className="text-xs text-muted-foreground">4 hours ago</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-xs text-muted-foreground">New customer account created</p>
                    </div>
                    <span className="text-xs text-muted-foreground">6 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedApplication(application)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {application.first_name} {application.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{application.email}</p>
                          <p className="text-sm text-muted-foreground">{application.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">${application.hourly_rate}/hr</p>
                          <p className="text-xs text-muted-foreground">{application.experience}</p>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {application.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredApplications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search or filter criteria."
                      : "No technician applications have been submitted yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management features coming soon. This will include:
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>• View all registered users</li>
                  <li>• Manage user roles and permissions</li>
                  <li>• User activity monitoring</li>
                  <li>• Account suspension/activation</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Booking management features coming soon. This will include:
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>• View all bookings and their status</li>
                  <li>• Assign technicians to bookings</li>
                  <li>• Monitor booking progress</li>
                  <li>• Generate booking reports</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Admin settings features coming soon. This will include:
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>• System configuration</li>
                  <li>• Email templates</li>
                  <li>• Notification settings</li>
                  <li>• Security settings</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedApplication.first_name} {selectedApplication.last_name}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedApplication.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{selectedApplication.phone}</p>
                </div>
                <div>
                  <Label>Experience</Label>
                  <p className="text-sm">{selectedApplication.experience}</p>
                </div>
                <div>
                  <Label>Hourly Rate</Label>
                  <p className="text-sm">${selectedApplication.hourly_rate}/hr</p>
                </div>
              </div>

              <div className="mb-6">
                <Label>Specialties</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedApplication.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <Label>Admin Notes</Label>
                <Textarea
                  placeholder="Add admin notes..."
                  defaultValue={selectedApplication.admin_notes || ""}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center gap-4">
                <Label>Status</Label>
                <Select
                  defaultValue={selectedApplication.status}
                  onValueChange={(value) => {
                    handleApplicationStatusUpdate(selectedApplication.id, value);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
