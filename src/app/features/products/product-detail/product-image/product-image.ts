import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.html',
  styleUrl: './product-image.scss',
})
export class ProductImage {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
}
