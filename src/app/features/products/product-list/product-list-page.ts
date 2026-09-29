import { Component, computed, inject, signal } from '@angular/core';
import { BreadcrumbStore } from '../../../core/breadcrumbs/breadcrumb.store';
import { SLOW_RESPONSE_NOTICE, toUserFacingError } from '../../../core/errors/user-facing-error';
import { filterProducts } from '../data/product-search';
import { injectProductList } from '../data/product.resources';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { ProductGrid } from './product-grid/product-grid';
import { SearchBar } from './search-bar/search-bar';

@Component({
  selector: 'app-product-list-page',
  imports: [LoadingState, ErrorState, EmptyState, SearchBar, ProductGrid],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
})
export class ProductListPage {
  protected readonly products = injectProductList();
  protected readonly slowNotice = SLOW_RESPONSE_NOTICE;
  protected readonly searchTerm = signal('');

  protected readonly listError = computed(() => {
    const error = this.products.error();
    return error ? toUserFacingError(error, 'list') : null;
  });

  protected readonly visibleProducts = computed(() =>
    filterProducts(this.products.value(), this.searchTerm()),
  );

  constructor() {
    inject(BreadcrumbStore).set([{ label: 'Inicio', url: null }]);
  }

  protected reload(): void {
    this.products.reload();
  }
}
