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
import { EmptyStateType } from '../../core/enums/empry-state.enum';
import { MatDivider } from '@angular/material/divider';

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
    MatDivider,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  @ViewChild('sidenav') public sidenav!: MatSidenav;
  @ViewChild(FilterPanelComponent) public filterPanel!: FilterPanelComponent;
  private readonly productStore = inject(ProductStore);
  private readonly filtersStore = inject(FiltersStore);

  public readonly products = this.productStore.filteredProducts;
  public readonly loading = this.productStore.loading;
  public readonly filtersCounter = this.filtersStore.activeFiltersCount;
  public readonly isMobile = signal<boolean>(false);
  public readonly emptyStateType = EmptyStateType;

  public readonly skeletonItems = Array.from({ length: 10 }, (_, i) => i);

  constructor(private readonly _breakpointObserver: BreakpointObserver) {}

  public ngOnInit(): void {
    this.observeBreakpoint();
    this.productStore.loadProducts();
  }

  public toggleFilters(): void {
    this.sidenav.toggle();
  }

  public resetFilters(): void {
    this.filterPanel.reset();
    if (this.sidenav.opened && this.isMobile()) {
      this.sidenav.close();
    }
  }

  private observeBreakpoint(): void {
    this._breakpointObserver.observe(['(max-width: 768px)']).subscribe((result) => {
      this.isMobile.set(result.matches);
    });
  }
}
