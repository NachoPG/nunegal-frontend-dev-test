import { InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage | null>('BROWSER_STORAGE', {
  providedIn: 'root',
  factory: (): Storage | null => {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const probeKey = '__storage_probe__';
      localStorage.setItem(probeKey, '1');
      localStorage.removeItem(probeKey);
      return localStorage;
    } catch {
      return null;
    }
  },
});
