import { Component, Input, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Product } from '../../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatIcon,
    MatButton,
    MatIconButton,
    CurrencyPipe,
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
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

  public navigateToDetails(product: Product): void {
    this._router.navigate([product.id, 'details'], { relativeTo: this._route });
  }
}
