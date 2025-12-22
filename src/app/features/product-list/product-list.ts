import { Component, inject, OnInit } from '@angular/core';
import { NxsProductCard } from '../../shared/components/nxs-product-card/nxs-product-card';
import { FilterPanelComponent } from './filter/filter';
import { ProductStore } from '../../core/store/products.store';
import { NxsNoData } from '../../shared/components/nxs-no-data/nxs-no-data';
import { NxsSkeletonCard } from '../../shared/components/nxs-skeleton-card/nxs-skeleton-card';

@Component({
  selector: 'app-product-list',
  imports: [NxsProductCard, FilterPanelComponent, NxsNoData, NxsSkeletonCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly productStore = inject(ProductStore);
  public readonly products = this.productStore.filteredProducts;
  public readonly loading = this.productStore.loading;

  constructor() {
    /* empty */
  }

  public ngOnInit(): void {
    this.productStore.loadProducts();
  }
}
