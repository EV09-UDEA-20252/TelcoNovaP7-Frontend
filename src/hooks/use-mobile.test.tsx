import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

//Helpers

function mockMatchMedia(width: number) {
  const listeners = new Set<() => void>();

  return {
    matches: width < 768,
    media: "",
    onchange: null,
    addEventListener: (_event: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_event: string, cb: () => void) =>
      listeners.delete(cb),
    triggerChange: () => listeners.forEach((cb) => cb()),
  };
}

describe("useIsMobile", () => {
  let mql: ReturnType<typeof mockMatchMedia>;

  //Mocks

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    mql = mockMatchMedia(window.innerWidth);
    window.matchMedia = vi.fn(() => mql as unknown as MediaQueryList);
  });

  it("retorna false cuando el viewport es mayor o igual al breakpoint", () => {
    //Arrange
    window.innerWidth = 1024;
    mql = mockMatchMedia(1024);
    window.matchMedia = vi.fn(() => mql as unknown as MediaQueryList);

    //Act
    const { result } = renderHook(() => useIsMobile());

    //Assert
    expect(result.current).toBe(false);
  });

  it("retorna true cuando el viewport es menor al breakpoint", () => {
    //Arrange
    window.innerWidth = 500;
    mql = mockMatchMedia(500);
    window.matchMedia = vi.fn(() => mql as unknown as MediaQueryList);

    //Act
    const { result } = renderHook(() => useIsMobile());

    //Assert
    expect(result.current).toBe(true);
  });

  it("actualiza el valor cuando cambia el media query", () => {
    //Arrange
    window.innerWidth = 1024;
    mql = mockMatchMedia(1024);
    window.matchMedia = vi.fn(() => mql as unknown as MediaQueryList);

    //Act
    const { result } = renderHook(() => useIsMobile());

    //Assert
    expect(result.current).toBe(false);

    //Act
    act(() => {
      window.innerWidth = 400;
      mql.triggerChange();
    });

    //Assert
    expect(result.current).toBe(true);
  });

  it("remueve correctamente el event listener en cleanup", () => {
    //Arrange
    const removeSpy = vi.spyOn(mql, "removeEventListener");

    //Act
    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    //Assert
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });
});