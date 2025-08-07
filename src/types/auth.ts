export type UserRole = 'customer' | 'technician' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends User {
  role: 'customer';
  // Customer-specific fields
  totalSpent: number;
  loyaltyPoints: number;
  preferredTechnicians: string[];
}

export interface Technician extends User {
  role: 'technician';
  // Technician-specific fields
  specialties: string[];
  certifications: string[];
  experience: string;
  hourlyRate: number;
  availability: AvailabilitySchedule;
  rating: number;
  totalJobs: number;
  isActive: boolean;
  skills: string[];
  languages: string[];
  vehicleInfo?: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
  };
}

export interface Admin extends User {
  role: 'admin';
  // Admin-specific fields
  permissions: string[];
  department: string;
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

export interface AvailabilitySchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // "09:00"
  end: string;   // "17:00"
  isAvailable: boolean;
}

export interface AuthState {
  user: Customer | Technician | Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
}
