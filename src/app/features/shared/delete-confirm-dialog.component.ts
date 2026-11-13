import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

interface DeleteConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-delete-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Avbryt</button>
      <button mat-flat-button class="icon-label" [mat-dialog-close]="true">
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
        Radera
      </button>
    </mat-dialog-actions>
  `,
})
export class DeleteConfirmDialogComponent {
  protected readonly data = inject<DeleteConfirmDialogData>(MAT_DIALOG_DATA);
}
