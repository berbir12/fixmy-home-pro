import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'technician';
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: {
    users: { view: boolean; edit: boolean; delete: boolean };
    bookings: { view: boolean; edit: boolean; delete: boolean };
    technicians: { view: boolean; edit: boolean; delete: boolean };
    applications: { view: boolean; approve: boolean; reject: boolean };
    reports: { view: boolean; export: boolean };
    settings: { view: boolean; edit: boolean };
  };
  is_super_admin: boolean;
  last_login?: string;
}

export interface Customer extends User {
  role: 'customer';
  addresses: any[];
  preferences: {
    notifications: { email: boolean; sms: boolean; push: boolean };
    privacy: { shareLocation: boolean; shareContact: boolean };
  };
  total_spent: number;
  loyalty_points: number;
  preferred_technicians: string[];
  is_verified: boolean;
  last_login?: string;
}

export interface Technician extends User {
  role: 'technician';
  specialties: string[];
  certifications: string[];
  experience: string;
  hourly_rate: number;
  availability: any;
  rating: number;
  total_jobs: number;
  is_active: boolean;
  skills: string[];
  languages: string[];
  vehicle_info?: any;
  is_verified: boolean;
  application_status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  last_login?: string;
}

export interface Booking {
  id: string;
  service_id: string;
  service_name: string;
  technician_id: string;
  technician_name: string;
  technician_avatar?: string;
  customer_id: string;
  customer_name: string;
  status: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  description: string;
  price: number;
  rating?: number;
  review?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TechnicianApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  specialties: string[];
  certifications: string[];
  hourly_rate: number;
  resume_url?: string;
  cover_letter?: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class Api {
  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: Admin | Customer | Technician }>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        return { success: false, error: 'Login failed' };
      }

      // Check which table the user belongs to
      const user = await this.getCurrentUser();
      
      if (!user.success || !user.data) {
        return { success: false, error: 'User not found in database' };
      }

      return { success: true, data: { user: user.data } };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  }

  async register(userData: {
    email: string;
    password: string;
  name: string;
    phone?: string;
  }): Promise<ApiResponse<{ user: Customer; requiresEmailConfirmation?: boolean }>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        return { success: false, error: 'Registration failed' };
      }

      // Use a safer approach to create customer record
      try {
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            role: 'customer',
          });

        if (customerError) {
          console.warn('Customer creation error (non-critical):', customerError);
          // Don't throw here, continue with the registration
        }
      } catch (insertError) {
        console.warn('Customer insert failed (non-critical):', insertError);
        // Continue with registration even if customer record creation fails
      }

      const customer: Customer = {
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: 'customer',
        addresses: [],
        preferences: {
          notifications: { email: true, sms: true, push: true },
          privacy: { shareLocation: false, shareContact: false },
        },
        total_spent: 0,
        loyalty_points: 0,
        preferred_technicians: [],
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return {
        success: true,
        data: {
          user: customer,
          requiresEmailConfirmation: authData.user.email_confirmed_at === null,
        },
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, error: error.message || 'Logout failed' };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<Admin | Customer | Technician>> {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        return { success: false, error: 'Not authenticated' };
      }

      // Check admins table first
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (admin && !adminError) {
        return { success: true, data: admin as Admin };
      }

      // Check customers table
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (customer && !customerError) {
        return { success: true, data: customer as Customer };
      }

      // Check technicians table
      const { data: technician, error: technicianError } = await supabase
        .from('technicians')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (technician && !technicianError) {
        return { success: true, data: technician as Technician };
      }

      return { success: false, error: 'User not found in database' };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return { success: false, error: error.message || 'Failed to get user' };
    }
  }

  async updateProfile(userData: Partial<Admin | Customer | Technician>): Promise<ApiResponse<Admin | Customer | Technician>> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser.success || !currentUser.data) {
        return { success: false, error: 'User not authenticated' };
      }

      const userId = currentUser.data.id;
      const userRole = currentUser.data.role;

      let updateResult;
      let error;

      switch (userRole) {
        case 'admin':
          ({ data: updateResult, error } = await supabase
            .from('admins')
            .update(userData)
            .eq('id', userId)
            .select()
            .single());
          break;
        case 'customer':
          ({ data: updateResult, error } = await supabase
            .from('customers')
            .update(userData)
            .eq('id', userId)
            .select()
            .single());
          break;
        case 'technician':
          ({ data: updateResult, error } = await supabase
            .from('technicians')
            .update(userData)
            .eq('id', userId)
            .select()
            .single());
          break;
        default:
          return { success: false, error: 'Invalid user role' };
      }

      if (error) throw error;

      return { success: true, data: updateResult as Admin | Customer | Technician };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  }

  // Admin-specific methods
  async getAllUsers(): Promise<ApiResponse<(Admin | Customer | Technician)[]>> {
    try {
      const [adminsResult, customersResult, techniciansResult] = await Promise.all([
        supabase.from('admins').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('technicians').select('*'),
      ]);

      const users = [
        ...(adminsResult.data || []),
        ...(customersResult.data || []),
        ...(techniciansResult.data || []),
      ];

      return { success: true, data: users };
    } catch (error: any) {
      console.error('Get all users error:', error);
      return { success: false, error: error.message || 'Failed to get users' };
    }
  }

  async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Get all bookings error:', error);
      return { success: false, error: error.message || 'Failed to get bookings' };
    }
  }

  async getTechnicianApplications(): Promise<ApiResponse<TechnicianApplication[]>> {
    try {
      const { data, error } = await supabase
        .from('technician_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Get technician applications error:', error);
      return { success: false, error: error.message || 'Failed to get applications' };
    }
  }

  async updateTechnicianApplication(
    applicationId: string,
    updates: Partial<TechnicianApplication>
  ): Promise<ApiResponse<TechnicianApplication>> {
    try {
      const { data, error } = await supabase
        .from('technician_applications')
        .update(updates)
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Update technician application error:', error);
      return { success: false, error: error.message || 'Failed to update application' };
    }
  }

  // Customer-specific methods
  async getCustomerBookings(customerId: string): Promise<ApiResponse<Booking[]>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Get customer bookings error:', error);
      return { success: false, error: error.message || 'Failed to get bookings' };
    }
  }

  // Utility methods
  async sendOtp(email: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  }

  async verifyOtp(email: string, token: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message || 'Failed to verify OTP' };
    }
  }
}

export const api = new Api();
