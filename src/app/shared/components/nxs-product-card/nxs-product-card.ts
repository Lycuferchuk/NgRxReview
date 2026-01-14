import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Product } from '../../../core/models/product.model';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartStore } from '../../../core/store/cart.store';
import { NxsQuantityInput } from '../nxs-quantity-input/nxs-quantity-input';
import { ProductStore } from '../../../core/store/products.store';

@Component({
  selector: 'nxs-product-card',
  imports: [
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatIcon,
    MatButton,
    MatIconButton,
    CurrencyPipe,
    NgOptimizedImage,
    NxsQuantityInput,
  ],
  templateUrl: './nxs-product-card.html',
  styleUrl: './nxs-product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NxsProductCard {
  public readonly product = input.required<Product>();
  private readonly productStore = inject(ProductStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cartStore = inject(CartStore);

  public readonly isInCart = computed(() => this.cartStore.isInCart()(this.product().id));
  public readonly quantity = computed(() => this.cartStore.getQuantity()(this.product().id));

  public handleAdd(): void {
    if (this.product().inStock) {
      this.cartStore.addToCart(this.product());
    }
  }

  public handleIncrease(): void {
    this.cartStore.incrementQuantity(this.product().id);
  }

  public handleDecrease(): void {
    this.cartStore.decrementQuantity(this.product().id);
  }

  public handleRemove(): void {
    this.cartStore.removeFromCart(this.product().id);
  }

  public handleQuantityChange(quantity: number): void {
    this.cartStore.updateQuantity(this.product().id, quantity);
  }

  public navigateToDetails(): void {
    const productId = this.product().id;
    this.productStore.setSelectedProduct(this.product());

    this.router.navigate([productId, 'details'], { relativeTo: this.route });
  }
}
