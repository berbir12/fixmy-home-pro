import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // User profile helpers
  async createUserProfile(userId: string, profileData: Inserts<'user_profiles'>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{ ...profileData, user_id: userId }])
      .select()
      .single()
    return { data, error }
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  async updateUserProfile(userId: string, updates: Updates<'user_profiles'>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Technician profile helpers
  async createTechnicianProfile(userId: string, profileData: Inserts<'technician_profiles'>) {
    const { data, error } = await supabase
      .from('technician_profiles')
      .insert([{ ...profileData, user_id: userId }])
      .select()
      .single()
    return { data, error }
  },

  async getTechnicianProfile(userId: string) {
    const { data, error } = await supabase
      .from('technician_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  async updateTechnicianProfile(userId: string, updates: Updates<'technician_profiles'>) {
    const { data, error } = await supabase
      .from('technician_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Booking helpers
  async createBooking(bookingData: Inserts<'bookings'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single()
    return { data, error }
  },

  async getBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async updateBooking(bookingId: string, updates: Updates<'bookings'>) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single()
    return { data, error }
  },

  // Payment helpers
  async createPayment(paymentData: Inserts<'payments'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single()
    return { data, error }
  },

  async getPayments(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        bookings!inner(user_id)
      `)
      .eq('bookings.user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Chat helpers
  async getChatMessages(chatId: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true })
    return { data, error }
  },

  async sendMessage(messageData: Inserts<'chat_messages'>) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([messageData])
      .select()
      .single()
    return { data, error }
  },

  async getChatContacts() {
    const { data, error } = await supabase
      .from('chat_contacts')
      .select('*')
      .order('last_message_time', { ascending: false })
    return { data, error }
  },

  // Service helpers
  async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true })
    return { data, error }
  },

  async getService(serviceId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single()
    return { data, error }
  }
}
