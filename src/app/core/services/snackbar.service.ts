import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  public success(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: 'snackbar--success',
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  public error(message: string): void {
    this.snackBar.open(message, '', {
      duration: 4000,
      panelClass: 'snackbar--error',
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  public info(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: 'snackbar--info',
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
