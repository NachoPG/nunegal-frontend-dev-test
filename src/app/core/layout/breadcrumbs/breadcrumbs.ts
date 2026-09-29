import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Breadcrumb } from '../../breadcrumbs/breadcrumb.model';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
  readonly items = input.required<readonly Breadcrumb[]>();
}
