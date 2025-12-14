import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { NxsProductCard } from '../../shared/components/nxs-product-card/nxs-product-card';
import { FilterPanelComponent } from './filter/filter';
import { ProductService } from '../../core/services/product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  imports: [NxsProductCard, FilterPanelComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  public products: Product[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(private readonly _productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  public loadProducts(): void {
    this._productService
      .getProductsList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.products = result;
      });
  }
}
