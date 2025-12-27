import { View, type ViewProps } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { cn } from '@/lib/utils';

import { useGradualAnimation } from '@/hooks/use-gradual-animation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  sendMessageParamSchema,
  SendMessageParam,
} from '../schemas/send-message/send-message-param.schema';

import { Text } from '@/components/ui/text';

interface SendDirectMessageProps extends ViewProps {
  handleSubmit: (text: string) => void;
}

export function SendDirectMessage({ className, handleSubmit, ...props }: SendDirectMessageProps) {
  const { height } = useGradualAnimation();

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const {
    control,
    reset,

    handleSubmit: handlFormSubmit,
  } = useForm<SendMessageParam>({
    defaultValues: {
      text: '',
    },
    resolver: arktypeResolver(sendMessageParamSchema),
  });

  const onSubmit = (data: SendMessageParam) => {
    reset();

    handleSubmit(data.text);
  };

  return (
    <View className={cn('border-t-2 border-gray-400', className)} {...props}>
      <View className="flex-row items-center p-2">
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              className="mr-2 w-[80%]"
              placeholder="Type a message..."
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
              textAlignVertical="top"
              multiline
              numberOfLines={8}
              maxLength={1000}
            />
          )}
        />

        <Button onPress={handlFormSubmit(onSubmit)} size="sm">
          <Text>Send</Text>
        </Button>
      </View>

      <Animated.View style={keyboardPadding} />
    </View>
  );
}
