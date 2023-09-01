import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { style, transition, trigger, animate } from '@angular/animations';
import { BehaviorSubject, of } from 'rxjs';

import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { AuthService } from '@core/services/auth.service';
import {
    emailRegex,
    phoneRegex,
    usernameRegex,
} from '@core/constants/verification-regex';
import {
    UniqueCredentialValidator,
    UniqueEmailValidator,
    UniqueUsernameValidator,
} from '@core/services/unique-creds.service';
import { FieldErrorMessagesService } from '@core/services/field-error-messages.service';
import { UserRole } from '@core/models/users';
import { Specialization } from '@core/models/specialization';
import { ProfileService } from '@core/services/profile.service';

import { EditImageModalComponent as EditImageComponent } from '@shared/components/edit-image-modal/edit-image-modal.component';

interface FieldConfig {
    fieldName: string;
    label: string;
    type: string;
    autocomplete?: string;
    autocapitalize?: string;
    forRole?: UserRole;
    readonly?: boolean;
}

// TODO: Submit form on enter
// TODO: Add doctor fields
@Component({
    selector: 'app-editable-profile',
    templateUrl: './editable-profile.component.html',
    styleUrls: ['./editable-profile.component.css'],
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ width: '90%', height: '100%', opacity: 0 }),
                animate(
                    '0.5s ease-out',
                    style({ width: '*', height: '*', opacity: 1 })
                ),
            ]),
            transition(':leave', [
                style({ width: '*', height: '*', opacity: 1 }),
                animate(
                    '0.5s ease-in',
                    style({ width: '90%', height: '100%', opacity: 0 })
                ),
            ]),
        ]),
    ],
    providers: [DialogService],
})
export class EditableProfileComponent implements OnInit, OnDestroy {
    imgLoading = true;
    imageLoaded() {
        this.imgLoading = false;
    }
    user$ = this.authService.user$;

    // formEdited = false;
    formEdited = new BehaviorSubject<boolean>(false);
    matcher = new ShowOnDirtyErrorStateMatcher();
    profileForm = this.fb.group({
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: [
            '',
            [Validators.required, Validators.pattern(emailRegex)],
            [
                this.uniqueAndNotMinevalidator(
                    'email',
                    this.emailValidator
                ).bind(this),
            ],
            {
                updateOn: 'change',
            },
        ],
        username: [
            '',
            [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(20),
                Validators.pattern(usernameRegex),
            ],
            [
                this.uniqueAndNotMinevalidator(
                    'username',
                    this.usernameValidator
                ).bind(this),
            ],
            {
                updateOn: 'change',
            },
        ],
        phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
        address: ['', [Validators.required]],
    });

    uniqueAndNotMinevalidator(
        field: 'email' | 'username',
        validator: UniqueCredentialValidator
    ) {
        return (control: AbstractControl) => {
            if (control.value === this.user$.value[field]) {
                return of(null);
            }
            return validator.validate.bind(validator)(control);
        };
    }

    fieldNames: string[] = Object.keys(this.profileForm.controls);

    fieldGenerateConfig: FieldConfig[] = [
        {
            fieldName: 'first_name',
            label: 'First Name',
            type: 'text',
            autocapitalize: 'words',
        },
        {
            fieldName: 'last_name',
            label: 'Last Name',
            type: 'text',
            autocapitalize: 'words',
        },
        {
            fieldName: 'email',
            label: 'Email',
            type: 'email',
            readonly: this.user$.value.type !== 'patient',
        },
        {
            fieldName: 'username',
            label: 'Username',
            type: 'text',
            readonly: this.user$.value.type === 'manager',
        },
        {
            fieldName: 'phone',
            label: 'Phone',
            type: 'tel',
        },
        {
            fieldName: 'address',
            label: 'Address',
            type: 'text',
        },
        {
            fieldName: 'licence_number',
            label: 'Licence Number',
            type: 'text',
            forRole: 'doctor',
        },
        {
            fieldName: 'branch',
            label: 'Branch',
            type: 'text',
            forRole: 'doctor',
        },
        // {
        //     fieldName: 'specialization',
        //     label: 'Specialization',
        //     type: 'text',
        //     forRole: 'doctor',
        // }
    ];

    specializations?: Specialization[];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        private profileService: ProfileService,
        private emailValidator: UniqueEmailValidator,
        private usernameValidator: UniqueUsernameValidator,
        public errorMessages: FieldErrorMessagesService,
        public dialogService: DialogService
    ) {
        this.specializations = this.route.snapshot.data['specializations'];
        this.user$.subscribe((user) => {
            this.profileForm.patchValue(user as any);
        });
    }

    resetField(fieldName: string, event?: Event) {
        this.profileForm.patchValue({
            [fieldName]: this.user$.value?.[fieldName],
        });
    }

    patchProfile() {
        this.profileService
            .update_profile(this.profileForm.value as any)
            .subscribe({
                next: (_user) => {
                    this.profileForm.markAsPristine();
                },
                error: (err) => {
                    this.profileForm.patchValue(this.user$.value as any);
                    console.error(err);
                },
                complete: () => {
                    this.formEdited.next(false);
                },
            });
    }

    calculateFormEdited(): boolean {
        return this.fieldNames.every(
            (key: string) =>
                this.profileForm?.get(key)?.value === this.user$.value[key]
        );
    }

    ngOnInit(): void {
        this.profileForm.valueChanges.subscribe(() =>
            this.formEdited.next(!this.calculateFormEdited())
        );
    }

    dialogRef: DynamicDialogRef | undefined;
    openEditImageModal() {
        this.dialogRef = this.dialogService.open(EditImageComponent, {
            data: {
                profile_picture: this.user$.value.profile_picture,
            },
            header: 'Edit profile picture',
            width: '70%',
            draggable: false,
            resizable: true,
            styleClass: 'edit-image-modal',
            contentStyle: {
                overflow: 'auto',
                backgroundColor: 'var(--bg-color)',
            },
            modal: true,
            baseZIndex: 10000,
        });

        this.dialogRef.onClose.subscribe(
            ({ action = 'cancel', picture } = {}) => {
                if (action === 'edit' && picture !== undefined) {
                    const formData = new FormData(document.forms[0]);
                    formData.append('profile_picture', picture);
                    this.profileService.update_avatar(formData).subscribe({
                        error: (err) => {
                            console.error(err);
                        },
                    });
                }
                if (action == 'delete') {
                    this.profileService.delete_avatar().subscribe({
                        error: (err) => {
                            console.error(err);
                        },
                    });
                }
            }
        );
    }
    ngOnDestroy() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
        this.formEdited.complete();
    }
}
