'use client';

import { authClient } from '@/lib/auth-client';
import { registerSchema, type Register } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Register>({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      image: ''
    },
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (values: Register) => {
    await authClient.signUp.email({
      name: values.name,
      email: values.email,
      username: values.username,
      password: values.password,
      image: values.image
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-auto flex flex-col space-y-4 **:mt-2"
    >
      <section>
        <Label htmlFor="name">
          Nome <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="name"
          placeholder="Ex.: John Martinez"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-destructive">{errors.name.message}</p>
        )}
      </section>
      <section>
        <Label htmlFor="username">
          Nome de Usuário <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="username"
          placeholder="Ex.: John_Martinez"
          {...register('username')}
        />
        {errors.username && (
          <p className="text-destructive">{errors.username.message}</p>
        )}
      </section>
      <section>
        <Label htmlFor="email">
          Email <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Ex.: john_martinez@youremail.com"
          {...register('name')}
        />
        {errors.email && (
          <p className="text-destructive">{errors.email.message}</p>
        )}
      </section>
      <section>
        <Label htmlFor="password">
          Senha <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="**********"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-destructive">{errors.password.message}</p>
        )}
      </section>
      <section>
        <Label htmlFor="confirmPassword">
          Confirmar Senha <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="*********"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-destructive">{errors.confirmPassword.message}</p>
        )}
      </section>
      <section>
        <Label htmlFor="image">Foto de Perfil</Label>

        <Dialog>
          <DialogTrigger
            render={<Button>Enviar foto de perfil</Button>}
            content="a"
          />
          <DialogContent className="bg-surface-3 text-background">
            <DialogHeader>
              <DialogTitle>Foto de perfil</DialogTitle>
              <DialogDescription>
                Abra ou arraste sua foto para o campo
              </DialogDescription>
            </DialogHeader>
            <section className="flex flex-col justify-center items-center gap-2">
              <Input accept="image/png,jpeg,webp" type="file" />
            </section>
          </DialogContent>
        </Dialog>
      </section>
    </form>
  );
}
