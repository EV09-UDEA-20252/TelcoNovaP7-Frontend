// src/services/AuthService.ts
export abstract class AuthService {
  abstract login(email: string, password: string): Promise<{ success: boolean; message?: string; token?: string }>;
}
    