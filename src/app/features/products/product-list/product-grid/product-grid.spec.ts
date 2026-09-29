import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ProductGrid } from './product-grid';
import type { ProductSummary } from '../../data/product.model';

function product(id: string): ProductSummary {
  return { id, brand: 'Acer', model: id, price: 100, imageUrl: '' };
}

describe('ProductGrid', () => {
  it('should render one item per product', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProductGrid);
    fixture.componentRef.setInput('products', [product('1'), product('2'), product('3')]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('li').length).toBe(3);
  });

  it('should give priority only to the first 4 cards', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProductGrid);
    fixture.componentRef.setInput(
      'products',
      Array.from({ length: 6 }, (_, i) => product(String(i))),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    const images = (fixture.nativeElement as HTMLElement).querySelectorAll('img');
    const eager = Array.from(images).filter((img) => img.getAttribute('loading') === 'eager');
    expect(eager).toHaveLength(4);
  });
});
