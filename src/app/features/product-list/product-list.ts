import { Component, inject, OnInit } from '@angular/core';
import { NxsProductCard } from '../../shared/components/nxs-product-card/nxs-product-card';
import { FilterPanelComponent } from './filter/filter';
import { ProductStore } from '../../core/store/products.store';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NxsNoData } from '../../shared/components/nxs-no-data/nxs-no-data';

@Component({
  selector: 'app-product-list',
  imports: [NxsProductCard, FilterPanelComponent, MatProgressSpinner, NxsNoData],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly productStore = inject(ProductStore);
  public readonly products = this.productStore.products;
  public readonly loading = this.productStore.loading;

  constructor() {
    /* empty */
  }

  public ngOnInit(): void {
    this.productStore.loadProducts();
  }
}
