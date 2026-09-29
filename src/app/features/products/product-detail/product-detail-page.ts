import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbStore } from '../../../core/breadcrumbs/breadcrumb.store';
import { SLOW_RESPONSE_NOTICE, toUserFacingError } from '../../../core/errors/user-facing-error';
import { CartStore } from '../../cart/cart.store';
import { injectProductDetail } from '../data/product.resources';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import {
  ProductActions,
  type AddToCartSelection,
  type AddToCartStatus,
} from './product-actions/product-actions';
import { ProductDescription } from './product-description/product-description';
import { ProductImage } from './product-image/product-image';

@Component({
  selector: 'app-product-detail-page',
  imports: [RouterLink, LoadingState, ErrorState, ProductImage, ProductDescription, ProductActions],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.scss',
})
export class ProductDetailPage {
  readonly id = input.required<string>();

  private readonly breadcrumbStore = inject(BreadcrumbStore);
  private readonly cartStore = inject(CartStore);

  protected readonly product = injectProductDetail(this.id);
  protected readonly slowNotice = SLOW_RESPONSE_NOTICE;

  protected readonly detailError = computed(() => {
    const error = this.product.error();
    return error ? toUserFacingError(error, 'detail') : null;
  });

  protected readonly addStatus = signal<AddToCartStatus>('idle');
  protected readonly addMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const error = this.detailError();
      if (error) {
        this.breadcrumbStore.set([
          { label: 'Inicio', url: '/' },
          {
            label: error.kind === 'not-found' ? 'Producto no encontrado' : 'Detalle del producto',
            url: null,
          },
        ]);
        return;
      }

      const product = this.product.value();
      this.breadcrumbStore.set([
        { label: 'Inicio', url: '/' },
        {
          label: product ? `${product.brand} ${product.model}` : 'Detalle del producto',
          url: null,
        },
      ]);
    });
  }

  protected reload(): void {
    this.product.reload();
  }

  protected async onAdd(selection: AddToCartSelection): Promise<void> {
    const product = this.product.value();
    if (!product) {
      return;
    }

    this.addStatus.set('adding');
    this.addMessage.set(null);

    try {
      await this.cartStore.add({ id: product.id, ...selection });
      this.addStatus.set('success');
      this.addMessage.set('Añadido a la cesta.');
    } catch {
      this.addStatus.set('error');
      this.addMessage.set('No se ha podido añadir. Inténtalo de nuevo.');
    }
  }
}
