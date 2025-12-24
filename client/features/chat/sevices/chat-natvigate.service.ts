import { router } from 'expo-router';

import { ConversationRepository } from '@/db/repositories/conversation';

export const navigateToChat = async (receiverId: string) => {
  const conversationReposiory = new ConversationRepository();

  const existingConversation = await conversationReposiory.getConversationWithUserId(receiverId);

  if (existingConversation)
    router.replace({
      pathname: '/(main)/chat/[id]',
      params: { id: existingConversation.id },
    });

  
};
