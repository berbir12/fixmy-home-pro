import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Booking } from '@/lib/api';

export function useBookings() {
  const queryClient = useQueryClient();

  // Get all bookings
  const {
    data: bookings = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await api.getBookings();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch bookings');
    },
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (bookingData: {
      serviceId: string;
      technicianId: string;
      scheduledDate: string;
      scheduledTime: string;
      address: string;
      description: string;
    }) => api.createBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Create booking error:', error);
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => api.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Cancel booking error:', error);
    },
  });

  // Rate booking mutation
  const rateBookingMutation = useMutation({
    mutationFn: ({ bookingId, rating, review }: {
      bookingId: string;
      rating: number;
      review?: string;
    }) => api.rateBooking(bookingId, rating, review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Rate booking error:', error);
    },
  });

  // Get single booking
  const getBooking = (bookingId: string) => {
    return useQuery({
      queryKey: ['booking', bookingId],
      queryFn: async () => {
        const response = await api.getBooking(bookingId);
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to fetch booking');
      },
      enabled: !!bookingId,
    });
  };

  return {
    bookings,
    isLoading,
    error,
    refetch,
    createBooking: createBookingMutation.mutate,
    cancelBooking: cancelBookingMutation.mutate,
    rateBooking: rateBookingMutation.mutate,
    getBooking,
    createBookingLoading: createBookingMutation.isPending,
    cancelBookingLoading: cancelBookingMutation.isPending,
    rateBookingLoading: rateBookingMutation.isPending,
    createBookingError: createBookingMutation.error,
    cancelBookingError: cancelBookingMutation.error,
    rateBookingError: rateBookingMutation.error,
  };
}
