import { Text } from '@/components/ui/text';

import { RegisterForm } from '@/features/auth/register/components/register-form';
import { useRegister } from '@/features/auth/register/hooks/use-register';
import { useDeviceConfigStore } from '@/store/device';

import { Link } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function RegisterScreen() {
  const { mutate, isPending } = useRegister();

  const { expoPushToken } = useDeviceConfigStore((state) => state);

  return (
    <KeyboardAwareScrollView contentContainerClassName="flex-1 p-2 gap-y-3 justify-center items-center">
      <Text variant={'h1'}>Register Screen</Text>

      <RegisterForm
        expoPushToken={expoPushToken}
        handleSumit={mutate}
        isSubmitting={isPending}
        className="w-full max-w-lg"
      />

      <Link href={'/(auth)/login'} className="text-blue-500 underline">
        Login Here
      </Link>
    </KeyboardAwareScrollView>
  );
}
