import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { PriceRange } from '../../../core/models/filter.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'nxs-price-range',
  imports: [
    MatDivider,
    MatSlider,
    MatSliderRangeThumb,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  templateUrl: './nxs-price-range.component.html',
  styleUrl: './nxs-price-range.component.scss',
})
export class NxsPriceRange implements OnInit {
  public readonly min = input.required<number>();
  public readonly max = input.required<number>();
  public readonly currentMin = input<number | null>(null);
  public readonly currentMax = input<number | null>(null);

  public readonly rangeChange = output<PriceRange>();

  public readonly selectedMin = signal(0);
  public readonly selectedMax = signal(0);

  constructor() {
    effect(
      () => {
        this.selectedMin.set(this.currentMin() ?? this.min());
        this.selectedMax.set(this.currentMax() ?? this.max());
      },
      { allowSignalWrites: true },
    );
  }

  public ngOnInit(): void {
    this.selectedMin.set(this.currentMin() ?? this.min());
    this.selectedMax.set(this.currentMax() ?? this.max());
  }

  public onMinChange(value: number): void {
    const clamped = Math.min(value, this.selectedMax());
    this.selectedMin.set(clamped);
    this.emitChange();
  }

  public onMaxChange(value: number): void {
    const clamped = Math.max(value, this.selectedMin());
    this.selectedMax.set(clamped);
    this.emitChange();
  }

  public onMinInputChange(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (isNaN(value)) return;

    const clamped = Math.max(this.min(), Math.min(value, this.selectedMax()));
    this.selectedMin.set(clamped);
    this.emitChange();
  }

  public onMaxInputChange(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (isNaN(value)) return;

    const clamped = Math.min(this.max(), Math.max(value, this.selectedMin()));
    this.selectedMax.set(clamped);
    this.emitChange();
  }

  private emitChange(): void {
    this.rangeChange.emit({
      min: this.selectedMin(),
      max: this.selectedMax(),
    });
  }
}
