const ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS: 'Já existe uma conta com este e-mail.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Já existe uma conta com este e-mail.',
  INVALID_EMAIL_OR_PASSWORD: 'E-mail ou senha incorretos.',
  INVALID_EMAIL: 'Informe um e-mail válido.',
  INVALID_PASSWORD: 'Senha incorreta.',
  PASSWORD_TOO_SHORT: 'A senha deve ter pelo menos 8 caracteres.',
  PASSWORD_TOO_LONG: 'A senha é muito longa.',
  USER_NOT_FOUND: 'Não encontramos uma conta com este e-mail.'
};

type AuthError = {
  code?: string;
  message?: string;
} | null;

export function translateAuthError(error: AuthError | undefined): string {
  if (!error) return 'Não foi possível concluir a operação.';

  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }

  return error.message || 'Não foi possível concluir a operação.';
}
