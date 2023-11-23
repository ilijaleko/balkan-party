import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DIALOG_ACTIONS } from '../../../constants/dialog-actions.constant';
import { IConfirmDialogData } from '../../../interfaces/confirm-dialog-data.interface';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class ConfirmDialog {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IConfirmDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close({ action: DIALOG_ACTIONS.CANCEL });
  }

  onConfirm(): void {
    this.dialogRef.close({ action: DIALOG_ACTIONS.CONFIRM });
  }
}
