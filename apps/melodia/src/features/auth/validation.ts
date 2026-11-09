import { z } from 'zod';

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Informe um e-mail válido.'));

const passwordField = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .max(128, 'A senha deve ter no máximo 128 caracteres.');

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Informe sua senha.')
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Informe seu nome.')
      .max(80, 'O nome deve ter no máximo 80 caracteres.'),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, 'Confirme sua senha.')
  })
  .refine(values => values.password === values.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword']
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

export type AuthFieldName = keyof SignUpInput;
export type AuthFieldErrors = Partial<Record<AuthFieldName, string>>;
