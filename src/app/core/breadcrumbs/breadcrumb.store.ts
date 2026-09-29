import { Service, signal } from '@angular/core';
import type { Breadcrumb } from './breadcrumb.model';

@Service()
export class BreadcrumbStore {
  private readonly itemsSignal = signal<readonly Breadcrumb[]>([]);
  readonly items = this.itemsSignal.asReadonly();

  set(items: readonly Breadcrumb[]): void {
    this.itemsSignal.set(items);
  }
}
