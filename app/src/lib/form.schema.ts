'use client';

import { z } from 'zod';

export const signUpSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must at least be 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .refine((value) => value, 'Name is Required'),
  email: z
    .string()
    .refine((value) => value, 'Email is Required')
    .refine((value) => {
      return z.string().email().safeParse(value).success;
    }, 'Invalid email'),
  password: z.string().refine((value) => value, 'Password is required'),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});
