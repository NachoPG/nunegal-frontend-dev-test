export interface AddToCartRequest {
  readonly id: string;
  readonly colorCode: number;
  readonly storageCode: number;
}

export interface AddToCartResponse {
  readonly count: number;
}
