'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/lib/auth-client';
import { registerSchema, type Register } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from '@tanstack/react-form';
import { redirect } from 'next/navigation';

export function SignupForm() {
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
    }
  });
  const onSubmit = async (data: Register) => {
    try {
      await signUp.email(
        {
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
          image: data.image
        },
        {
          onSuccess: () => {
            redirect('/dashboard');
          }
        }
      );
    } catch (error) {
      console.error('Erro ao processar cadastro.', error);
    }
  };

  return (
    <form className="space-y-4 **:mt-2">
      <form.Field
        name="name"
        children={val => (
          <>
            <Label htmlFor={val.name}>
              Nome <sup className="text-destructive">*</sup>
            </Label>
            <Input id="name" placeholder="John William" type="text" />
          </>
        )}
      />
      <section>
        <Input
          id="name"
          placeholder="John William"
          type="text"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-destructive">{errors.name.message}</p>
        )}
      </section>
      <section>
        <Label htmlFor="email">
          Email <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="email"
          placeholder="john_william@gmail.com"
          type="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-destructive">{errors.email.message}</p>
        )}
      </section>
      <section>
        <Label htmlFor="username">
          Nome de Usuário <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="username"
          placeholder="John_William"
          type="text"
          {...register('username')}
        />
        {errors.username && (
          <p className="text-destructive">{errors.username.message}</p>
        )}
      </section>
      <section>
        <Label htmlFor="password">
          Senha <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="password"
          placeholder="********"
          type="password"
          {...register('password')}
        />
        {errors.name && (
          <p className="text-destructive">{errors.name.message}</p>
        )}
      </section>
      <section>
        <Label htmlFor="confirmPassword">
          Confirmar Senha <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="confirmPassword"
          placeholder="********"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-destructive">{errors.confirmPassword.message}</p>
        )}
      </section>
      <section>
        <Label htmlFor="image">Foto de perfil</Label>
        <Input id="image" type="url" {...register('image')} />
        {errors.image && (
          <p className="text-destructive">{errors.image.message}</p>
        )}
      </section>
    </form>
  );
}
