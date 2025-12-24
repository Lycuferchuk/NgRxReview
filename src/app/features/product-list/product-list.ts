import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { NxsProductCard } from '../../shared/components/nxs-product-card/nxs-product-card';
import { FilterPanelComponent } from './filter/filter';
import { ProductStore } from '../../core/store/products.store';
import { NxsNoData } from '../../shared/components/nxs-no-data/nxs-no-data';
import { NxsSkeletonCard } from '../../shared/components/nxs-skeleton-card/nxs-skeleton-card';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FiltersStore } from '../../core/store/filters.store';

@Component({
  selector: 'app-product-list',
  imports: [
    NxsProductCard,
    FilterPanelComponent,
    NxsNoData,
    NxsSkeletonCard,
    MatSidenavContent,
    MatSidenav,
    MatSidenavContainer,
    MatIcon,
    MatButton,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  private readonly productStore = inject(ProductStore);
  private readonly filterStore = inject(FiltersStore);
  public readonly products = this.productStore.filteredProducts;
  public readonly loading = this.productStore.loading;
  public readonly filtersCounter = this.filterStore.activeFiltersCount;
  public isMobile = signal(false);

  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  public ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((result) => {
      this.isMobile.set(result.matches);
    });
    this.productStore.loadProducts();
  }

  public toggleFilters(): void {
    this.sidenav.toggle();
  }

  public resetFilters(): void {
    this.filterStore.reset();
    if (this.sidenav.opened) {
      this.sidenav.toggle();
    }
  }
}
