import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';

export function SearchUserInput({ className, ...props }: ComponentProps<typeof Input>) {
  return <Input className={cn(className)} {...props} />;
}
