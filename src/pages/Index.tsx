import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-telco-primary flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="w-20 h-20 bg-telco-success rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-telco-primary mb-4">
          TelcoNova SupportSuite
        </h1>
        
        <p className="text-gray-600 mb-8">
          Sistema de gestión de órdenes de trabajo para telecomunicaciones
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/login')}
            className="btn-telco-primary w-full"
          >
            Iniciar Sesión
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={() => navigate('/register')}
            variant="outline"
            className="w-full border-telco-primary text-telco-primary hover:bg-telco-primary hover:text-white"
          >
            Crear Cuenta
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>© 2024 TelcoNova. Todos los derechos reservados.</p>
        </div>
      </Card>
    </div>
  );
};

export default Index;
