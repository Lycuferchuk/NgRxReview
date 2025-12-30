import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { ProductService } from '../../../core/services/product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NxsNoData } from '../../../shared/components/nxs-no-data/nxs-no-data';
import { EmptyStateType } from '../../../core/enums/empry-state.enum';
import { MatIcon } from '@angular/material/icon';
import { CartStore } from '../../../core/store/cart.store';
import { NxsSkeletonDetails } from '../../../shared/components/nxs-skeleton-details/nxs-skeleton-details';
import { CATEGORY_LABELS } from '../../../core/constants/filters.constants';

interface SpecItem {
  key: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-product-details',
  imports: [MatCard, CurrencyPipe, MatDivider, MatButton, NxsNoData, MatIcon, NxsSkeletonDetails],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  public product!: Product;
  public isLoading = true;
  public noData = false;
  public readonly emptyStateType = EmptyStateType;
  public cart = inject(CartStore);

  private destroyRef = inject(DestroyRef);

  constructor(
    private _route: ActivatedRoute,
    private readonly _productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.getProductId();
  }

  public addToCart(): void {
    this.cart.addToCart(this.product);
  }

  public getCategoryLabel(category: string): string {
    return CATEGORY_LABELS[category] || category;
  }

  public getFormattedSpecs(): SpecItem[] {
    // if (!this.product.attributes) return [];
    //
    // const specs: SpecItem[] = [];
    //
    // Object.entries(this.product.attributes).forEach(([key, value]) => {
    //   if (value === undefined || value === null) return;
    //
    //   const label = ATTRIBUTE_LABELS[key] || key;
    //   let formattedValue: string;
    //
    //   if (typeof value === 'boolean') {
    //     formattedValue = value ? 'Так' : 'Ні';
    //   } else {
    //     formattedValue = String(value);
    //   }
    //
    //   specs.push({
    //     key,
    //     label,
    //     value: formattedValue,
    //   });
    // });
    return [];
  }

  private getProductId(): void {
    const productId = this._route.snapshot.paramMap.get('productId');

    if (!productId) {
      this.isLoading = false;
      this.noData = true;
      return;
    }
    this.getProduct(productId);
  }

  private getProduct(id: string): void {
    this._productService
      .getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.isLoading = false;
          if (!product) {
            this.noData = true;
            return;
          }
          this.product = product;
        },
        error: (err) => {
          console.error(`Error loading product id=${id}`, err);
          this.noData = true;
        },
      });
  }
}
