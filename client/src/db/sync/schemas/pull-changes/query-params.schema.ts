import { type } from 'arktype';

export const pullChangesQueryParamSchema = type({
  lastPulledAt: 'number > 0 | undefined',
});

export type PullChangesQueryParam = typeof pullChangesQueryParamSchema.infer;
