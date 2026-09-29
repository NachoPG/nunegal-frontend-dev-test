import { HttpContext, HttpContextToken } from '@angular/common/http';

export const CACHEABLE = new HttpContextToken<boolean>(() => false);

export function withCache(context: HttpContext = new HttpContext()): HttpContext {
  return context.set(CACHEABLE, true);
}
