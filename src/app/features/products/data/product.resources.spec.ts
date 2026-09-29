import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../../../core/config/api.config';
import { cacheInterceptor } from '../../../core/cache/cache.interceptor';
import { CACHEABLE } from '../../../core/cache/cache.context';
import { BROWSER_STORAGE } from '../../../core/storage/browser-storage.token';
import productListFixture from '../../../../testing/fixtures/product-list.json';
import normalFixture from '../../../../testing/fixtures/product-detail-normal.json';
import { injectProductDetail, injectProductList } from './product.resources';

const BASE_URL = 'https://api.test';
const TIMEOUT_MS = 1234;

@Component({ selector: 'app-test-list-host', template: '' })
class ListHostComponent {
  readonly products = injectProductList();
}

@Component({ selector: 'app-test-detail-host', template: '' })
class DetailHostComponent {
  readonly id = signal<string | undefined>(undefined);
  readonly product = injectProductDetail(this.id);
}

describe('injectProductList', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([cacheInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        { provide: REQUEST_TIMEOUT_MS, useValue: TIMEOUT_MS },
        { provide: BROWSER_STORAGE, useValue: null },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should request GET {base}/api/product marked as cacheable', async () => {
    const fixture = TestBed.createComponent(ListHostComponent);
    fixture.detectChanges();

    const req = httpMock.expectOne(`${BASE_URL}/api/product`);
    expect(req.request.method).toBe('GET');
    expect(req.request.context.get(CACHEABLE)).toBe(true);
    expect(req.request.timeout).toBe(TIMEOUT_MS);

    req.flush(productListFixture);
    await fixture.whenStable();

    expect(fixture.componentInstance.products.value().length).toBe(productListFixture.length);
  });

  it('should apply the mapper (parse) to the result', async () => {
    const fixture = TestBed.createComponent(ListHostComponent);
    fixture.detectChanges();

    httpMock.expectOne(`${BASE_URL}/api/product`).flush(productListFixture);
    await fixture.whenStable();

    const withoutPrice = fixture.componentInstance.products.value().find((p) => p.price === null);
    expect(withoutPrice).toBeDefined();
  });
});

describe('injectProductDetail', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([cacheInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        { provide: REQUEST_TIMEOUT_MS, useValue: TIMEOUT_MS },
        { provide: BROWSER_STORAGE, useValue: null },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should not send any request while the id is undefined', async () => {
    const fixture = TestBed.createComponent(DetailHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    httpMock.expectNone(() => true);
  });

  it('should request GET {base}/api/product/:id once the id is set and apply the mapper', async () => {
    const fixture = TestBed.createComponent(DetailHostComponent);
    fixture.componentInstance.id.set(normalFixture.id);
    fixture.detectChanges();

    const req = httpMock.expectOne(`${BASE_URL}/api/product/${normalFixture.id}`);
    expect(req.request.context.get(CACHEABLE)).toBe(true);
    expect(req.request.timeout).toBe(TIMEOUT_MS);

    req.flush(normalFixture);
    await fixture.whenStable();

    expect(fixture.componentInstance.product.value()?.id).toBe(normalFixture.id);
    expect(fixture.componentInstance.product.value()?.specs.cpu).toBe(normalFixture.cpu);
  });
});
