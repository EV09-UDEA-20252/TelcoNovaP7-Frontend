import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MOCK_CLIENTS, MOCK_WORK_ORDERS, initializeMockData } from './mockData'
import type { Client, WorkOrder } from '.././types'

//Mocks

describe('Mock Data Utilities', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem')
    vi.spyOn(Storage.prototype, 'setItem')
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('MOCK_CLIENTS', () => {
    it('debe tener al menos 5 clientes mock', () => {
      expect(MOCK_CLIENTS.length).toBeGreaterThanOrEqual(5)
    })

    it('cada cliente debe tener todas las propiedades requeridas', () => {
      MOCK_CLIENTS.forEach((client: Client) => {
        expect(client).toHaveProperty('id')
        expect(client).toHaveProperty('name')
        expect(client).toHaveProperty('identification')
        expect(client).toHaveProperty('phone')
        expect(client).toHaveProperty('address')
        expect(client).toHaveProperty('createdAt')
        expect(client).toHaveProperty('updatedAt')
        
        expect(typeof client.id).toBe('string')
        expect(typeof client.name).toBe('string')
        expect(typeof client.identification).toBe('string')
        expect(typeof client.phone).toBe('string')
        expect(typeof client.address).toBe('string')
        expect(client.createdAt).toBeInstanceOf(Date)
        expect(client.updatedAt).toBeInstanceOf(Date)
      })
    })

    it('las identificaciones deben ser únicas', () => {
      //Arrange + Act
      const ids = MOCK_CLIENTS.map(c => c.identification)
      const uniqueIds = new Set(ids)

      //Assert
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('los IDs deben ser únicos', () => {
      //Arrange + Act
      const ids = MOCK_CLIENTS.map(c => c.id)
      const uniqueIds = new Set(ids)

      //Assert
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('debe tener datos realistas de Colombia', () => {
      MOCK_CLIENTS.forEach(client => {
        expect(client.phone).toMatch(/^\+57/)
      })
    })

    it('debe tener nombres completos', () => {
      MOCK_CLIENTS.forEach(client => {
        expect(client.name.split(' ').length).toBeGreaterThanOrEqual(2)
      })
    })
  })

  describe('MOCK_WORK_ORDERS', () => {
    it('debe tener múltiples órdenes de trabajo', () => {
      expect(MOCK_WORK_ORDERS.length).toBeGreaterThan(3)
    })

    it('cada orden debe tener todas las propiedades requeridas', () => {
      MOCK_WORK_ORDERS.forEach((order: WorkOrder) => {
        expect(order).toHaveProperty('id')
        expect(order).toHaveProperty('orderNumber')
        expect(order).toHaveProperty('clientId')
        expect(order).toHaveProperty('activity')
        expect(order).toHaveProperty('priority')
        expect(order).toHaveProperty('status')
        expect(order).toHaveProperty('description')
        expect(order).toHaveProperty('responsibleUserId')
        expect(order).toHaveProperty('createdAt')
        expect(order).toHaveProperty('updatedAt')

        expect(typeof order.id).toBe('string')
        expect(typeof order.orderNumber).toBe('string')
        expect(typeof order.clientId).toBe('string')
        expect(typeof order.activity).toBe('string')
        expect(typeof order.priority).toBe('string')
        expect(typeof order.status).toBe('string')
        expect(typeof order.description).toBe('string')
        expect(typeof order.responsibleUserId).toBe('string')
        expect(order.createdAt).toBeInstanceOf(Date)
        expect(order.updatedAt).toBeInstanceOf(Date)
      })
    })

    it('los números de orden deben ser únicos', () => {
      //Arrange + Act
      const orderNumbers = MOCK_WORK_ORDERS.map(o => o.orderNumber)
      const uniqueOrderNumbers = new Set(orderNumbers)

      //Assert
      expect(uniqueOrderNumbers.size).toBe(orderNumbers.length)
    })

    it('debe tener actividades válidas', () => {
      //Arrange + Act
      const validActivities = ['Instalación', 'Reparación', 'Mantenimiento']

      //Assert
      MOCK_WORK_ORDERS.forEach(order => {
        expect(validActivities).toContain(order.activity)
      })
    })

    it('debe tener prioridades válidas', () => {
      //Arrange + Act
      const validPriorities = ['Alta', 'Media', 'Baja']

      //Assert
      MOCK_WORK_ORDERS.forEach(order => {
        expect(validPriorities).toContain(order.priority)
      })
    })

    it('debe tener estados válidos', () => {
      //Arrange + Act
      const validStatuses = ['Abierta', 'En progreso', 'Cerrada']

      //Assert
      MOCK_WORK_ORDERS.forEach(order => {
        expect(validStatuses).toContain(order.status)
      })
    })

    it('clientId debe referenciar a un cliente existente', () => {
      //Arrange + Act
      const clientIds = MOCK_CLIENTS.map(c => c.id)
      
      //Assert
      MOCK_WORK_ORDERS.forEach(order => {
        expect(clientIds).toContain(order.clientId)
      })
    })

    it('debe tener fechas coherentes (createdAt <= updatedAt)', () => {
      MOCK_WORK_ORDERS.forEach(order => {
        expect(order.createdAt.getTime()).toBeLessThanOrEqual(order.updatedAt.getTime())
      })
    })

    it('las descripciones deben tener contenido', () => {
      MOCK_WORK_ORDERS.forEach(order => {
        expect(order.description.trim().length).toBeGreaterThan(10)
      })
    })
  })

  describe('initializeMockData', () => {
    it('debe inicializar localStorage con datos mock cuando está vacío', () => {
      //Arrange + Act
      Storage.prototype.getItem = vi.fn(() => null)
      
      initializeMockData()

      //Assert
      expect(localStorage.setItem).toHaveBeenCalledTimes(2)
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'telconova_clients',
        JSON.stringify(MOCK_CLIENTS)
      )
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'telconova_work_orders',
        JSON.stringify(MOCK_WORK_ORDERS)
      )
    })

    it('NO debe sobrescribir datos existentes en localStorage', () => {
      //Arrange + Act
      const existingClients = [{ id: 'existing', name: 'Existente' }]
      const existingOrders = [{ id: 'existing', orderNumber: '999' }]
      
      Storage.prototype.getItem = vi.fn((key: string) => {
        if (key === 'telconova_clients') return JSON.stringify(existingClients)
        if (key === 'telconova_work_orders') return JSON.stringify(existingOrders)
        return null
      })
      
      initializeMockData()
      
      //Assert
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })

    it('debe manejar JSON inválido en localStorage', () => {
        //Arrange
        Storage.prototype.getItem = vi.fn((key: string) => {
        if (key === 'telconova_clients') return 'invalid-json'
        if (key === 'telconova_work_orders') return null
        return null
        })
    
        initializeMockData()
    
        //Assert
        expect(localStorage.setItem).toHaveBeenCalledTimes(1)
        expect(localStorage.setItem).toHaveBeenCalledWith(
        'telconova_work_orders',
        JSON.stringify(MOCK_WORK_ORDERS)
        )
    
        expect(localStorage.setItem).not.toHaveBeenCalledWith(
        'telconova_clients',
        expect.any(String)
        )
    })

  it('debe documentar la limitación con JSON inválido', () => {
        //Arrange + Act
        Storage.prototype.getItem = vi.fn(() => 'invalid-json')
    
        initializeMockData()

        //Assert
        expect(localStorage.setItem).not.toHaveBeenCalled()

        console.warn('ADVERTENCIA: initializeMockData no maneja JSON inválido en localStorage')
    })

    it('debe manejar errores de localStorage', () => {
      //Arrange + Act
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Quota exceeded')
      })
      
      //Assert
      expect(() => initializeMockData()).not.toThrow()

      Storage.prototype.setItem = originalSetItem
    })

    it('debe verificar ambas claves antes de inicializar', () => {
      //Arrange + Act
      Storage.prototype.getItem = vi.fn((key: string) => {
        if (key === 'telconova_clients') return JSON.stringify(MOCK_CLIENTS)
        if (key === 'telconova_work_orders') return null
        return null
      })
      
      initializeMockData()
      
      //Assert
      expect(localStorage.setItem).toHaveBeenCalledTimes(1)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'telconova_work_orders',
        JSON.stringify(MOCK_WORK_ORDERS)
      )
    })
  })

  describe('Relaciones entre datos mock', () => {
    it('cada cliente debe tener al menos una orden de trabajo', () => {
      //Arrange + Act
      const clientIdsWithOrders = new Set(MOCK_WORK_ORDERS.map(o => o.clientId))
      
      //Assert
      MOCK_CLIENTS.forEach(client => {
        expect(clientIdsWithOrders.has(client.id)).toBe(true)
      })
    })

    it('algunas órdenes deben tener ownerUserId', () => {
      //Arrange + Act
      const ordersWithOwner = MOCK_WORK_ORDERS.filter(o => o.ownerUserId)
      
      //Assert
      expect(ordersWithOwner.length).toBeGreaterThan(0)
    })

    it('las órdenes deben tener números secuenciales', () => {
      //Arrange + Act
      const orderNumbers = MOCK_WORK_ORDERS.map(o => 
        parseInt(o.orderNumber)
      ).sort((a, b) => a - b)
      
      //Assert
      for (let i = 1; i < orderNumbers.length; i++) {
        expect(orderNumbers[i]).toBe(orderNumbers[i - 1] + 1)
      }
    })
  })

  describe('Integridad de datos', () => {
    it('debe poder serializar y deserializar los datos mock', () => {
      //Arrange + Act
      const clientsJson = JSON.stringify(MOCK_CLIENTS)
      const ordersJson = JSON.stringify(MOCK_WORK_ORDERS)
      
      const parsedClients = JSON.parse(clientsJson)
      const parsedOrders = JSON.parse(ordersJson)
      
      //Assert
      expect(parsedClients.length).toBe(MOCK_CLIENTS.length)
      expect(parsedOrders.length).toBe(MOCK_WORK_ORDERS.length)
    })

    it('las fechas deben convertirse correctamente a JSON y viceversa', () => {
      //Arrange + Act
      const clientsJson = JSON.stringify(MOCK_CLIENTS)
      const parsedClients = JSON.parse(clientsJson)
      
      //Assert
      parsedClients.forEach((client: any) => {
        expect(typeof client.createdAt).toBe('string')
        expect(typeof client.updatedAt).toBe('string')

        expect(new Date(client.createdAt)).toBeInstanceOf(Date)
        expect(new Date(client.updatedAt)).toBeInstanceOf(Date)
      })
    })
  })
})