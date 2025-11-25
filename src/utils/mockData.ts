import { Client, WorkOrder } from '../types';

// Mock clients for demo
export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'María García López',
    identification: '12345678',
    phone: '+57 300 111 2222',
    address: 'Calle 123 #45-67, Bogotá',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Carlos Rodríguez Morales',
    identification: '87654321',
    phone: '+57 301 333 4444',
    address: 'Carrera 89 #12-34, Medellín',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Ana Sofía Martínez',
    identification: '45678912',
    phone: '+57 302 555 6666',
    address: 'Avenida 56 #78-90, Cali',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: '4',
    name: 'Luis Fernando Herrera',
    identification: '78912345',
    phone: '+57 303 777 8888',
    address: 'Diagonal 34 #56-78, Barranquilla',
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-03-25')
  },
  {
    id: '5',
    name: 'Patricia Jiménez Silva',
    identification: '32165498',
    phone: '+57 304 999 0000',
    address: 'Transversal 12 #34-56, Cartagena',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05')
  }
];

// Mock work orders for demo
export const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: '1',
    orderNumber: '001',
    clientId: '1',
    activity: 'Instalación',
    priority: 'Alta',
    status: 'En progreso',
    description: 'Instalación de fibra óptica en residencia. Configuración de router y pruebas de conectividad.',
    responsibleUserId: '1',
    ownerUserId: '2',
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-09-21')
  },
  {
    id: '2',
    orderNumber: '002',
    clientId: '2',
    activity: 'Reparación',
    priority: 'Media',
    status: 'Abierta',
    description: 'Reparación de intermitencia en el servicio de internet. Revisar cables y conexiones.',
    responsibleUserId: '2',
    createdAt: new Date('2024-09-21'),
    updatedAt: new Date('2024-09-21')
  },
  {
    id: '3',
    orderNumber: '003',
    clientId: '3',
    activity: 'Mantenimiento',
    priority: 'Baja',
    status: 'Cerrada',
    description: 'Mantenimiento preventivo del equipo de telecomunicaciones. Limpieza y actualización de firmware.',
    responsibleUserId: '1',
    createdAt: new Date('2024-09-18'),
    updatedAt: new Date('2024-09-19')
  },
  {
    id: '4',
    orderNumber: '004',
    clientId: '4',
    activity: 'Instalación',
    priority: 'Alta',
    status: 'Abierta',
    description: 'Nueva instalación de servicio empresarial. Requiere configuración de VLAN y QoS.',
    responsibleUserId: '2',
    createdAt: new Date('2024-09-22'),
    updatedAt: new Date('2024-09-22')
  },
  {
    id: '5',
    orderNumber: '005',
    clientId: '5',
    activity: 'Reparación',
    priority: 'Alta',
    status: 'En progreso',
    description: 'Servicio completamente caído. Revisar infrastructure externa y equipos.',
    responsibleUserId: '1',
    ownerUserId: '2',
    createdAt: new Date('2024-09-23'),
    updatedAt: new Date('2024-09-23')
  },
  {
    id: '6',
    orderNumber: '006',
    clientId: '1',
    activity: 'Mantenimiento',
    priority: 'Media',
    status: 'Cerrada',
    description: 'Actualización de configuración de seguridad y cambio de contraseñas.',
    responsibleUserId: '2',
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-16')
  },
  {
    id: '7',
    orderNumber: '007',
    clientId: '3',
    activity: 'Reparación',
    priority: 'Media',
    status: 'Abierta',
    description: 'Problemas de velocidad en horas pico. Análisis de tráfico y optimización.',
    responsibleUserId: '1',
    createdAt: new Date('2024-09-23'),
    updatedAt: new Date('2024-09-23')
  },
  {
    id: '8',
    orderNumber: '008',
    clientId: '4',
    activity: 'Instalación',
    priority: 'Baja',
    status: 'Abierta',
    description: 'Instalación de punto adicional en oficina. Extensión de red interna.',
    responsibleUserId: '2',
    createdAt: new Date('2024-09-22'),
    updatedAt: new Date('2024-09-22')
  }
];

// Initialize localStorage with mock data if not present
export function initializeMockData() {
  if (!localStorage.getItem('telconova_clients')) {
    localStorage.setItem('telconova_clients', JSON.stringify(MOCK_CLIENTS));
  }
  
  if (!localStorage.getItem('telconova_work_orders')) {
    localStorage.setItem('telconova_work_orders', JSON.stringify(MOCK_WORK_ORDERS));
  }
}