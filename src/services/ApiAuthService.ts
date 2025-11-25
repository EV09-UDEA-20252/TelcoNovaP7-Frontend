// src/services/ApiAuthService.ts
import { AuthService } from "./AuthService";

export class ApiAuthService extends AuthService {
  private apiUrl = import.meta.env.VITE_API_URL;

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Error en el inicio de sesión" };
      }

      localStorage.setItem("telconova_token", data.accessToken);
      localStorage.setItem("telconova_user", JSON.stringify(data.user));
      return { success: true, token: data.accessToken };
    } catch {
      return { success: false, message: "Error de conexión" };
    }
  }
}
