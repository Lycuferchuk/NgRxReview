import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-pip-header',
  imports: [MatIconModule, FormsModule, MatIconButton, MatFormField, MatInput],
  templateUrl: './pip-header.html',
  styleUrl: './pip-header.scss',
})
export class PipHeader {
  public searchQuery = '';
  public cartCount = 2;

  constructor(private readonly router: Router) {}

  public toCart(): void {
    this.router.navigate(['cart']);
  }

  public toHome(): void {
    this.router.navigate(['products']);
  }

  public onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { q: this.searchQuery } });
      this.searchQuery = '';
    }
  }
}
