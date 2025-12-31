import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ProductService } from '../../../core/services/product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NxsNoData } from '../../../shared/components/nxs-no-data/nxs-no-data';
import { EmptyStateType } from '../../../core/enums/empry-state.enum';
import { MatIcon } from '@angular/material/icon';
import { CartStore } from '../../../core/store/cart.store';
import { NxsSkeletonDetails } from '../../../shared/components/nxs-skeleton-details/nxs-skeleton-details';
import { ATTRIBUTE_LABELS } from '../../../core/constants/products.constants';
import { FilterPrimitive } from '../../../core/models/filter.model';

interface SpecItem {
  key: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-product-details',
  imports: [
    MatCard,
    CurrencyPipe,
    MatDivider,
    MatButton,
    NxsNoData,
    MatIcon,
    NxsSkeletonDetails,
    MatIconButton,
    NxsSkeletonDetails,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private readonly cartStore = inject(CartStore);
  private readonly destroyRef = inject(DestroyRef);

  public product!: Product;
  public isLoading = true;
  public noData = false;
  public readonly emptyStateType = EmptyStateType;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _productService: ProductService,
    private readonly _router: Router,
  ) {}

  public ngOnInit(): void {
    this.loadProduct();
  }

  public goBack(): void {
    this._router.navigate(['products']);
  }

  public addToCart(): void {
    this.cartStore.addToCart(this.product);
  }

  public getFormattedSpecs(): SpecItem[] {
    if (!this.product?.attributes) return [];

    return Object.entries(this.product.attributes)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => ({
        key,
        label: ATTRIBUTE_LABELS[key] || key,
        value: this.formatAttributeValue(value),
      }));
  }

  private formatAttributeValue(value: FilterPrimitive): string {
    if (typeof value === 'boolean') {
      return value ? 'Так' : 'Ні';
    }
    return String(value);
  }

  private loadProduct(): void {
    const productId = this._route.snapshot.paramMap.get('productId');

    if (!productId) {
      this.isLoading = false;
      this.noData = true;
      return;
    }

    this._productService
      .getProductById(productId)
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
          console.error(`Error loading product id=${productId}`, err);
          this.isLoading = false;
          this.noData = true;
        },
      });
  }
}
