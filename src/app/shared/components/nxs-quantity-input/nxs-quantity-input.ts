import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'nxs-quantity-input',
  imports: [MatIcon, MatIconButton, MatFormField, MatInput],
  templateUrl: './nxs-quantity-input.html',
  styleUrl: './nxs-quantity-input.scss',
})
export class NxsQuantityInput {
  public readonly quantity = input.required<number>();
  public readonly min = input(1);
  public readonly compact = input(false);

  public readonly increase = output<void>();
  public readonly decrease = output<void>();
  public readonly change = output<number>();
  public readonly remove = output<void>();

  public onIncrease(): void {
    this.increase.emit();
  }

  public onDecrease(): void {
    if (this.quantity() <= this.min()) {
      this.remove.emit();
    } else {
      this.decrease.emit();
    }
  }

  public onInputChange(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10) || this.min();
    this.change.emit(Math.max(this.min(), value));
  }
}
