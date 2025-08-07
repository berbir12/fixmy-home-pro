import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, User } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check authentication status on mount and when auth state changes
  const { data: currentUser, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.getCurrentUser(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update auth state when user data changes
  useEffect(() => {
    console.log('🔗 useAuth: User data changed:', { 
      user: currentUser?.data?.id, 
      success: currentUser?.success, 
      error: currentUser?.error 
    });

    if (currentUser?.success && currentUser.data) {
      console.log('🔗 useAuth: Setting authenticated state');
      setAuthState({
        user: currentUser.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } else if (currentUser?.error || userError) {
      console.log('🔗 useAuth: Setting unauthenticated state');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } else if (userLoading) {
      console.log('🔗 useAuth: Setting loading state');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: true,
      });
    }
  }, [currentUser, userLoading, userError]);

  // Debug auth state changes
  useEffect(() => {
    console.log('🔗 useAuth: Auth state changed:', {
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      userId: authState.user?.id,
      userRole: authState.user?.role
    });
  }, [authState]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      console.log('🔗 useAuth: Login mutation called with:', { email });
      return api.login(email, password);
    },
    onSuccess: (response) => {
      console.log('🔗 useAuth: Login success response:', response);
      if (response.success && response.data) {
        console.log('🔗 useAuth: Login successful, invalidating queries');
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        
        // Navigate to dashboard after successful login
        setTimeout(() => {
          console.log('🔗 useAuth: Navigating to dashboard after login');
          navigate('/dashboard');
        }, 100);
      } else {
        console.error('🔗 useAuth: Login failed:', response.error);
      }
    },
    onError: (error) => {
      console.error('🔗 useAuth: Login error:', error);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      name: string;
      phone?: string;
    }) => {
      console.log('🔗 useAuth: Register mutation called with:', userData);
      return api.register(userData);
    },
    onSuccess: (response) => {
      console.log('🔗 useAuth: Register success response:', response);
      if (response.success && response.data) {
        if (response.data.requiresEmailConfirmation) {
          console.log('🔗 useAuth: Registration requires email confirmation');
          // Don't navigate, let the UI handle the confirmation message
        } else {
          console.log('🔗 useAuth: Registration successful, invalidating queries');
          queryClient.invalidateQueries({ queryKey: ['currentUser'] });
          
          // Navigate to dashboard after successful registration
          setTimeout(() => {
            console.log('🔗 useAuth: Navigating to dashboard after registration');
            navigate('/dashboard');
          }, 100);
        }
      } else {
        console.error('🔗 useAuth: Registration failed:', response.error);
      }
    },
    onError: (error) => {
      console.error('🔗 useAuth: Register error:', error);
    },
  });

  // Send OTP mutation
  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => api.sendOtp(email),
    onError: (error) => {
      console.error('🔗 useAuth: Send OTP error:', error);
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      api.verifyOtp(email, otp),
    onSuccess: (response) => {
      if (response.success) {
        console.log('🔗 useAuth: OTP verified successfully');
      }
    },
    onError: (error) => {
      console.error('🔗 useAuth: Verify OTP error:', error);
    },
  });

  // Logout function
  const logout = useCallback(async () => {
    console.log('🔗 useAuth: Logout called');
    try {
      await api.logout();
      console.log('🔗 useAuth: Logout successful');
      
      // Clear all queries
      queryClient.clear();
      
      // Update auth state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('🔗 useAuth: Logout error:', error);
    }
  }, [queryClient, navigate]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (userData: Partial<User>) => api.updateProfile(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        console.log('🔗 useAuth: Profile updated successfully');
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      }
    },
    onError: (error) => {
      console.error('🔗 useAuth: Update profile error:', error);
    },
  });

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    
    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    sendOtp: sendOtpMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    logout,
    updateProfile: updateProfileMutation.mutate,
    
    // Loading states
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
    sendOtpLoading: sendOtpMutation.isPending,
    verifyOtpLoading: verifyOtpMutation.isPending,
    updateProfileLoading: updateProfileMutation.isPending,
    
    // Error states
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    sendOtpError: sendOtpMutation.error,
    verifyOtpError: verifyOtpMutation.error,
    updateProfileError: updateProfileMutation.error,
  };
}
