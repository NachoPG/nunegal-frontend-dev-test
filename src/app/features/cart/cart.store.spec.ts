import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { API_BASE_URL } from '../../core/config/api.config';
import { BROWSER_STORAGE } from '../../core/storage/browser-storage.token';
import { CartStore } from './cart.store';

const BASE_URL = 'https://api.test';

function createFakeStorage(initial: Record<string, string> = {}): Storage {
  const backing = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => backing.get(key) ?? null,
    setItem: (key: string, value: string) => backing.set(key, value),
    removeItem: (key: string) => backing.delete(key),
    clear: () => backing.clear(),
    key: () => null,
    get length() {
      return backing.size;
    },
  } as Storage;
}

function createStore(storage: Storage | null = createFakeStorage()): CartStore {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: BASE_URL },
      { provide: BROWSER_STORAGE, useValue: storage },
    ],
  });
  return TestBed.inject(CartStore);
}

describe('CartStore', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should start at 0 when nothing is persisted', () => {
    const store = createStore();
    expect(store.count()).toBe(0);
  });

  it('should restore the previously persisted count', () => {
    const store = createStore(createFakeStorage({ 'cart:count': JSON.stringify(3) }));
    expect(store.count()).toBe(3);
  });

  it('should ignore a corrupted or invalid persisted value and start at 0', () => {
    const store = createStore(createFakeStorage({ 'cart:count': JSON.stringify(-1) }));
    expect(store.count()).toBe(0);
  });

  it('should start at 0 when browser storage is unavailable', () => {
    const store = createStore(null);
    expect(store.count()).toBe(0);
  });

  it('should add the count returned by the API to the total and persist it', async () => {
    const storage = createFakeStorage({ 'cart:count': JSON.stringify(2) });
    const store = createStore(storage);
    const httpMock = TestBed.inject(HttpTestingController);

    const promise = store.add({ id: 'abc', colorCode: 1000, storageCode: 2000 });
    httpMock.expectOne(`${BASE_URL}/api/cart`).flush({ count: 1 });

    await expect(promise).resolves.toBe(3);
    expect(store.count()).toBe(3);
    expect(storage.getItem('cart:count')).toBe(JSON.stringify(3));
  });

  it('should POST exactly {id, colorCode, storageCode} when add() is called', async () => {
    const store = createStore();
    const httpMock = TestBed.inject(HttpTestingController);

    const promise = store.add({ id: 'abc-123', colorCode: 1000, storageCode: 2000 });
    const req = httpMock.expectOne(`${BASE_URL}/api/cart`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ id: 'abc-123', colorCode: 1000, storageCode: 2000 });
    req.flush({ count: 1 });

    await promise;
  });

  it('should leave the count unchanged when the add() request fails', async () => {
    const store = createStore(createFakeStorage({ 'cart:count': JSON.stringify(2) }));
    const httpMock = TestBed.inject(HttpTestingController);

    const promise = store.add({ id: 'abc', colorCode: 1000, storageCode: 2000 });
    httpMock
      .expectOne(`${BASE_URL}/api/cart`)
      .flush('error', { status: 500, statusText: 'Server Error' });

    await expect(promise).rejects.toBeDefined();
    expect(store.count()).toBe(2);
  });
});
