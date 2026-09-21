'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';
import { loginSchema } from '@/lib/schema';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';

export function SigninForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    validators: {
      onSubmit: loginSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await signIn.email(
          {
            email: value.email,
            password: value.password
          },
          {
            onSuccess: () => router.push('/')
          }
        );
      } catch (error) {
        console.error('Erro ao entrar.', error);
      }
    }
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="sign-in-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 **:mt-2"
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Email <sup className="text-destructive">*</sup>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="johnwilliam@gmail.com"
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="email"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Senha <sup className="text-destructive">*</sup>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="**********"
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="password"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="sign-in-form">
            Entrar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
