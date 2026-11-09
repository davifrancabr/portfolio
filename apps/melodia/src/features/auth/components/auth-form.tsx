'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { signIn, signUp } from '@/lib/auth-client';
import { CircleAlert, LockKeyhole, Mail, Music2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { ZodError } from 'zod';
import { translateAuthError } from '../errors';
import { withRedirect } from '../utils';
import {
  signInSchema,
  signUpSchema,
  type AuthFieldErrors,
  type AuthFieldName
} from '../validation';
import { PasswordInput } from './password-input';

export type AuthMode = 'signin' | 'signup';

type AuthFormProps = {
  mode: AuthMode;
  redirectTo: string;
};

const COPY = {
  signin: {
    title: 'Bem-vindo de volta',
    description: 'Entre para continuar ouvindo sua música.',
    submit: 'Entrar',
    switchLabel: 'Ainda não tem uma conta?',
    switchAction: 'Criar conta',
    switchHref: '/register'
  },
  signup: {
    title: 'Crie sua conta',
    description: 'Leve sua música com você para qualquer lugar.',
    submit: 'Criar conta',
    switchLabel: 'Já tem uma conta?',
    switchAction: 'Entrar',
    switchHref: '/login'
  }
} as const;

function collectFieldErrors(error: ZodError): AuthFieldErrors {
  const fieldErrors: AuthFieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in fieldErrors)) {
      fieldErrors[key as AuthFieldName] = issue.message;
    }
  }

  return fieldErrors;
}

export function AuthForm({ mode, redirectTo }: Readonly<AuthFormProps>) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  const copy = COPY[mode];
  const isSignUp = mode === 'signup';

  function handleFieldChange(field: AuthFieldName) {
    setFormError(null);
    setFieldErrors(current => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? '')
    };

    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const parsed = signUpSchema.safeParse(values);

        if (!parsed.success) {
          setFieldErrors(collectFieldErrors(parsed.error));
          return;
        }

        const { error } = await signUp.email({
          name: parsed.data.name,
          email: parsed.data.email,
          password: parsed.data.password
        });

        if (error) {
          setFormError(translateAuthError(error));
          return;
        }
      } else {
        const parsed = signInSchema.safeParse(values);

        if (!parsed.success) {
          setFieldErrors(collectFieldErrors(parsed.error));
          return;
        }

        const { error } = await signIn.email({
          email: parsed.data.email,
          password: parsed.data.password,
          rememberMe: true
        });

        if (error) {
          setFormError(translateAuthError(error));
          return;
        }
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setFormError('Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-100">
      <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Music2 className="size-5" aria-hidden="true" />
        </span>
        <span className="text-lg font-semibold tracking-tight">Melodia</span>
      </Link>

      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          {copy.title}
        </h1>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>

      {formError && (
        <Alert variant="destructive" className="mb-6">
          <CircleAlert aria-hidden="true" />
          <AlertTitle>Não foi possível continuar</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} noValidate aria-busy={isSubmitting}>
        <FieldGroup className="gap-5">
          {isSignUp && (
            <Field data-invalid={Boolean(fieldErrors.name)}>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <div className="relative">
                <User
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Como podemos te chamar?"
                  className="pl-9"
                  aria-invalid={Boolean(fieldErrors.name)}
                  onChange={() => handleFieldChange('name')}
                  required
                />
              </div>
              <FieldError errors={[{ message: fieldErrors.name }]} />
            </Field>
          )}

          <Field data-invalid={Boolean(fieldErrors.email)}>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                className="pl-9"
                aria-invalid={Boolean(fieldErrors.email)}
                onChange={() => handleFieldChange('email')}
                required
              />
            </div>
            <FieldError errors={[{ message: fieldErrors.email }]} />
          </Field>

          <Field data-invalid={Boolean(fieldErrors.password)}>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <PasswordInput
                id="password"
                name="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                placeholder={isSignUp ? 'Mínimo de 8 caracteres' : 'Sua senha'}
                className="pl-9"
                aria-invalid={Boolean(fieldErrors.password)}
                onChange={() => handleFieldChange('password')}
                required
              />
            </div>
            {isSignUp && (
              <FieldDescription>Use pelo menos 8 caracteres.</FieldDescription>
            )}
            <FieldError errors={[{ message: fieldErrors.password }]} />
          </Field>

          {isSignUp && (
            <Field data-invalid={Boolean(fieldErrors.confirmPassword)}>
              <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Repita a senha"
                  className="pl-9"
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  onChange={() => handleFieldChange('confirmPassword')}
                  required
                />
              </div>
              <FieldError errors={[{ message: fieldErrors.confirmPassword }]} />
            </Field>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'Enviando...' : copy.submit}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {copy.switchLabel}{' '}
        <Link
          href={withRedirect(copy.switchHref, redirectTo)}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {copy.switchAction}
        </Link>
      </p>
    </div>
  );
}
