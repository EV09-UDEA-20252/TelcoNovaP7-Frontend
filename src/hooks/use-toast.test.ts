import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reducer } from "../hooks/use-toast";
import { toast } from "../hooks/use-toast";
import { useToast } from "../hooks/use-toast";
import type { ToastProps } from "@/components/ui/toast";
import { renderHook, act } from "@testing-library/react";

//Helpers

const sampleToast = {
  title: "Hola",
  description: "Descripción",
  open: true,
} as ToastProps;

//Mocks

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

//Tests

describe("useToast reducer", () => {
  it("ADD_TOAST agrega un toast", () => {
    //Arrange and Act
    const t = { ...sampleToast, id: "1" };

    const state = reducer({ toasts: [] }, { type: "ADD_TOAST", toast: t });

    //Assert
    expect(state.toasts.length).toBe(1);
    expect(state.toasts[0].id).toBe("1");
  });

  it("UPDATE_TOAST actualiza un toast existente", () => {
    //Arrange and Act
    const initial = {
      toasts: [{ ...sampleToast, id: "1", title: "Viejo titulo" }],
    };

    const updated = reducer(initial, {
      type: "UPDATE_TOAST",
      toast: { id: "1", title: "Nuevo" },
    });

    //Assert
    expect(updated.toasts[0].title).toBe("Nuevo");
  });

  it("DISMISS_TOAST pone open=false", () => {
    //Arrange and Act
    const initial = { toasts: [{ ...sampleToast, id: "1", open: true }] };

    const state = reducer(initial, {
      type: "DISMISS_TOAST",
      toastId: "1",
    });

    //Assert
    expect(state.toasts[0].open).toBe(false);
  });

  it("REMOVE_TOAST elimina un toast", () => {
    //Arrange and Act
    const initial = { toasts: [{ ...sampleToast, id: "1" }] };

    const state = reducer(initial, {
      type: "REMOVE_TOAST",
      toastId: "1",
    });

    //Assert
    expect(state.toasts.length).toBe(0);
  });
});

describe("toast() API", () => {
  it("crea un toast correctamente", () => {
    //Arrange and Act
    const { id } = toast({ ...sampleToast });

    //Assert
    expect(id).toBeDefined();
    expect(typeof id).toBe("string");
  });

  it("dismiss() marca open=false", () => {
    //Arrange and Act
    const { result } = renderHook(() => useToast());

    act(() => {
        result.current.toast({
        title: "Hola",
        open: true,
        });
    });

    const id = result.current.toasts[0].id;

    act(() => {
        result.current.dismiss(id);
    });

    const target = result.current.toasts.find((t) => t.id === id);

    //Assert
    expect(target?.open).toBe(false);
  });

  it("update() actualiza un toast", () => {
    //Arrange and Act
    const { id, update } = toast({ ...sampleToast });

    act(() =>
      update({
        ...sampleToast,
        id,
        title: "Actualizado",
      })
    );

    const { result } = renderHook(() => useToast());
    const t = result.current.toasts.find((t) => t.id === id);

    //Assert
    expect(t?.title).toBe("Actualizado");
  });
});

describe("useToast hook", () => {
  it("expone toasts y funciones", () => {
    //Arrange and Act
    const { result } = renderHook(() => useToast());

    //Assert
    expect(Array.isArray(result.current.toasts)).toBe(true);
    expect(typeof result.current.toast).toBe("function");
    expect(typeof result.current.dismiss).toBe("function");
  });

  it("agrega un toast y hook recibe actualización", () => {
    //Arrange and Act
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: "Nuevo",
        description: "Test",
        open: true,
      });
    });

    //Assert
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe("Nuevo");
  });

  it("dismiss() desde hook funciona", () => {
    //Arrange and Act
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: "X",
        description: "Y",
        open: true,
      });
    });

    const id = result.current.toasts[0].id;

    act(() => result.current.dismiss(id));

    vi.runAllTimers();

    //Assert
    expect(result.current.toasts[0].open).toBe(false);
  });
});