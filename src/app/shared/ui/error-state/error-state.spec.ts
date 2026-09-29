import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from './error-state';

describe('ErrorState', () => {
  it('should display the error message in a role="alert" region', async () => {
    const fixture = TestBed.createComponent(ErrorState);
    fixture.componentRef.setInput('error', { kind: 'network', message: 'Sin conexión' });
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Sin conexión');
  });

  it('should emit retry when the "Reintentar" button is clicked', async () => {
    const fixture = TestBed.createComponent(ErrorState);
    fixture.componentRef.setInput('error', { kind: 'server', message: 'Error' });
    const onRetry = vi.fn();
    fixture.componentInstance.retry.subscribe(onRetry);
    fixture.detectChanges();
    await fixture.whenStable();

    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
