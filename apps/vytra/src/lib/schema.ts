import z from 'zod';

export const inventoryMovementEnum = {
  ENTRADA: 'entrada',
  SAIDA: 'saida',
  AJUSTE: 'ajuste'
} as const;

export const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.email().nonempty(),
    username: z.string().min(6),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    image: z.url()
  })
  .refine(a => a.password === a.confirmPassword, {
    path: ['confirmPassword']
  });
export type Register = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty()
});
export type Login = z.infer<typeof loginSchema>;
