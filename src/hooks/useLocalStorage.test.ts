import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage hook', () => {
  const KEY = 'test-key';

  beforeEach(() => {
    localStorage.clear();
  });

  it('inicializa con valor de localStorage si existe', () => {
    localStorage.setItem(KEY, JSON.stringify('stored value'));

    const { result } = renderHook(() => useLocalStorage<string>(KEY, 'default'));

    expect(result.current[0]).toBe('stored value');
  });

  it('inicializa con initialValue si no hay valor en localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<number>(KEY, 42));

    expect(result.current[0]).toBe(42);
  });

  it('actualiza el estado y localStorage al usar setValue', () => {
    const { result } = renderHook(() => useLocalStorage<number>(KEY, 0));

    act(() => {
      result.current[1](10);
    });

    expect(result.current[0]).toBe(10);
    expect(localStorage.getItem(KEY)).toBe('10');
  });

  it('acepta una función como valor en setValue', () => {
    const { result } = renderHook(() => useLocalStorage<number>(KEY, 5));

    act(() => {
      result.current[1]((prev) => prev + 3);
    });

    expect(result.current[0]).toBe(8);
    expect(localStorage.getItem(KEY)).toBe('8');
  });

  it('maneja errores al leer localStorage y usa initialValue', () => {
    // Simular error en getItem
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('fail'); });

    const { result } = renderHook(() => useLocalStorage<string>(KEY, 'default'));

    expect(result.current[0]).toBe('default');

    spy.mockRestore();
  });

  it('maneja errores al escribir en localStorage y no rompe', () => {
    // Simular error en setItem
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('fail'); });

    const { result } = renderHook(() => useLocalStorage<number>(KEY, 0));

    act(() => {
      result.current[1](42);
    });

    // El estado todavía se actualiza
    expect(result.current[0]).toBe(42);

    spy.mockRestore();
  });
});
