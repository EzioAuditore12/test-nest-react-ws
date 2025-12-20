import type { ComponentProps } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

import type { User } from '../schemas/user.schema';

interface UserCardProps extends ComponentProps<typeof Card> {
  data: User;
  onPress?: PressableProps['onPress'];
}

export function UserCard({ className, data, onPress, ...props }: UserCardProps) {
  const { name, username, createdAt } = data;

  return (
    <Pressable onPress={onPress}>
      <Card className={cn(className)} {...props}>
        <CardContent className="relative w-full flex-row gap-x-2">
          <Avatar className="size-20" alt={name}>
            <AvatarImage src={''} />
            <AvatarFallback>
              <Text>{name[0]}</Text>
            </AvatarFallback>
          </Avatar>

          <View>
            <Text variant={'h3'}>{name}</Text>
            <Text>{username}</Text>
          </View>

          <Text className="absolute right-3" variant={'muted'}>
            {createdAt}
          </Text>
        </CardContent>
      </Card>
    </Pressable>
  );
}
