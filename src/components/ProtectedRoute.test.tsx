import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";

//Mocks

const mockUseAuth = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  interface MockNavigateProps {
    to: string;
    state?: {
      from?: {
        pathname?: string;
      };
    };
    replace?: boolean;
  }

  return {
    ...actual,
    useLocation: () => ({ pathname: "/test" }),
    Navigate: ({ to, state }: MockNavigateProps) => (
      <div>
        MOCK_NAVIGATE to={to} from={state?.from?.pathname}
      </div>
    ),
  };
});

//Helpers

const renderProtected = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
});

//Tests

describe("ProtectedRoute", () => {
  it("muestra pantalla de carga cuando isLoading=true", () => {
    //Arrange and Act
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    renderProtected(
      <ProtectedRoute>
        <div>Contenido privado</div>
      </ProtectedRoute>
    );

    //Assert
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
    expect(screen.queryByText("Contenido privado")).toBeNull();
  });

  it("redirige a /login cuando NO está autenticado", () => {
    //Arrange and Act
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    renderProtected(
      <ProtectedRoute>
        <div>Contenido privado</div>
      </ProtectedRoute>
    );

    const navigateMock = screen.getByText(/MOCK_NAVIGATE/);

    //Assert
    expect(navigateMock).toBeInTheDocument();
    expect(navigateMock.textContent).toContain("to=/login");
    expect(navigateMock.textContent).toContain("from=/test");
  });

  it("renderiza los children cuando está autenticado", () => {
    //Arrange and Act
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    renderProtected(
      <ProtectedRoute>
        <div>Contenido privado</div>
      </ProtectedRoute>
    );

    //Assert
    expect(screen.getByText("Contenido privado")).toBeInTheDocument();
  });
});