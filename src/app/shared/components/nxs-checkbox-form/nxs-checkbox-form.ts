import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { ControlValueAccessor, FormArray, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface CheckboxOption {
  value: string | number | boolean | null;
  label: string;
  count?: number;
}

export interface CheckboxConfig {
  label: string;
  type: 'radio' | 'boolean' | 'checkbox';
  options?: CheckboxOption[];
}

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
  config = input.required<CheckboxConfig>();

  useFormArray = input<boolean>(false);
  formArray = input<FormArray<FormControl<boolean>>>();

  value: string | number | boolean | null = null;
  selectedValues: (string | number | boolean | null)[] = []; // Додали null

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  onBooleanChange(checked: boolean): void {
    this.value = checked;
    this.onChange(checked);
    this.onTouched();
  }

  // Оновлено: додали null
  onCheckboxChange(checked: boolean, value: string | number | boolean | null): void {
    if (checked) {
      this.selectedValues.push(value);
    } else {
      this.selectedValues = this.selectedValues.filter((v) => v !== value);
    }
    this.onChange(this.selectedValues);
    this.onTouched();
  }

  onFormArrayCheckboxChange(index: number, checked: boolean): void {
    const array = this.formArray();
    if (array) {
      array.at(index).setValue(checked);
      this.onTouched();
    }
  }

  // Оновлено: додали null
  isChecked(value: string | number | boolean | null): boolean {
    return this.selectedValues.includes(value);
  }

  isFormArrayChecked(index: number): boolean {
    const array = this.formArray();
    return array ? array.at(index).value : false;
  }

  onRadioChange(value: string | number | boolean | null): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: unknown): void {
    if (this.config().type === 'checkbox') {
      this.selectedValues = Array.isArray(value) ? value : [];
    } else {
      this.value = value as string | number | boolean | null;
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Можна додати логіку для disabled стану
  }
}
