import {
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms';
import { ErrorMessages } from '@core/utils/form-error-messages';
import { FileInput } from 'ngx-material-file-input';

import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-edit-image',
    templateUrl: './edit-image.component.html',
    styleUrls: ['./edit-image.component.css'],
    providers: [ConfirmationService],
})
export class EditImageComponent implements OnInit, OnDestroy {
    forManager: boolean = false;
    constructor(
        public dialogRef: DynamicDialogRef,
        public dialogConfig: DynamicDialogConfig,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder
    ) {}
    errorMessages = ErrorMessages;
    pictureForm = this.fb.group({
        picture: [new FileInput(null), [], [this.imageValidator.bind(this)]],
    });

    picture$ = new BehaviorSubject<string>('');

    ngOnInit(): void {
        const picture = this.dialogConfig.data.profile_picture;
        this.forManager = this.dialogConfig.data.forManager ?? false;
        this.picture$.next(picture);
    }

    @ViewChild('preview', { static: false })
    preview?: ElementRef<HTMLImageElement>;
    previewDOM?: HTMLImageElement;
    ngAfterViewInit(): void {
        this.previewDOM = this.preview?.nativeElement;
    }

    ngOnDestroy(): void {
        this.picture$.complete();
    }

    async imageValidator(g: AbstractControl): Promise<ValidationErrors | null> {
        const files = g?.value?.files;
        if (['', [], null, undefined].some((v) => v == files)) {
            return Promise.resolve(null);
        }
        const file = files?.[0] as File;
        if (file?.type?.split('/')?.[0] !== 'image') {
            return Promise.resolve({ notImage: true });
        }
        return new Promise((resolve, reject) => {
            const image = this.previewDOM!;
            image.onload = () => {
                const { width, height } = image;
                if (width < 100 || height < 100) {
                    resolve({
                        tooSmall: true,
                    });
                }
                if (width > 300 || height > 300) {
                    resolve({
                        tooBig: true,
                    });
                }
                resolve(null);
            };
            image.onerror = () => reject({ 'error: ': 'Error loading image' });

            const reader = new FileReader();
            reader.onloadend = () => (image.src = reader.result as string);
            reader.onerror = () => reject({ error: 'Error reading file' });
            reader.readAsDataURL(file as Blob);
        });
    }

    returnValue(data: any) {
        this.dialogRef.close(data);
    }

    handleConfirm() {
        this.returnValue({
            action: 'edit',
            picture: this.pictureForm.get('picture')?.value?.files?.[0],
        });
    }

    handleRemove() {
        this.confirmationService.confirm({
            message: this.forManager
                ? "Are you sure that you want to remove this user's profile picture?"
                : 'Are you sure that you want to remove your profile picutre? People might not be able to recognize you anymore.',
            header: 'Delete profile picture',
            icon: 'pi pi-exclamation-triangle ',
            acceptButtonStyleClass: 'mat-raised-button mat-warn',
            rejectButtonStyleClass: 'mat-raised-button mat-green',
            accept: () => {
                this.returnValue({ action: 'delete' });
            },
        });
    }

    handleCancel() {
        this.dialogRef.close({ action: 'cancel' });
    }
}
