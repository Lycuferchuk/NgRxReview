import { Component, OnInit } from '@angular/core';
import { PipHeader } from '../../shared/components/pip-header/pip-header';
import { Product } from '../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-cart',
  imports: [PipHeader, CurrencyPipe, MatCard, MatButton],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  public items: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'Новий флагман Apple з надшвидким процесором A17 Bionic та покращеною камерою.',
      price: 1200,
      brand: 'Apple',
      type: 'Smartphone',
      imageUrl: 'assets/images/iphone15pro.jpg',
      features: ['6.1 inch display', '48MP camera', '128GB storage'],
      stock: 10,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Samsung Galaxy S23',
      description: 'Смартфон з великим AMOLED дисплеєм та високою автономністю.',
      price: 999,
      brand: 'Samsung',
      type: 'Smartphone',
      imageUrl: 'assets/images/galaxys23.jpg',
      features: ['6.2 inch display', '50MP camera', '256GB storage'],
      stock: 15,
      rating: 4.6,
    },
    {
      id: '3',
      name: 'Xiaomi 14 Pro',
      description: 'Флагманський смартфон з AMOLED дисплеєм та потужним процесором.',
      price: 850,
      brand: 'Xiaomi',
      type: 'Smartphone',
      imageUrl: 'assets/images/xiaomi14pro.jpg',
      features: ['6.73 inch display', '200MP camera', '256GB storage'],
      stock: 12,
      rating: 4.5,
    },
  ];
  public totalPrice = 0;

  constructor() {
    /* empty */
  }

  public ngOnInit(): void {
    this.calculateTotal();
  }

  public removeFromCart(productId: string): void {
    console.log(productId);
    this.calculateTotal();
  }

  private calculateTotal(): void {
    this.totalPrice = this.items.reduce((sum, p) => sum + p.price, 0);
  }
}
