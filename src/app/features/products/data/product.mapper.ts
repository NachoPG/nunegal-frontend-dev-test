import type { ProductDetailDto, ProductSummaryDto } from './product.dto';
import type { ProductDetail, ProductOption, ProductSpecs, ProductSummary } from './product.model';

export function toDisplayText(value: unknown): string | null {
  let text = '';
  if (Array.isArray(value)) {
    text = value.filter((part): part is string => typeof part === 'string').join(', ');
  } else if (typeof value === 'string' || typeof value === 'number') {
    text = String(value);
  }

  const trimmed = text.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function toPrice(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function toWeightGrams(value: unknown): number | null {
  return toPrice(value);
}

// Without an `id`, you can't link to the details, and without a brand or model, the card
// would be empty: those records are discarded rather than breaking up the list.
export function isUsableProduct(value: unknown): value is ProductSummaryDto {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { id, brand, model } = value as Record<string, unknown>;
  const hasId = typeof id === 'string' && id.trim().length > 0;
  return hasId && (toDisplayText(brand) !== null || toDisplayText(model) !== null);
}

export function toProductSummary(dto: ProductSummaryDto): ProductSummary {
  return {
    id: dto.id,
    brand: toDisplayText(dto.brand) ?? '',
    model: toDisplayText(dto.model) ?? '',
    price: toPrice(dto.price),
    imageUrl: typeof dto.imgUrl === 'string' ? dto.imgUrl : '',
  };
}

const UNNAMED_OPTION = 'No especificado';

function hasValidCode(value: unknown): value is { code: number; name?: unknown } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const { code } = value as Record<string, unknown>;
  return typeof code === 'number' && Number.isFinite(code);
}

function toOptions(value: unknown): readonly ProductOption[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter(hasValidCode)
    .map(({ code, name }) => ({ code, name: toDisplayText(name) ?? UNNAMED_OPTION }));
}

function toSpecs(dto: ProductDetailDto): ProductSpecs {
  return {
    cpu: toDisplayText(dto.cpu),
    ram: toDisplayText(dto.ram),
    os: toDisplayText(dto.os),
    screenResolution: toDisplayText(dto.displaySize),
    battery: toDisplayText(dto.battery),
    cameras: {
      primary: toDisplayText(dto.primaryCamera),
      secondary: toDisplayText(dto.secondaryCmera),
    },
    dimensions: toDisplayText(dto.dimentions),
    weightGrams: toWeightGrams(dto.weight),
  };
}

export function toProductDetail(dto: ProductDetailDto): ProductDetail {
  return {
    ...toProductSummary(dto),
    specs: toSpecs(dto),
    colors: toOptions(dto.options?.colors),
    storages: toOptions(dto.options?.storages),
  };
}

export function parseProductList(value: unknown): readonly ProductSummary[] {
  if (!Array.isArray(value)) {
    throw new TypeError('La respuesta del listado de productos no es un array.');
  }
  return value.filter(isUsableProduct).map(toProductSummary);
}

export function parseProductDetail(value: unknown): ProductDetail {
  if (!isUsableProduct(value)) {
    throw new TypeError('La respuesta del detalle de producto no es un producto válido.');
  }
  return toProductDetail(value);
}
