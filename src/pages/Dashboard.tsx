import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/card';
import { 
  Users, 
  FileText, 
  ClipboardList, 
  BarChart3,
  Plus,
  List
} from 'lucide-react';
import Layout from '../components/Layout';
import { initializeMockData } from '../utils/mockData';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize mock data on dashboard load
    initializeMockData();
  }, []);

  const dashboardItems = [
    {
      title: 'Registrar cliente',
      description: 'Agregar nuevo cliente al sistema',
      icon: Users,
      action: () => navigate('/clients'),
      color: 'bg-blue-500'
    },
    {
      title: 'Registrar orden de trabajo',
      description: 'Crear nueva orden de servicio',
      icon: Plus,
      action: () => navigate('/orders/new'),
      color: 'bg-telco-success'
    },
    {
      title: 'Órdenes de trabajo creadas',
      description: 'Ver y gestionar órdenes existentes',
      icon: ClipboardList,
      action: () => navigate('/orders'),
      color: 'bg-orange-500'
    },
    {
      title: 'Informes',
      description: 'ver estadísticas de los tipos de ordenes creadas',
      icon: BarChart3,
      action: () => navigate('/informes'),
      color: 'bg-purple-400',
      disabled: false
    }
  ];

  return (
    <Layout>
      <div className="container-telco py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.rol}
          </h1>
          <p className="text-gray-600">
            Gestiona órdenes de trabajo y clientes desde tu panel principal
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {dashboardItems.map((item, index) => (
            <Card
              key={index}
              className={`dashboard-card ${item.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={!item.disabled ? item.action : undefined}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mb-4`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
                {item.disabled && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 mt-2">
                    Próximamente
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-telco text-center">
            <h3 className="text-2xl font-bold text-telco-primary">5</h3>
            <p className="text-gray-600">Clientes Registrados</p>
          </div>
          <div className="card-telco text-center">
            <h3 className="text-2xl font-bold text-telco-success">8</h3>
            <p className="text-gray-600">Órdenes Activas</p>
          </div>
          <div className="card-telco text-center">
            <h3 className="text-2xl font-bold text-orange-500">3</h3>
            <p className="text-gray-600">En Progreso</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}