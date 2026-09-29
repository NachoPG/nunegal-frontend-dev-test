import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://itx-frontend-test.onrender.com',
});

export const CACHE_TTL_MS = new InjectionToken<number>('CACHE_TTL_MS', {
  providedIn: 'root',
  factory: () => 60 * 60 * 1000,
});

export const REQUEST_TIMEOUT_MS = new InjectionToken<number>('REQUEST_TIMEOUT_MS', {
  providedIn: 'root',
  factory: () => 60 * 1000,
});

export const NOW = new InjectionToken<() => number>('NOW', {
  providedIn: 'root',
  factory: () => () => Date.now(),
});
