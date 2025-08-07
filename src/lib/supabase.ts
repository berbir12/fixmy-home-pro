import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'customer' | 'technician' | 'admin'
          phone?: string
          avatar?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'customer' | 'technician' | 'admin'
          phone?: string
          avatar?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'customer' | 'technician' | 'admin'
          phone?: string
          avatar?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          addresses: any[]
          preferences: any
          total_spent?: number
          loyalty_points?: number
          preferred_technicians?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          addresses?: any[]
          preferences?: any
          total_spent?: number
          loyalty_points?: number
          preferred_technicians?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          addresses?: any[]
          preferences?: any
          total_spent?: number
          loyalty_points?: number
          preferred_technicians?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      technician_profiles: {
        Row: {
          id: string
          user_id: string
          specialties: string[]
          certifications: string[]
          experience: string
          hourly_rate: number
          availability: any
          rating: number
          total_jobs: number
          is_active: boolean
          skills: string[]
          languages: string[]
          vehicle_info?: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          specialties?: string[]
          certifications?: string[]
          experience: string
          hourly_rate: number
          availability?: any
          rating?: number
          total_jobs?: number
          is_active?: boolean
          skills?: string[]
          languages?: string[]
          vehicle_info?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          specialties?: string[]
          certifications?: string[]
          experience?: string
          hourly_rate?: number
          availability?: any
          rating?: number
          total_jobs?: number
          is_active?: boolean
          skills?: string[]
          languages?: string[]
          vehicle_info?: any
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          price: number
          duration: number
          features: string[]
          requirements?: string[]
          warranty?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          price: number
          duration: number
          features?: string[]
          requirements?: string[]
          warranty?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          price?: number
          duration?: number
          features?: string[]
          requirements?: string[]
          warranty?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          service_id: string
          service_name: string
          technician_id: string
          technician_name: string
          technician_avatar?: string
          user_id: string
          status: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_date: string
          scheduled_time: string
          address: string
          description: string
          price: number
          rating?: number
          review?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_id: string
          service_name: string
          technician_id: string
          technician_name: string
          technician_avatar?: string
          user_id: string
          status?: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_date: string
          scheduled_time: string
          address: string
          description: string
          price: number
          rating?: number
          review?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          service_name?: string
          technician_id?: string
          technician_name?: string
          technician_avatar?: string
          user_id?: string
          status?: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_date?: string
          scheduled_time?: string
          address?: string
          description?: string
          price?: number
          rating?: number
          review?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          amount: number
          currency: string
          method: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount: number
          currency?: string
          method: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number
          currency?: string
          method?: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          sender_name: string
          sender_type: 'user' | 'technician' | 'support' | 'ai'
          content: string
          type: 'text' | 'image' | 'file' | 'location'
          timestamp: string
          status: 'sent' | 'delivered' | 'read'
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          sender_name: string
          sender_type: 'user' | 'technician' | 'support' | 'ai'
          content: string
          type?: 'text' | 'image' | 'file' | 'location'
          timestamp?: string
          status?: 'sent' | 'delivered' | 'read'
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          sender_name?: string
          sender_type?: 'user' | 'technician' | 'support' | 'ai'
          content?: string
          type?: 'text' | 'image' | 'file' | 'location'
          timestamp?: string
          status?: 'sent' | 'delivered' | 'read'
        }
      }
      chat_contacts: {
        Row: {
          id: string
          name: string
          avatar?: string
          type: 'technician' | 'support' | 'ai'
          last_message?: string
          last_message_time?: string
          unread_count: number
          is_online: boolean
        }
        Insert: {
          id?: string
          name: string
          avatar?: string
          type: 'technician' | 'support' | 'ai'
          last_message?: string
          last_message_time?: string
          unread_count?: number
          is_online?: boolean
        }
        Update: {
          id?: string
          name?: string
          avatar?: string
          type?: 'technician' | 'support' | 'ai'
          last_message?: string
          last_message_time?: string
          unread_count?: number
          is_online?: boolean
        }
      }
      technician_applications: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip_code: string
          experience: string
          hourly_rate: number
          specialties: string[]
          certifications: string[]
          skills: string[]
          languages: string[]
          has_vehicle: boolean
          vehicle_type?: string
          vehicle_info?: string
          availability: any
          resume_url?: string
          certification_files: any[]
          references_text?: string
          agree_to_terms: boolean
          agree_to_background_check: boolean
          status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'hired'
          admin_notes?: string
          reviewed_by?: string
          reviewed_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip_code: string
          experience: string
          hourly_rate: number
          specialties?: string[]
          certifications?: string[]
          skills?: string[]
          languages?: string[]
          has_vehicle?: boolean
          vehicle_type?: string
          vehicle_info?: string
          availability?: any
          resume_url?: string
          certification_files?: any[]
          references_text?: string
          agree_to_terms: boolean
          agree_to_background_check: boolean
          status?: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'hired'
          admin_notes?: string
          reviewed_by?: string
          reviewed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          experience?: string
          hourly_rate?: number
          specialties?: string[]
          certifications?: string[]
          skills?: string[]
          languages?: string[]
          has_vehicle?: boolean
          vehicle_type?: string
          vehicle_info?: string
          availability?: any
          resume_url?: string
          certification_files?: any[]
          references_text?: string
          agree_to_terms?: boolean
          agree_to_background_check?: boolean
          status?: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'hired'
          admin_notes?: string
          reviewed_by?: string
          reviewed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Helper functions for common operations
