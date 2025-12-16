import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Filter, PriceRange } from '../../../core/models/filter.model';
import { filterFormOutput, FilterGroup } from './filter-group/filter-group';

@Component({
  selector: 'app-filter',
  imports: [MatCard, FormsModule, ReactiveFormsModule, FilterGroup],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class FilterPanelComponent {
  public filters: Filter[] = [
    {
      key: 'brand',
      label: 'Бренд',
      type: 'checkbox',
      options: [
        { value: 'apple', label: 'Apple', count: 124 },
        { value: 'samsung', label: 'Samsung', count: 98 },
        { value: 'xiaomi', label: 'Xiaomi', count: 56, disabled: true },
      ],
    },
    {
      key: 'rating',
      label: 'Рейтинг',
      type: 'radio',
      options: [
        { value: 5, label: '5 зірок' },
        { value: 4, label: '4 зірки і більше' },
        { value: 3, label: '3 зірки і більше' },
      ],
    },
    {
      key: 'price',
      label: 'Ціна',
      type: 'range',
      min: 0,
      max: 50000,
    },
    {
      key: 'inStock',
      label: 'Тільки в наявності',
      type: 'boolean',
    },
    {
      key: 'discount',
      label: 'Зі знижкою',
      type: 'boolean',
    },
  ];

  public form: FormGroup = new FormGroup({
    brand: new FormControl<string[]>([], { nonNullable: true }),
    price: new FormControl<PriceRange>({ min: 0, max: 1000 }, { nonNullable: true }),
    availability: new FormControl<boolean>(false, { nonNullable: true }),
    condition: new FormControl<string | null>(null),
  });

  public onFilterChange(event: filterFormOutput): void {
    const control = this.form.get(event.key);

    if (control instanceof FormArray && event.checked !== undefined) {
      this.updateCheckboxArray(control, event);
    }
  }

  private updateCheckboxArray(
    control: FormArray<FormControl<string>>,
    event: filterFormOutput,
  ): void {
    if (!event.checked || !event.value) {
      return;
    }
    control.push(new FormControl(event.value, { nonNullable: true }));
  }
}
