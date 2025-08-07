import { useState, useEffect } from 'react';
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

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Verify token and get user data
      api.getCurrentUser()
        .then(response => {
          if (response.success && response.data) {
            setAuthState({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('auth_token');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
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
      console.log('Register mutation called with:', userData);
      return api.register(userData);
    },
    onSuccess: (response) => {
      console.log('Register success:', response);
      if (response.success && response.data) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        navigate('/dashboard');
      } else {
        console.error('Registration failed:', response.error);
      }
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });

  // Send OTP mutation
  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => api.sendOtp(email),
    onError: (error) => {
      console.error('Send OTP error:', error);
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      api.verifyOtp(email, otp),
    onSuccess: (response) => {
      if (response.success) {
        // OTP verified successfully
        console.log('OTP verified');
      }
    },
    onError: (error) => {
      console.error('Verify OTP error:', error);
    },
  });

  // Logout function
  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      queryClient.clear();
      navigate('/');
    }
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (userData: Partial<User>) => api.updateProfile(userData),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data,
        }));
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    },
    onError: (error) => {
      console.error('Update profile error:', error);
    },
  });

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    sendOtp: sendOtpMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    logout,
    updateProfile: updateProfileMutation.mutate,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
    sendOtpLoading: sendOtpMutation.isPending,
    verifyOtpLoading: verifyOtpMutation.isPending,
    updateProfileLoading: updateProfileMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    sendOtpError: sendOtpMutation.error,
    verifyOtpError: verifyOtpMutation.error,
    updateProfileError: updateProfileMutation.error,
  };
}
