import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { Breadcrumbs } from './breadcrumbs';

describe('Breadcrumbs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('should render nothing when there are no breadcrumbs', async () => {
    const fixture = TestBed.createComponent(Breadcrumbs);
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('nav')).toBeNull();
  });

  it('should render a link for each navigable breadcrumb and mark the last one as the current page', async () => {
    const fixture = TestBed.createComponent(Breadcrumbs);
    fixture.componentRef.setInput('items', [
      { label: 'Inicio', url: '/' },
      { label: 'Acer Liquid Z6', url: null },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    const links = el.querySelectorAll('a.breadcrumbs__link');
    expect(links).toHaveLength(1);
    expect(links[0].textContent?.trim()).toBe('Inicio');

    const current = el.querySelector('[aria-current="page"]');
    expect(current?.textContent?.trim()).toBe('Acer Liquid Z6');
  });

  it('should render no link when the only breadcrumb is the current page', async () => {
    const fixture = TestBed.createComponent(Breadcrumbs);
    fixture.componentRef.setInput('items', [{ label: 'Inicio', url: null }]);
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('a.breadcrumbs__link')).toHaveLength(0);
    expect(el.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('Inicio');
  });
});
