import { Injectable, signal } from '@angular/core';
import { ViewTransitionInfo } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ViewTransitionService {
  public readonly currentTransition = signal<ViewTransitionInfo | null>(null);
}
