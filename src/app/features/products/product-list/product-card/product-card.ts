import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PricePipe } from '../../../../shared/pipes/price.pipe';
import type { ProductSummary } from '../../data/product.model';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, PricePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<ProductSummary>();
  readonly priority = input(false);
}
