import { Component, computed, input } from '@angular/core';
import { PricePipe } from '../../../../shared/pipes/price.pipe';
import type { ProductDetail } from '../../data/product.model';

const NOT_AVAILABLE = 'No disponible';

@Component({
  selector: 'app-product-description',
  imports: [PricePipe],
  templateUrl: './product-description.html',
  styleUrl: './product-description.scss',
})
export class ProductDescription {
  readonly product = input.required<ProductDetail>();

  protected readonly cpu = computed(() => this.product().specs.cpu ?? NOT_AVAILABLE);
  protected readonly ram = computed(() => this.product().specs.ram ?? NOT_AVAILABLE);
  protected readonly os = computed(() => this.product().specs.os ?? NOT_AVAILABLE);
  protected readonly screenResolution = computed(
    () => this.product().specs.screenResolution ?? NOT_AVAILABLE,
  );
  protected readonly battery = computed(() => this.product().specs.battery ?? NOT_AVAILABLE);
  protected readonly dimensions = computed(() => this.product().specs.dimensions ?? NOT_AVAILABLE);

  protected readonly weight = computed(() => {
    const grams = this.product().specs.weightGrams;
    return grams === null ? NOT_AVAILABLE : `${grams} g`;
  });

  protected readonly cameras = computed(() => {
    const { primary, secondary } = this.product().specs.cameras;
    const lines: string[] = [];
    lines.push(`Principal: ${primary ?? NOT_AVAILABLE}`);
    lines.push(`Frontal: ${secondary ?? NOT_AVAILABLE}`);
    return lines;
  });
}
