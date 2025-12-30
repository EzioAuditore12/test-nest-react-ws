import { withObservables } from '@nozbe/watermelondb/react';
import { use, type ComponentProps } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils';

import { Conversation } from '@/db/models/conversation.model';
import { User } from '@/db/models/user.model';

interface ConversationCardProps extends ComponentProps<typeof Card> {
  onPress: PressableProps['onPress'];
  data: Conversation;
  user: User;
}

const enhance = withObservables(['data'], ({ data }: { data: Conversation }) => ({
  user: data.user.observe(),
}));

export function ConversationCard({
  className,
  data,
  user,
  onPress,
  ...props
}: ConversationCardProps) {
  const { contact, updatedAt } = data;

  return (
    <Pressable onPress={onPress}>
      <Card className={cn(className)} {...props}>
        <CardContent className="flex-row gap-x-2">
          <Avatar className="size-20" alt={user.name}>
            <AvatarImage source={{ uri: '' }} />
            <AvatarFallback>
              <Text>{user.name[0]}</Text>
            </AvatarFallback>
          </Avatar>

          <View className="flex-col">
            <Text variant={'h3'}>{contact}</Text>

            <Text>{use.name}</Text>

            <Text>{user.username}</Text>
          </View>
        </CardContent>
        <Text className="mr-2 ml-auto">
          {updatedAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Card>
    </Pressable>
  );
}

export const EnhancedConversationCard = enhance(ConversationCard);
