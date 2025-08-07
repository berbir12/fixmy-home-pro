import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => void;
  register: (userData: { email: string; password: string; name: string; phone?: string }) => void;
  logout: () => void;
  sendOtp: (email: string) => void;
  verifyOtp: (data: { email: string; otp: string }) => void;
  updateProfile: (userData: Partial<User>) => void;
  loginLoading: boolean;
  registerLoading: boolean;
  sendOtpLoading: boolean;
  verifyOtpLoading: boolean;
  updateProfileLoading: boolean;
  loginError: Error | null;
  registerError: Error | null;
  sendOtpError: Error | null;
  verifyOtpError: Error | null;
  updateProfileError: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
