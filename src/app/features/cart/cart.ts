import { Component, OnInit } from '@angular/core';
import { PipHeader } from '../../shared/components/pip-header/pip-header';
import { CurrencyPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';

@Component({
  selector: 'app-cart',
  imports: [PipHeader, CurrencyPipe, MatCard, MatButton],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  public items: CartItem[] = [];
  public totalPrice = 0;

  constructor(private readonly _cartService: CartService) {}

  public ngOnInit(): void {
    this.loadCart();
  }

  public removeFromCart(productId: string): void {
    this._cartService.removeFromCart(productId);
    this.calculateTotal();
  }

  // public updateQuantity(): void {}

  public orderCart(): void {
    this._cartService.checkout();
    this.loadCart();
  }

  private loadCart(): void {
    this.items = this._cartService.getCart();
    this.calculateTotal();
  }

  private calculateTotal(): void {
    this.totalPrice = this.items.reduce((sum, item) => sum + item.product.price, 0);
  }
}
