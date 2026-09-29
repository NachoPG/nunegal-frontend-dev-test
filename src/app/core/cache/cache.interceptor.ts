import { inject } from '@angular/core';
import { HttpEventType, HttpResponse, type HttpInterceptorFn } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHEABLE } from './cache.context';
import { HttpCacheStore } from './http-cache.store';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || !req.context.get(CACHEABLE)) {
    return next(req);
  }

  const cache = inject(HttpCacheStore);
  const key = req.urlWithParams;
  const cached = cache.read<unknown>(key);

  if (cached !== null) {
    return of(new HttpResponse({ body: cached, status: 200, statusText: 'OK', url: req.url }));
  }

  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response && event.ok) {
        cache.write(key, event.body);
      }
    }),
  );
};
