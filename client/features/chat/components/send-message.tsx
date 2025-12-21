import { useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { View, type ViewProps } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { arktypeResolver } from '@hookform/resolvers/arktype';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  sendMessageParamSchema,
  SendMessageParam,
} from '../schemas/send-message/send-message-param.schema';
import { Text } from '@/components/ui/text';

interface SendMessageProps extends ViewProps {
  handleSubmit: (data: SendMessageParam) => void;
  onTyping?: () => void;
}

export function SendMessage({ className, onTyping, handleSubmit, ...props }: SendMessageProps) {
  const {
    control,
    reset,
    watch,
    handleSubmit: handlFormSubmit,
  } = useForm<SendMessageParam>({
    defaultValues: {
      text: '',
    },
    resolver: arktypeResolver(sendMessageParamSchema),
  });

  const change = watch(['text']);

  useEffect(() => {
    if (change && onTyping) {
      onTyping();
    }
  }, [change, onTyping]);

  const onSubmit = (data: SendMessageParam) => {
    reset();

    handleSubmit(data);
  };

  return (
    <KeyboardAvoidingView>
      <View
        className={cn('flex-row items-center border-t border-gray-200 bg-white p-2', className)}
        {...props}>
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              className="mr-2 flex-1"
              placeholder="Type a message..."
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Button onPress={handlFormSubmit(onSubmit)} size="sm">
          <Text>Send</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