export const supabaseHelpers = {
  // Auth helpers
  async signUp(email: string, password: string, userData: { name: string; role: 'customer' | 'technician' | 'admin'; phone?: string }) {
    console.log('🔗 SupabaseHelpers: signUp called with:', { email, name: userData.name, role: userData.role });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          phone: userData.phone
        },
        emailRedirectTo: `${window.location.origin}/auth?confirmed=true`
      }
    })
    
    console.log('🔗 SupabaseHelpers: signUp response:', { data, error });
    return { data, error }
  },

  async signIn(email: string, password: string) {
    console.log('🔗 SupabaseHelpers: signIn called with:', { email });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    console.log('🔗 SupabaseHelpers: signIn response:', { data, error });
    return { data, error }
  },

  async signOut() {
    console.log('🔗 SupabaseHelpers: signOut called');
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    console.log('🔗 SupabaseHelpers: getCurrentUser called');
    const { data: { user }, error } = await supabase.auth.getUser()
    console.log('🔗 SupabaseHelpers: getCurrentUser response:', { user: user?.id, error });
    return { user, error }
  },

  async getSession() {
    console.log('🔗 SupabaseHelpers: getSession called');
    const { data: { session }, error } = await supabase.auth.getSession()
    console.log('🔗 SupabaseHelpers: getSession response:', { session: session?.user?.id, error });
    return { session, error }
  },

  // User profile helpers
  async createUserProfile(userId: string, profileData: Inserts<'user_profiles'>) {
    console.log('🔗 SupabaseHelpers: createUserProfile called with:', { userId });
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{ ...profileData, user_id: userId }])
      .select()
      .single()
    
    console.log('🔗 SupabaseHelpers: createUserProfile response:', { data, error });
    return { data, error }
  },

  async getUserProfile(userId: string) {
    console.log('🔗 SupabaseHelpers: getUserProfile called with:', { userId });
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    console.log('🔗 SupabaseHelpers: getUserProfile response:', { data, error });
    return { data, error }
  },

  async updateUserProfile(userId: string, updates: Updates<'user_profiles'>) {
    console.log('🔗 SupabaseHelpers: updateUserProfile called with:', { userId, updates });
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    
    console.log('🔗 SupabaseHelpers: updateUserProfile response:', { data, error });
    return { data, error }
  },

  // Technician profile helpers
  async createTechnicianProfile(userId: string, profileData: Inserts<'technician_profiles'>) {
    console.log('🔗 SupabaseHelpers: createTechnicianProfile called with:', { userId });
    
    const { data, error } = await supabase
      .from('technician_profiles')
      .insert([{ ...profileData, user_id: userId }])
      .select()
      .single()
    
    console.log('🔗 SupabaseHelpers: createTechnicianProfile response:', { data, error });
    return { data, error }
  },

  async getTechnicianProfile(userId: string) {
    console.log('🔗 SupabaseHelpers: getTechnicianProfile called with:', { userId });
    
    const { data, error } = await supabase
      .from('technician_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    console.log('🔗 SupabaseHelpers: getTechnicianProfile response:', { data, error });
    return { data, error }
  },

  async updateTechnicianProfile(userId: string, updates: Updates<'technician_profiles'>) {
    console.log('🔗 SupabaseHelpers: updateTechnicianProfile called with:', { userId, updates });
    
    const { data, error } = await supabase
      .from('technician_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    
    console.log('🔗 SupabaseHelpers: updateTechnicianProfile response:', { data, error });
    return { data, error }
  },

  // Booking helpers
  async createBooking(bookingData: Inserts<'bookings'>) {
    console.log('🔗 SupabaseHelpers: createBooking called with:', { bookingData });
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single()
    
    console.log('🔗 SupabaseHelpers: createBooking response:', { data, error });
    return { data, error }
  },

  async getBookings(userId: string) {
    console.log('🔗 SupabaseHelpers: getBookings called with:', { userId });
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    console.log('🔗 SupabaseHelpers: getBookings response:', { data, error });
    return { data, error }
  },

  async updateBooking(bookingId: string, updates: Updates<'bookings'>) {
    console.log('🔗 SupabaseHelpers: updateBooking called with:', { bookingId, updates });
    
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single()
    
    console.log('🔗 SupabaseHelpers: updateBooking response:', { data, error });
    return { data, error }
  },

  // Payment helpers
  async createPayment(paymentData: Inserts<'payments'>) {
    console.log('🔗 SupabaseHelpers: createPayment called with:', { paymentData });
    
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single()
    
    console.log('🔗 SupabaseHelpers: createPayment response:', { data, error });
    return { data, error }
  },

  async getPayments(userId: string) {
    console.log('🔗 SupabaseHelpers: getPayments called with:', { userId });
    
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        bookings!inner(user_id)
      `)
      .eq('bookings.user_id', userId)
      .order('created_at', { ascending: false })
    
    console.log('🔗 SupabaseHelpers: getPayments response:', { data, error });
    return { data, error }
  },

  // Chat helpers
  async getChatMessages(chatId: string) {
    console.log('🔗 SupabaseHelpers: getChatMessages called with:', { chatId });
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true })
    
    console.log('🔗 SupabaseHelpers: getChatMessages response:', { data, error });
    return { data, error }
  },

  async sendMessage(messageData: Inserts<'chat_messages'>) {
    console.log('🔗 SupabaseHelpers: sendMessage called with:', { messageData });
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([messageData])
      .select()
      .single()
    
    console.log('🔗 SupabaseHelpers: sendMessage response:', { data, error });
    return { data, error }
  },

  async getChatContacts() {
    console.log('🔗 SupabaseHelpers: getChatContacts called');
    
    const { data, error } = await supabase
      .from('chat_contacts')
      .select('*')
      .order('last_message_time', { ascending: false })
    
    console.log('🔗 SupabaseHelpers: getChatContacts response:', { data, error });
    return { data, error }
  },

  // Service helpers
  async getServices() {
    console.log('🔗 SupabaseHelpers: getServices called');
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true })
    
    console.log('🔗 SupabaseHelpers: getServices response:', { data, error });
    return { data, error }
  },

  async getService(serviceId: string) {
    console.log('🔗 SupabaseHelpers: getService called with:', { serviceId });
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single()
    
    console.log('🔗 SupabaseHelpers: getService response:', { data, error });
    return { data, error }
  },

  // Technician application helpers
  async submitTechnicianApplication(applicationData: Inserts<'technician_applications'>) {
    console.log('🔗 SupabaseHelpers: submitTechnicianApplication called with:', { applicationData });
    
    const { data, error } = await supabase
      .from('technician_applications')
      .insert([applicationData])
      .select()
      .single()
    
    console.log('🔗 SupabaseHelpers: submitTechnicianApplication response:', { data, error });
    return { data, error }
  },

  async getTechnicianApplications() {
    console.log('🔗 SupabaseHelpers: getTechnicianApplications called');
    
    const { data, error } = await supabase
      .from('technician_applications')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('🔗 SupabaseHelpers: getTechnicianApplications response:', { data, error });
    return { data, error }
  },

  async updateTechnicianApplication(applicationId: string, updates: Updates<'technician_applications'>) {
    console.log('🔗 SupabaseHelpers: updateTechnicianApplication called with:', { applicationId, updates });
    
    const { data, error } = await supabase
      .from('technician_applications')
      .update(updates)
      .eq('id', applicationId)
      .select()
      .single()
    
    console.log('🔗 SupabaseHelpers: updateTechnicianApplication response:', { data, error });
    return { data, error }
  }
}
