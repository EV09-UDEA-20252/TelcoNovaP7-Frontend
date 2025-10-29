import { useState, useEffect } from 'react';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string; // "OPERARIO", "ADMIN", etc.
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  telefono: string;
  numero_iden: string;
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Cargar el usuario autenticado al iniciar
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('telconova_token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('No se pudo obtener el usuario');

        const data: User = await res.json();
        setUser(data);
        localStorage.setItem('telconova_user', JSON.stringify(data));
      } catch (error) {
        console.error('Error cargando usuario:', error);
        localStorage.removeItem('telconova_token');
        localStorage.removeItem('telconova_user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [API_URL]);

  // ✅ Login: guarda token y obtiene datos del usuario real
  const login = async (credentials: LoginCredentials) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok || !data.accessToken) {
        return { success: false, message: 'Credenciales inválidas' };
      }

      // Guarda token
      localStorage.setItem('telconova_token', data.accessToken);

      // Llama al endpoint /me para obtener el usuario real
      const meRes = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      const userData: User = await meRes.json();
      setUser(userData);
      localStorage.setItem('telconova_user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) return { success: false, message: 'Error en el registro' };

      return { success: true };
    } catch {
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('telconova_user');
    localStorage.removeItem('telconova_token');
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
