import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Accessibility } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export default function Layout({ children, showNavigation = true }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado del panel de accesibilidad
  const [accessOpen, setAccessOpen] = useState(false);
  const accessRef = useRef<HTMLDivElement | null>(null);

  // Estado persistente: modo oscuro y tamaño de fuente
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("telconova_dark") === "1";
    } catch {
      return false;
    }
  });

  const [fontPct, setFontPct] = useState<number>(() => {
    try {
      const v = localStorage.getItem("telconova_font_pct");
      return v ? Number(v) : 100;
    } catch {
      return 100;
    }
  });

  // Aplicar clases y tamaño de fuente global
  useEffect(() => {
    const html = document.documentElement;

    // Modo oscuro
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");

    // Tamaño de fuente
    html.style.fontSize = `${fontPct}%`;

    // Guardar preferencia
    try {
      localStorage.setItem("telconova_dark", darkMode ? "1" : "0");
      localStorage.setItem("telconova_font_pct", String(fontPct));
    } catch {}
  }, [darkMode, fontPct]);

  // Cerrar panel si se hace clic fuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (accessRef.current && !accessRef.current.contains(e.target as Node)) {
        setAccessOpen(false);
      }
    }

    if (accessOpen) {
      document.addEventListener("mousedown", onDocClick);
    }

    return () => {
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [accessOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAccessOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Handlers
  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada exitosamente");
    navigate("/login");
  };

  const handleBack = () => window.history.back();
  const handleHome = () => navigate("/dashboard");

  const toggleAccess = () => setAccessOpen((s) => !s);
  const increaseFont = () => setFontPct((p) => Math.min(150, p + 10));
  const decreaseFont = () => setFontPct((p) => Math.max(90, p - 10));
  const resetFont = () => setFontPct(100);
  const toggleDark = () => setDarkMode((d) => !d);

  // Rutas que no muestran navegación
  const isLoginPage = location.pathname === "/login";
  const isRegisterFlow = ["/register", "/verify", "/register-success"].includes(location.pathname);

  return (
    <div
      className={`min-h-screen transition-colors duration-300
      }`}
    >
      {/* Header */}
      {showNavigation && user && !isLoginPage && !isRegisterFlow && (
        <header className="page-header">
          <div className="container-telco py-4">
            <div className="flex items-center justify-between">
              {/* Usuario */}
              <div className="flex items-center space-x-4">
                <div
                  className="w-10 h-10 bg-telco-primary rounded-full flex items-center justify-center"
                  aria-hidden
                >
                  <span className="text-white font-semibold">
                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold">{user.nombre}</h2>
                  <p className="text-sm">{user.rol}</p>
                </div>
              </div>

              {/* Panel de accesibilidad y logout */}
              <div className="flex items-center gap-3">
                <div ref={accessRef} className="relative">
                  <button
                    aria-haspopup="menu"
                    aria-expanded={accessOpen}
                    aria-label="Opciones de accesibilidad"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAccess();
                    }}
                    className="btn-telco-outline p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-telco-primary"
                    title="Accesibilidad"
                  >
                    <Accessibility className="w-5 h-5" />
                  </button>

                  {/* Menú de accesibilidad */}
                  {accessOpen && (
                    <div
                      role="menu"
                      aria-label="Opciones de accesibilidad"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                    >
                      <div className="p-3">
                        <p className="text-sm font-semibold mb-2">
                          Accesibilidad
                        </p>

                        <div className="flex flex-col gap-2">
                          <button
                            role="menuitem"
                            onClick={increaseFont}
                            className="text-sm text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-200"
                          >
                            Aumentar texto
                          </button>
                          <button
                            role="menuitem"
                            onClick={decreaseFont}
                            className="text-sm text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-200"
                          >
                            Reducir texto
                          </button>
                          <button
                            role="menuitem"
                            onClick={resetFont}
                            className="text-sm text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-200"
                          >
                            Restablecer tamaño
                          </button>
                          <button
                            role="menuitem"
                            onClick={toggleDark}
                            className="text-sm text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-200"
                          >
                            Alternar modo claro/oscuro
                          </button>
                          <a
                            href="#"
                            role="menuitem"
                            onClick={(e) => {
                              e.preventDefault();
                              alert(
                                "Atención: los elementos tienen etiquetas ARIA y soporte de teclado."
                              );
                            }}
                            className="text-sm text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-200"
                          >
                            Ver ayuda de accesibilidad
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logout */}
                <button onClick={handleLogout} className="btn-telco-outline text-sm px-4 py-2">
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Contenido principal */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {showNavigation && user && !isLoginPage && !isRegisterFlow && location.pathname !== "/dashboard" && (
        <footer className="bg-white border-t border-gray-200 dark:border-gray-700 py-4 transition-colors duration-300">
          <div className="container-telco">
            <div className="flex justify-between">
              <button onClick={handleBack} className="btn-telco-outline text-sm px-6 py-2">
                Atrás
              </button>
              <button onClick={handleHome} className="btn-telco-outline text-sm px-6 py-2">
                Inicio
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
