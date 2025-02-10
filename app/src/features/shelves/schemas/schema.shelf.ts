'use client';

import { z } from 'zod';

export const shelfSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must at least be 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .refine((value) => value, 'Name is Required'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .nullable(),
  books: z.array(z.string()),
});
