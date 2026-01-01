import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserProfile, UserProfileLoading } from '@/features/common/components/user-profiler';

import { useGetProfile } from '@/features/settings/hooks/use-get-profile';

export default function ProfileScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { data, isLoading } = useGetProfile();

  if (isLoading) return <UserProfileLoading />;

  return (
    <ScrollView
      style={{ marginTop: safeAreaInsets.top }}
      contentContainerClassName="flex-1 items-center justify-center gap-y-2 p-2">
      <UserProfile className="w-full" data={data} />
    </ScrollView>
  );
}
