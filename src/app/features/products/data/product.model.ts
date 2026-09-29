export interface ProductSummary {
  readonly id: string;
  readonly brand: string;
  readonly model: string;
  readonly price: number | null;
  readonly imageUrl: string;
}

export interface ProductOption {
  readonly code: number;
  readonly name: string;
}

export interface ProductSpecs {
  readonly cpu: string | null;
  readonly ram: string | null;
  readonly os: string | null;
  readonly screenResolution: string | null;
  readonly battery: string | null;
  readonly cameras: {
    readonly primary: string | null;
    readonly secondary: string | null;
  };
  readonly dimensions: string | null;
  readonly weightGrams: number | null;
}

export interface ProductDetail extends ProductSummary {
  readonly specs: ProductSpecs;
  readonly colors: readonly ProductOption[];
  readonly storages: readonly ProductOption[];
}
