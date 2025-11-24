import { useEffect, useState } from "react";
import { WorkOrder, Client } from "../types";

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
                const mapped = data.content.map((o: any) => ({
                    id: o.idOrden,
                    orderNumber: o.nroOrden,
                    clientId: o.idCliente,
                    client: o.cliente,
                    status: o.estado,
                    priority: o.prioridad,
                    activity: o.tipoServicio,
                    createdAt: o.creadaEn
                })) as WorkOrder[];

                setOrders(mapped);
                localStorage.setItem("telconova_work_orders", JSON.stringify(mapped));
            });
    }, [token]);

    return orders;
}
