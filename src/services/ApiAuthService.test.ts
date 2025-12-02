import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ApiAuthService } from './ApiAuthService'

//Mocks
const mockFetch = vi.fn()
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

describe('ApiAuthService', () => {
  let authService: ApiAuthService

  beforeEach(() => {
    global.fetch = mockFetch
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    vi.stubEnv('VITE_API_URL', 'http://localhost:3000')

    vi.clearAllMocks()
    authService = new ApiAuthService()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  //Tests

  describe('login', () => {
    const mockEmail = 'test@example.com'
    const mockPassword = 'password123'

    it('debe realizar login exitoso y guardar token en localStorage', async () => {
      //Arrange
      const mockResponse = {
        accessToken: 'fake-token-123',
        user: { id: 1, email: mockEmail, name: 'Test User' },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      //Act
      const result = await authService.login(mockEmail, mockPassword)

      //Assert
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: mockEmail, password: mockPassword }),
        }
      )

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'telconova_token',
        mockResponse.accessToken
      )

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'telconova_user',
        JSON.stringify(mockResponse.user)
      )

      expect(result).toEqual({
        success: true,
        token: mockResponse.accessToken,
      })
    })

    it('debe manejar error de credenciales incorrectas', async () => {
      //Arrange
      const errorMessage = 'Credenciales inválidas'
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: errorMessage }),
      } as Response)

      //Act
      const result = await authService.login(mockEmail, mockPassword)

      //Assert
      expect(result).toEqual({
        success: false,
        message: errorMessage,
      })
      expect(window.localStorage.setItem).not.toHaveBeenCalled()
    })

    it('debe manejar error de conexión', async () => {
      //Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      //Act
      const result = await authService.login(mockEmail, mockPassword)

      //Assert
      expect(result).toEqual({
        success: false,
        message: 'Error de conexión',
      })
      expect(window.localStorage.setItem).not.toHaveBeenCalled()
    })

    it('debe usar mensaje por defecto cuando no hay mensaje en respuesta de error', async () => {
      //Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      } as Response)

      //Act
      const result = await authService.login(mockEmail, mockPassword)

      //Assert
      expect(result).toEqual({
        success: false,
        message: 'Error en el inicio de sesión',
      })
    })
  })
})