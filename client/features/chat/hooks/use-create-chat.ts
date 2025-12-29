import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { createChatApi } from '../api/create-chat.api';

import { UserRepository } from '@/db/repositories/user';
import { ConversationRepository } from '@/db/repositories/conversation';
import { DirectChatRepository } from '@/db/repositories/direct-chat';
import { getUserApi } from '@/features/common/api/get-user.api';

export const useCreateChat = (receiverId: string) => {
  const userRepository = new UserRepository();
  const conversationRepository = new ConversationRepository();
  const directChatRepository = new DirectChatRepository();

  return useMutation({
    mutationFn: createChatApi,
    onSuccess: async (data) => {
      const receiverDetails = await getUserApi(receiverId);

      const savedReceiver = await userRepository.create({
        ...receiverDetails,
        createdAt: new Date(receiverDetails.createdAt),
        updatedAt: new Date(receiverDetails.updatedAt),
      });

      const savedConversation = await conversationRepository.create({
        id: data.conversationId,
        contact: savedReceiver.name,
        userId: savedReceiver.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      });

      await directChatRepository.create({
        _id: data._id,
        conversationId: savedConversation.id,
        isDelivered: false,
        isSeen: false,
        mode: 'SENT',
        text: data.text,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.createdAt),
      });

      router.replace({
        pathname: '/(main)/chat/[id]',
        params: {
          id: savedConversation.id,
          name: savedConversation.contact,
          receiverId: savedConversation.user.id,
        },
      });
    },

    onError: (error) => {
      alert(error);
    },
  });
};
