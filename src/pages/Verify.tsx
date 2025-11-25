import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';
import Layout from '../components/Layout';

export default function Verify() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { verifyCode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('El código de verificación es requerido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = verifyCode(code);
      if (isValid) {
        toast.success('Código verificado exitosamente');
        navigate('/register-success');
      } else {
        setError('Código de verificación inválido');
        toast.error('Código incorrecto. Intente nuevamente.');
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
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-telco-primary mb-2">Verificación de Cuenta</h1>
            <p className="text-gray-600 text-center">
              Se ha enviado un código de verificación a tu correo electrónico. 
              Ingresa el código para completar el registro.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Código de verificación"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={error}
              placeholder="Ingrese el código de 6 dígitos"
              maxLength={6}
              required
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-telco-success mt-6"
            >
              {isLoading ? 'Validando...' : 'Validar'}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Para la demo:</strong> Usa el código <span className="font-mono">123456</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}