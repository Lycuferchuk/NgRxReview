import { Component, Input, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Product } from '../../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

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
  @Input() index = 1;

  public isHovered = signal<boolean>(false);
  public isNew = true;

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _cartService: CartService,
  ) {}

  public handleAdd(): void {
    if (this.product.stock) {
      this._cartService.addToCart(this.product);
    }
  }

  public navigateToDetails(): void {
    this._router.navigate([this.product.id, 'details'], { relativeTo: this._route });
  }
}
