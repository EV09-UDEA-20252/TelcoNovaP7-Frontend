import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import Layout from "../components/Layout";

//Mocks

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

const mockNavigate = vi.fn();
vi.mocked(useNavigate).mockReturnValue(mockNavigate);

const mockLogout = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: "1",
      nombre: "Test User",
      email: "test@test.com",
      rol: "ADMIN",
    },
    isLoading: false,
    logout: mockLogout,
    isAuthenticated: true,
  }),
}));

//Helper

const mockLocation = (pathname: string): Location => ({
  pathname,
  search: "",
  hash: "",
  state: null,
  key: "test-key",
});

const renderLayout = (ui: React.ReactNode, route = "/dashboard") => {
  vi.mocked(useLocation).mockReturnValue(mockLocation(route));

  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
};

//Tests

describe("Layout component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el header cuando el usuario está autenticado", () => {
    //Arrange
    renderLayout(<Layout><div /></Layout>);
    
    //Assert
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("NO muestra header en /login", () => {
    //Arrange
    renderLayout(<Layout><div /></Layout>, "/login");
    
    //Assert
    expect(screen.queryByText("Test User")).toBeNull();
  });

  it("muestra botón de accesibilidad", () => {
    //Arrange
    renderLayout(<Layout><div /></Layout>);
    
    //Assert
    expect(screen.getByLabelText("Opciones de accesibilidad")).toBeInTheDocument();
  });

  it("toggle de accesibilidad cambia aria-expanded", () => {
    //Assert
    renderLayout(<Layout><div /></Layout>);
    
    const btn = screen.getByLabelText("Opciones de accesibilidad");
    
    expect(btn).toHaveAttribute("aria-expanded", "false");
    
    //Act
    fireEvent.click(btn);
    
    //Assert
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("botón Logout ejecuta logout()", () => {
    //Arrange
    renderLayout(<Layout><div /></Layout>);
    
    //Act
    fireEvent.click(screen.getByText(/cerrar sesión/i));
    
    //Assert
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("renderiza el children correctamente", () => {
    //Arrange
    renderLayout(
      <Layout>
        <span>Hola mundo</span>
      </Layout>
    );
    
    //Assert
    expect(screen.getByText("Hola mundo")).toBeInTheDocument();
  });

  it("NO muestra accesibilidad ni logout en rutas de registro", () => {
    //Arrange
    renderLayout(<Layout><div /></Layout>, "/register");
    
    //Assert
    expect(screen.queryByLabelText("Opciones de accesibilidad")).toBeNull();
    expect(screen.queryByText(/cerrar sesión/i)).toBeNull();
  });
});