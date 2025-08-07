// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true' || false;

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    shareLocation: boolean;
    shareContact: boolean;
  };
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  technicianId: string;
  technicianName: string;
  technicianAvatar?: string;
  userId: string;
  status: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  description: string;
  price: number;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'technician' | 'support' | 'ai';
  content: string;
  type: 'text' | 'image' | 'file' | 'location';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  type: 'technician' | 'support' | 'ai';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline: boolean;
}

// API Client with authentication
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication Methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  async sendOtp(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOtp(email: string, otp: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // User Management
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async addAddress(address: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    return this.request<Address>('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }

  async updateAddress(addressId: string, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return this.request<Address>(`/user/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  }

  async deleteAddress(addressId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/user/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }

  // Bookings
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request<Booking[]>('/bookings');
  }

  async getBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${bookingId}`);
  }

  async createBooking(bookingData: {
    serviceId: string;
    technicianId: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    description: string;
  }): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async cancelBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  }

  async rateBooking(bookingId: string, rating: number, review?: string): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${bookingId}/rate`, {
      method: 'PUT',
      body: JSON.stringify({ rating, review }),
    });
  }

  // Payments
  async getPayments(): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>('/payments');
  }

  async createPayment(paymentData: {
    bookingId: string;
    amount: number;
    method: Payment['method'];
  }): Promise<ApiResponse<Payment>> {
    return this.request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Chat
  async getChatContacts(): Promise<ApiResponse<ChatContact[]>> {
    return this.request<ChatContact[]>('/chat/contacts');
  }

  async getChatMessages(chatId: string): Promise<ApiResponse<ChatMessage[]>> {
    return this.request<ChatMessage[]>(`/chat/${chatId}/messages`);
  }

  async sendMessage(chatId: string, message: {
    content: string;
    type: ChatMessage['type'];
  }): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>(`/chat/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  // Services
  async getServices(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/services');
  }

  async getService(serviceId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/services/${serviceId}`);
  }

  async getTechnicians(serviceId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/services/${serviceId}/technicians`);
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Mock API for development (when backend is not available)
export class MockApiClient {
  private users: User[] = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      phone: '+1234567890',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      addresses: [
        {
          id: '1',
          type: 'home',
          address: '123 Main St, Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          isDefault: true,
        },
      ],
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        privacy: {
          shareLocation: true,
          shareContact: false,
        },
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  private bookings: Booking[] = [
    {
      id: '1',
      serviceId: 'ac-installation',
      serviceName: 'AC Installation',
      technicianId: 'tech-1',
      technicianName: 'John Smith',
      technicianAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      userId: '1',
      status: 'completed',
      scheduledDate: '2024-03-15',
      scheduledTime: '10:00 AM',
      address: '123 Main St, Apt 4B',
      description: 'Install new AC unit in living room',
      price: 150,
      rating: 5,
      review: 'Excellent service, very professional!',
      createdAt: '2024-03-10T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z',
    },
    {
      id: '2',
      serviceId: 'washing-machine-repair',
      serviceName: 'Washing Machine Repair',
      technicianId: 'tech-2',
      technicianName: 'Sarah Wilson',
      technicianAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      userId: '1',
      status: 'scheduled',
      scheduledDate: '2024-03-20',
      scheduledTime: '2:00 PM',
      address: '123 Main St, Apt 4B',
      description: 'Washing machine not spinning properly',
      price: 80,
      createdAt: '2024-03-18T00:00:00Z',
      updatedAt: '2024-03-18T00:00:00Z',
    },
  ];

  private payments: Payment[] = [
    {
      id: '1',
      bookingId: '1',
      amount: 150,
      currency: 'USD',
      method: 'credit_card',
      status: 'completed',
      transactionId: 'txn_123456789',
      createdAt: '2024-03-15T00:00:00Z',
    },
    {
      id: '2',
      bookingId: '2',
      amount: 80,
      currency: 'USD',
      method: 'paypal',
      status: 'pending',
      createdAt: '2024-03-18T00:00:00Z',
    },
  ];

  private chatContacts: ChatContact[] = [
    {
      id: 'tech-1',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      type: 'technician',
      lastMessage: 'I\'ll be there in 10 minutes',
      lastMessageTime: '2024-03-15T09:50:00Z',
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: 'support',
      name: 'Customer Support',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      type: 'support',
      lastMessage: 'How can I help you today?',
      lastMessageTime: '2024-03-14T15:30:00Z',
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: 'ai-assistant',
      name: 'AI Assistant',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      type: 'ai',
      lastMessage: 'I can help you with booking and support',
      lastMessageTime: '2024-03-14T10:00:00Z',
      unreadCount: 0,
      isOnline: true,
    },
  ];

  private chatMessages: ChatMessage[] = [
    {
      id: '1',
      chatId: 'tech-1',
      senderId: 'tech-1',
      senderName: 'John Smith',
      senderType: 'technician',
      content: 'Hi! I\'m on my way to your location',
      type: 'text',
      timestamp: '2024-03-15T09:45:00Z',
      status: 'read',
    },
    {
      id: '2',
      chatId: 'tech-1',
      senderId: '1',
      senderName: 'John Doe',
      senderType: 'user',
      content: 'Great! I\'ll be waiting',
      type: 'text',
      timestamp: '2024-03-15T09:46:00Z',
      status: 'read',
    },
    {
      id: '3',
      chatId: 'tech-1',
      senderId: 'tech-1',
      senderName: 'John Smith',
      senderType: 'technician',
      content: 'I\'ll be there in 10 minutes',
      type: 'text',
      timestamp: '2024-03-15T09:50:00Z',
      status: 'delivered',
    },
  ];

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = this.users.find(u => u.email === email);
    if (!user || password !== 'password') {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('auth_token', token);

    return {
      success: true,
      data: {
        user,
        token,
      },
    };
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log('MockApiClient register called with:', userData);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      console.log('User already exists:', userData.email);
      return {
        success: false,
        error: 'User already exists',
      };
    }

    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      avatar: undefined,
      addresses: [],
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        privacy: {
          shareLocation: true,
          shareContact: false,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('auth_token', token);

    console.log('Registration successful, created user:', newUser);
    return {
      success: true,
      data: {
        user: newUser,
        token,
      },
    };
  }

  async sendOtp(email: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        message: 'OTP sent successfully',
      },
    };
  }

  async verifyOtp(email: string, otp: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (otp === '1234') {
      return {
        success: true,
        data: {
          message: 'OTP verified successfully',
        },
      };
    }
    return {
      success: false,
      error: 'Invalid OTP',
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = this.users[0]; // Mock current user
    return {
      success: true,
      data: user,
    };
  }

  async getBookings(): Promise<ApiResponse<Booking[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: this.bookings,
    };
  }

  async getPayments(): Promise<ApiResponse<Payment[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: this.payments,
    };
  }

  async getChatContacts(): Promise<ApiResponse<ChatContact[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: this.chatContacts,
    };
  }

  async getChatMessages(chatId: string): Promise<ApiResponse<ChatMessage[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const messages = this.chatMessages.filter(msg => msg.chatId === chatId);
    return {
      success: true,
      data: messages,
    };
  }

  async sendMessage(chatId: string, message: {
    content: string;
    type: ChatMessage['type'];
  }): Promise<ApiResponse<ChatMessage>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMessage: ChatMessage = {
      id: (this.chatMessages.length + 1).toString(),
      chatId,
      senderId: '1', // Mock user ID
      senderName: 'John Doe',
      senderType: 'user',
      content: message.content,
      type: message.type,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    this.chatMessages.push(newMessage);
    return {
      success: true,
      data: newMessage,
    };
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = this.users[0]; // Mock current user
    const updatedUser = { ...user, ...userData };
    this.users[0] = updatedUser;
    return {
      success: true,
      data: updatedUser,
    };
  }

  async addAddress(address: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAddress: Address = {
      id: (this.users[0]?.addresses.length || 0 + 1).toString(),
      ...address,
    };
    if (this.users[0]) {
      this.users[0].addresses.push(newAddress);
    }
    return {
      success: true,
      data: newAddress,
    };
  }

  async updateAddress(addressId: string, address: Partial<Address>): Promise<ApiResponse<Address>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (this.users[0]) {
      const addressIndex = this.users[0].addresses.findIndex(addr => addr.id === addressId);
      if (addressIndex !== -1) {
        this.users[0].addresses[addressIndex] = { ...this.users[0].addresses[addressIndex], ...address };
        return {
          success: true,
          data: this.users[0].addresses[addressIndex],
        };
      }
    }
    return {
      success: false,
      error: 'Address not found',
    };
  }

  async deleteAddress(addressId: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (this.users[0]) {
      this.users[0].addresses = this.users[0].addresses.filter(addr => addr.id !== addressId);
    }
    return {
      success: true,
    };
  }

  async getBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      return {
        success: true,
        data: booking,
      };
    }
    return {
      success: false,
      error: 'Booking not found',
    };
  }

  async createBooking(bookingData: {
    serviceId: string;
    technicianId: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    description: string;
  }): Promise<ApiResponse<Booking>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newBooking: Booking = {
      id: (this.bookings.length + 1).toString(),
      serviceId: bookingData.serviceId,
      serviceName: 'Mock Service',
      technicianId: bookingData.technicianId,
      technicianName: 'John Smith',
      userId: '1',
      status: 'pending',
      scheduledDate: bookingData.scheduledDate,
      scheduledTime: bookingData.scheduledTime,
      address: bookingData.address,
      description: bookingData.description,
      price: 99.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.bookings.push(newBooking);
    return {
      success: true,
      data: newBooking,
    };
  }

  async cancelBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
      booking.updatedAt = new Date().toISOString();
      return {
        success: true,
        data: booking,
      };
    }
    return {
      success: false,
      error: 'Booking not found',
    };
  }

  async rateBooking(bookingId: string, rating: number, review?: string): Promise<ApiResponse<Booking>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.rating = rating;
      booking.review = review;
      booking.updatedAt = new Date().toISOString();
      return {
        success: true,
        data: booking,
      };
    }
    return {
      success: false,
      error: 'Booking not found',
    };
  }

  async createPayment(paymentData: {
    bookingId: string;
    amount: number;
    method: Payment['method'];
  }): Promise<ApiResponse<Payment>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPayment: Payment = {
      id: (this.payments.length + 1).toString(),
      bookingId: paymentData.bookingId,
      amount: paymentData.amount,
      currency: 'USD',
      method: paymentData.method,
      status: 'completed',
      transactionId: 'mock_transaction_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.payments.push(newPayment);
    return {
      success: true,
      data: newPayment,
    };
  }

  async getServices(): Promise<ApiResponse<any[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: [
        { id: '1', name: 'Computer Repair', price: 89.99 },
        { id: '2', name: 'Network Setup', price: 149.99 },
        { id: '3', name: 'Smart Home Setup', price: 199.99 },
      ],
    };
  }

  async getService(serviceId: string): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const services = [
      { id: '1', name: 'Computer Repair', price: 89.99, description: 'Professional computer repair services' },
      { id: '2', name: 'Network Setup', price: 149.99, description: 'Professional network installation' },
      { id: '3', name: 'Smart Home Setup', price: 199.99, description: 'Complete smart home installation' },
    ];
    const service = services.find(s => s.id === serviceId);
    if (service) {
      return {
        success: true,
        data: service,
      };
    }
    return {
      success: false,
      error: 'Service not found',
    };
  }

  async getTechnicians(serviceId: string): Promise<ApiResponse<any[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: [
        { id: '1', name: 'John Smith', rating: 4.9, specialty: 'Computer Repair' },
        { id: '2', name: 'Sarah Johnson', rating: 4.8, specialty: 'Network Setup' },
        { id: '3', name: 'Mike Wilson', rating: 4.7, specialty: 'Smart Home' },
      ],
    };
  }
}

// Import Supabase API client
import { SupabaseApiClient } from './supabaseApi';

// Export mock client for development
export const mockApiClient = new MockApiClient();

// Use Supabase client when configured, otherwise use mock client
export const api = USE_SUPABASE ? new SupabaseApiClient() : mockApiClient;
