import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Payment } from '@/lib/api';

export function usePayments() {
  const queryClient = useQueryClient();

  // Get all payments
  const {
    data: payments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await api.getPayments();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch payments');
    },
  });

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: (paymentData: {
      bookingId: string;
      amount: number;
      method: Payment['method'];
    }) => api.createPayment(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Create payment error:', error);
    },
  });

  return {
    payments,
    isLoading,
    error,
    refetch,
    createPayment: createPaymentMutation.mutate,
    createPaymentLoading: createPaymentMutation.isPending,
    createPaymentError: createPaymentMutation.error,
  };
}
