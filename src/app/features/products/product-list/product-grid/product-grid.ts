import { Component, input } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import type { ProductSummary } from '../../data/product.model';

const PRIORITY_COUNT = 4;

@Component({
  selector: 'app-product-grid',
  imports: [ProductCard],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid {
  readonly products = input.required<readonly ProductSummary[]>();

  protected isPriority(index: number): boolean {
    return index < PRIORITY_COUNT;
  }
}
