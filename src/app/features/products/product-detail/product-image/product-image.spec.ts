import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ProductImage } from './product-image';

describe('ProductImage', () => {
  it('should render the image with its src and alt', async () => {
    const fixture = TestBed.createComponent(ProductImage);
    fixture.componentRef.setInput('src', 'https://example.test/img.jpg');
    fixture.componentRef.setInput('alt', 'Acer Liquid Z6');
    fixture.detectChanges();
    await fixture.whenStable();

    const img = (fixture.nativeElement as HTMLElement).querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://example.test/img.jpg');
    expect(img?.getAttribute('alt')).toBe('Acer Liquid Z6');
  });
});
