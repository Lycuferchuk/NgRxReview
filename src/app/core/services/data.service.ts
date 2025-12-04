import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly url = 'assets/data/';

  constructor(private readonly http: HttpClient) {}

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('assets/data/products.json');
  }
}
