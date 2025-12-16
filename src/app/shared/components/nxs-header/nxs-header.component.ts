import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CartStore } from '../../../core/store/cart.store';

@Component({
  selector: 'app-nxs-header',
  imports: [MatIconModule, FormsModule, MatIconButton, MatFormField, MatInput, MatLabel],
  templateUrl: './nxs-header.component.html',
  styleUrl: './nxs-header.component.scss',
})
export class NxsHeader {
  public cart = inject(CartStore);
  public searchQuery = '';
  public cartCount = this.cart.cartCount;

  constructor(private readonly _router: Router) {}

  public toCart(): void {
    this._router.navigate(['cart']);
  }

  public toHome(): void {
    this._router.navigate(['products']);
  }

  public onSearch(): void {
    if (this.searchQuery.trim()) {
      this._router.navigate(['/products'], { queryParams: { q: this.searchQuery } });
      this.searchQuery = '';
    }
  }
}
