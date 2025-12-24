import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserProfile } from '@/features/common/components/user-profiler';

import { Text } from '@/components/ui/text';

import { useGetUser } from '@/features/common/hooks/use-get-user';
import { useAuthStore } from '@/store/auth';

import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { Button } from '@/components/ui/button';

export default function UserDetails() {
  const safeAreaInsets = useSafeAreaInsets();

  const user = useAuthStore((state) => state.user);
  const { mutate, isPending } = useCreateChat();

  const { id } = useLocalSearchParams() as unknown as { id: string };

  const { data } = useGetUser(id);

  if (!data)
    return (
      <View className="flex-1 items-center justify-center">
        <Text variant={'h1'}>Not Found</Text>
      </View>
    );

  return (
    <View
      style={{ marginTop: safeAreaInsets.top }}
      className="flex-1 items-center justify-center gap-y-2 p-2">
      <UserProfile className="w-full max-w-md" data={data} />

      <Button
        onPress={() =>
          router.push({
            pathname: '/(main)/chat/[id]',
            params: { id: data.id, name: data.name, type: 'NEW' },
          })
        }>
        <Text>Start Chat</Text>
      </Button>
    </View>
  );
}
