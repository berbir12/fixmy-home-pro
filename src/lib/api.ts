// API Types
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
  role?: 'customer' | 'technician' | 'admin';
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

// Import Supabase API client
import { SupabaseApiClient } from './supabaseApi';

// Export Supabase API client as the only API client
export const api = new SupabaseApiClient();

// Debug logging to confirm Supabase is being used
console.log('🔗 API Client: Using SupabaseApiClient');
console.log('🔗 Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Not configured');
console.log('🔗 Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Not configured');

// Check if environment variables are missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('❌ VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.error('❌ VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
}
