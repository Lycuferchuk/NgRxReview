import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-nxs-header',
  imports: [MatIconModule, FormsModule, MatIconButton, MatFormField, MatInput, MatLabel],
  templateUrl: './nxs-header.component.html',
  styleUrl: './nxs-header.component.scss',
})
export class NxsHeader implements OnInit {
  public searchQuery = '';
  public cartCount = 0;

  constructor(
    private readonly _router: Router,
    private readonly _cartService: CartService,
  ) {}

  public ngOnInit(): void {
    this._cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });
  }

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
