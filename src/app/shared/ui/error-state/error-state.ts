import { Component, input, output } from '@angular/core';
import type { UserFacingError } from '../../../core/errors/user-facing-error';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
})
export class ErrorState {
  readonly error = input.required<UserFacingError>();
  readonly retry = output<void>();
}
