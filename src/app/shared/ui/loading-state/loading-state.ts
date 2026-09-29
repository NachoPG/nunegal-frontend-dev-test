import { Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.html',
  styleUrl: './loading-state.scss',
})
export class LoadingState {
  readonly message = input.required<string>();
  readonly slowMessage = input<string | null>(null);
  readonly slowAfterMs = input(4000);

  protected readonly isSlow = signal(false);

  constructor() {
    effect((onCleanup) => {
      const timer = setTimeout(() => this.isSlow.set(true), this.slowAfterMs());
      onCleanup(() => clearTimeout(timer));
    });
  }
}
