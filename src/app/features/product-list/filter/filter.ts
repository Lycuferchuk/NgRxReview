import { Component, Input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product.model';
import { Filters } from '../../../core/models/filter.model';
import { MatButton } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-filter',
  imports: [
    MatCard,
    MatSlider,
    MatCheckbox,
    FormsModule,
    MatButton,
    MatRadioButton,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatSliderRangeThumb,
    MatFormField,
    MatInput,
    MatRadioGroup,
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class FilterPanelComponent {
  @Input() products: Product[] = [];
  @Input() filters: Filters = {
    categories: ['Phones', 'laptops', 'earbuds'],
    brands: ['Brand X', 'Brand Y', 'Brand Z'],
    priceRange: [0, 1000],
    minRating: 1,
    inStock: false,
  };

  get categories(): (string | undefined)[] {
    return Array.from(new Set(this.products.map((p) => p.category)));
  }

  get brands(): string[] {
    return Array.from(new Set(this.products.map((p) => p.brand)));
  }

  toggleCategory(category: string) {
    const i = this.filters.categories.indexOf(category);
    if (i >= 0) this.filters.categories.splice(i, 1);
    else this.filters.categories.push(category);
  }

  toggleBrand(brand: string) {
    const i = this.filters.brands.indexOf(brand);
    if (i >= 0) this.filters.brands.splice(i, 1);
    else this.filters.brands.push(brand);
  }
}
