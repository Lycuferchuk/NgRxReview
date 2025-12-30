import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NxsNoData } from '../../shared/components/nxs-no-data/nxs-no-data';
import { EmptyStateType } from '../../core/enums/empry-state.enum';
import { CartStore } from '../../core/store/cart.store';

@Component({
  selector: 'app-nxs-cart',
  imports: [
    CurrencyPipe,
    MatCard,
    MatButton,
    MatIcon,
    MatFormField,
    MatIconButton,
    MatInput,
    FormsModule,
    NxsNoData,
  ],
  templateUrl: './nxs-cart.html',
  styleUrl: './nxs-cart.scss',
})
export class CartComponent implements OnInit {
  private readonly cartStore = inject(CartStore);

  public readonly items = this.cartStore.items;
  public readonly totalPrice = this.cartStore.totalPrice;
  public readonly emptyStateType = EmptyStateType;

  public ngOnInit(): void {
    this.cartStore.loadCart();
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

  public updateQuantity(productId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = Math.max(1, parseInt(input.value, 10) || 1);
    this.cartStore.updateQuantity(productId, quantity);
  }

  public checkout(): void {
    this.cartStore.checkout();
  }
}
