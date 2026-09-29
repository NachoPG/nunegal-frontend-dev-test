import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { afterEach, describe, expect, it } from 'vitest';
import { API_BASE_URL } from '../../../core/config/api.config';
import { cacheInterceptor } from '../../../core/cache/cache.interceptor';
import { BROWSER_STORAGE } from '../../../core/storage/browser-storage.token';
import { BreadcrumbStore } from '../../../core/breadcrumbs/breadcrumb.store';
import { CartStore } from '../../cart/cart.store';
import { By } from '@angular/platform-browser';
import { SLOW_RESPONSE_NOTICE } from '../../../core/errors/user-facing-error';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import normalFixture from '../../../../testing/fixtures/product-detail-normal.json';
import multiOptionFixture from '../../../../testing/fixtures/product-detail-multi-option.json';
import { ProductDetailPage } from './product-detail-page';

const BASE_URL = 'https://api.test';

const timeoutError = new DOMException(
  'signal timed out',
  'TimeoutError',
) as unknown as ProgressEvent;

function setup(id: string) {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptors([cacheInterceptor])),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: API_BASE_URL, useValue: BASE_URL },
      { provide: BROWSER_STORAGE, useValue: null },
    ],
  });
  const fixture = TestBed.createComponent(ProductDetailPage);
  fixture.componentRef.setInput('id', id);
  return { fixture, httpMock: TestBed.inject(HttpTestingController) };
}

describe('ProductDetailPage', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should show a link back to the list while loading', () => {
    const { fixture, httpMock } = setup(normalFixture.id);
    fixture.detectChanges();

    const back = (fixture.nativeElement as HTMLElement).querySelector(
      'a.product-detail-page__back',
    );
    expect(back?.getAttribute('href')).toBe('/');

    httpMock.expectOne(`${BASE_URL}/api/product/${normalFixture.id}`).flush(normalFixture);
  });

  it('should render the full detail when the request succeeds', async () => {
    const { fixture, httpMock } = setup(normalFixture.id);
    fixture.detectChanges();
    httpMock.expectOne(`${BASE_URL}/api/product/${normalFixture.id}`).flush(normalFixture);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Acer Iconia Talk S');
    expect(el.querySelector('app-product-description')).not.toBeNull();
    expect(el.querySelector('app-product-actions')).not.toBeNull();

    expect(TestBed.inject(BreadcrumbStore).items()).toEqual([
      { label: 'Inicio', url: '/' },
      { label: 'Acer Iconia Talk S', url: null },
    ]);
  });

  it('should show "Producto no encontrado" when the API responds 500 (it does not use 404)', async () => {
    const { fixture, httpMock } = setup('no-existe');
    fixture.detectChanges();
    httpMock
      .expectOne(`${BASE_URL}/api/product/no-existe`)
      .flush('error', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[role="alert"]')).not.toBeNull();
    expect(el.querySelector('a.product-detail-page__back')).not.toBeNull();

    expect(TestBed.inject(BreadcrumbStore).items()).toEqual([
      { label: 'Inicio', url: '/' },
      { label: 'Producto no encontrado', url: null },
    ]);
  });

  it('should show a confirmation and update the cart count after a successful add', async () => {
    const { fixture, httpMock } = setup(normalFixture.id);
    fixture.detectChanges();
    httpMock.expectOne(`${BASE_URL}/api/product/${normalFixture.id}`).flush(normalFixture);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    // El fixture "normal" trae un único color (preseleccionado) y dos
    // almacenamientos: hace falta elegir uno para poder añadir.
    (el.querySelectorAll('input[type="radio"]')[0] as HTMLInputElement).click();
    fixture.detectChanges();

    (el.querySelector('button.product-actions__submit') as HTMLButtonElement).click();

    const cartReq = httpMock.expectOne(`${BASE_URL}/api/cart`);
    expect(cartReq.request.body).toEqual({
      id: normalFixture.id,
      colorCode: normalFixture.options.colors[0].code,
      storageCode: normalFixture.options.storages[0].code,
    });
    cartReq.flush({ count: 1 });
    await fixture.whenStable();

    expect(el.querySelector('[role="status"]')?.textContent).toContain('Añadido a la cesta.');
    expect(TestBed.inject(CartStore).count()).toBe(1);
  });

  it('should keep the button disabled until both options are chosen', async () => {
    const { fixture, httpMock } = setup(multiOptionFixture.id);
    fixture.detectChanges();
    httpMock
      .expectOne(`${BASE_URL}/api/product/${multiOptionFixture.id}`)
      .flush(multiOptionFixture);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    const submit = el.querySelector('button.product-actions__submit') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
  });

  it('should show an error and keep the cart count when the add request fails', async () => {
    const { fixture, httpMock } = setup(normalFixture.id);
    fixture.detectChanges();
    httpMock.expectOne(`${BASE_URL}/api/product/${normalFixture.id}`).flush(normalFixture);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    (el.querySelectorAll('input[type="radio"]')[0] as HTMLInputElement).click();
    fixture.detectChanges();
    (el.querySelector('button.product-actions__submit') as HTMLButtonElement).click();

    httpMock
      .expectOne(`${BASE_URL}/api/cart`)
      .flush('error', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    expect(el.querySelector('[role="alert"]')?.textContent).toContain('No se ha podido añadir');
    expect(TestBed.inject(CartStore).count()).toBe(0);
  });

  it('should render a detail without options or price instead of failing', async () => {
    const { fixture, httpMock } = setup('incompleto');
    fixture.detectChanges();
    httpMock
      .expectOne(`${BASE_URL}/api/product/incompleto`)
      .flush({ id: 'incompleto', brand: 'Acer', model: 'Liquid' });
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[role="alert"]')).toBeNull();
    expect(el.querySelector('h1')?.textContent).toContain('Acer Liquid');
    expect(el.textContent).toContain('Precio no disponible');
    expect((el.querySelector('button.product-actions__submit') as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('should pass the cold-start notice to the loading state', () => {
    const { fixture, httpMock } = setup(normalFixture.id);
    fixture.detectChanges();

    const loading = fixture.debugElement.query(By.directive(LoadingState));
    expect((loading.componentInstance as LoadingState).slowMessage()).toBe(SLOW_RESPONSE_NOTICE);

    httpMock.expectOne(`${BASE_URL}/api/product/${normalFixture.id}`).flush(normalFixture);
  });

  it('should show a timeout-specific message instead of "Producto no encontrado"', async () => {
    const { fixture, httpMock } = setup(normalFixture.id);
    fixture.detectChanges();
    httpMock.expectOne(`${BASE_URL}/api/product/${normalFixture.id}`).error(timeoutError);
    await fixture.whenStable();

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('no ha respondido a tiempo');
    expect(TestBed.inject(BreadcrumbStore).items().at(-1)?.label).not.toBe(
      'Producto no encontrado',
    );
  });
});
