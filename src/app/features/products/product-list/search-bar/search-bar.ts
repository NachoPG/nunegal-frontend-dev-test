import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  readonly term = model('');
  readonly resultCount = input.required<number>();

  protected onInput(event: Event): void {
    this.term.set((event.target as HTMLInputElement).value);
  }
}
