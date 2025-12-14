import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NxsNoData } from '../../shared/components/nxs-no-data/nxs-no-data';
import { EmptyStateType } from '../../core/enums/empry-state.enum';

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
  public items: CartItem[] = [];
  public totalPrice = 0;
  public readonly emptyStateType = EmptyStateType;

  constructor(private readonly _cartService: CartService) {}

  public ngOnInit(): void {
    this.loadCart();
  }

  public removeFromCart(productId: string): void {
    this._cartService.removeFromCart(productId);
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.calculateTotal();
  }
  public increaseQuantity(item: CartItem): void {
    item.quantity++;
    item.totalPrice = item.product.price * item.quantity;

    this._cartService.saveUpdatedItem(item);
    this.calculateTotal();
  }

  public decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      item.totalPrice = item.product.price * item.quantity;

      this._cartService.saveUpdatedItem(item);
      this.calculateTotal();
    }
  }

  public validateQuantity(item: CartItem): void {
    if (!item.quantity || item.quantity < 1) {
      item.quantity = 1;
    }
    item.totalPrice = item.product.price * item.quantity;

    this._cartService.saveUpdatedItem(item);
    this.calculateTotal();
  }

  public orderCart(): void {
    this._cartService.checkout();
    this.loadCart();
  }

  private loadCart(): void {
    this.items = this._cartService.getCart();
    this.calculateTotal();
  }

  private calculateTotal(): void {
    this.totalPrice = this.items.reduce((sum: number, item) => sum + item.totalPrice, 0);
  }
}
