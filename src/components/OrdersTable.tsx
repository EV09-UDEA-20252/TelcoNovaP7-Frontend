import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Input } from '../components/ui/input';
import { SimpleSelect, SelectOption } from '../components/ui/simple-select';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Client, WorkOrder } from '../types';
import { Edit } from 'lucide-react';
import { useFetchOrders } from '@/hooks/useFetchOrders';

interface EnrichedWorkOrder extends WorkOrder {
  client: Client | undefined;
}

export default function OrdersTable() {
  const navigate = useNavigate();
  const workOrders = useFetchOrders();
  const [clients] = useLocalStorage<Client[]>('telconova_clients', []);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const enrichedOrders = useMemo(() => {
    // NOTA: El campo 'client' de la API es un string. 
    // El campo 'client' de este mapeo es el objeto completo de localStorage.
    return workOrders.map(order => ({
      ...order,
      client: clients.find(c => c.id === order.clientId)
    }));
  }, [workOrders, clients]);

  const filteredOrders = useMemo(() => {
    return enrichedOrders.filter(order => {
      const matchesSearch =
        !searchText ||
        order.orderNumber.includes(searchText) ||
        // Usa 'order.client?.name' para el cliente enriquecido O 'order.client' 
        // para el nombre que viene directamente de la API si la búsqueda por descripción falla.
        order.client?.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (typeof order.client === 'string' && order.client.toLowerCase().includes(searchText.toLowerCase())) ||
        order.description.toLowerCase().includes(searchText.toLowerCase()); // <--- Usa el nuevo campo 'description'

      const matchesStatus = !statusFilter || order.status === statusFilter;

      const matchesType = !typeFilter || order.activity === typeFilter;
      const matchesPriority = !priorityFilter || order.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });
  }, [enrichedOrders, searchText, statusFilter, typeFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusOptions: SelectOption[] = [
    { value: 'Abierta', label: 'Abierta' },
    { value: 'En progreso', label: 'En progreso' },
    { value: 'Cerrada', label: 'Cerrada' }
  ];

  const typeOptions: SelectOption[] = [
    { value: 'Instalación', label: 'Instalación' },
    { value: 'Reparación', label: 'Reparación' },
    { value: 'Mantenimiento', label: 'Mantenimiento' }
  ];

  const priorityOptions: SelectOption[] = [
    { value: 'Alta', label: 'Alta' },
    { value: 'Media', label: 'Media' },
    { value: 'Baja', label: 'Baja' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activa': return 'status-open';
      case 'EN_PROCESO': return 'status-progress';
      case 'CERRADA': return 'status-closed';
      default: return 'status-open';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'ALTA': return 'priority-high';
      case 'MEDIA': return 'priority-medium';
      case 'BAJA': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-CO');
  };

  return (
    <>
      {/* Filtros */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Buscar por número, cliente o descripción"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <SimpleSelect
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="Filtrar por estado"
          />
          <SimpleSelect
            options={typeOptions}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            placeholder="Filtrar por tipo"
          />
          <SimpleSelect
            options={priorityOptions}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            placeholder="Filtrar por prioridad"
          />
          <Button
            onClick={() => {
              setSearchText('');
              setStatusFilter('');
              setTypeFilter('');
              setPriorityFilter('');
              setCurrentPage(1);
            }}
            variant="outline"
            className="w-full"
          >
            Limpiar filtros
          </Button>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="table-telco">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-mono font-semibold">#{order.orderNumber}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <div>
                      <div className="font-medium">{order.client?.name || 'Cliente no encontrado'}</div>
                      <div className="text-gray-500 text-sm">{order.client?.identification}</div>
                    </div>
                  </td>
                  <td><span className={getStatusBadge(order.status)}>{order.status}</span></td>
                  <td>{order.activity}</td>
                  <td><span className={getPriorityBadge(order.priority)}>{order.priority}</span></td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/orders/${order.id}/edit`)}
                      className="text-telco-primary border-telco-primary hover:bg-telco-primary hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-600">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length} órdenes
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                Anterior
              </Button>
              <span className="px-4 py-2 text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron órdenes de trabajo</p>
          </div>
        )}
      </Card>
    </>
  );
}
