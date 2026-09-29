import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { afterEach, describe, expect, it } from 'vitest';
import { API_BASE_URL } from '../../../core/config/api.config';
import { cacheInterceptor } from '../../../core/cache/cache.interceptor';
import { BROWSER_STORAGE } from '../../../core/storage/browser-storage.token';
import { BreadcrumbStore } from '../../../core/breadcrumbs/breadcrumb.store';
import { By } from '@angular/platform-browser';
import { SLOW_RESPONSE_NOTICE } from '../../../core/errors/user-facing-error';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import productListFixture from '../../../../testing/fixtures/product-list.json';
import { ProductListPage } from './product-list-page';

const BASE_URL = 'https://api.test';
const timeoutError = new DOMException(
  'signal timed out',
  'TimeoutError',
) as unknown as ProgressEvent;

function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptors([cacheInterceptor])),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: API_BASE_URL, useValue: BASE_URL },
      { provide: BROWSER_STORAGE, useValue: null },
    ],
  });
  return {
    fixture: TestBed.createComponent(ProductListPage),
    httpMock: TestBed.inject(HttpTestingController),
  };
}

describe('ProductListPage', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should show a loading state while waiting for the response', async () => {
    const { fixture, httpMock } = setup();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[role="status"]')).not.toBeNull();

    httpMock.expectOne(`${BASE_URL}/api/product`).flush(productListFixture);
    await fixture.whenStable();
  });

  it('should publish the "Inicio" breadcrumb as the current page', async () => {
    const { fixture, httpMock } = setup();
    fixture.detectChanges();
    httpMock.expectOne(`${BASE_URL}/api/product`).flush(productListFixture);
    await fixture.whenStable();

    expect(TestBed.inject(BreadcrumbStore).items()).toEqual([{ label: 'Inicio', url: null }]);
  });

  it('should render every product when the request succeeds', async () => {
    const { fixture, httpMock } = setup();
    fixture.detectChanges();
    httpMock.expectOne(`${BASE_URL}/api/product`).flush(productListFixture);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.product-grid__item')).toHaveLength(productListFixture.length);
  });

  it('should show an error state with a retry option when the request fails', async () => {
    const { fixture, httpMock } = setup();
    fixture.detectChanges();
    httpMock
      .expectOne(`${BASE_URL}/api/product`)
      .flush('error', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[role="alert"]')).not.toBeNull();

    (el.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();

    httpMock.expectOne(`${BASE_URL}/api/product`).flush(productListFixture);
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.product-grid__item'),
    ).toHaveLength(productListFixture.length);
  });

  it('should show an empty state when the API returns no products', async () => {
    const { fixture, httpMock } = setup();
    fixture.detectChanges();
    httpMock.expectOne(`${BASE_URL}/api/product`).flush([]);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('No hay productos disponibles.');
    expect(el.querySelector('app-search-bar')).toBeNull();
  });

  it('should filter the grid while typing and show an empty result when nothing matches', async () => {
    const { fixture, httpMock } = setup();
    fixture.detectChanges();
    httpMock.expectOne(`${BASE_URL}/api/product`).flush(productListFixture);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('input') as HTMLInputElement;

    input.value = 'zzz-no-existe';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(el.querySelectorAll('.product-grid__item')).toHaveLength(0);
    expect(el.textContent).toContain('No hay productos que coincidan con «zzz-no-existe».');
  });

  it('should keep rendering the other products when one record is malformed', async () => {
    const { fixture, httpMock } = setup();
    fixture.detectChanges();
    httpMock
      .expectOne(`${BASE_URL}/api/product`)
      .flush([...productListFixture, { brand: 'Sin id' }, { id: 'sin-precio', brand: 'Acer' }]);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[role="alert"]')).toBeNull();
    expect(el.querySelectorAll('.product-grid__item')).toHaveLength(productListFixture.length + 1);
  });

  it('should pass the cold-start notice to the loading state', async () => {
    const { fixture, httpMock } = setup();
    fixture.detectChanges();

    const loading = fixture.debugElement.query(By.directive(LoadingState));
    expect((loading.componentInstance as LoadingState).slowMessage()).toBe(SLOW_RESPONSE_NOTICE);

    httpMock.expectOne(`${BASE_URL}/api/product`).flush(productListFixture);
    await fixture.whenStable();
  });

  it('should show a specific message when the request times out', async () => {
    const { fixture, httpMock } = setup();
    fixture.detectChanges();
    httpMock.expectOne(`${BASE_URL}/api/product`).error(timeoutError);
    await fixture.whenStable();

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('no ha respondido a tiempo');
  });
});
