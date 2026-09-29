import { inject, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SafeStorage } from '../../core/storage/safe-storage';
import { CartApi } from './cart.api';
import type { AddToCartRequest } from './cart.model';

const STORAGE_KEY = 'cart:count';

function isValidCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

@Service()
export class CartStore {
  private readonly storage = inject(SafeStorage);
  private readonly cartApi = inject(CartApi);
  private readonly countSignal = signal(this.restore());
  readonly count = this.countSignal.asReadonly();

  private restore(): number {
    const stored = this.storage.getItem<number>(STORAGE_KEY);
    return isValidCount(stored) ? stored : 0;
  }

  private persist(count: number): void {
    this.countSignal.set(count);
    this.storage.setItem(STORAGE_KEY, count);
  }

  async add(request: AddToCartRequest): Promise<number> {
    const response = await firstValueFrom(this.cartApi.add(request));
    const next = this.countSignal() + response.count;
    this.persist(next);
    return next;
  }
}
