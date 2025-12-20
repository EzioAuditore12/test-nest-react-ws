import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';

import type { User } from '../schemas/user.schema';

interface UserProfileProps extends ViewProps {
  data?: User;
}

export function UserProfile({ className, data, ...props }: UserProfileProps) {
  if (!data) return null;

  const { createdAt, name, id, username } = data;

  return (
    <View
      key={id}
      className={cn(
        'flex flex-col items-center space-y-4 rounded-2xl bg-white p-6 shadow-lg',
        className
      )}
      {...props}>
      <Avatar className="size-48" alt={name}>
        <AvatarImage src={''} />
        <AvatarFallback>
          <Text>{name[0]} </Text>
        </AvatarFallback>
      </Avatar>
      <Text variant={'h3'} className="text-center">
        {name}
      </Text>
      <Text variant={'large'} className="text-center text-gray-700">
        {username}
      </Text>

      <Text variant={'small'} className="mt-2 text-center text-gray-500">
        Joined: {new Date(createdAt).toLocaleDateString()}
      </Text>
    </View>
  );
}
