import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import type { User } from '@/features/auth/common/schemas/user.schema';

interface UserProfileProps extends ComponentProps<typeof Card> {
  data?: User;
}

export function UserProfile({ className, data, ...props }: UserProfileProps) {
  if (!data) return null;

  const { createdAt, name, id, username } = data;

  return (
    <Card key={id} className={cn(className)} {...props}>
      <CardContent className="items-center gap-y-4">
        <Avatar className="size-48" alt={name}>
          <AvatarImage src={''} />
          <AvatarFallback>
            <Text>{name[0]}</Text>
          </AvatarFallback>
        </Avatar>
        <Text variant={'h3'}>Name: {name}</Text>
        <Text variant={'large'}>Username: {username}</Text>

        <Text variant={'small'}>Joined: {new Date(createdAt).toLocaleDateString()}</Text>
      </CardContent>
    </Card>
  );
}

export function UserProfileLoading({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card className={cn(className)} {...props}>
      <CardContent className="items-center gap-y-4">
        <Skeleton className="size-48 rounded-full" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );
}
