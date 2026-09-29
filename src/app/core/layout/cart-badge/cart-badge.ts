import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cart-badge',
  templateUrl: './cart-badge.html',
  styleUrl: './cart-badge.scss',
})
export class CartBadge {
  readonly count = input.required<number>();
}
