import { Component, effect, input, output, signal } from '@angular/core';
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
  public readonly showDeleteLastItem = input(true);

  public readonly increase = output<void>();
  public readonly decrease = output<void>();
  public readonly change = output<number>();
  public readonly remove = output<void>();
  public inputValue = signal(1);

  constructor() {
    effect(() => {
      this.inputValue.set(this.quantity());
    });
  }

  public onIncrease(): void {
    this.increase.emit();
  }

  public onDecrease(): void {
    if (this.quantity() <= this.min()) {
      if (this.showDeleteLastItem()) {
        this.remove.emit();
      }
    } else {
      this.decrease.emit();
    }
  }

  public onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);

    if (isNaN(value) || value <= 0) {
      this.inputValue.set(this.min());
      input.value = this.min().toString();
      this.change.emit(this.min());
      return;
    }

    const validValue = Math.max(this.min(), value);
    this.inputValue.set(validValue);

    if (validValue !== value) {
      input.value = validValue.toString();
    }

    this.change.emit(validValue);
  }

  public get isDecreaseDisabled(): boolean {
    return this.quantity() <= this.min() && !this.showDeleteLastItem();
  }

  public get decreaseIcon(): string {
    return this.quantity() <= this.min() && this.showDeleteLastItem() ? 'delete' : 'remove';
  }

  public onKeyDown(event: KeyboardEvent): void {
    const invalidKeys = ['-', '+', 'e', 'E', '.', ','];

    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
