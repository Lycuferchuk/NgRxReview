import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { DataService } from './data.service';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cartCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private readonly cartKey: string = 'cart';
  private items: CartItem[] = [];

  constructor(private readonly dataService: DataService) {
    this.loadCart();
  }

  public addToCart(product: Product, quantity = 1): void {
    const existing = this.items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += quantity;
      existing.totalPrice += existing.product.price * quantity;
    } else {
      this.items.push({
        product: product,
        quantity: quantity,
        totalPrice: product.price * quantity,
      });
    }
    this.updateCartCount();
    this.saveCart();
  }

  public removeFromCart(productId: string): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.updateCartCount();
    this.saveCart();
  }

  public getCart(): CartItem[] {
    return this.items;
  }

  public checkout(): void {
    console.log('Замовлення оформлене:', this.items);
    this.items = [];
    this.updateCartCount();
    this.saveCart();
  }

  public saveUpdatedItem(item: CartItem): void {
    const index = this.items.findIndex((item) => item.product.id === item.product.id);
    if (index !== -1) {
      this.items[index] = { ...item };
      this.updateCartCount();
      this.saveCart();
    }
  }

  private saveCart(): void {
    this.dataService.saveLocalStorage<CartItem[]>(this.cartKey, this.items);
  }

  private loadCart(): void {
    this.items = this.dataService.loadLocalStorage<CartItem[]>(this.cartKey) || [];
  }

  private updateCartCount(): void {
    const sum = this.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
    this.cartCount$.next(sum);
  }
}
