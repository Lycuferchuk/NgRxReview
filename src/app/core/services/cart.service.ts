import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { DataService } from './data.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartKey: string = 'cart';
  private items: CartItem[] = [];

  constructor(private readonly dataService: DataService) {
    this.loadCart();
  }

  public addToCart(product: Product, quantity = 1): void {
    const existing = this.items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        product: product,
        quantity: quantity,
      });
    }

    this.saveCart();
  }

  public removeFromCart(productId: string): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.saveCart();
  }

  public getCart(): CartItem[] {
    return this.items;
  }

  public checkout(): void {
    console.log('Замовлення оформлене:', this.items);
    this.items = [];
    this.saveCart();
  }

  private saveCart(): void {
    this.dataService.saveLocalStorage<CartItem[]>(this.cartKey, this.items);
  }

  private loadCart(): void {
    this.items = this.dataService.loadLocalStorage<CartItem[]>(this.cartKey) || [];
  }
}
