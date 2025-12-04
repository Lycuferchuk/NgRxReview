import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pip-header',
  imports: [MatButton, MatIconModule, FormsModule, MatIconButton],
  templateUrl: './pip-header.html',
  styleUrl: './pip-header.scss',
})
export class PipHeader {
  public searchQuery = '';

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
