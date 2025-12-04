import { Component, OnInit } from '@angular/core';
import { PipHeader } from '../../shared/components/pip-header/pip-header';
import { PipNavigationBar } from '../../shared/components/pip-navigation-bar/pip-navigation-bar';
import { Product } from '../../core/models/product.model';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-product-list',
  imports: [PipHeader, PipNavigationBar],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  public products: Product[] = [];

  constructor(private readonly dataService: DataService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  public loadProducts(): void {
    this.dataService.getProducts().subscribe((data) => {
      this.products = data;
      console.log(this.products);
    });
  }
}
