import { z } from 'zod';

export const createUserValidationSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'Name must be at least 5 characters long!' }),
  email: z
    .string()
    .email({ message: 'Invalid email address!' })
    .min(8, { message: 'Email must be at least 8 characters long!' }),
  role: z.enum(['user', 'admin']).optional().default('user'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long!' })
    .max(20, { message: 'Password cannot exceed 20 characters' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 characters long' })
    .max(15, { message: 'Phone number cannot exceed 15 characters' }),
  address: z
    .string()
    .min(2, { message: 'Address must be at least 2 characters long' }),
  status: z.enum(['active', 'blocked']).optional().default('blocked'),
});
