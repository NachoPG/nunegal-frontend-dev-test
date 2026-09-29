import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { CACHE_TTL_MS, NOW } from '../config/api.config';
import { HttpCacheStore } from './http-cache.store';

const ONE_HOUR = 60 * 60 * 1000;

function createStore(initialNow: number): {
  store: HttpCacheStore;
  setNow: (value: number) => void;
} {
  let current = initialNow;

  TestBed.configureTestingModule({
    providers: [
      { provide: CACHE_TTL_MS, useValue: ONE_HOUR },
      { provide: NOW, useValue: () => current },
    ],
  });

  return { store: TestBed.inject(HttpCacheStore), setNow: (value: number) => (current = value) };
}

describe('HttpCacheStore', () => {
  it('should return null when there is no entry for the key', () => {
    const { store } = createStore(0);
    expect(store.read('missing')).toBeNull();
  });

  it('should return the stored value while it has not expired', () => {
    const { store } = createStore(0);
    store.write('products', [{ id: '1' }]);

    expect(store.read('products')).toEqual([{ id: '1' }]);
  });

  it('should still be valid one millisecond before the hour elapses', () => {
    const { store, setNow } = createStore(0);
    store.write('products', 'value');

    setNow(ONE_HOUR - 1);
    expect(store.read('products')).toBe('value');
  });

  it('should expire exactly when the hour elapses', () => {
    const { store, setNow } = createStore(0);
    store.write('products', 'value');

    setNow(ONE_HOUR);
    expect(store.read('products')).toBeNull();
  });

  it('should remove an expired entry from storage', () => {
    const { store, setNow } = createStore(0);
    store.write('products', 'value');
    setNow(ONE_HOUR);
    store.read('products');

    setNow(0);
    expect(store.read('products')).toBeNull();
  });

  it('should ignore an entry with an unexpected shape', () => {
    const { store } = createStore(0);
    store['storage'].setItem('http-cache:v1:bad', { unexpected: true });

    expect(store.read('bad')).toBeNull();
  });

  it('should delete an entry when remove() is called', () => {
    const { store } = createStore(0);
    store.write('products', 'value');
    store.remove('products');

    expect(store.read('products')).toBeNull();
  });
});
