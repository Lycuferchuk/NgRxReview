import { Component, Input } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Product } from '../../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatCardTitle,
    MatCardSubtitle,
    MatIcon,
    MatButton,
    MatIconButton,
    MatCardImage,
    CurrencyPipe,
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;

  get stars(): number[] {
    return Array(Math.round(this.product.rating ?? 0)).fill(0);
  }

  public addToCart(product: Product): void {
    if (product.stock > 0) {
      console.log('Додати в кошик:', product);
    } else {
      console.warn('Товар відсутній на складі');
    }
  }
}
