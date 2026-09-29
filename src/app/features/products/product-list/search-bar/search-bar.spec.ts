import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { SearchBar } from './search-bar';

function setup() {
  const fixture = TestBed.createComponent(SearchBar);
  fixture.componentRef.setInput('resultCount', 5);
  return fixture;
}

describe('SearchBar', () => {
  it('should update term() on every keystroke without a submit button', async () => {
    const fixture = setup();
    fixture.detectChanges();
    await fixture.whenStable();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    input.value = 'acer';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.term()).toBe('acer');
  });

  it('should announce the number of results', async () => {
    const fixture = setup();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[aria-live]')?.textContent,
    ).toContain('5 resultados');
  });

  it('should use the singular form when there is one result', async () => {
    const fixture = setup();
    fixture.componentRef.setInput('resultCount', 1);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[aria-live]')?.textContent,
    ).toContain('1 resultado');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[aria-live]')?.textContent,
    ).not.toContain('resultados');
  });

  it('should show the clear button only when there is text and clear the search on click', async () => {
    const fixture = setup();
    fixture.componentInstance.term.set('acer');
    fixture.detectChanges();
    await fixture.whenStable();

    const clearButton = (fixture.nativeElement as HTMLElement).querySelector(
      'button.search-bar__clear',
    ) as HTMLButtonElement;
    expect(clearButton).not.toBeNull();

    clearButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.term()).toBe('');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('button.search-bar__clear'),
    ).toBeNull();
  });
});
