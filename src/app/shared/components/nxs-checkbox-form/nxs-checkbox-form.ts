import { Component, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { ControlValueAccessor, FormArray, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterUIConfig } from '../../../core/models/filter.model';

type FilterValue = string | number | boolean | null;

@Component({
  selector: 'nxs-checkbox-form',
  imports: [CommonModule, MatCheckboxModule, MatRadioModule, MatExpansionModule, MatDividerModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NxsCheckboxForm,
      multi: true,
    },
  ],
  templateUrl: './nxs-checkbox-form.html',
  styleUrls: ['./nxs-checkbox-form.scss'],
})
export class NxsCheckboxForm implements ControlValueAccessor {
  public readonly config = input.required<FilterUIConfig>();
  public readonly useFormArray = input(false);
  public readonly formArray = input<FormArray<FormControl<boolean>>>();

  public readonly value = signal<FilterValue>(null);
  public readonly selectedValues = signal<FilterValue[]>([]);

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  public onBooleanChange(checked: boolean): void {
    this.value.set(checked);
    this.onChange(checked);
    this.onTouched();
  }

  public onCheckboxChange(checked: boolean, optionValue: FilterValue): void {
    this.selectedValues.update((values) =>
      checked ? [...values, optionValue] : values.filter((v) => v !== optionValue),
    );
    this.onChange(this.selectedValues());
    this.onTouched();
  }

  public onFormArrayCheckboxChange(index: number, checked: boolean): void {
    const array = this.formArray();
    if (array) {
      array.at(index).setValue(checked);
      this.onTouched();
    }
  }

  public onRadioChange(value: FilterValue): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  public isChecked(value: FilterValue): boolean {
    return this.selectedValues().includes(value);
  }

  public isFormArrayChecked(index: number): boolean {
    const array = this.formArray();
    return array ? array.at(index).value : false;
  }

  public writeValue(value: unknown): void {
    if (this.config().type === 'checkbox') {
      this.selectedValues.set(Array.isArray(value) ? value : []);
    } else {
      this.value.set(value as FilterValue);
    }
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
