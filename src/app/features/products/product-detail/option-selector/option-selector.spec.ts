import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OptionSelector } from './option-selector';
import type { ProductOption } from '../../data/product.model';

const options: ProductOption[] = [
  { code: 2000, name: '16 GB' },
  { code: 2001, name: '32 GB' },
];

function setup() {
  const fixture = TestBed.createComponent(OptionSelector);
  fixture.componentRef.setInput('legend', 'Almacenamiento');
  fixture.componentRef.setInput('name', 'storage');
  fixture.componentRef.setInput('options', options);
  return fixture;
}

describe('OptionSelector', () => {
  it('should render every given option', async () => {
    const fixture = setup();
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = (fixture.nativeElement as HTMLElement).querySelectorAll('input[type="radio"]');
    expect(inputs).toHaveLength(2);
  });

  it('should check the option given by selected()', async () => {
    const fixture = setup();
    fixture.componentRef.setInput('selected', 2001);
    fixture.detectChanges();
    await fixture.whenStable();

    const checked = (fixture.nativeElement as HTMLElement).querySelector(
      'input:checked',
    ) as HTMLInputElement;
    expect(checked.id).toBe('storage-2001');
  });

  it('should update selected() when an option is chosen', async () => {
    const fixture = setup();
    fixture.detectChanges();
    await fixture.whenStable();

    const secondInput = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input[type="radio"]',
    )[1] as HTMLInputElement;
    secondInput.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.selected()).toBe(2001);
  });

  it('should render the selector even when there is a single option', async () => {
    const fixture = setup();
    fixture.componentRef.setInput('options', [{ code: 2000, name: '16 GB' }]);
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = (fixture.nativeElement as HTMLElement).querySelectorAll('input[type="radio"]');
    expect(inputs).toHaveLength(1);
  });
});
