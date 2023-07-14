import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  PORT: z.coerce.number().default(3333),
});

const parsedEnv = envSchema.safeParse(process.env);

if (parsedEnv.success === false) {
  console.log('Invalid env variables.', parsedEnv.error.format());

  throw new Error('Invalid env variables.');
}

export const env = parsedEnv.data;
