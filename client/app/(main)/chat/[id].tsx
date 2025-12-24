import { router, Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

export default function DirectChatScreen() {
  const { id, name, type } = useLocalSearchParams() as unknown as {
    id: string;
    name: string;
    type: 'NEW' | 'OLD';
  };

  if (type === 'NEW')
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{id} New Chat</Text>

        <Button
          onPress={() =>
            router.replace({
              pathname: '/(main)/chat/[id]',
              params: { id, name, type: 'OLD' },
            })
          }>
          <Text>Chat</Text>
        </Button>
      </View>
    );

  return (
    <>
      <Stack.Screen options={{ headerTitle: name, animation: 'none' }} />
      <View className="flex-1 items-center justify-center">
        <Text>{id} Old Chat</Text>
      </View>
    </>
  );
}
