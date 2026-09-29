import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { CartBadge } from './cart-badge';

describe('CartBadge', () => {
  it('should display the given count', async () => {
    const fixture = TestBed.createComponent(CartBadge);
    fixture.componentRef.setInput('count', 3);
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.cart-badge__count')?.textContent?.trim()).toBe('3');
  });

  it('should expose an accessible name with the number of products', async () => {
    const fixture = TestBed.createComponent(CartBadge);
    fixture.componentRef.setInput('count', 2);
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.cart-badge')?.getAttribute('aria-label')).toBe('Cesta: 2 productos');
  });

  it('should use the singular form when there is one product', async () => {
    const fixture = TestBed.createComponent(CartBadge);
    fixture.componentRef.setInput('count', 1);
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.cart-badge')?.getAttribute('aria-label')).toBe('Cesta: 1 producto');
  });
});
