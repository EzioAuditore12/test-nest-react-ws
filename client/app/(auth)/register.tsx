import { Text } from '@/components/ui/text';
import { RegisterForm } from '@/features/auth/register/components/register-form';
import { useRegister } from '@/features/auth/register/hooks/use-register';
import { Link } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function RegisterScreen() {
  const { mutate, isPending } = useRegister();

  return (
    <KeyboardAwareScrollView contentContainerClassName="flex-1 p-2 gap-y-3 justify-center items-center">
      <Text variant={'h1'}>Register Screen</Text>

      <RegisterForm handleSumit={mutate} isSubmitting={isPending} className="w-full max-w-lg" />

      <Link href={'/(auth)/login'} className='underline text-blue-500'>Login Here</Link>
    </KeyboardAwareScrollView>
  );
}
