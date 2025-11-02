export interface Client {
  city: string;
  department: string;
  country: string;
  email: string;
  id: string;
  name: string;
  identification: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  clientId: string;
  client?: Client;
  activity: 'Instalación' | 'Reparación' | 'Mantenimiento';
  priority: 'Alta' | 'Media' | 'Baja';
  status: 'Abierta' | 'En progreso' | 'Cerrada';
  description: string;
  responsibleUserId: string;
  ownerUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}