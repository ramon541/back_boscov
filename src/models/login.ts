import z from 'zod';
import userSchema from './user';

export const loginSchema = userSchema.pick({
    email: true,
    password: true,
});

export type ILogin = z.infer<typeof loginSchema>;
