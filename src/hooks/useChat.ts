import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ChatContact, ChatMessage } from '@/lib/api';

export function useChat() {
  const queryClient = useQueryClient();

  // Get chat contacts
  const {
    data: contacts = [],
    isLoading: contactsLoading,
    error: contactsError,
    refetch: refetchContacts,
  } = useQuery({
    queryKey: ['chat-contacts'],
    queryFn: async () => {
      const response = await api.getChatContacts();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch chat contacts');
    },
  });

  // Get chat messages for a specific chat
  const getChatMessages = (chatId: string) => {
    return useQuery({
      queryKey: ['chat-messages', chatId],
      queryFn: async () => {
        const response = await api.getChatMessages(chatId);
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || 'Failed to fetch chat messages');
      },
      enabled: !!chatId,
    });
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ chatId, message }: {
      chatId: string;
      message: {
        content: string;
        type: ChatMessage['type'];
      };
    }) => api.sendMessage(chatId, message),
    onSuccess: (data, variables) => {
      // Optimistically update the messages
      queryClient.setQueryData(
        ['chat-messages', variables.chatId],
        (oldData: ChatMessage[] | undefined) => {
          if (oldData) {
            return [...oldData, data.data!];
          }
          return [data.data!];
        }
      );
      
      // Update the last message in contacts
      queryClient.setQueryData(
        ['chat-contacts'],
        (oldData: ChatContact[] | undefined) => {
          if (oldData) {
            return oldData.map(contact => {
              if (contact.id === variables.chatId) {
                return {
                  ...contact,
                  lastMessage: variables.message.content,
                  lastMessageTime: new Date().toISOString(),
                  unreadCount: contact.unreadCount + 1,
                };
              }
              return contact;
            });
          }
          return oldData;
        }
      );
    },
    onError: (error) => {
      console.error('Send message error:', error);
    },
  });

  return {
    contacts,
    contactsLoading,
    contactsError,
    refetchContacts,
    getChatMessages,
    sendMessage: sendMessageMutation.mutate,
    sendMessageLoading: sendMessageMutation.isPending,
    sendMessageError: sendMessageMutation.error,
  };
}
