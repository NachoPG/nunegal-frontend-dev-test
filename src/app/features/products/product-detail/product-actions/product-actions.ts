import { Component, computed, input, linkedSignal, output } from '@angular/core';
import type { ProductOption } from '../../data/product.model';
import { OptionSelector } from '../option-selector/option-selector';

export type AddToCartStatus = 'idle' | 'adding' | 'success' | 'error';

export interface AddToCartSelection {
  readonly colorCode: number;
  readonly storageCode: number;
}

@Component({
  selector: 'app-product-actions',
  imports: [OptionSelector],
  templateUrl: './product-actions.html',
  styleUrl: './product-actions.scss',
})
export class ProductActions {
  readonly colors = input.required<readonly ProductOption[]>();
  readonly storages = input.required<readonly ProductOption[]>();
  readonly status = input<AddToCartStatus>('idle');
  readonly add = output<AddToCartSelection>();

  protected readonly selectedColor = linkedSignal<number | null>(() =>
    this.colors().length === 1 ? this.colors()[0].code : null,
  );
  protected readonly selectedStorage = linkedSignal<number | null>(() =>
    this.storages().length === 1 ? this.storages()[0].code : null,
  );

  protected readonly isAdding = computed(() => this.status() === 'adding');

  protected readonly canAdd = computed(
    () => this.selectedColor() !== null && this.selectedStorage() !== null && !this.isAdding(),
  );

  protected onSubmit(): void {
    const colorCode = this.selectedColor();
    const storageCode = this.selectedStorage();
    if (colorCode === null || storageCode === null || this.isAdding()) {
      return;
    }
    this.add.emit({ colorCode, storageCode });
  }
}
