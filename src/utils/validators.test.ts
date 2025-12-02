import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  validateIdentification,
  validatePassword,
  validateRequired,
  validateLoginForm,
  validateRegisterForm,
  validateClientForm,
  validateWorkOrderForm
} from './validators'

//Tests

describe('Validators Unit Tests', () => {
  describe('validateEmail', () => {
    it('debe validar emails correctos', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co')).toBe(true)
      expect(validateEmail('user+tag@domain.com')).toBe(true)
    })

    it('debe rechazar emails incorrectos', () => {
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@example')).toBe(false)
      expect(validateEmail('test example.com')).toBe(false)
      expect(validateEmail('test@.com')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('debe validar teléfonos correctos', () => {
      expect(validatePhone('3001234567')).toBe(true)
      expect(validatePhone('+573001234567')).toBe(true)
      expect(validatePhone('(300) 123-4567')).toBe(true)
      expect(validatePhone('300 123 4567')).toBe(true)
      expect(validatePhone('57 300 1234567')).toBe(true)
    })

    it('debe rechazar teléfonos incorrectos', () => {
      expect(validatePhone('')).toBe(false)
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('abc')).toBe(false)
      expect(validatePhone('300-123-456')).toBe(true)
    })
  })

  describe('validateIdentification', () => {
    it('debe validar identificaciones correctas', () => {
      expect(validateIdentification('123456')).toBe(true)
      expect(validateIdentification('1234567890')).toBe(true)
      expect(validateIdentification('987654321')).toBe(true)
    })

    it('debe rechazar identificaciones incorrectas', () => {
      expect(validateIdentification('')).toBe(false)
      expect(validateIdentification('12345')).toBe(false)
      expect(validateIdentification('abc123')).toBe(false)
      expect(validateIdentification('12.345.678')).toBe(false)
      expect(validateIdentification('12-345-678')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('debe validar contraseñas correctas', () => {
      expect(validatePassword('12345678')).toBe(true)
      expect(validatePassword('password123')).toBe(true)
      expect(validatePassword('P@ssw0rd!')).toBe(true)
      expect(validatePassword('a'.repeat(20))).toBe(true)
    })

    it('debe rechazar contraseñas incorrectas', () => {
      expect(validatePassword('')).toBe(false)
      expect(validatePassword('1234567')).toBe(false)
      expect(validatePassword('short')).toBe(false)
    })
  })

  describe('validateRequired', () => {
    it('debe validar valores requeridos', () => {
      expect(validateRequired('texto')).toBe(true)
      expect(validateRequired(' a ')).toBe(true)
      expect(validateRequired('123')).toBe(true)
    })

    it('debe rechazar valores vacíos', () => {
      expect(validateRequired('')).toBe(false)
      expect(validateRequired('   ')).toBe(false)
      expect(validateRequired('\t\n')).toBe(false)
    })
  })

  describe('validateLoginForm', () => {
    it('debe validar formulario de login correcto', () => {
      //Arrange + Act
      const result = validateLoginForm('test@example.com', 'password123')
      
      //Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('debe rechazar email vacío', () => {
      //Arrange + Act
      const result = validateLoginForm('', 'password123')
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual({
        email: 'El email es requerido'
      })
    })

    it('debe rechazar email inválido', () => {
      //Arrange + Act
      const result = validateLoginForm('invalid-email', 'password123')
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual({
        email: 'Email inválido'
      })
    })

    it('debe rechazar contraseña vacía', () => {
      //Arrange + Act
      const result = validateLoginForm('test@example.com', '')
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual({
        password: 'La contraseña es requerida'
      })
    })

    it('debe mostrar múltiples errores', () => {
      //Arrange + Act
      const result = validateLoginForm('', '')
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual({
        email: 'El email es requerido',
        password: 'La contraseña es requerida'
      })
    })
  })

  describe('validateRegisterForm', () => {
    const validData = {
      nombre: 'Juan Pérez',
      numero_iden: '3001234567',
      email: 'juan@example.com',
      cellphone: '3001234567',
      password: 'password123'
    }

    it('debe validar formulario de registro correcto', () => {
      //Arrange + Act
      const result = validateRegisterForm(
        validData.nombre,
        validData.numero_iden,
        validData.email,
        validData.cellphone,
        validData.password
      )
      
      //Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('debe rechazar nombre vacío', () => {
      //Arrange + Act
      const result = validateRegisterForm(
        '',
        validData.numero_iden,
        validData.email,
        validData.cellphone,
        validData.password
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.nombre).toBe('El nombre es requerido')
    })

    it('debe rechazar identificación vacía', () => {
      //Arrange + Act
      const result = validateRegisterForm(
        validData.nombre,
        '',
        validData.email,
        validData.cellphone,
        validData.password
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.numero_iden).toBe('El número de identificación es requerido')
    })

    it('debe rechazar email inválido', () => {
      //Arrange + Act
      const result = validateRegisterForm(
        validData.nombre,
        validData.numero_iden,
        'invalid-email',
        validData.cellphone,
        validData.password
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Email inválido')
    })

    it('debe rechazar contraseña corta', () => {
      //Arrange + Act
      const result = validateRegisterForm(
        validData.nombre,
        validData.numero_iden,
        validData.email,
        validData.cellphone,
        '123'
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.password).toBe('La contraseña debe tener al menos 8 caracteres')
    })

    it('debe mostrar todos los errores simultáneamente', () => {
      //Arrange + Act
      const result = validateRegisterForm('', '', '', '', '')
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual({
        nombre: 'El nombre es requerido',
        numero_iden: 'El número de identificación es requerido',
        email: 'El email es requerido',
        password: 'La contraseña es requerida'
      })
    })
  })

  describe('validateClientForm', () => {
    const validData = {
      name: 'Cliente Ejemplo',
      identification: '123456789',
      phone: '3001234567',
      address: 'Calle 123 #45-67'
    }

    it('debe validar formulario de cliente correcto', () => {
      //Arrange + Act
      const result = validateClientForm(
        validData.name,
        validData.identification,
        validData.phone,
        validData.address
      )
      
      //Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('debe rechazar nombre vacío', () => {
      //Arrange + Act
      const result = validateClientForm(
        '',
        validData.identification,
        validData.phone,
        validData.address
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('El nombre es requerido')
    })

    it('debe rechazar identificación vacía', () => {
      //Arrange + Act
      const result = validateClientForm(
        validData.name,
        '',
        validData.phone,
        validData.address
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.identification).toBe('La identificación es requerida')
    })

    it('debe rechazar identificación inválida', () => {
      //Arrange + Act
      const result = validateClientForm(
        validData.name,
        'abc123',
        validData.phone,
        validData.address
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.identification).toBe(
        'La identificación debe contener solo números y al menos 6 dígitos'
      )
    })

    it('debe rechazar identificación corta', () => {
      //Arrange + Act
      const result = validateClientForm(
        validData.name,
        '12345',
        validData.phone,
        validData.address
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.identification).toBe(
        'La identificación debe contener solo números y al menos 6 dígitos'
      )
    })

    it('debe rechazar teléfono vacío', () => {
      //Arrange + Act
      const result = validateClientForm(
        validData.name,
        validData.identification,
        '',
        validData.address
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.phone).toBe('El teléfono es requerido')
    })

    it('debe rechazar teléfono inválido', () => {
      //Arrange + Act
      const result = validateClientForm(
        validData.name,
        validData.identification,
        'abc',
        validData.address
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.phone).toBe('Formato de teléfono inválido')
    })

    it('debe rechazar dirección vacía', () => {
      //Arrange + Act
      const result = validateClientForm(
        validData.name,
        validData.identification,
        validData.phone,
        ''
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.address).toBe('La dirección es requerida')
    })
  })

  describe('validateWorkOrderForm', () => {
    const validData = {
      activity: 'Instalación',
      priority: 'Alta',
      clientId: '123',
      description: 'Instalar servicio de internet'
    }

    it('debe validar orden de trabajo correcta', () => {
      //Arrange + Act
      const result = validateWorkOrderForm(
        validData.activity,
        validData.priority,
        validData.clientId,
        validData.description
      )
      
      //Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('debe rechazar actividad vacía', () => {
      //Arrange + Act
      const result = validateWorkOrderForm(
        '',
        validData.priority,
        validData.clientId,
        validData.description
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.activity).toBe('La actividad es requerida')
    })

    it('debe rechazar prioridad vacía', () => {
      //Arrange + Act
      const result = validateWorkOrderForm(
        validData.activity,
        '',
        validData.clientId,
        validData.description
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.priority).toBe('La prioridad es requerida')
    })

    it('debe rechazar cliente no seleccionado', () => {
      //Arrange + Act
      const result = validateWorkOrderForm(
        validData.activity,
        validData.priority,
        '',
        validData.description
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.clientId).toBe('Debe seleccionar un cliente')
    })

    it('debe rechazar descripción vacía', () => {
      //Arrange + Act
      const result = validateWorkOrderForm(
        validData.activity,
        validData.priority,
        validData.clientId,
        ''
      )
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.description).toBe('La descripción es requerida')
    })

    it('debe mostrar múltiples errores', () => {
      //Arrange + Act
      const result = validateWorkOrderForm('', '', '', '')
      
      //Assert
      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual({
        activity: 'La actividad es requerida',
        priority: 'La prioridad es requerida',
        clientId: 'Debe seleccionar un cliente',
        description: 'La descripción es requerida'
      })
    })
  })

  describe('Edge Cases y casos especiales', () => {
    describe('validateEmail - casos especiales', () => {
      it('debe aceptar emails con guiones', () => {
        expect(validateEmail('first-last@domain.com')).toBe(true)
      })

      it('debe aceptar emails con números', () => {
        expect(validateEmail('user123@domain.com')).toBe(true)
      })

      it('debe rechazar emails con espacios', () => {
        expect(validateEmail('user name@domain.com')).toBe(false)
      })

      it('debe rechazar emails con doble @', () => {
        expect(validateEmail('user@@domain.com')).toBe(false)
      })
    })

    describe('validatePhone - casos especiales', () => {
      it('debe aceptar teléfonos con guiones y espacios', () => {
        expect(validatePhone('300-123-4567')).toBe(true)
        expect(validatePhone('300 123 4567')).toBe(true)
      })

      it('debe aceptar teléfonos con paréntesis', () => {
        expect(validatePhone('(300)1234567')).toBe(true)
        expect(validatePhone('(300) 123-4567')).toBe(true)
      })

      it('debe aceptar números internacionales', () => {
        expect(validatePhone('+1-300-123-4567')).toBe(true)
        expect(validatePhone('+57 300 1234567')).toBe(true)
      })
    })

    describe('validateIdentification - casos límite', () => {
      it('debe aceptar exactamente 6 dígitos', () => {
        expect(validateIdentification('123456')).toBe(true)
      })

      it('debe rechazar 5 dígitos', () => {
        expect(validateIdentification('12345')).toBe(false)
      })

      it('debe aceptar números muy largos', () => {
        expect(validateIdentification('12345678901234567890')).toBe(true)
      })
    })

    describe('validatePassword - casos límite', () => {
      it('debe aceptar exactamente 8 caracteres', () => {
        expect(validatePassword('12345678')).toBe(true)
      })

      it('debe rechazar 7 caracteres', () => {
        expect(validatePassword('1234567')).toBe(false)
      })

      it('debe aceptar contraseñas largas', () => {
        expect(validatePassword('a'.repeat(100))).toBe(true)
      })
    })

    describe('Formularios - validación de espacios', () => {
      it('debe rechazar strings con solo espacios en validateRequired', () => {
        expect(validateRequired('   ')).toBe(false)
      })

      it('debe rechazar formulario con espacios en blanco', () => {
        //Arrange + Act
        const result = validateLoginForm('   ', '   ')

        //Assert
        expect(result.isValid).toBe(false)
        expect(result.errors.email).toBe('El email es requerido')
        expect(result.errors.password).toBe('La contraseña es requerida')
      })
    })
  })
})