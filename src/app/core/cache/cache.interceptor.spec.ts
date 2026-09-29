import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CACHE_TTL_MS, NOW } from '../config/api.config';
import { BROWSER_STORAGE } from '../storage/browser-storage.token';
import { withCache } from './cache.context';
import { cacheInterceptor } from './cache.interceptor';

const ONE_HOUR = 60 * 60 * 1000;

describe('cacheInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let now: number;

  beforeEach(() => {
    now = 0;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([cacheInterceptor])),
        provideHttpClientTesting(),
        { provide: CACHE_TTL_MS, useValue: ONE_HOUR },
        { provide: NOW, useValue: () => now },
        { provide: BROWSER_STORAGE, useValue: null },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should let a cacheable GET request reach the network the first time', async () => {
    const promise = firstValueFrom(httpClient.get('/api/product', { context: withCache() }));

    httpMock.expectOne('/api/product').flush([{ id: '1' }]);

    await expect(promise).resolves.toEqual([{ id: '1' }]);
  });

  it('should serve a repeated request from the cache without hitting the network', async () => {
    const first = firstValueFrom(httpClient.get('/api/product', { context: withCache() }));
    httpMock.expectOne('/api/product').flush([{ id: '1' }]);
    await first;

    const second = await firstValueFrom(httpClient.get('/api/product', { context: withCache() }));

    httpMock.expectNone('/api/product');
    expect(second).toEqual([{ id: '1' }]);
  });

  it('should always hit the network for requests without withCache()', async () => {
    const first = firstValueFrom(httpClient.get('/api/product'));
    httpMock.expectOne('/api/product').flush([{ id: '1' }]);
    await first;

    const second = firstValueFrom(httpClient.get('/api/product'));
    httpMock.expectOne('/api/product').flush([{ id: '1' }]);
    await second;
  });

  it('should never cache a POST request even when marked with withCache()', async () => {
    const first = firstValueFrom(
      httpClient.post('/api/cart', { id: '1' }, { context: withCache() }),
    );
    httpMock.expectOne('/api/cart').flush({ count: 1 });
    await first;

    const second = firstValueFrom(
      httpClient.post('/api/cart', { id: '1' }, { context: withCache() }),
    );
    httpMock.expectOne('/api/cart').flush({ count: 2 });
    await second;
  });

  it('should not cache error responses', async () => {
    const first = firstValueFrom(httpClient.get('/api/product', { context: withCache() }));
    httpMock.expectOne('/api/product').flush('error', { status: 500, statusText: 'Server Error' });
    await first.catch(() => undefined);

    const second = firstValueFrom(httpClient.get('/api/product', { context: withCache() }));
    httpMock.expectOne('/api/product').flush([{ id: '1' }]);
    await second;
  });

  it('should hit the network again once the entry has expired (1 h)', async () => {
    const first = firstValueFrom(httpClient.get('/api/product', { context: withCache() }));
    httpMock.expectOne('/api/product').flush([{ id: '1' }]);
    await first;

    now = ONE_HOUR;

    const second = firstValueFrom(httpClient.get('/api/product', { context: withCache() }));
    httpMock.expectOne('/api/product').flush([{ id: '1' }, { id: '2' }]);
    await expect(second).resolves.toEqual([{ id: '1' }, { id: '2' }]);
  });
});
