import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CartStore } from '../../../core/store/cart.store';
import { FiltersStore } from '../../../core/store/filters.store';

@Component({
  selector: 'app-nxs-header',
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
export class NxsHeader {
  private readonly cartStore = inject(CartStore);
  private readonly filtersStore = inject(FiltersStore);

  public readonly cartCount = this.cartStore.cartCount;
  public searchQuery = '';

  constructor(private readonly _router: Router) {}

  public toCart(): void {
    this._router.navigate(['cart']);
  }

  public toHome(): void {
    this._router.navigate(['products']);
  }

  public onSearchChange(query: string): void {
    this.filtersStore.setSearchQuery(query);
  }
}
