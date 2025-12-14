import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Product } from '../models/product.model';
import { map, Observable } from 'rxjs';
import { PRODUCTS_JSON_KEY } from '../constants/data-key.constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly _dataService: DataService) {}

  public getProductsList(): Observable<Product[]> {
    return this._dataService.getDataFromJson<Product[]>(PRODUCTS_JSON_KEY);
  }

  public getProductById(id: string): Observable<Product | undefined> {
    return this.getProductsList().pipe(
      map((products) => products.find((product) => product.id === id)),
    );
  }
}
