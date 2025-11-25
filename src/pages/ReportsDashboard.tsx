import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, RefreshCcw } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import OrdersTable from "../components/OrdersTable";

interface Order {
  id: string;
  fecha: string;
  cliente: string;
  estado: string;
  tipo: string;
  prioridad: string;
}

export default function ReportsDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const dummyOrders: Order[] = [
      { id: "999", fecha: "11-08-2025", cliente: "Karolina Higuita Marulanda", estado: "Activa", tipo: "Reparación", prioridad: "Alta" },
      { id: "998", fecha: "10-08-2025", cliente: "Juana Corrales Arango", estado: "Activa", tipo: "Instalación", prioridad: "Baja" },
      { id: "997", fecha: "10-08-2025", cliente: "Kamila Torres Holguín", estado: "Activa", tipo: "Mantenimiento", prioridad: "Media" },
      { id: "996", fecha: "09-08-2025", cliente: "Juan Higuita Marulanda", estado: "En proceso", tipo: "Reparación", prioridad: "Baja" },
      { id: "995", fecha: "08-08-2025", cliente: "Karolina Higuita Marulanda", estado: "Cerrada", tipo: "Reparación", prioridad: "Alta" },
    ];
    setOrders(dummyOrders);
    setFilteredOrders(dummyOrders);
  }, []);

  const handleRefresh = () => setFilteredOrders(orders);

  const handleExport = () => {
    const csvContent = [
      ["ID", "Fecha", "Cliente", "Estado", "Tipo", "Prioridad"],
      ...filteredOrders.map((o) => [o.id, o.fecha, o.cliente, o.estado, o.tipo, o.prioridad]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "reporte_ordenes.csv");
    document.body.appendChild(link);
    link.click();
  };

  const chartData = [
    { prioridad: "Alta", cantidad: 12 },
    { prioridad: "Media", cantidad: 8 },
    { prioridad: "Baja", cantidad: 3 },
  ];

  const tipoData = [
    { tipo: "Reparación", porcentaje: 35, cantidad: 51, color: "#2563EB" },
    { tipo: "Instalación", porcentaje: 25, cantidad: 36, color: "#3B82F6" },
    { tipo: "Mantenimiento", porcentaje: 40, cantidad: 58, color: "#60A5FA" },
  ];

  return (
    <Layout>
      <div className="container-telco px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Reporte de Órdenes
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Estadísticas y resumen de las órdenes registradas
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              className="btn-telco-primary flex items-center justify-center"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold">75 Total</h2>
              <p className="text-sm text-gray-600">Órdenes registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold text-green-600">25 Activas</h2>
              <p className="text-sm text-gray-600">En ejecución</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-500">25 Cerradas</h2>
              <p className="text-sm text-gray-600">Finalizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tipos de orden y gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tipos de orden */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tipos de Órdenes</h3>
              <div className="space-y-4">
                {tipoData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1 text-sm sm:text-base">
                      <span className="font-medium text-gray-800">
                        {item.tipo} ({item.porcentaje}%)
                      </span>
                      <span className="text-gray-600">{item.cantidad} ord.</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full"
                        style={{
                          width: `${item.porcentaje}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de prioridades */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Prioridad de Órdenes
              </h3>
              <div className="w-full h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="prioridad" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de órdenes */}
        <div className="overflow-x-auto">
          <OrdersTable />
        </div>
      </div>
    </Layout>
  );
}
