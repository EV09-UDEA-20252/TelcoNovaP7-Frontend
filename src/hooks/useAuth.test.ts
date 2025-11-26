import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth, User, LoginCredentials, RegisterData } from '../hooks/useAuth';

// -----------------------------------------------------
// Mock fetch
// -----------------------------------------------------
beforeEach(() => {
  vi.restoreAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

// -----------------------------------------------------
// Datos de prueba
// -----------------------------------------------------
const mockUser: User = {
  id: '1',
  nombre: 'Juan',
  email: 'juan@mail.com',
  rol: 'OPERARIO',
};

const mockToken = 'mock_token';

// -----------------------------------------------------
// Suite
// -----------------------------------------------------
describe('useAuth hook', () => {
  it('login exitoso', async () => {
    const credentials: LoginCredentials = { email: 'test@mail.com', password: '1234' };

    // Mock login
    vi.stubGlobal('fetch', vi.fn()
      // primera llamada: /login
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: mockToken }),
      })
      // segunda llamada: /me
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })
    );

    const { result } = renderHook(() => useAuth());

    const response = await act(async () => result.current.login(credentials));

    expect(response.success).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('telconova_token')).toBe(mockToken);
    expect(localStorage.getItem('telconova_user')).toBe(JSON.stringify(mockUser));
  });

  it('login falla por credenciales inválidas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error' }),
    }));

    const { result } = renderHook(() => useAuth());

    const response = await act(async () =>
      result.current.login({ email: 'x', password: 'y' })
    );

    expect(response.success).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('register exitoso', async () => {
    const data: RegisterData = {
      nombre: 'Juan',
      email: 'juan@mail.com',
      telefono: '12345678',
      numero_iden: '1001',
      password: '1234',
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
    }));

    const { result } = renderHook(() => useAuth());

    const response = await act(async () => result.current.register(data));

    expect(response.success).toBe(true);
  });

  it('logout limpia usuario y localStorage', () => {
    localStorage.setItem('telconova_token', mockToken);
    localStorage.setItem('telconova_user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    act(() => result.current.logout());

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('telconova_token')).toBeNull();
    expect(localStorage.getItem('telconova_user')).toBeNull();
  });

  it('verifyCode devuelve success=true con código correcto', async () => {
    const { result } = renderHook(() => useAuth());

    const response = await act(async () => result.current.verifyCode('123456'));
    expect(response.success).toBe(true);
  });

  it('verifyCode devuelve success=false con código incorrecto', async () => {
    const { result } = renderHook(() => useAuth());

    const response = await act(async () => result.current.verifyCode('000000'));
    expect(response.success).toBe(false);
  });
});