import type { ProductSummary } from './product.model';

export function normalizeSearchText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
}

export function filterProducts(
  products: readonly ProductSummary[],
  term: string,
): readonly ProductSummary[] {
  const normalizedTerm = normalizeSearchText(term);
  if (normalizedTerm.length === 0) {
    return products;
  }

  const words = normalizedTerm.split(' ');

  return products.filter((product) => {
    const textNormalized = normalizeSearchText(`${product.brand} ${product.model}`);
    return words.every((word) => textNormalized.includes(word));
  });
}
