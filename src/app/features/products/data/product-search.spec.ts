import { describe, expect, it } from 'vitest';
import { filterProducts, normalizeSearchText } from './product-search';
import type { ProductSummary } from './product.model';

function product(brand: string, model: string): ProductSummary {
  return { id: `${brand}-${model}`, brand, model, price: 100, imageUrl: '' };
}

const products: ProductSummary[] = [
  product('Acer', 'Liquid Z6'),
  product('Acer', 'Predator 8'),
  product('Samsung', 'Galaxy Ace'),
];

describe('normalizeSearchText', () => {
  it('should convert to lowercase', () => {
    expect(normalizeSearchText('ACER')).toBe('acer');
  });

  it('should strip diacritics', () => {
    expect(normalizeSearchText('Ratón óptico')).toBe('raton optico');
  });

  it('should trim and collapse whitespace', () => {
    expect(normalizeSearchText('  acer   liquid  ')).toBe('acer liquid');
  });
});

describe('filterProducts', () => {
  it('should return all products when the term is empty', () => {
    expect(filterProducts(products, '')).toEqual(products);
  });

  it('should return all products when the term is only whitespace', () => {
    expect(filterProducts(products, '   ')).toEqual(products);
  });

  it('should filter by brand', () => {
    expect(filterProducts(products, 'acer')).toHaveLength(2);
  });

  it('should filter by model', () => {
    const result = filterProducts(products, 'liquid');
    expect(result).toEqual([product('Acer', 'Liquid Z6')]);
  });

  it('should match brand and model combined in the same term', () => {
    const result = filterProducts(products, 'acer liquid');
    expect(result).toEqual([product('Acer', 'Liquid Z6')]);
  });

  it('should ignore case and diacritics', () => {
    expect(filterProducts(products, 'ÁCER')).toHaveLength(2);
  });

  it('should ignore extra whitespace in the term', () => {
    expect(filterProducts(products, '  acer  ')).toHaveLength(2);
  });

  it('should return an empty list when nothing matches', () => {
    expect(filterProducts(products, 'nokia')).toEqual([]);
  });

  it('should match partial words', () => {
    expect(filterProducts(products, 'ace')).toHaveLength(3);
  });
});
