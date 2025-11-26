import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchOrders } from '../hooks/useFetchOrders';
import type { WorkOrder } from '../types';

//Mocks

const mockOrdersBackend = {
  content: [
    {
      idOrden: '1',
      nroOrden: '1001',
      idCliente: '2',
      cliente: { city: "Medellin",
                department: "Antioquia",
                country: "Colombia",
                email: "usertest123@gmail.com",
                id: "2",
                name: "Usuario 2",
                identification: "54321",
                phone: "345543345",
                address: "Calle 21",
                createdAt: new Date("2025-11-20"),
                updatedAt: new Date("2025-11-20") },
      nombreTipoServicio: 'INSTALACION',
      estado: 'ACTIVA',
      prioridad: 'ALTA',
      descripcion: 'Orden de prueba',
      creadaEn: '2025-11-25T12:00:00Z',
    },
    {
      idOrden: '2',
      nroOrden: '1002',
      idCliente: '1',
      cliente: { city: "Medellin",
                department: "Antioquia",
                country: "Colombia",
                email: "usertest@gmail.com",
                id: "1",
                name: "Usuario 1",
                identification: "12345",
                phone: "321321321",
                address: "Calle 19",
                createdAt: new Date("2025-11-20"),
                updatedAt: new Date("2025-11-20") },
      nombreTipoServicio: 'REPARACION',
      estado: 'CERRADA',
      prioridad: 'MEDIA',
      descripcion: 'Otra orden',
      creadaEn: '2025-11-24T08:30:00Z',
    },
  ],
};

const mappedOrders: WorkOrder[] = [
  {
    id: '1',
    orderNumber: '1001',
    clientId: '2',
    client: { city: "Medellin",
                department: "Antioquia",
                country: "Colombia",
                email: "usertest123@gmail.com",
                id: "2",
                name: "Usuario 2",
                identification: "54321",
                phone: "345543345",
                address: "Calle 21",
                createdAt: new Date("2025-11-20"),
                updatedAt: new Date("2025-11-20") },
    activity: 'Instalación',
    status: 'Abierta',
    priority: 'Alta',
    description: 'Orden de prueba',
    createdAt: new Date('2025-11-25T12:00:00Z'),
    updatedAt: expect.any(Date),
    responsibleUserId: 'N/A',
  },
  {
    id: '2',
    orderNumber: '1002',
    clientId: '1',
    client: { city: "Medellin",
                department: "Antioquia",
                country: "Colombia",
                email: "usertest@gmail.com",
                id: "1",
                name: "Usuario 1",
                identification: "12345",
                phone: "321321321",
                address: "Calle 19",
                createdAt: new Date("2025-11-20"),
                updatedAt: new Date("2025-11-20") },
    activity: 'Reparación',
    status: 'Cerrada',
    priority: 'Media',
    description: 'Otra orden',
    createdAt: new Date('2025-11-24T08:30:00Z'),
    updatedAt: expect.any(Date),
    responsibleUserId: 'N/A',
  },
];

//Tests

describe('useFetchOrders hook', () => {
  beforeEach(() => {
    localStorage.setItem('telconova_token', 'mock_token');
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('retorna las órdenes correctamente mapeadas y las guarda en localStorage', async () => {
    //Arrange and Act
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => mockOrdersBackend,
    })));

    const { result } = renderHook(() => useFetchOrders());

    await waitFor(() => expect(result.current.length).toBe(2));

    //Assert
    expect(result.current).toEqual(mappedOrders);

    const saved = JSON.parse(localStorage.getItem('telconova_work_orders') || '[]');
    expect(saved.length).toBe(2);
    expect(saved[0].activity).toBe('Instalación');
    expect(saved[1].status).toBe('Cerrada');
  });

  it('retorna arreglo vacío si no hay token', () => {
    //Arrange and Act
    localStorage.removeItem('telconova_token');

    const { result } = renderHook(() => useFetchOrders());

    //Assert
    expect(result.current).toEqual([]);
  });

  it('maneja valores desconocidos sin fallar', async () => {
    //Arrange and Act
    const mockUnknown = {
      content: [
        { 
          idOrden: '3',
          nroOrden: '1003',
          idCliente: 'C3',
          cliente: 'Cliente 3',
          nombreTipoServicio: 'DESCONOCIDO',
          estado: 'DESCONOCIDO',
          prioridad: 'DESCONOCIDO',
          descripcion: 'Orden rara',
          creadaEn: '2025-11-23T10:00:00Z',
        }
      ]
    };

    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => mockUnknown,
    })));

    const { result } = renderHook(() => useFetchOrders());

    await waitFor(() => expect(result.current.length).toBe(1));

    //Assert
    expect(result.current[0].activity).toBe('DESCONOCIDO');
    expect(result.current[0].status).toBe('DESCONOCIDO');
    expect(result.current[0].priority).toBe('DESCONOCIDO');
  });
});