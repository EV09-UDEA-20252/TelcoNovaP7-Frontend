import { FormErrors, ValidationResult } from '../types';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function validateIdentification(identification: string): boolean {
  const idRegex = /^\d+$/;
  return idRegex.test(identification) && identification.length >= 6;
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: FormErrors = {};

  if (!validateRequired(email)) {
    errors.email = 'El email es requerido';
  } else if (!validateEmail(email)) {
    errors.email = 'Email inválido';
  }

  if (!validateRequired(password)) {
    errors.password = 'La contraseña es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateRegisterForm(nombre: string, numero_iden: string, email: string, cellphone: string, password: string): ValidationResult {
  const errors: FormErrors = {};

  if (!validateRequired(nombre)) errors.nombre = 'El nombre es requerido';
  if (!validateRequired(numero_iden)) errors.numero_iden = 'El número de identificación es requerido';
  else if (!validatePhone(numero_iden)) errors.numero_iden = 'Formato inválido';

  if (!validateRequired(email)) errors.email = 'El email es requerido';
  else if (!validateEmail(email)) errors.email = 'Email inválido';

  if (!validateRequired(password)) errors.password = 'La contraseña es requerida';
  else if (!validatePassword(password)) errors.password = 'La contraseña debe tener al menos 8 caracteres';

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateClientForm(name: string, identification: string, phone: string, address: string): ValidationResult {
  const errors: FormErrors = {};

  if (!validateRequired(name)) {
    errors.name = 'El nombre es requerido';
  }

  if (!validateRequired(identification)) {
    errors.identification = 'La identificación es requerida';
  } else if (!validateIdentification(identification)) {
    errors.identification = 'La identificación debe contener solo números y al menos 6 dígitos';
  }

  if (!validateRequired(phone)) {
    errors.phone = 'El teléfono es requerido';
  } else if (!validatePhone(phone)) {
    errors.phone = 'Formato de teléfono inválido';
  }

  if (!validateRequired(address)) {
    errors.address = 'La dirección es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateWorkOrderForm(
  activity: string,
  priority: string,
  clientId: string,
  description: string
): ValidationResult {
  const errors: FormErrors = {};

  if (!validateRequired(activity)) {
    errors.activity = 'La actividad es requerida';
  }

  if (!validateRequired(priority)) {
    errors.priority = 'La prioridad es requerida';
  }

  if (!validateRequired(clientId)) {
    errors.clientId = 'Debe seleccionar un cliente';
  }

  if (!validateRequired(description)) {
    errors.description = 'La descripción es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}