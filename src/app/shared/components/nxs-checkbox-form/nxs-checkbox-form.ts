import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { ControlValueAccessor, FormArray, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterUIConfig } from '../../../core/models/filter.model';

type FilterValue = string | number | boolean | null;

@Component({
  selector: 'app-nxs-checkbox-form',
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
  @Input() public config!: FilterUIConfig;
  @Input() public useFormArray = false;
  @Input() public formArray?: FormArray<FormControl<boolean>>;

  public value: FilterValue = null;
  public selectedValues: FilterValue[] = [];

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  public onBooleanChange(checked: boolean): void {
    this.value = checked;
    this.onChange(checked);
    this.onTouched();
  }

  public onCheckboxChange(checked: boolean, value: FilterValue): void {
    if (checked) {
      this.selectedValues = [...this.selectedValues, value];
    } else {
      this.selectedValues = this.selectedValues.filter((v) => v !== value);
    }
    this.onChange(this.selectedValues);
    this.onTouched();
  }

  public onFormArrayCheckboxChange(index: number, checked: boolean): void {
    const array = this.formArray;
    if (array) {
      array.at(index).setValue(checked);
      this.onTouched();
    }
  }

  public onRadioChange(value: FilterValue): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  public isChecked(value: FilterValue): boolean {
    return this.selectedValues.includes(value);
  }

  public isFormArrayChecked(index: number): boolean {
    const array = this.formArray;
    return array ? array.at(index).value : false;
  }

  public writeValue(value: unknown): void {
    const type = this.config.type;

    if (type === 'checkbox') {
      this.selectedValues = Array.isArray(value) ? value : [];
    } else {
      this.value = value as FilterValue;
    }
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
