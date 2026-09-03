import z from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2),
    username: z.string().nonempty(),
    email: z.email().nonempty(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    image: z.url().optional()
  })
  .refine(data => data.password === data.confirmPassword, {
    error: 'As senhas não correspodem!',
    path: ['password', 'confirmPassword']
  });

export type Register = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty()
});

export type Login = z.infer<typeof loginSchema>;
