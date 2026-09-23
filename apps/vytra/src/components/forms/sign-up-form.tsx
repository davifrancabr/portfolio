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
import { signUp } from '@/lib/auth-client';
import { registerSchema } from '@/lib/schema';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';

export function SignupForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      image: ''
    },
    validators: {
      onSubmit: registerSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await signUp.email(
          {
            name: value.name,
            email: value.email,
            username: value.username,
            password: value.password,
            image: value.image
          },
          {
            onSuccess: () => router.push('/')
          }
        );
      } catch (error) {
        console.error('Erro ao processar cadastro.', error);
      }
    }
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Cadastro</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="sign-up-form"
          onSubmit={e => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 **:mt-2"
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Nome <sup className="text-destructive">*</sup>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="John William"
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
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
              name="username"
              children={field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Nome de Usuário<sup className="text-destructive">*</sup>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="john_william"
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
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
            <form.Field
              name="confirmPassword"
              children={field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirmar Senha <sup className="text-destructive">*</sup>
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
            <form.Field
              name="image"
              children={field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Foto de perfil</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      required={false}
                      type="url"
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
          <Button type="submit" form="sign-up-form">
            Cadastrar
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
