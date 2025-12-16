import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filter } from '../../../../core/models/filter.model';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatFormField } from '@angular/material/form-field';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';

export interface filterFormOutput {
  key: string;
  type: string;
  value?: string;
  checked?: boolean;
}

@Component({
  selector: 'app-filter-group',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatCheckbox,
    MatRadioGroup,
    MatFormField,
    ReactiveFormsModule,
    MatRadioButton,
    MatInput,
    MatDivider,
  ],
  templateUrl: './filter-group.html',
  styleUrl: './filter-group.scss',
})
export class FilterGroup {
  @Input({ required: true }) public filter!: Filter;
  @Input({ required: true }) public parentForm!: FormGroup;
  @Output() public controlChange = new EventEmitter<filterFormOutput>();

  public rangeGroup: FormGroup = new FormGroup({
    min: new FormControl<number | null>(null),
    max: new FormControl<number | null>(null),
  });

  public isChecked(value: string): boolean {
    return this.checkboxArray?.value.includes(value) ?? false;
  }

  public getValue(): string {
    return this.parentForm.get(this.filter.key)?.value ?? null;
  }

  public onCheckbox(value: string, checked: boolean): void {
    this.controlChange.emit({
      key: this.filter.key,
      type: 'checkbox',
      value,
      checked,
    });
  }

  public onRadio(value: string): void {
    this.controlChange.emit({
      key: this.filter.key,
      type: 'radio',
      value,
    });
  }

  public onBoolean(checked: boolean): void {
    this.controlChange.emit({
      key: this.filter.key,
      type: 'boolean',
      checked,
    });
  }

  private get checkboxArray(): FormArray<FormControl<string>> {
    return this.parentForm.get(this.filter.key) as FormArray<FormControl<string>>;
  }
}
