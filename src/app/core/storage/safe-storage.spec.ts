import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BROWSER_STORAGE } from './browser-storage.token';
import { SafeStorage } from './safe-storage';

function createFakeStorage(overrides: Partial<Storage> = {}): Storage {
  const backing = new Map<string, string>();
  return {
    getItem: (key: string) => backing.get(key) ?? null,
    setItem: (key: string, value: string) => backing.set(key, value),
    removeItem: (key: string) => backing.delete(key),
    clear: () => backing.clear(),
    key: () => null,
    get length() {
      return backing.size;
    },
    ...overrides,
  } as Storage;
}

function createService(storage: Storage | null): SafeStorage {
  TestBed.configureTestingModule({
    providers: [{ provide: BROWSER_STORAGE, useValue: storage }],
  });
  return TestBed.inject(SafeStorage);
}

describe('SafeStorage', () => {
  it('should write and read a value using the browser storage', () => {
    const service = createService(createFakeStorage());

    expect(service.setItem('key', { a: 1 })).toBe(true);
    expect(service.getItem<{ a: number }>('key')).toEqual({ a: 1 });
  });

  it('should return null when the key does not exist', () => {
    const service = createService(createFakeStorage());
    expect(service.getItem('missing')).toBeNull();
  });

  it('should return null when the stored value is not valid JSON', () => {
    const storage = createFakeStorage();
    storage.setItem('corrupt', '{not-json');
    const service = createService(storage);

    expect(service.getItem('corrupt')).toBeNull();
  });

  it('should return false without throwing when writing fails (e.g. quota exceeded)', () => {
    const storage = createFakeStorage({
      setItem: () => {
        throw new DOMException('QuotaExceededError');
      },
    });
    const service = createService(storage);

    expect(() => service.setItem('key', 'value')).not.toThrow();
    expect(service.setItem('key', 'value')).toBe(false);
  });

  it('should fall back to in-memory storage when browser storage is unavailable', () => {
    const service = createService(null);

    expect(service.setItem('key', 42)).toBe(true);
    expect(service.getItem<number>('key')).toBe(42);
  });

  it('should remove a value stored in the browser storage', () => {
    const service = createService(createFakeStorage());
    service.setItem('key', 'value');
    service.removeItem('key');
    expect(service.getItem('key')).toBeNull();
  });

  it('should remove a value stored in memory', () => {
    const service = createService(null);
    service.setItem('key', 'value');
    service.removeItem('key');
    expect(service.getItem('key')).toBeNull();
  });
});
