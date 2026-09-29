import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LoadingState } from './loading-state';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function setup(inputs: { slowMessage?: string | null; slowAfterMs?: number }) {
  const fixture = TestBed.createComponent(LoadingState);
  fixture.componentRef.setInput('message', 'Cargando productos…');
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

describe('LoadingState', () => {
  it('should display the given message in a role="status" region', async () => {
    const fixture = setup({});
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[role="status"]')?.textContent).toContain('Cargando productos…');
  });

  it('should not show the slow-response notice before the threshold', async () => {
    const fixture = setup({ slowMessage: 'Tarda más de lo habitual', slowAfterMs: 1000 });
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain(
      'Tarda más de lo habitual',
    );
  });

  it('should show the slow-response notice inside the role="status" region after the threshold', async () => {
    const fixture = setup({ slowMessage: 'Tarda más de lo habitual', slowAfterMs: 10 });
    await wait(30);
    fixture.detectChanges();
    await fixture.whenStable();

    const status = (fixture.nativeElement as HTMLElement).querySelector('[role="status"]');
    expect(status?.textContent).toContain('Tarda más de lo habitual');
  });

  it('should not show any notice when no slowMessage is given', async () => {
    const fixture = setup({ slowAfterMs: 10 });
    await wait(30);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.loading-state__notice'),
    ).toBeNull();
  });
});
