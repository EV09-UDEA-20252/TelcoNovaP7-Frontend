import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { validateClientForm } from '../utils/validators';
import { Client } from '../types';
import { toast } from 'sonner';
import { Search, Save, UserPlus } from 'lucide-react';
import Layout from '../components/Layout';

export default function Clients() {
  const { user } = useAuth();
  const [clients, setClients] = useLocalStorage<Client[]>('telconova_clients', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchId, setSearchId] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    identification: '',
    phone: '',
    address: '',
    email: '',
    country: '',
    department: '',
    city: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [countries, setCountries] = useState<string[]>([]);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

  // Cargar países
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries');
        const data = await res.json();
        setCountries(data.data.map((item: any) => item.country));
      } catch (error) {
        console.error('Error cargando países:', error);
      }
    };
    loadCountries();
  }, []);

  // Cargar departamentos de Colombia
  useEffect(() => {
    const loadDepartments = async () => {
      if (formData.country === 'Colombia') {
        try {
          const res = await fetch('https://api-colombia.com/api/v1/Department');
          const data = await res.json();
          setDepartments(data);
        } catch (error) {
          console.error('Error cargando departamentos:', error);
        }
      } else {
        setDepartments([]);
        setCities([]);
      }
    };
    loadDepartments();
  }, [formData.country]);

  // Cargar ciudades del departamento
  useEffect(() => {
    const loadCities = async () => {
      if (formData.country === 'Colombia' && formData.department) {
        try {
          const res = await fetch(`https://api-colombia.com/api/v1/Department/${formData.department}/cities`);
          const data = await res.json();
          setCities(data);
        } catch (error) {
          console.error('Error cargando ciudades:', error);
        }
      } else {
        setCities([]);
      }
    };
    loadCities();
  }, [formData.department, formData.country]);

  // Manejo de cambios en campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'country') {
      setFormData({ ...formData, country: value, department: '', city: '' });
      setDepartments([]);
      setCities([]);
      return;
    }
    if (name === 'department') {
      setFormData({ ...formData, department: value, city: '' });
      return;
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearch = () => {
    if (!searchTerm && !searchId) {
      setSelectedClient(null);
      return;
    }

    const client = clients.find(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.identification.includes(searchId)
    );

    if (client) {
      setSelectedClient(client);
      setFormData({
        name: client.name,
        identification: client.identification,
        phone: client.phone,
        address: client.address,
        email: client.email || '',
        country: client.country || '',
        department: client.department || '',
        city: client.city || ''
      });
      setIsEditing(true);
      toast.success('Cliente encontrado');
    } else {
      setSelectedClient(null);
      setIsEditing(false);
      setFormData({
        name: searchTerm,
        identification: searchId,
        phone: '',
        address: '',
        email: '',
        country: '',
        department: '',
        city: ''
      });
      toast.info('Cliente no encontrado. Puede crear uno nuevo.');
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateClientForm(
      formData.name,
      formData.identification,
      formData.phone,
      formData.address
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    const clientData = {
      nombre: formData.name,
      identificacion: formData.identification,
      telefono: formData.phone,
      pais: formData.country,
      departamento: formData.department,
      ciudad: formData.city,
      direccion: formData.address,
      email: formData.email
    };

    const token = localStorage.getItem("telconova_token");


    try {
      const response = await fetch("https://telconova-backend-1.onrender.com/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(clientData)
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos al servidor");
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      toast.success("Cliente creado exitosamente");

      const newClient: Client = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setClients([...clients, newClient]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo enviar el cliente al servidor");
    }

    setFormData({
      name: "",
      identification: "",
      phone: "",
      address: "",
      email: "",
      country: "",
      department: "",
      city: ""
    });
    setSelectedClient(null);
    setIsEditing(false);
    setSearchTerm("");
    setSearchId("");
  };

  return (
    <Layout>
      <div className="container-telco py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registro de Cliente
          </h1>
          <p className="text-gray-600">
            Registrado por: <span className="font-semibold">{user?.nombre}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Buscar Cliente
            </h2>
            
            <div className="space-y-4">
              <Input
                label="Buscar por nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre del cliente"
              />
              
              <Input
                label="Buscar por identificación"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Número de identificación"
              />
              
              <Button
                onClick={handleSearch}
                className="btn-telco-primary w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </Card>

          {/* Form Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
          

              <Input
                label="Nombre del cliente"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Nombre completo"
                required
              />
              
              <Input
                label="Identificación"
                name="identification"
                value={formData.identification}
                onChange={handleChange}
                error={errors.identification}
                placeholder="Solo números"
                required
              />

              <Input
                label="Correo electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Seleccione un país</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {formData.country === 'Colombia' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    disabled={!formData.country}
                  >
                    <option value="">Seleccione un departamento</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  disabled={
                    formData.country === 'Colombia'
                      ? !formData.department
                      : !formData.country
                  }
                >
                  <option value="">Seleccione una ciudad</option>
                  {formData.country === 'Colombia'
                    ? cities.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))
                    : formData.country && <option value="Principal">Ciudad principal</option>}
                </select>
              </div>
              
              <Input
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+57 300 123 4567"
                required
              />
              
              <Input
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Dirección completa"
                required
              />
              
              <Button
                type="submit"
                className="btn-telco-success w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
            </form>
          </Card>
        </div>

        {/* Client List */}
        {clients.length > 0 && (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Clientes Registrados ({clients.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client) => (
                <div key={client.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-gray-600">ID: {client.identification}</p>
                  <p className="text-gray-600">{client.phone}</p>
                  <p className="text-gray-600 text-sm">{client.address}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
