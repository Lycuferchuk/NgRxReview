import { Component, DestroyRef, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CartStore } from '../../../core/store/cart.store';
import { FiltersStore } from '../../../core/store/filters.store';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductStore } from '../../../core/store/products.store';

@Component({
  selector: 'nxs-header',
  imports: [
    MatIconModule,
    FormsModule,
    MatIconButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
  ],
  templateUrl: './nxs-header.component.html',
  styleUrl: './nxs-header.component.scss',
})
export class NxsHeader implements OnInit {
  private readonly router = inject(Router);
  private readonly cartStore = inject(CartStore);
  private readonly productStore = inject(ProductStore);
  private readonly filtersStore = inject(FiltersStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  public readonly cartCount = this.cartStore.cartCount;

  public ngOnInit(): void {
    this.setupSearchListener();
  }

  public toCart(): void {
    this.router.navigate(['cart']);
  }

  public toHome(): void {
    this.router.navigate(['products']);
  }

  private setupSearchListener(): void {
    fromEvent(this.searchInput().nativeElement, 'input')
      .pipe(
        map((event) => (event.target as HTMLInputElement).value),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        this.filtersStore.setSearchQuery(query || '');
        this.productStore.loadProducts();
      });
  }
}
