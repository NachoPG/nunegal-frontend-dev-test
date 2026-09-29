import { Component, input, model } from '@angular/core';
import type { ProductOption } from '../../data/product.model';

@Component({
  selector: 'app-option-selector',
  templateUrl: './option-selector.html',
  styleUrl: './option-selector.scss',
})
export class OptionSelector {
  readonly legend = input.required<string>();
  readonly name = input.required<string>();
  readonly options = input.required<readonly ProductOption[]>();
  readonly selected = model<number | null>(null);

  protected optionId(code: number): string {
    return `${this.name()}-${code}`;
  }
}
