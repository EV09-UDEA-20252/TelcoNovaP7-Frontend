// useFetchOrders.ts

import { useEffect, useState } from "react";
import { WorkOrder } from "../types"; // Importamos el tipo WorkOrder

// Función auxiliar para mapear valores del backend al tipo de WorkOrder
const mapBackendValue = (value: string): 'Instalación' | 'Reparación' | 'Mantenimiento' | 'Alta' | 'Media' | 'Baja' | 'Abierta' | 'En progreso' | 'Cerrada' => {
    switch (value) {
        // Status Mappings
        case 'ACTIVA':
        case 'ABIERTA':
            return 'Abierta';
        case 'EN_PROCESO':
            return 'En progreso';
        case 'CERRADA':
            return 'Cerrada';

        // Priority Mappings
        case 'ALTA':
            return 'Alta';
        case 'MEDIA':
            return 'Media';
        case 'BAJA':
            return 'Baja';

        // Activity/Type Mappings
        case 'INSTALACION':
            return 'Instalación';
        case 'REPARACION':
            return 'Reparación';
        case 'MANTENIMIENTO':
            return 'Mantenimiento';

        default:
            // Manejar valores inesperados o devolver el valor sin cambios si no se mapea
            return value as any;
    }
};

export function useFetchOrders() {
    const [orders, setOrders] = useState<WorkOrder[]>([]);
    const token = localStorage.getItem("telconova_token");

    useEffect(() => {
        if (!token) return;

        fetch("https://telconova-backend-1.onrender.com/api/ordenes", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                const mapped: WorkOrder[] = data.content.map((o: any) => ({
                    id: o.idOrden,
                    orderNumber: o.nroOrden,
                    clientId: o.idCliente,
                    client: o.cliente, // Se mantiene como string, el enriquecimiento se hace en OrdersTable
                    // Usamos la función de mapeo para convertir el string de la API a los tipos de WorkOrder
                    activity: mapBackendValue(o.nombreTipoServicio),
                    status: mapBackendValue(o.estado),
                    priority: mapBackendValue(o.prioridad),
                    description: o.descripcion,
                    createdAt: new Date(o.creadaEn), // Convertir a Date
                    updatedAt: new Date(), // Asumir la fecha actual si no viene de la API
                    responsibleUserId: 'N/A' // O un valor por defecto si la API no lo proporciona
                }));

                setOrders(mapped);
                localStorage.setItem("telconova_work_orders", JSON.stringify(mapped));
            });
    }, [token]);

    return orders;
}