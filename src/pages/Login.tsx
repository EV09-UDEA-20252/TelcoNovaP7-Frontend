import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { validateLoginForm } from '../utils/validators';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import Layout from '../components/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await login({ email, password });
      if (result.success) {
        toast.success('Inicio de sesión exitoso');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Error al iniciar sesión');
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
            <div className="w-20 h-20 bg-telco-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-telco-primary mb-2">TelcoNova</h1>
            <p className="text-gray-600">SupportSuite</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Usuario"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="Ingrese su email"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Ingrese su contraseña"
              required
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-telco-primary mt-6"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-telco-primary hover:underline font-medium">
                Regístrate
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Credenciales de prueba:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Admin:</strong> admin@telconova.co / Admin123!</p>
              <p><strong>Técnico:</strong> tecnico@telconova.co / Tec12345!</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}