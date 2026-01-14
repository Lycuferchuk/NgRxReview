import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NxsNoData } from '../../shared/components/nxs-no-data/nxs-no-data';
import { EmptyStateType } from '../../core/enums/empry-state.enum';
import { CartStore } from '../../core/store/cart.store';
import { Router } from '@angular/router';
import { NxsQuantityInput } from '../../shared/components/nxs-quantity-input/nxs-quantity-input';

@Component({
  selector: 'nxs-cart',
  imports: [
    CurrencyPipe,
    MatCard,
    MatButton,
    MatIcon,
    MatIconButton,
    FormsModule,
    NxsNoData,
    NxsQuantityInput,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit {
  private readonly cartStore = inject(CartStore);
  private readonly router = inject(Router);

  public readonly items = this.cartStore.items;
  public readonly totalPrice = this.cartStore.totalPrice;
  public readonly emptyStateType = EmptyStateType;

  public ngOnInit(): void {
    this.cartStore.loadCart();
  }

  public goBack(): void {
    this.router.navigate(['products']);
  }

  public removeFromCart(productId: string): void {
    this.cartStore.removeFromCart(productId);
  }

  public increaseQuantity(productId: string): void {
    this.cartStore.incrementQuantity(productId);
  }

  public decreaseQuantity(productId: string): void {
    this.cartStore.decrementQuantity(productId);
  }

  public updateQuantity(productId: string, quantity: number): void {
    this.cartStore.updateQuantity(productId, quantity);
  }

  public checkout(): void {
    this.cartStore.checkout();
  }
}
