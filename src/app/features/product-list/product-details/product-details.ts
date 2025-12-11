import { Component, OnInit } from '@angular/core';
import { NxsHeader } from '../../../shared/components/nxs-header/nxs-header.component';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardImage } from '@angular/material/card';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-details',
  imports: [
    NxsHeader,
    MatCard,
    MatCardImage,
    CurrencyPipe,
    MatDivider,
    NgClass,
    MatButton,
    MatProgressSpinner,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  public product: Product = {
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
  };
  public isLoading = true;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    const productId = this._route.snapshot.paramMap.get('productId');
    this.isLoading = false;
    if (!productId) return;
    /*
    this._productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });*/
  }
}
