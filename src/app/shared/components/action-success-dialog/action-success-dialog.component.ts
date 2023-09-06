import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-action-result-dialog',
    template: ` <div class="d-flex align-items-center flex-wrap mb-2">
            <mat-icon class="mx-1" [color]="data.success ? 'green' : 'warn'">
                {{ data.success ? 'check_circle' : 'cancel' }}
            </mat-icon>
            <h1 [style.text-align]="'center'" class="mb-0">
                {{ data.success ? 'Success' : 'Failure' }}
            </h1>
        </div>
        <div mat-dialog-content>
            <p>{{ data.message }}</p>
        </div>
        <div mat-dialog-actions class="d-flex justify-content-center">
            <button mat-button mat-dialog-close cdkFocusInitial>Close</button>
        </div>`,
})
export class ActionResultDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ActionResultDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { success: boolean; message: string }
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
