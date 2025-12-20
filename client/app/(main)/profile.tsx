import { View } from 'react-native';

import { UserProfile } from '@/features/common/components/user-profiler';
import { useGetProfile } from '@/features/settings/hooks/use-get-profile';

export default function ProfileScreen() {
  const { data } = useGetProfile();

  return (
    <View className="flex-1 items-center justify-center p-2">
      <UserProfile className="w-full" data={data} />
    </View>
  );
}
