import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlider } from '@angular/material/slider';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product.model';
import { Filters } from '../../../core/models/filter.model';

@Component({
  selector: 'app-filter',
  imports: [
    MatCard,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatSlider,
    MatCheckbox,
    FormsModule,
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter {
  @Input() products: Product[] = [];
  @Output() filterChange = new EventEmitter<Filters>();

  public filters: Filters = {
    type: '',
    brand: '',
    price: 10000,
    rating: '',
    inStock: false,
  };

  types = [...new Set(this.products.map((p) => p.type))];
  brands = [...new Set(this.products.map((p) => p.brand))];
  maxPrice = Math.max(...this.products.map((p) => p.price));

  public onPriceChange(event: any): void {
    this.filters.price = event.value;
    this.applyFilters();
  }

  public applyFilters(): void {
    this.filterChange.emit(this.filters);
  }
}
