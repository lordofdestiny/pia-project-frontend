import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'profile-update-dialog',
    template: ` <h1 mat-dialog-title [style.color]="titleColor">
            {{ data.title }}
        </h1>
        <div mat-dialog-content>
            {{ data.message }}
        </div>
        <div mat-dialog-actions class="d-flex justify-content-end">
            <button mat-stroked-button mat-dialog-close color="accent">
                Close
            </button>
        </div>`,
})
export class ProfileUpdatedDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { title: string; message: string; success: boolean }
    ) {}
    titleColor = this.data.success ? 'var(--green)' : 'var(--warn)';

    static displayDialog(
        dialog: MatDialog,
        title: string,
        message: string,
        success: boolean
    ) {
        dialog.open(ProfileUpdatedDialogComponent, {
            minWidth: '400px',
            minHeight: '150px',
            data: {
                title,
                message,
                success,
            },
        });
    }

    static displaySuccessDialog(message: string, dialog: MatDialog) {
        ProfileUpdatedDialogComponent.displayDialog(
            dialog,
            'Success',
            message,
            true
        );
    }
    static displayFailedDialog(message: string, dialog: MatDialog) {
        ProfileUpdatedDialogComponent.displayDialog(
            dialog,
            'Failed',
            message,
            false
        );
    }
}
