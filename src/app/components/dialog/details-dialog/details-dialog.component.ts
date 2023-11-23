import { MatInputModule } from '@angular/material/input';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DIALOG_ACTIONS } from '../../../constants/dialog-actions.constant';

@Component({
  selector: 'details-dialog',
  templateUrl: 'details-dialog.component.html',
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
export class DetailsDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string[],
    private dialogRef: MatDialogRef<DetailsDialog>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dialogRef.close({ action: DIALOG_ACTIONS.DELETE, data: this.data });
  }

  onSave(): void {
    this.dialogRef.close({ action: DIALOG_ACTIONS.SAVE, data: this.data });
  }
}
