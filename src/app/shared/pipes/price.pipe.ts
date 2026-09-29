import { formatCurrency, getCurrencySymbol, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Pipe, type PipeTransform } from '@angular/core';

registerLocaleData(localeEs);

@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
  transform(value: number | null): string {
    if (value === null) {
      return 'Precio no disponible';
    }

    return formatCurrency(value, 'es-ES', getCurrencySymbol('EUR', 'narrow'), 'EUR', '1.2-2');
  }
}
