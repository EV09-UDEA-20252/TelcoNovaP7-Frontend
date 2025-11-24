export function mapBackendOrderToWorkOrder(data: any) {
    return {
        id: data.idOrden,
        orderNumber: data.nroOrden,
        clientId: data.idCliente,
        clientName: data.cliente,
        activity:
            data.tipoServicio === "INSTALACIÓN"
                ? "Instalación"
                : data.tipoServicio === "REPARACION"
                    ? "Reparación"
                    : "Mantenimiento",
        priority:
            data.prioridad === "ALTA"
                ? "Alta"
                : data.prioridad === "MEDIA"
                    ? "Media"
                    : "Baja",
        status:
            data.estado === "ACTIVA"
                ? "Abierta"
                : data.estado === "EN_PROGRESO"
                    ? "En progreso"
                    : "Cerrada",
        description: "",
        createdAt: data.creadaEn,
        updatedAt: data.creadaEn
    };
}
