import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';
import { ProductDetailPage } from './features/products/product-detail/product-detail-page';
import { ProductListPage } from './features/products/product-list/product-list-page';
import { BROWSER_STORAGE } from './core/storage/browser-storage.token';

function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideRouter(routes, withComponentInputBinding()),
      { provide: BROWSER_STORAGE, useValue: null },
    ],
  });
}

describe('app.routes', () => {
  it('should navigate to ProductListPage for the empty path', async () => {
    setup();
    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/', ProductListPage);
    expect(instance).toBeInstanceOf(ProductListPage);
  });

  it('should navigate to ProductDetailPage for "product/:id" and bind the route id', async () => {
    setup();
    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/product/abc-123', ProductDetailPage);
    expect(instance).toBeInstanceOf(ProductDetailPage);
    expect(instance.id()).toBe('abc-123');
  });

  it('should redirect an unknown route to the product list', async () => {
    setup();
    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/esto-no-existe', ProductListPage);
    expect(instance).toBeInstanceOf(ProductListPage);
  });
});
