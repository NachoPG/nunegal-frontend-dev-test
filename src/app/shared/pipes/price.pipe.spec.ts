import { describe, expect, it } from 'vitest';
import { PricePipe } from './price.pipe';

describe('PricePipe', () => {
  const pipe = new PricePipe();

  it('should format a number as a euro price (es-ES)', () => {
    expect(pipe.transform(170)).toBe('170,00 €');
  });

  it('should format with two decimals', () => {
    expect(pipe.transform(99.9)).toBe('99,90 €');
  });

  it('should return "Precio no disponible" when the value is null', () => {
    expect(pipe.transform(null)).toBe('Precio no disponible');
  });
});
