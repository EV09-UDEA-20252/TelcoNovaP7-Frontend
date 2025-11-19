import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';

export default function RegisterSuccess() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <Layout showNavigation={false}>
      <div className="min-h-screen bg-telco-primary flex items-center justify-center px-4">
        <div className="form-container w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-telco-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-telco-success mb-4">
            ¡REGISTRO EXITOSO!
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Ahora puedes acceder al sistema con tus credenciales.
          </p>

          <Button
            onClick={handleLoginRedirect}
            className="btn-telco-primary w-full"
          >
            Iniciar sesión
          </Button>
        </div>
      </div>
    </Layout>
  );
}