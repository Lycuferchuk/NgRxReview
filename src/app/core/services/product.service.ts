import { inject, Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Product, ProductFilters } from '../models/product.model';
import { delay, map, Observable } from 'rxjs';
import { PRODUCTS_JSON_KEY } from '../constants/data-key.constants';
import { FilterHelper } from '../helper/filter.helper';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly dataService = inject(DataService);

  getProductsList(filters?: ProductFilters): Observable<Product[]> {
    return this.dataService.getDataFromJson<Product[]>(PRODUCTS_JSON_KEY).pipe(
      map((products) =>
        filters ? FilterHelper.filterProducts(products, filters.basic, filters.dynamic) : products,
      ),
      delay(500),
    );
  }

  public getProductById(id: string): Observable<Product | undefined> {
    return this.getProductsList().pipe(
      map((products) => products.find((product) => product.id === id)),
    );
  }
}
