import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Controller, useForm } from 'react-hook-form';
import { View, type ViewProps } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils';

import { registerParamSchema, type RegisterParam } from '../schemas/register-param.schema';

interface RegisterFormProps extends ViewProps {
  expoPushToken: string;
  handleSumit: (data: RegisterParam) => void;
  isSubmitting: boolean;
}

export function RegisterForm({
  className,
  expoPushToken,
  handleSumit,
  isSubmitting,
  ...props
}: RegisterFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit: handlFormSubmit,
  } = useForm<RegisterParam>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: arktypeResolver(registerParamSchema),
  });

  const onSubmit = (data: RegisterParam) => {
    if (!(expoPushToken.length === 0)) data.expoPushToken = expoPushToken;

    handleSumit(data);
  };

  return (
    <View className={cn('gap-y-3', className)} {...props}>
      <Controller
        control={control}
        name="username"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            placeholder="Enter Username"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {errors.username && (
        <Text variant={'p'} className="text-red-500">
          {errors.username.message}
        </Text>
      )}

      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input placeholder="Enter name" value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
      />

      {errors.name && (
        <Text variant={'p'} className="text-red-500">
          {errors.name.message}
        </Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            placeholder="Enter Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
          />
        )}
      />

      {errors.password && (
        <Text variant={'p'} className="text-red-500">
          {errors.password.message}
        </Text>
      )}

      <Button disabled={isSubmitting} onPress={handlFormSubmit(onSubmit)}>
        <Text>{isSubmitting ? 'Submitting' : 'Submit'}</Text>
      </Button>
    </View>
  );
}
