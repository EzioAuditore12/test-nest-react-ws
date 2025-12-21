import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export default function DirectChatScreen() {
  const { id, name } = useLocalSearchParams() as unknown as { id: string; name: string };

  return (
    <>
      <Stack.Screen options={{ headerTitle: name }} />
      <View className="flex-1 items-center justify-center">
        <Text>{id}</Text>
      </View>
    </>
  );
}
