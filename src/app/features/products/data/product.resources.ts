import { inject } from '@angular/core';
import { httpResource, type HttpResourceRef } from '@angular/common/http';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../../../core/config/api.config';
import { withCache } from '../../../core/cache/cache.context';
import type { ProductDetail, ProductSummary } from './product.model';
import { parseProductDetail, parseProductList } from './product.mapper';

export function injectProductList(): HttpResourceRef<readonly ProductSummary[]> {
  const baseUrl = inject(API_BASE_URL);
  const timeout = inject(REQUEST_TIMEOUT_MS);

  return httpResource<readonly ProductSummary[]>(
    () => ({
      url: `${baseUrl}/api/product`,
      context: withCache(),
      timeout,
    }),
    {
      parse: parseProductList,
      defaultValue: [],
    },
  );
}

export function injectProductDetail(
  id: () => string | undefined,
): HttpResourceRef<ProductDetail | undefined> {
  const baseUrl = inject(API_BASE_URL);
  const timeout = inject(REQUEST_TIMEOUT_MS);

  return httpResource<ProductDetail>(
    () => {
      const productId = id();
      return productId
        ? { url: `${baseUrl}/api/product/${productId}`, context: withCache(), timeout }
        : undefined;
    },
    {
      parse: parseProductDetail,
    },
  );
}
