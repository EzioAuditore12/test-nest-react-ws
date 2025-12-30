import { Type, type } from 'arktype';

export const phoneSchema = type('/^\\+[1-9]\\d{7,14}$/').describe(
  'must be a valid phone number'
) as Type<string>;

export const jwtTokenSchema = type('/^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$/').describe(
  'must be in a valid jwt format'
) as Type<string>;

export const strongPasswordSchema = type(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\+\-=\[\]{};:'",.<>\/?]).{8,16}$/
).describe(
  'must be 8-16 characters, include uppercase, lowercase, number, and special character'
) as Type<string>;

export const objectIdSchema = type('/^[a-fA-F0-9]{24}$/').describe(
  'must be a valid MongoDB ObjectId'
) as Type<string>;

export const watermelondbIdSchema = type('/^[A-Za-z0-9]{15,17}$/').describe(
  'must be a valid WatermelonDB Id'
) as Type<string>;
