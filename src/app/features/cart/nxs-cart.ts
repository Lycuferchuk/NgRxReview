import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CartItem } from '../../core/models/cart-item.model';
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

  public readonly items = this.cartStore.itemsSignal;
  public readonly totalPrice = this.cartStore.totalPrice;
  public readonly emptyStateType = EmptyStateType;

  public ngOnInit(): void {
    this.cartStore.loadCart();
  }

  public removeFromCart(productId: string): void {
    this.cartStore.removeFromCart(productId);
  }

  public increaseQuantity(item: CartItem): void {
    this.cartStore.saveUpdatedItem({
      ...item,
      quantity: item.quantity + 1,
      totalPrice: (item.quantity + 1) * item.product.price,
    });
  }

  public decreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      return;
    }

    this.cartStore.saveUpdatedItem({
      ...item,
      quantity: item.quantity - 1,
      totalPrice: (item.quantity - 1) * item.product.price,
    });
  }

  public validateQuantity(item: CartItem): void {
    const quantity = item.quantity < 1 ? 1 : item.quantity;

    this.cartStore.saveUpdatedItem({
      ...item,
      quantity,
      totalPrice: quantity * item.product.price,
    });
  }

  public orderCart(): void {
    this.cartStore.checkout();
  }
}
