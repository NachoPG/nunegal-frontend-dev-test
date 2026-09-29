import { describe, expect, it } from 'vitest';
import type { ProductDetailDto, ProductSummaryDto } from './product.dto';
import {
  isUsableProduct,
  parseProductDetail,
  parseProductList,
  toDisplayText,
  toPrice,
  toProductDetail,
  toProductSummary,
} from './product.mapper';
import productListFixture from '../../../../testing/fixtures/product-list.json';
import normalFixture from '../../../../testing/fixtures/product-detail-normal.json';
import arraysFixture from '../../../../testing/fixtures/product-detail-arrays.json';
import singleOptionFixture from '../../../../testing/fixtures/product-detail-single-option.json';
import multiOptionFixture from '../../../../testing/fixtures/product-detail-multi-option.json';
import emptyWeightFixture from '../../../../testing/fixtures/product-detail-empty-weight.json';

describe('toDisplayText', () => {
  it('should keep a non-empty string as is', () => {
    expect(toDisplayText('Android 6.0 (Marshmallow)')).toBe('Android 6.0 (Marshmallow)');
  });

  it('should join an array of fragments with ", "', () => {
    expect(toDisplayText(['13 MP', 'autofocus'])).toBe('13 MP, autofocus');
  });

  it('should return null for an empty string', () => {
    expect(toDisplayText('')).toBeNull();
  });

  it('should return null for a whitespace-only string', () => {
    expect(toDisplayText('   ')).toBeNull();
  });

  it('should return null for an empty array', () => {
    expect(toDisplayText([])).toBeNull();
  });

  it('should return null when there is no value', () => {
    expect(toDisplayText(undefined)).toBeNull();
  });
});

describe('toPrice', () => {
  it('should convert a numeric price string to a number', () => {
    expect(toPrice('170')).toBe(170);
  });

  it('should return null for an empty string', () => {
    expect(toPrice('')).toBeNull();
  });

  it('should return null for a non-numeric value', () => {
    expect(toPrice('n/a')).toBeNull();
  });
});

describe('toProductSummary', () => {
  it('should map brand, model, price and image from the real API list', () => {
    const dto = (productListFixture as ProductSummaryDto[])[0];
    const summary = toProductSummary(dto);

    expect(summary).toEqual({
      id: dto.id,
      brand: dto.brand,
      model: dto.model,
      price: Number(dto.price),
      imageUrl: dto.imgUrl,
    });
  });

  it('should set the price to null when the list item has an empty price', () => {
    const withoutPrice = (productListFixture as ProductSummaryDto[]).find((p) => p.price === '');
    expect(withoutPrice).toBeDefined();

    const summary = toProductSummary(withoutPrice!);
    expect(summary.price).toBeNull();
  });
});

describe('toProductDetail', () => {
  it('should normalize a detail whose fields are all plain strings', () => {
    const dto = normalFixture as ProductDetailDto;
    const detail = toProductDetail(dto);

    expect(detail.specs.cpu).toBe(dto.cpu);
    expect(detail.specs.ram).toBe(dto.ram);
    expect(detail.specs.os).toBe(dto.os);
    // displaySize (píxeles), no displayResolution (pulgadas): los campos están intercambiados.
    expect(detail.specs.screenResolution).toBe(dto.displaySize);
    expect(detail.specs.screenResolution).not.toBe(dto.displayResolution);
    expect(detail.specs.dimensions).toBe(dto.dimentions);
    expect(detail.specs.cameras.secondary).toBe((dto.secondaryCmera as string[]).join(', '));
    expect(detail.specs.weightGrams).toBe(Number(dto.weight));
  });

  it('should normalize array fields (cpu) and an empty price', () => {
    const dto = arraysFixture as ProductDetailDto;
    const detail = toProductDetail(dto);

    expect(detail.price).toBeNull();
    expect(detail.specs.cpu).toBe((dto.cpu as string[]).join(', '));
    expect(detail.specs.cameras.primary).toBe((dto.primaryCamera as string[]).join(', '));
    expect(detail.specs.cameras.secondary).toBe((dto.secondaryCmera as string[]).join(', '));
  });

  it('should keep a single color and storage option', () => {
    const detail = toProductDetail(singleOptionFixture as ProductDetailDto);

    expect(detail.colors).toHaveLength(1);
    expect(detail.storages).toHaveLength(1);
  });

  it('should keep multiple color and storage options', () => {
    const detail = toProductDetail(multiOptionFixture as ProductDetailDto);

    expect(detail.colors.length).toBeGreaterThan(1);
    expect(detail.storages.length).toBeGreaterThan(1);
  });

  it('should set the weight to null when the API omits it', () => {
    const detail = toProductDetail(emptyWeightFixture as ProductDetailDto);
    expect(detail.specs.weightGrams).toBeNull();
  });
});

