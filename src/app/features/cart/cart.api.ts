import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import type { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api.config';
import type { AddToCartRequest, AddToCartResponse } from './cart.model';

@Service()
export class CartApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  add(request: AddToCartRequest): Observable<AddToCartResponse> {
    return this.http.post<AddToCartResponse>(`${this.baseUrl}/api/cart`, request);
  }
}
