import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PipFooter} from './shared/components/pip-footer/pip-footer';
import {PipHeader} from './shared/components/pip-header/pip-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PipFooter, PipHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('NgRxReviewProject');
}
