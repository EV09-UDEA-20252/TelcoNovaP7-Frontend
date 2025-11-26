import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth, User, LoginCredentials, RegisterData } from '../hooks/useAuth';

//Mocks

beforeEach(() => {
  vi.restoreAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

const mockUser: User = {
  id: '1',
  nombre: 'Juan',
  email: 'juan@mail.com',
  rol: 'OPERARIO',
};

const mockToken = 'mock_token';

//Tests

describe('useAuth hook', () => {
  it('login exitoso', async () => {
    //Arrange and Act
    const credentials: LoginCredentials = { email: 'test@mail.com', password: '1234' };

    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: mockToken }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })
    );

    const { result } = renderHook(() => useAuth());

    const response = await act(async () => result.current.login(credentials));

    //Assert
    expect(response.success).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('telconova_token')).toBe(mockToken);
    expect(localStorage.getItem('telconova_user')).toBe(JSON.stringify(mockUser));
  });

  it('login falla por credenciales inválidas', async () => {
    //Arrange and Act
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Error' }),
    }));

    const { result } = renderHook(() => useAuth());

    const response = await act(async () =>
      result.current.login({ email: 'x', password: 'y' })
    );

    //Assert
    expect(response.success).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('register exitoso', async () => {
    //Arrange and Act
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

    //Assert
    expect(response.success).toBe(true);
  });

  it('logout limpia usuario y localStorage', () => {
    //Arrange
    localStorage.setItem('telconova_token', mockToken);
    localStorage.setItem('telconova_user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    //Act
    act(() => result.current.logout());

    //Assert
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('telconova_token')).toBeNull();
    expect(localStorage.getItem('telconova_user')).toBeNull();
  });

  it('verifyCode devuelve success=true con código correcto', async () => {
    //Arrange and Act
    const { result } = renderHook(() => useAuth());

    const response = await act(async () => result.current.verifyCode('123456'));

    //Assert
    expect(response.success).toBe(true);
  });

  it('verifyCode devuelve success=false con código incorrecto', async () => {
    //Arrange and Act
    const { result } = renderHook(() => useAuth());

    const response = await act(async () => result.current.verifyCode('000000'));

    //Assert
    expect(response.success).toBe(false);
  });
});