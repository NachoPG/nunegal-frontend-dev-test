import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { toProductDetail } from '../../data/product.mapper';
import type { ProductDetailDto } from '../../data/product.dto';
import normalFixture from '../../../../../testing/fixtures/product-detail-normal.json';
import emptyWeightFixture from '../../../../../testing/fixtures/product-detail-empty-weight.json';
import { ProductDescription } from './product-description';

function setup(dto: ProductDetailDto) {
  const fixture = TestBed.createComponent(ProductDescription);
  fixture.componentRef.setInput('product', toProductDetail(dto));
  fixture.detectChanges();
  return fixture;
}

describe('ProductDescription', () => {
  it('should display the 11 required attributes with their values', async () => {
    const fixture = setup(normalFixture as ProductDetailDto);
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    for (const label of [
      'Marca',
      'Modelo',
      'Precio',
      'CPU',
      'RAM',
      'Sistema operativo',
      'Resolución de pantalla',
      'Batería',
      'Cámaras',
      'Dimensiones',
      'Peso',
    ]) {
      expect(text).toContain(label);
    }

    expect(text).toContain('Acer');
    expect(text).toContain('Iconia Talk S');
    expect(text).toContain('170,00');
    expect(text).toContain('Principal:');
    expect(text).toContain('Frontal:');
  });

  it('should display "No disponible" when the weight is missing', async () => {
    const fixture = setup(emptyWeightFixture as ProductDetailDto);
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No disponible');
  });
});
