import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { validateRegisterForm } from '../utils/validators';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import Layout from '../components/Layout';

export default function Register() {
  const [formData, setFormData] = useState({
      nombre: '',
      numero_iden: '',
      email: '',
      telefono: '',
      password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateRegisterForm(
      formData.nombre,
      formData.numero_iden,
      formData.email,
      formData.telefono,
      formData.password
    );
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await register(formData);
      if (result.success) {
        toast.success('Registro exitoso. Verifica tu cuenta.');
        navigate('/verify');
      } else {
        toast.error(result.message || 'Error al registrar usuario');
      }
    } catch (error) {
      toast.error('Error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showNavigation={false}>
      <div className="min-h-screen bg-telco-primary flex items-center justify-center px-4">
        <div className="form-container w-full max-w-md">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-telco-success rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-telco-primary mb-2">Registro de Cuenta</h1>
            <p className="text-gray-600">Crea tu cuenta en TelcoNova</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Nombre completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={errors.nombre}
              placeholder="Ingrese su nombre completo"
              required
            />

            <Input
              label="número de identificación"
              name="numero_iden"
              value={formData.numero_iden}
              onChange={handleChange}
              error={errors.numero_iden}
              placeholder="Cc"
              required
            />

            <Input
              label="Correo"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="correo@ejemplo.com"
              required
            />

            <Input
              label="Teléfono"
              name="telefono"
              type="text"
              value={formData.telefono}
              onChange={handleChange}
              error={errors.telefono}
              placeholder="310......."
              required
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Mínimo 8 caracteres"
              required
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-telco-success mt-6"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-telco-primary hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}