import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BreadcrumbStore } from './breadcrumb.store';

describe('BreadcrumbStore', () => {
  it('should start with no breadcrumbs', () => {
    const store = TestBed.inject(BreadcrumbStore);
    expect(store.items()).toEqual([]);
  });

  it('should replace the current breadcrumbs when set() is called', () => {
    const store = TestBed.inject(BreadcrumbStore);

    store.set([{ label: 'Inicio', url: null }]);
    expect(store.items()).toEqual([{ label: 'Inicio', url: null }]);

    store.set([
      { label: 'Inicio', url: '/' },
      { label: 'Acer Liquid Z6', url: null },
    ]);
    expect(store.items()).toEqual([
      { label: 'Inicio', url: '/' },
      { label: 'Acer Liquid Z6', url: null },
    ]);
  });
});