describe('incomplete or mistyped data', () => {
  it('should accept numbers and skip non-string array items in toDisplayText', () => {
    expect(toDisplayText(260)).toBe('260');
    expect(toDisplayText(['13 MP', null, 5, 'autofocus'])).toBe('13 MP, autofocus');
    expect(toDisplayText({ unexpected: true })).toBeNull();
  });

  it('should accept a number and return null for a missing field in toPrice', () => {
    expect(toPrice(170)).toBe(170);
    expect(toPrice(undefined)).toBeNull();
    expect(toPrice(Number.NaN)).toBeNull();
  });

  it('should require an id and at least a brand or model in isUsableProduct', () => {
    expect(isUsableProduct({ id: 'a', brand: 'Acer' })).toBe(true);
    expect(isUsableProduct({ id: 'a', model: 'Liquid' })).toBe(true);
    expect(isUsableProduct({ brand: 'Acer', model: 'Liquid' })).toBe(false);
    expect(isUsableProduct({ id: '  ', brand: 'Acer' })).toBe(false);
    expect(isUsableProduct({ id: 'a' })).toBe(false);
    expect(isUsableProduct(null)).toBe(false);
    expect(isUsableProduct('a')).toBe(false);
  });
});

describe('parseProductList', () => {
  it('should discard only unusable records and keep the rest', () => {
    const products = parseProductList([
      { id: 'ok-1', brand: 'Acer', model: 'Liquid Z6', price: '120', imgUrl: 'x.jpg' },
      { brand: 'Sin id', model: 'X' },
      null,
      { id: 'sin-marca-ni-modelo', price: '99' },
      { id: 'ok-2', brand: 'Alcatel', model: 'Flash' },
    ]);

    expect(products.map((p) => p.id)).toEqual(['ok-1', 'ok-2']);
  });

  it('should not throw when a record is missing optional fields', () => {
    const [product] = parseProductList([{ id: 'x', brand: 'Acer' }]);

    expect(product).toEqual({ id: 'x', brand: 'Acer', model: '', price: null, imageUrl: '' });
  });

  it('should throw when the response is not an array', () => {
    expect(() => parseProductList({ error: 'boom' })).toThrow(TypeError);
  });
});

describe('parseProductDetail', () => {
  it('should return empty option lists instead of throwing when options are missing', () => {
    const detail = parseProductDetail({ id: 'x', brand: 'Acer', model: 'Liquid' });

    expect(detail.colors).toEqual([]);
    expect(detail.storages).toEqual([]);
    expect(detail.price).toBeNull();
    expect(detail.specs.cpu).toBeNull();
    expect(detail.specs.weightGrams).toBeNull();
  });

  it('should discard options without a numeric code and keep the valid ones', () => {
    const detail = parseProductDetail({
      id: 'x',
      brand: 'Acer',
      options: {
        colors: [
          { code: 1000, name: 'Black' },
          { code: '1001', name: 'White' },
          { name: 'Sin código' },
        ],
        storages: 'no es un array',
      },
    });

    expect(detail.colors).toEqual([{ code: 1000, name: 'Black' }]);
    expect(detail.storages).toEqual([]);
  });

  it('should keep an option with a blank name and give it a default name (real case: Acer DX650)', () => {
    const detail = parseProductDetail({
      id: 'mQWbDUsIUEPZy2My8Qxvl',
      brand: 'Acer',
      model: 'DX650',
      options: { colors: [{ code: 1000, name: 'Black' }], storages: [{ code: 2000, name: ' ' }] },
    });

    expect(detail.storages).toEqual([{ code: 2000, name: 'No especificado' }]);
  });

  it('should throw when the record is not a usable product', () => {
    expect(() => parseProductDetail({ brand: 'Acer' })).toThrow(TypeError);
    expect(() => parseProductDetail(null)).toThrow(TypeError);
  });

  it('should match toProductDetail for a complete real record', () => {
    expect(parseProductDetail(normalFixture)).toEqual(
      toProductDetail(normalFixture as ProductDetailDto),
    );
  });
});
