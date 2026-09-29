export type ApiText = string | readonly string[];

export interface ProductSummaryDto {
  readonly id: string;
  readonly brand?: string;
  readonly model?: string;
  readonly price?: string;
  readonly imgUrl?: string;
}

export interface ProductOptionDto {
  readonly code?: number;
  readonly name?: string;
}

export interface ProductOptionsDto {
  readonly colors?: readonly ProductOptionDto[];
  readonly storages?: readonly ProductOptionDto[];
}

export interface ProductDetailDto extends ProductSummaryDto {
  readonly cpu?: ApiText;
  readonly ram?: ApiText;
  readonly os?: ApiText;
  readonly displayResolution?: string;
  readonly displaySize?: string;
  readonly battery?: ApiText;
  readonly primaryCamera?: ApiText;
  readonly secondaryCmera?: ApiText;
  readonly dimentions?: string;
  readonly weight?: string;
  readonly options?: ProductOptionsDto;
}
