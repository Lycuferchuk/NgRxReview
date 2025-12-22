import { Component, DestroyRef, forwardRef, inject, input, OnInit } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';

@Component({
  selector: 'app-form-range-slider',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatFormField,
    MatInput,
    MatDivider,
    MatLabel,
    ReactiveFormsModule,
    MatSlider,
    MatSliderRangeThumb,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NxsFormRangeSlider), // ← ДОДАЙ forwardRef
      multi: true,
    },
  ],
  templateUrl: './nxs-form-range-slider.component.html',
  styleUrl: './nxs-form-range-slider.component.scss',
})
export class NxsFormRangeSlider implements ControlValueAccessor, OnInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  min = input<number>(0);
  max = input<number>(10000);

  rangeGroup: FormGroup = this.fb.group({
    min: [null],
    max: [null],
  });

  private onChange: any = () => {};
  private onTouched: any = () => {};

  ngOnInit(): void {
    // Встановлюємо початкові значення
    this.rangeGroup.patchValue(
      {
        min: this.min(),
        max: this.max(),
      },
      { emitEvent: false },
    );

    // Підписуємось на зміни форми
    this.rangeGroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      // Валідація: min не може бути більше max
      if (value.min !== null && value.max !== null && value.min > value.max) {
        this.rangeGroup.patchValue(
          {
            min: value.max,
          },
          { emitEvent: false },
        );
        return;
      }

      this.onChange(value);
      this.onTouched();
    });
  }

  writeValue(value: any): void {
    if (value) {
      this.rangeGroup.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.rangeGroup.disable();
    } else {
      this.rangeGroup.enable();
    }
  }
}
