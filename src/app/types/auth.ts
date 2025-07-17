import type { UUID } from './misc';

export interface AuthData {
  email: string;
  id: UUID;
  token: string;
  expiresAt: Date | string;
}

export interface EmailRequest {
  email: string;
}

export interface LoginVerifyRequest extends EmailRequest {
  loginCode: string;
}

export interface PasswordAuthRequest extends EmailRequest {
  password: string;
}
