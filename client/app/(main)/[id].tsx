import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserProfile } from '@/features/common/components/user-profiler';

import { Text } from '@/components/ui/text';

import { useGetUser } from '@/features/common/hooks/use-get-user';

export default function UserDetails() {
  const safeAreaInsets = useSafeAreaInsets();

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
      className="flex-1 items-center justify-center p-2">
      <UserProfile className="w-full max-w-4xl" data={data} />
    </View>
  );
}
