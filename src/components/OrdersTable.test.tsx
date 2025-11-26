import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import OrdersTable from "../components/OrdersTable";
import type { WorkOrder } from "@/types";

//Mocks

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../hooks/useLocalStorage", () => ({
  useLocalStorage: vi.fn().mockReturnValue([
    [
      {
        id: "c1",
        name: "Cliente Uno",
        identification: "123",
      },
    ],
  ]),
}));

const mockOrders: WorkOrder[] = [
  {
    id: "1",
    orderNumber: "OT001",
    clientId: "c1",
    status: "Abierta",
    activity: "Instalación",
    priority: "Alta",
    description: "Instalar router",
    responsibleUserId: "u1",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "2",
    orderNumber: "OT002",
    clientId: "c1",
    status: "Cerrada",
    activity: "Reparación",
    priority: "Baja",
    description: "Reparar fibra",
    responsibleUserId: "u2",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-20"),
  },
];

vi.mock("@/hooks/useFetchOrders", () => ({
  useFetchOrders: () => mockOrders,
}));

//Helpers

const renderOrders = () =>
  render(
    <MemoryRouter>
      <OrdersTable />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

//Tests

describe("OrdersTable", () => {
  it("renderiza órdenes correctamente", () => {
    //Arrange and Act
    renderOrders();

    //Assert
    expect(screen.getByText("#OT001")).toBeInTheDocument();
    expect(screen.getByText("#OT002")).toBeInTheDocument();
    expect(screen.getAllByText("Cliente Uno")).toHaveLength(2);
  });

  it("enriquece órdenes con datos del cliente", () => {
    //Arrange and Act
    renderOrders();

    //Assert
    expect(screen.getAllByText("Cliente Uno").length).toBe(2);

    const phones = screen.getAllByText("123");
    expect(phones).toHaveLength(2);
  });

  it("filtra por búsqueda (texto)", () => {
    //Arrange and Act
    renderOrders();

    const input = screen.getByRole("textbox");

    //Act
    fireEvent.change(input, { target: { value: "fibra" } });

    //Assert
    expect(screen.queryByText("#OT001")).toBeNull();
    expect(screen.getByText("#OT002")).toBeInTheDocument();
  });

  it("filtra por estado", () => {
    //Arrange and Act
    renderOrders();

    const [estadoSelect] = screen.getAllByRole("combobox");

    //Act
    fireEvent.change(estadoSelect, { target: { value: "Cerrada" } });

    //Assert
    expect(screen.queryByText("#OT001")).toBeNull();
    expect(screen.getByText("#OT002")).toBeInTheDocument();
  });

  it("filtra por tipo de actividad", () => {
    //Arrange and Act
    renderOrders();

    const [, tipoSelect] = screen.getAllByRole("combobox");

    fireEvent.change(tipoSelect, { target: { value: "Instalación" } });

    //Assert
    expect(screen.getByText("#OT001")).toBeInTheDocument();
    expect(screen.queryByText("#OT002")).toBeNull();
  });

  it("filtra por prioridad", () => {
    //Arrange and Act
    renderOrders();

    const [, , prioridadSelect] = screen.getAllByRole("combobox");

    //Act
    fireEvent.change(prioridadSelect, { target: { value: "Alta" } });

    //Assert
    expect(screen.getByText("#OT001")).toBeInTheDocument();
    expect(screen.queryByText("#OT002")).toBeNull();
  });

  it("limpia los filtros correctamente", () => {
    //Arrange and Act
    renderOrders();

    const [, , prioridadSelect] = screen.getAllByRole("combobox");

    fireEvent.change(prioridadSelect, { target: { value: "Alta" } });

    expect(screen.queryByText("#OT002")).toBeNull();

    fireEvent.click(screen.getByText("Limpiar filtros"));

    //Assert
    expect(screen.getByText("#OT002")).toBeInTheDocument();
    expect(screen.getByText("#OT001")).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay resultados", () => {
    //Arrange and Act
    renderOrders();

    const [estadoSelect] = screen.getAllByRole("combobox");

    fireEvent.change(estadoSelect, { target: { value: "En progreso" } });

    //Assert
    expect(screen.getByText("No se encontraron órdenes de trabajo")).toBeInTheDocument();
  });

  it("navega al hacer clic en Editar", () => {
    //Arrange and Act
    renderOrders();

    fireEvent.click(screen.getAllByText("Editar")[0]);

    //Assert
    expect(mockNavigate).toHaveBeenCalledWith("/orders/1/edit");
  });

  it("muestra columna de ESTADO correctamente (sin depender de badges)", () => {
    //Arrange and Act
    renderOrders();

    const rows = screen.getAllByRole("row").slice(1);

    const stateCell1 = within(rows[0]).getAllByRole("cell")[3];
    const stateCell2 = within(rows[1]).getAllByRole("cell")[3];

    //Assert
    expect(stateCell1.textContent).toBe("Abierta");
    expect(stateCell2.textContent).toBe("Cerrada");
    expect(stateCell1.querySelector("[class*='status-']")).toBeDefined();
  });

  it("muestra columna de PRIORIDAD correctamente (sin depender de badges)", () => {
    //Arrange and Act
    renderOrders();

    const rows = screen.getAllByRole("row").slice(1);

    const priorityCell1 = within(rows[0]).getAllByRole("cell")[5];
    const priorityCell2 = within(rows[1]).getAllByRole("cell")[5];

    //Assert
    expect(priorityCell1.textContent).toBe("Alta");
    expect(priorityCell2.textContent).toBe("Baja");
    expect(priorityCell1.querySelector("[class*='priority-']")).toBeDefined();
  });
});