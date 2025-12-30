import { Component, inject, Input, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Product } from '../../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartStore } from '../../../core/store/cart.store';

@Component({
  selector: 'app-nxs-product-card',
  imports: [
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatIcon,
    MatButton,
    MatIconButton,
    CurrencyPipe,
  ],
  templateUrl: './nxs-product-card.html',
  styleUrl: './nxs-product-card.scss',
})
export class NxsProductCard {
  @Input() public product: Product = {} as Product;

  private readonly cartStore = inject(CartStore);
  public readonly isHovered = signal<boolean>(false);

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
  ) {}

  public handleAdd(): void {
    if (this.product.inStock) {
      this.cartStore.addToCart(this.product);
    }
  }

  public navigateToDetails(): void {
    this._router.navigate([this.product.id, 'details'], { relativeTo: this._route });
  }

  public onMouseEnter(): void {
    this.isHovered.set(true);
  }

  public onMouseLeave(): void {
    this.isHovered.set(false);
  }
}
