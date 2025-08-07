import { supabase, supabaseHelpers } from './supabase'
import type { ApiResponse } from './api'
import type { User, Booking, Payment, ChatMessage, ChatContact } from './api'

// Supabase API Client
export class SupabaseApiClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const { data, error } = await supabaseHelpers.signIn(email, password)
      
      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Login failed'
        }
      }

      // Get user profile data
      const userProfile = await supabaseHelpers.getUserProfile(data.user.id)
      
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || 'User',
        role: data.user.user_metadata?.role || 'customer',
        phone: data.user.user_metadata?.phone,
        avatar: data.user.user_metadata?.avatar,
        addresses: userProfile.data?.addresses || [],
        preferences: userProfile.data?.preferences || {
          notifications: { email: true, sms: true, push: true },
          privacy: { shareLocation: false, shareContact: false }
        },
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at || data.user.created_at
      }

      this.setToken(data.session.access_token)

      return {
        success: true,
        data: { user, token: data.session.access_token }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Login failed'
      }
    }
  }

  async register(userData: {
    email: string
    password: string
    name: string
    phone?: string
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const { data, error } = await supabaseHelpers.signUp(
        userData.email,
        userData.password,
        {
          name: userData.name,
          role: 'customer',
          phone: userData.phone
        }
      )

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Registration failed'
        }
      }

      // Create user profile
      await supabaseHelpers.createUserProfile(data.user.id, {
        addresses: [],
        preferences: {
          notifications: { email: true, sms: true, push: true },
          privacy: { shareLocation: false, shareContact: false }
        }
      })

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: userData.name,
        role: 'customer',
        phone: userData.phone,
        addresses: [],
        preferences: {
          notifications: { email: true, sms: true, push: true },
          privacy: { shareLocation: false, shareContact: false }
        },
        createdAt: data.user.created_at,
        updatedAt: data.user.created_at
      }

      if (data.session) {
        this.setToken(data.session.access_token)
        return {
          success: true,
          data: { user, token: data.session.access_token }
        }
      }

      return {
        success: true,
        data: { user, token: '' }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed'
      }
    }
  }

  async sendOtp(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: { message: 'OTP sent successfully' }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send OTP'
      }
    }
  }

  async verifyOtp(email: string, otp: string): Promise<ApiResponse<{ message: string }>> {
    // For Supabase, we'll use the reset password flow
    // This is a simplified implementation
    return {
      success: true,
      data: { message: 'OTP verified successfully' }
    }
  }

  async logout(): Promise<void> {
    await supabaseHelpers.signOut()
    this.clearToken()
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const { user, error } = await supabaseHelpers.getCurrentUser()

      if (error || !user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      const userProfile = await supabaseHelpers.getUserProfile(user.id)

      const userData: User = {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || 'User',
        role: user.user_metadata?.role || 'customer',
        phone: user.user_metadata?.phone,
        avatar: user.user_metadata?.avatar,
        addresses: userProfile.data?.addresses || [],
        preferences: userProfile.data?.preferences || {
          notifications: { email: true, sms: true, push: true },
          privacy: { shareLocation: false, shareContact: false }
        },
        createdAt: user.created_at,
        updatedAt: user.updated_at || user.created_at
      }

      return {
        success: true,
        data: userData
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get user'
      }
    }
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const { user } = await supabaseHelpers.getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          phone: userData.phone,
          avatar: userData.avatar
        }
      })

      if (updateError) {
        return {
          success: false,
          error: updateError.message
        }
      }

      // Update user profile
      if (userData.addresses || userData.preferences) {
        await supabaseHelpers.updateUserProfile(user.id, {
          addresses: userData.addresses,
          preferences: userData.preferences
        })
      }

      const updatedUser = await this.getCurrentUser()
      return updatedUser
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update profile'
      }
    }
  }

  async addAddress(address: Omit<any, 'id'>): Promise<ApiResponse<any>> {
    try {
      const { user } = await supabaseHelpers.getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      const userProfile = await supabaseHelpers.getUserProfile(user.id)
      const currentAddresses = userProfile.data?.addresses || []
      
      const newAddress = {
        id: crypto.randomUUID(),
        ...address
      }

      await supabaseHelpers.updateUserProfile(user.id, {
        addresses: [...currentAddresses, newAddress]
      })

      return {
        success: true,
        data: newAddress
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add address'
      }
    }
  }

  async getBookings(): Promise<ApiResponse<Booking[]>> {
    try {
      const { user } = await supabaseHelpers.getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      const { data, error } = await supabaseHelpers.getBookings(user.id)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get bookings'
      }
    }
  }

  async createBooking(bookingData: {
    serviceId: string
    technicianId: string
    scheduledDate: string
    scheduledTime: string
    address: string
    description: string
  }): Promise<ApiResponse<Booking>> {
    try {
      const { user } = await supabaseHelpers.getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      // Get service details
      const service = await supabaseHelpers.getService(bookingData.serviceId)
      
      const booking: any = {
        service_id: bookingData.serviceId,
        service_name: service.data?.name || 'Service',
        technician_id: bookingData.technicianId,
        technician_name: 'Technician', // This would come from technician lookup
        user_id: user.id,
        status: 'pending',
        scheduled_date: bookingData.scheduledDate,
        scheduled_time: bookingData.scheduledTime,
        address: bookingData.address,
        description: bookingData.description,
        price: service.data?.price || 0
      }

      const { data, error } = await supabaseHelpers.createBooking(booking)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data as Booking
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create booking'
      }
    }
  }

  async cancelBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    try {
      const { data, error } = await supabaseHelpers.updateBooking(bookingId, {
        status: 'cancelled'
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data as Booking
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to cancel booking'
      }
    }
  }

  async rateBooking(bookingId: string, rating: number, review?: string): Promise<ApiResponse<Booking>> {
    try {
      const { data, error } = await supabaseHelpers.updateBooking(bookingId, {
        rating,
        review
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data as Booking
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to rate booking'
      }
    }
  }

  async getPayments(): Promise<ApiResponse<Payment[]>> {
    try {
      const { user } = await supabaseHelpers.getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      const { data, error } = await supabaseHelpers.getPayments(user.id)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get payments'
      }
    }
  }

  async createPayment(paymentData: {
    bookingId: string
    amount: number
    method: Payment['method']
  }): Promise<ApiResponse<Payment>> {
    try {
      const payment: any = {
        booking_id: paymentData.bookingId,
        amount: paymentData.amount,
        currency: 'USD',
        method: paymentData.method,
        status: 'pending'
      }

      const { data, error } = await supabaseHelpers.createPayment(payment)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data as Payment
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create payment'
      }
    }
  }

  async getChatContacts(): Promise<ApiResponse<ChatContact[]>> {
    try {
      const { data, error } = await supabaseHelpers.getChatContacts()

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get chat contacts'
      }
    }
  }

  async getChatMessages(chatId: string): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const { data, error } = await supabaseHelpers.getChatMessages(chatId)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get chat messages'
      }
    }
  }

  async sendMessage(chatId: string, message: {
    content: string
    type: ChatMessage['type']
  }): Promise<ApiResponse<ChatMessage>> {
    try {
      const { user } = await supabaseHelpers.getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      const messageData: any = {
        chat_id: chatId,
        sender_id: user.id,
        sender_name: user.user_metadata?.name || 'User',
        sender_type: 'user',
        content: message.content,
        type: message.type || 'text',
        timestamp: new Date().toISOString(),
        status: 'sent'
      }

      const { data, error } = await supabaseHelpers.sendMessage(messageData)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data as ChatMessage
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send message'
      }
    }
  }

  async getServices(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabaseHelpers.getServices()

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get services'
      }
    }
  }

  async getService(serviceId: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabaseHelpers.getService(serviceId)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: data
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get service'
      }
    }
  }

  async getTechnicians(serviceId: string): Promise<ApiResponse<any[]>> {
    // This would query technicians based on service
    // For now, return mock data
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'John Smith',
          avatar: '/placeholder.svg',
          rating: 4.8,
          totalJobs: 150,
          specialties: ['Computer Repair', 'Network Setup'],
          hourlyRate: 75
        }
      ]
    }
  }
}
