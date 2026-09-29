import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, describe, expect, it } from 'vitest';
import { API_BASE_URL } from '../../core/config/api.config';
import { CartApi } from './cart.api';

const BASE_URL = 'https://api.test';

describe('CartApi', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should POST exactly {id, colorCode, storageCode} to {base}/api/cart', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    const api = TestBed.inject(CartApi);
    const httpMock = TestBed.inject(HttpTestingController);

    const promise = firstValueFrom(api.add({ id: 'abc-123', colorCode: 1000, storageCode: 2000 }));

    const req = httpMock.expectOne(`${BASE_URL}/api/cart`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ id: 'abc-123', colorCode: 1000, storageCode: 2000 });

    req.flush({ count: 1 });
    await expect(promise).resolves.toEqual({ count: 1 });
  });
});
