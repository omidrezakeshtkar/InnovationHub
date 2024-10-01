import { z } from 'zod';

export const UserCreateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['user', 'moderator', 'admin', 'department_head']),
  department: z.string(),
  permissions: z.array(z.string()).optional(),
  points: z.number().default(0),
  badges: z.array(z.string()).optional(),
});

export const UserSchema = UserCreateSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserCreate = z.infer<typeof UserCreateSchema>;
export type User = z.infer<typeof UserSchema>;

export const TokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

export type Token = z.infer<typeof TokenSchema>;