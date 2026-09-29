import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { ProductActions } from './product-actions';
import type { ProductOption } from '../../data/product.model';

const oneColor: ProductOption[] = [{ code: 1000, name: 'Black' }];
const twoColors: ProductOption[] = [
  { code: 1000, name: 'Black' },
  { code: 1001, name: 'White' },
];
const oneStorage: ProductOption[] = [{ code: 2000, name: '16 GB' }];
const twoStorages: ProductOption[] = [
  { code: 2000, name: '16 GB' },
  { code: 2001, name: '32 GB' },
];

function setup(colors: ProductOption[], storages: ProductOption[]) {
  const fixture = TestBed.createComponent(ProductActions);
  fixture.componentRef.setInput('colors', colors);
  fixture.componentRef.setInput('storages', storages);
  fixture.detectChanges();
  return fixture;
}

describe('ProductActions', () => {
  it('should preselect the only option when each group has a single one', async () => {
    const fixture = setup(oneColor, oneStorage);
    await fixture.whenStable();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it('should preselect nothing and disable the button when there are several options', async () => {
    const fixture = setup(twoColors, twoStorages);
    await fixture.whenStable();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Selecciona almacenamiento y color.',
    );
  });

  it('should enable the button once both options are chosen', async () => {
    const fixture = setup(twoColors, twoStorages);
    await fixture.whenStable();

    const radios = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>;
    // Un color y un almacenamiento (dos fieldsets con 2 opciones cada uno).
    radios[0].click();
    radios[2].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it('should emit add with the selected codes when the button is clicked', async () => {
    const fixture = setup(oneColor, oneStorage);
    await fixture.whenStable();

    const onAdd = vi.fn();
    fixture.componentInstance.add.subscribe(onAdd);

    (fixture.nativeElement as HTMLElement)
      .querySelector('button')
      ?.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(onAdd).toHaveBeenCalledWith({ colorCode: 1000, storageCode: 2000 });
  });

  it('should show "Añadiendo…" and disable the button while status is "adding"', async () => {
    const fixture = setup(oneColor, oneStorage);
    fixture.componentRef.setInput('status', 'adding');
    fixture.detectChanges();
    await fixture.whenStable();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Añadiendo…');
  });

  it('should reset the selection when switching to a product with several options', async () => {
    const fixture = setup(oneColor, oneStorage);
    await fixture.whenStable();
    expect(fixture.componentInstance['selectedColor']()).toBe(1000);

    fixture.componentRef.setInput('colors', twoColors);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance['selectedColor']()).toBeNull();
  });
});
