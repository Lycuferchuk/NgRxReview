import { Component, DestroyRef, forwardRef, inject, input } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatDivider } from '@angular/material/divider';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export interface CheckboxOption {
  value: any;
  label: string;
  count?: number;
}

export interface CheckboxConfig {
  label: string;
  type: 'checkbox' | 'radio' | 'boolean';
  options?: CheckboxOption[];
}

@Component({
  selector: 'app-nxs-checkbox-form',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatCheckbox,
    MatRadioGroup,
    MatRadioButton,
    MatDivider,
    ReactiveFormsModule,
  ],
  providers: [
    // ✅ ДОДАЙ ЦЕ ТУТ
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxsCheckboxForm),
      multi: true,
    },
  ],
  templateUrl: './nxs-checkbox-form.html',
  styleUrl: './nxs-checkbox-form.scss',
})
export class NxsCheckboxForm implements ControlValueAccessor {
  private destroyRef = inject(DestroyRef);

  config = input.required<CheckboxConfig>();

  value: any = null;
  selectedValues: any[] = [];

  private onChange: any = () => {};
  private onTouched: any = () => {};

  // Для boolean
  onBooleanChange(checked: boolean): void {
    console.log('🔘 Boolean changed:', checked); // ← ТУТ
    this.value = checked;
    this.onChange(checked);
    this.onTouched();
  }

  // Для checkbox (multiple)
  onCheckboxChange(checked: boolean, value: any): void {
    console.log('☑️ Checkbox changed:', { checked, value }); // ← ТУТ
    if (checked) {
      this.selectedValues.push(value);
    } else {
      this.selectedValues = this.selectedValues.filter((v) => v !== value);
    }
    console.log('☑️ Selected values:', this.selectedValues); // ← ТУТ
    this.onChange(this.selectedValues);
    this.onTouched();
  }

  isChecked(value: any): boolean {
    return this.selectedValues.includes(value);
  }

  // Для radio
  onRadioChange(value: any): void {
    console.log('🔘 Radio changed:', value); // ← ТУТ
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any): void {
    console.log('✍️ WriteValue called:', value); // ← ТУТ
    if (this.config().type === 'checkbox') {
      this.selectedValues = Array.isArray(value) ? value : [];
    } else {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    console.log('📝 RegisterOnChange called'); // ← ТУТ
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('👆 RegisterOnTouched called'); // ← ТУТ
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('🚫 SetDisabledState called:', isDisabled); // ← ТУТ
  }
}
