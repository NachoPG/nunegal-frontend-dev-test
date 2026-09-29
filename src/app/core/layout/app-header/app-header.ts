import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbStore } from '../../breadcrumbs/breadcrumb.store';
import { CartStore } from '../../../features/cart/cart.store';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { CartBadge } from '../cart-badge/cart-badge';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Breadcrumbs, CartBadge],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {
  private readonly breadcrumbStore = inject(BreadcrumbStore);
  private readonly cartStore = inject(CartStore);

  protected readonly breadcrumbs = this.breadcrumbStore.items;
  protected readonly cartCount = this.cartStore.count;
}
