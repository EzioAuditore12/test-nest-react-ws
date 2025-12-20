import type { User } from '@/features/auth/common/schemas/user.schema';
import type { Tokens } from '@/features/auth/common/schemas/tokens.schema';

export interface AuthStoreType {
  user: User | null;
  tokens: Tokens | null;
  setUserDetail: (data: User) => void;
  setTokens: (data: Tokens) => void;
  logout: ()=> void
}
