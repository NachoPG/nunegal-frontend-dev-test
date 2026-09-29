import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { BreadcrumbStore } from '../../breadcrumbs/breadcrumb.store';
import { BROWSER_STORAGE } from '../../storage/browser-storage.token';
import { AppHeader } from './app-header';

function createFakeStorage(initial: Record<string, string> = {}): Storage {
  const backing = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => backing.get(key) ?? null,
    setItem: (key: string, value: string) => backing.set(key, value),
    removeItem: (key: string) => backing.delete(key),
    clear: () => backing.clear(),
    key: () => null,
    get length() {
      return backing.size;
    },
  } as Storage;
}

function setup(storage: Storage | null = createFakeStorage()) {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: BROWSER_STORAGE, useValue: storage }],
  });
  return TestBed.createComponent(AppHeader);
}

describe('AppHeader', () => {
  it('should link the title to the home page', async () => {
    const fixture = setup();
    fixture.detectChanges();
    await fixture.whenStable();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a.app-header__brand');
    expect(link?.getAttribute('href')).toBe('/');
  });

  it('should display the CartStore count', async () => {
    const fixture = setup(createFakeStorage({ 'cart:count': JSON.stringify(4) }));
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.cart-badge__count')?.textContent?.trim()).toBe('4');
  });

  it('should display the breadcrumbs published in BreadcrumbStore', async () => {
    const fixture = setup();
    const breadcrumbStore = TestBed.inject(BreadcrumbStore);
    breadcrumbStore.set([{ label: 'Inicio', url: null }]);
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('nav')).not.toBeNull();
    expect(el.textContent).toContain('Inicio');
  });
});
