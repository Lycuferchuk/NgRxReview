import { Directive, computed, inject, input } from '@angular/core';
import { ViewTransitionService } from '../services/view-transition.service';

@Directive({
  selector: '[nxsViewTransition]',
  standalone: true,
  host: { '[style.view-transition-name]': 'viewTransitionName()' },
})
export class ViewTransitionDirective {
  private readonly viewTransitionService = inject(ViewTransitionService);

  public readonly nxsViewTransition = input.required<string>();
  public readonly nxsViewTransitionId = input.required<string>();

  protected readonly viewTransitionName = computed(() => {
    const currentTransition = this.viewTransitionService.currentTransition();

    if (!currentTransition) {
      return 'none';
    }

    const toId = currentTransition.to.firstChild?.params?.['productId'];
    const fromId = currentTransition.from.firstChild?.params?.['productId'];

    const shouldApply =
      toId === this.nxsViewTransitionId() || fromId === this.nxsViewTransitionId();

    return shouldApply ? this.nxsViewTransition() : 'none';
  });
}
