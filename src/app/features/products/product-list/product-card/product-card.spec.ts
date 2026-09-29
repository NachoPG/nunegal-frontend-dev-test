import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ProductCard } from './product-card';
import type { ProductSummary } from '../../data/product.model';

const product: ProductSummary = {
  id: 'abc-123',
  brand: 'Acer',
  model: 'Liquid Z6',
  price: 120,
  imageUrl: 'https://example.test/img.jpg',
};

function setup() {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(ProductCard);
  fixture.componentRef.setInput('product', product);
  return fixture;
}

describe('ProductCard', () => {
  it('should display the image, brand, model and price', async () => {
    const fixture = setup();
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('img')?.getAttribute('src')).toBe(product.imageUrl);
    expect(el.querySelector('.product-card__brand')?.textContent).toBe('Acer');
    expect(el.querySelector('.product-card__model')?.textContent).toBe('Liquid Z6');
    expect(el.querySelector('.product-card__price')?.textContent).toBe('120,00 €');
  });

  it('should link to the product detail', async () => {
    const fixture = setup();
    fixture.detectChanges();
    await fixture.whenStable();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a.product-card');
    expect(link?.getAttribute('href')).toBe('/product/abc-123');
  });

  it('should display "Precio no disponible" when the product has no price', async () => {
    const fixture = setup();
    fixture.componentRef.setInput('product', { ...product, price: null });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.product-card__price')?.textContent,
    ).toBe('Precio no disponible');
  });

  it('should lazy-load the image unless it has priority', async () => {
    const fixture = setup();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('img')?.getAttribute('loading'),
    ).toBe('lazy');

    fixture.componentRef.setInput('priority', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('img')?.getAttribute('loading'),
    ).toBe('eager');
  });
});
