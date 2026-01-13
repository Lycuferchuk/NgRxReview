import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NxsNoData } from '../../../shared/components/nxs-no-data/nxs-no-data';
import { EmptyStateType } from '../../../core/enums/empry-state.enum';
import { MatIcon } from '@angular/material/icon';
import { CartStore } from '../../../core/store/cart.store';
import { NxsSkeletonDetails } from '../../../shared/components/nxs-skeleton-details/nxs-skeleton-details';
import { ATTRIBUTE_LABELS } from '../../../core/constants/products.constants';
import { FilterPrimitive } from '../../../core/models/filter.model';
import { ProductStore } from '../../../core/store/products.store';
import { ViewTransitionDirective } from '../../../core/directives/view-transition.directive';

interface SpecItem {
  key: string;
  label: string;
  value: string;
}

@Component({
  selector: 'nxs-product-details',
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
    ViewTransitionDirective,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productStore = inject(ProductStore);
  private readonly cartStore = inject(CartStore);

  public readonly product = this.productStore.selectedProduct;
  public readonly loading = this.productStore.loading;
  public readonly noData = computed(() => !this.loading() && !this.product());
  public readonly emptyStateType = EmptyStateType;

  public ngOnInit(): void {
    this.loadProduct();
  }

  public ngOnDestroy(): void {
    this.productStore.clearSelectedProduct();
  }

  public goBack(): void {
    this.router.navigate(['products']);
  }

  public addToCart(): void {
    const product = this.product();
    if (product) {
      this.cartStore.addToCart(product);
    }
  }

  public getFormattedSpecs(): SpecItem[] {
    const product = this.product();
    if (!product?.attributes) return [];

    return Object.entries(product.attributes)
      .filter(([_, value]) => value != null)
      .map(([key, value]) => ({
        key,
        label: ATTRIBUTE_LABELS[key] || key,
        value: this.formatAttributeValue(value),
      }));
  }

  private loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('productId');
    if (id) {
      this.productStore.loadProductById(id);
    }
  }

  private formatAttributeValue(value: FilterPrimitive): string {
    return typeof value === 'boolean' ? (value ? 'Так' : 'Ні') : String(value);
  }
}
