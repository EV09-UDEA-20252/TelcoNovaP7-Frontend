import { describe, it, expect } from 'vitest'
import { mapBackendOrderToWorkOrder } from './mappers'

describe('mapBackendOrderToWorkOrder', () => {
  it('debe mapear correctamente una orden del backend con todos los campos', () => {
    const backendData = {
      idOrden: 123,
      nroOrden: 'ORD-2024-001',
      idCliente: 456,
      cliente: 'Juan Pérez',
      tipoServicio: 'INSTALACIÓN',
      prioridad: 'ALTA',
      estado: 'ACTIVA',
      creadaEn: '2024-09-25T10:30:00Z',
      actualizadaEn: '2024-09-26T14:45:00Z'
    }

    const result = mapBackendOrderToWorkOrder(backendData)

    expect(result).toEqual({
      id: 123,
      orderNumber: 'ORD-2024-001',
      clientId: 456,
      clientName: 'Juan Pérez',
      activity: 'Instalación',
      priority: 'Alta',
      status: 'Abierta',
      description: '',
      createdAt: '2024-09-25T10:30:00Z',
      updatedAt: '2024-09-25T10:30:00Z' // Nota: usa creadaEn para ambos
    })
  })

  describe('Mapeo de tipoServicio a activity', () => {
    it('debe mapear "INSTALACIÓN" a "Instalación"', () => {
      const backendData = {
        idOrden: 1,
        nroOrden: 'ORD-001',
        idCliente: 1,
        cliente: 'Test',
        tipoServicio: 'INSTALACIÓN',
        prioridad: 'MEDIA',
        estado: 'ACTIVA',
        creadaEn: '2024-01-01T00:00:00Z'
      }

      const result = mapBackendOrderToWorkOrder(backendData)
      expect(result.activity).toBe('Instalación')
    })

    it('debe mapear "REPARACION" a "Reparación"', () => {
      const backendData = {
        idOrden: 1,
        nroOrden: 'ORD-001',
        idCliente: 1,
        cliente: 'Test',
        tipoServicio: 'REPARACION',
        prioridad: 'MEDIA',
        estado: 'ACTIVA',
        creadaEn: '2024-01-01T00:00:00Z'
      }

      const result = mapBackendOrderToWorkOrder(backendData)
      expect(result.activity).toBe('Reparación')
    })

    it('debe mapear cualquier otro valor a "Mantenimiento"', () => {
      const casos = [
        'MANTENIMIENTO',
        'OTRO_VALOR',
        '',
        null,
        undefined,
        'cualquier cosa'
      ]

      casos.forEach(tipoServicio => {
        const backendData = {
          idOrden: 1,
          nroOrden: 'ORD-001',
          idCliente: 1,
          cliente: 'Test',
          tipoServicio,
          prioridad: 'MEDIA',
          estado: 'ACTIVA',
          creadaEn: '2024-01-01T00:00:00Z'
        }

        const result = mapBackendOrderToWorkOrder(backendData as any)
        expect(result.activity).toBe('Mantenimiento')
      })
    })
  })

  describe('Mapeo de prioridad', () => {
    it('debe mapear "ALTA" a "Alta"', () => {
      const backendData = {
        idOrden: 1,
        nroOrden: 'ORD-001',
        idCliente: 1,
        cliente: 'Test',
        tipoServicio: 'INSTALACIÓN',
        prioridad: 'ALTA',
        estado: 'ACTIVA',
        creadaEn: '2024-01-01T00:00:00Z'
      }

      const result = mapBackendOrderToWorkOrder(backendData)
      expect(result.priority).toBe('Alta')
    })

    it('debe mapear "MEDIA" a "Media"', () => {
      const backendData = {
        idOrden: 1,
        nroOrden: 'ORD-001',
        idCliente: 1,
        cliente: 'Test',
        tipoServicio: 'INSTALACIÓN',
        prioridad: 'MEDIA',
        estado: 'ACTIVA',
        creadaEn: '2024-01-01T00:00:00Z'
      }

      const result = mapBackendOrderToWorkOrder(backendData)
      expect(result.priority).toBe('Media')
    })

    it('debe mapear cualquier otro valor a "Baja"', () => {
      const casos = [
        'BAJA',
        'OTRA_PRIORIDAD',
        '',
        null,
        undefined,
        'cualquier cosa'
      ]

      casos.forEach(prioridad => {
        const backendData = {
          idOrden: 1,
          nroOrden: 'ORD-001',
          idCliente: 1,
          cliente: 'Test',
          tipoServicio: 'INSTALACIÓN',
          prioridad,
          estado: 'ACTIVA',
          creadaEn: '2024-01-01T00:00:00Z'
        }

        const result = mapBackendOrderToWorkOrder(backendData as any)
        expect(result.priority).toBe('Baja')
      })
    })
  })

  describe('Mapeo de estado', () => {
    it('debe mapear "ACTIVA" a "Abierta"', () => {
      const backendData = {
        idOrden: 1,
        nroOrden: 'ORD-001',
        idCliente: 1,
        cliente: 'Test',
        tipoServicio: 'INSTALACIÓN',
        prioridad: 'MEDIA',
        estado: 'ACTIVA',
        creadaEn: '2024-01-01T00:00:00Z'
      }

      const result = mapBackendOrderToWorkOrder(backendData)
      expect(result.status).toBe('Abierta')
    })

    it('debe mapear "EN_PROGRESO" a "En progreso"', () => {
      const backendData = {
        idOrden: 1,
        nroOrden: 'ORD-001',
        idCliente: 1,
        cliente: 'Test',
        tipoServicio: 'INSTALACIÓN',
        prioridad: 'MEDIA',
        estado: 'EN_PROGRESO',
        creadaEn: '2024-01-01T00:00:00Z'
      }

      const result = mapBackendOrderToWorkOrder(backendData)
      expect(result.status).toBe('En progreso')
    })

    it('debe mapear cualquier otro valor a "Cerrada"', () => {
      const casos = [
        'CERRADA',
        'COMPLETADA',
        'CANCELADA',
        '',
        null,
        undefined,
        'otro estado'
      ]

      casos.forEach(estado => {
        const backendData = {
          idOrden: 1,
          nroOrden: 'ORD-001',
          idCliente: 1,
          cliente: 'Test',
          tipoServicio: 'INSTALACIÓN',
          prioridad: 'MEDIA',
          estado,
          creadaEn: '2024-01-01T00:00:00Z'
        }

        const result = mapBackendOrderToWorkOrder(backendData as any)
        expect(result.status).toBe('Cerrada')
      })
    })
  })

  describe('Campos siempre presentes', () => {
    it('siempre debe retornar description como string vacío', () => {
      const backendData = {
        idOrden: 1,
        nroOrden: 'ORD-001',
        idCliente: 1,
        cliente: 'Test',
        tipoServicio: 'INSTALACIÓN',
        prioridad: 'MEDIA',
        estado: 'ACTIVA',
        creadaEn: '2024-01-01T00:00:00Z'
      }

      const result = mapBackendOrderToWorkOrder(backendData)
      expect(result.description).toBe('')
    })

    it('siempre debe usar creadaEn para createdAt y updatedAt', () => {
      const backendData = {
        idOrden: 1,
        nroOrden: 'ORD-001',
        idCliente: 1,
        cliente: 'Test',
        tipoServicio: 'INSTALACIÓN',
        prioridad: 'MEDIA',
        estado: 'ACTIVA',
        creadaEn: '2024-01-01T10:30:45Z',
        actualizadaEn: '2024-01-02T15:45:30Z' // Este campo se ignora
      }

      const result = mapBackendOrderToWorkOrder(backendData)
      expect(result.createdAt).toBe('2024-01-01T10:30:45Z')
      expect(result.updatedAt).toBe('2024-01-01T10:30:45Z') // No usa actualizadaEn
    })
  })

  describe('Edge cases y valores problemáticos', () => {
    it('debe manejar datos mínimos', () => {
      const backendData = {
        idOrden: 999,
        nroOrden: 'TEST',
        idCliente: 888,
        cliente: 'Cliente Mínimo',
        creadaEn: '2024-01-01T00:00:00Z'
      }

      const result = mapBackendOrderToWorkOrder(backendData as any)

      expect(result).toEqual({
        id: 999,
        orderNumber: 'TEST',
        clientId: 888,
        clientName: 'Cliente Mínimo',
        activity: 'Mantenimiento', // Valor por defecto
        priority: 'Baja', // Valor por defecto
        status: 'Cerrada', // Valor por defecto
        description: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      })
    })

    it('debe mantener tipos de datos originales para id y clientId', () => {
      const backendData = {
        idOrden: '123', // string en lugar de number
        nroOrden: 'ORD-001',
        idCliente: '456', // string en lugar de number
        cliente: 'Test',
        tipoServicio: 'INSTALACIÓN',
        prioridad: 'MEDIA',
        estado: 'ACTIVA',
        creadaEn: '2024-01-01T00:00:00Z'
      }

      const result = mapBackendOrderToWorkOrder(backendData as any)

      expect(typeof result.id).toBe('string')
      expect(result.id).toBe('123')
      expect(typeof result.clientId).toBe('string')
      expect(result.clientId).toBe('456')
    })

    it('debe manejar valores null/undefined en campos opcionales', () => {
      const backendData = {
        idOrden: 1,
        nroOrden: null,
        idCliente: 2,
        cliente: undefined,
        creadaEn: null
      }

      const result = mapBackendOrderToWorkOrder(backendData as any)

      expect(result.orderNumber).toBe(null)
      expect(result.clientName).toBe(undefined)
      expect(result.createdAt).toBe(null)
      expect(result.updatedAt).toBe(null)
    })

    it('debe mantener espacios y formato en cliente name', () => {
      const casos = [
        '  Cliente con espacios  ', // espacios al inicio/fin
        'Cliente\ncon\nsaltos', // saltos de línea
        'Cliente\tcon\ttabs', // tabs
        'Cliente con  dobles  espacios' // dobles espacios
      ]

      casos.forEach(cliente => {
        const backendData = {
          idOrden: 1,
          nroOrden: 'ORD-001',
          idCliente: 1,
          cliente,
          tipoServicio: 'INSTALACIÓN',
          prioridad: 'MEDIA',
          estado: 'ACTIVA',
          creadaEn: '2024-01-01T00:00:00Z'
        }

        const result = mapBackendOrderToWorkOrder(backendData)
        expect(result.clientName).toBe(cliente)
      })
    })

    it('debe manejar nroOrden con diferentes formatos', () => {
      const formatos = [
        'ORD-2024-001',
        'WO-12345',
        '12345',
        '2024/09/001',
        'SRV-001-2024'
      ]

      formatos.forEach(nroOrden => {
        const backendData = {
          idOrden: 1,
          nroOrden,
          idCliente: 1,
          cliente: 'Test',
          tipoServicio: 'INSTALACIÓN',
          prioridad: 'MEDIA',
          estado: 'ACTIVA',
          creadaEn: '2024-01-01T00:00:00Z'
        }

        const result = mapBackendOrderToWorkOrder(backendData)
        expect(result.orderNumber).toBe(nroOrden)
      })
    })
  })

  describe('Comportamiento específico observado', () => {
    it('NO usa el campo actualizadaEn del backend', () => {
      // Esto podría ser un bug o una decisión de diseño
      const backendData = {
        idOrden: 1,
        nroOrden: 'ORD-001',
        idCliente: 1,
        cliente: 'Test',
        tipoServicio: 'INSTALACIÓN',
        prioridad: 'MEDIA',
        estado: 'ACTIVA',
        creadaEn: '2024-01-01T00:00:00Z',
        actualizadaEn: '2024-12-31T23:59:59Z' // Mucho después
      }

      const result = mapBackendOrderToWorkOrder(backendData)

      // updatedAt debería ser igual a createdAt, no a actualizadaEn
      expect(result.updatedAt).toBe('2024-01-01T00:00:00Z')
      expect(result.updatedAt).not.toBe('2024-12-31T23:59:59Z')
    })

    it('siempre retorna description vacío', () => {
      // El mapper no extrae descripción del backend
      const backendData = {
        idOrden: 1,
        nroOrden: 'ORD-001',
        idCliente: 1,
        cliente: 'Test',
        tipoServicio: 'INSTALACIÓN',
        prioridad: 'MEDIA',
        estado: 'ACTIVA',
        creadaEn: '2024-01-01T00:00:00Z',
        descripcion: 'Esta descripción se ignora' // Campo no mapeado
      }

      const result = mapBackendOrderToWorkOrder(backendData as any)
      expect(result.description).toBe('')
    })
  })
})