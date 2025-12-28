import { Text } from '@/components/ui/text';

import { LoginForm } from '@/features/auth/login/components/login-form';
import { useLogin } from '@/features/auth/login/hooks/use-login';
import { usePushNotification } from '@/hooks/use-push-notifications';

import { Link } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function LoginScreen() {
  const { mutate, isPending } = useLogin();

  const { expoPushToken } = usePushNotification();

  return (
    <KeyboardAwareScrollView contentContainerClassName="flex-1 p-2 justify-center items-center gap-y-5">
      <Text variant={'h1'}>Login Screen</Text>
      <LoginForm
        expoPushToken={expoPushToken}
        handleSumit={mutate}
        isSubmitting={isPending}
        className="w-full max-w-lg"
      />

      <Link href={'/(auth)/register'} className="text-blue-500 underline">
        Register Here
      </Link>
    </KeyboardAwareScrollView>
  );
}
