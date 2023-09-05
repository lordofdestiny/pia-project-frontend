import { ActivatedRoute } from '@angular/router';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    OnChanges,
    Output,
    EventEmitter,
    SimpleChanges,
    AfterViewInit,
} from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
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
import { Specialization } from '@core/models/specialization';

import { EditImageComponent } from '@shared/components/edit-image/edit-image.component';

import { FieldBase, baseFieldConfig } from '@core/utils/profile-fields';
import { ErrorMessages } from '@core/utils/form-error-messages';
import { Doctor, Manager, Patient, User, UserRole } from '@core/models/users';
import '@core/utils/object';

export type PictureEventAction = 'edit' | 'cancel' | 'delete';
export interface PictureEventBase {
    action: PictureEventAction;
    picture?: File;
}
export type PictureEvent =
    | (PictureEventBase & { action: 'edit'; picture: File })
    | (PictureEventBase & { action: 'cancel' | 'delete'; picture?: undefined });

@Component({
    selector: 'app-editable-profile',
    templateUrl: './editable-profile.component.html',
    styleUrls: ['./editable-profile.component.css'],
    providers: [DialogService],
})
export class EditableProfileComponent<T extends Patient | Doctor | Manager>
    implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
    errorMessages = ErrorMessages;
    imgLoading = true;
    @Input() disabled = false;
    @Input() styles: any = {};
    @Input() classes: any = {};
    @Input() renderFor?: UserRole;
    @Input() user?: T;
    @Output() userChange = new EventEmitter<T>();
    @Output() profileEdited = new EventEmitter<Partial<T>>();
    @Output() pictureEdited = new EventEmitter<PictureEvent>();
    @Output() valueChanged = new EventEmitter<User>();

    hasChange = new BehaviorSubject<boolean>(false);
    matcher = new ShowOnDirtyErrorStateMatcher();
    private emailValidator = new UniqueEmailValidator(this.authService);
    private usernameValidator = new UniqueUsernameValidator(this.authService);
    profileForm = this.fb.group({
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: [
            '',
            [Validators.required, Validators.pattern(emailRegex)],
            [
                this.uniqueAndNotMineValidator(
                    'email',
                    this.emailValidator
                ).bind(this),
            ],
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
                this.uniqueAndNotMineValidator(
                    'username',
                    this.usernameValidator
                ).bind(this),
            ],
        ],
        phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
        address: ['', [Validators.required]],
        branch: '',
        specialization: '',
        licence_number: '',
        profile_picture: null as unknown,
    });

    fieldConfig?: FieldBase<string>[];

    specializations: Specialization[];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        public dialogService: DialogService
    ) {
        this.specializations =
            this.route.snapshot.data['specializations'] ?? [];
    }

    uniqueAndNotMineValidator(
        field: 'email' | 'username',
        validator: UniqueCredentialValidator
    ) {
        return (control: AbstractControl) => {
            if (control.value === this.user?.[field]) {
                return of(null);
            }
            return validator.validate.bind(validator)(control);
        };
    }
    protected resetField(key: string, event?: Event) {
        event?.stopPropagation?.();
        if (key === 'specialization' && this.user?.type === 'doctor') {
            this.profileForm.patchValue({
                specialization: this.user?.specialization?.id ?? null,
            });
        } else {
            this.profileForm.patchValue({
                [key]: this.user?.[key] ?? '',
            });
        }
        this.profileForm.get(key)?.markAsPristine();
        if (!this.formEdited) {
            this.hasChange.next(false);
            this.profileForm.markAsPristine();
        }
    }

    protected updateProfile() {
        const { value } = this.profileForm;

        const editedFields = Object.keys(value).filter(
            this.fieldEdited.bind(this)
        ) as (keyof typeof value)[];

        this.profileEdited.emit(
            Object.assign(
                { type: this.user?.type },
                Object.pick(this.profileForm.value, ...editedFields)
            ) as any
        );
        this.userChange.emit(
            Object.assign(
                { type: this.user?.type },
                Object.pick(this.profileForm.value, ...editedFields)
            ) as any
        );
    }

    protected resetForm() {
        this.profileForm.patchValue(this.user as any);
        if (this.user?.type === 'doctor') {
            const spec = this.specializations.find(
                ({ id }) => id === this.user?.specialization?.id
            );
            if (this.profileForm.get('specialization')) {
                this.profileForm.patchValue({
                    specialization: spec?.id ?? null,
                });
            }
        }
        this.profileForm.markAsPristine();
        this.hasChange.next(false);
    }

    protected fieldEdited(key: string) {
        if (key === 'specialization') {
            return this.profileForm.get(key)?.value !== this.user?.[key]?.id;
        }
        return this.profileForm.get(key)?.value !== this.user?.[key];
    }

    get formEdited(): boolean {
        return (
            this.fieldConfig?.some(({ key }) => this.fieldEdited(key)) ?? false
        );
    }

    private createEditImageDialog() {
        return this.dialogService.open(EditImageComponent, {
            data: {
                profile_picture: this.user?.profile_picture,
                forManager: this.renderFor === 'manager',
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
    }

    dialogRef: DynamicDialogRef | undefined;
    protected openEditImageModal() {
        this.createEditImageDialog().onClose.subscribe(
            (event: PictureEvent = { action: 'cancel' }) => {
                const { action, picture } = event;
                if (action === 'edit') {
                    this.profileForm.patchValue({
                        profile_picture: picture,
                    });
                    this.pictureEdited.emit({
                        action: 'edit',
                        picture,
                    });
                } else {
                    this.pictureEdited.emit({
                        action,
                    });
                }
            }
        );
    }

    private addedControls = false;
    private addDoctorControls() {
        if (this.addedControls) return;
        this.addedControls = true;
        if (this.renderFor === 'doctor') {
            this.profileForm.get('email')?.disable();
        }
        this.profileForm.setControl(
            'licence_number' as any,
            this.fb.control('', [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(12),
                Validators.pattern(/^\d{5,12}$/),
            ])
        );
        this.profileForm.setControl(
            'specialization' as any,
            this.fb.control(null, [Validators.required])
        );
        this.profileForm.setControl(
            'branch' as any,
            this.fb.control(
                { value: '', disabled: this.renderFor === 'doctor' },
                [Validators.required]
            )
        );
    }

    loaded = false;
    ngOnInit(): void {
        if (this.renderFor === 'doctor') {
            this.addDoctorControls();
        }
        this.profileForm.valueChanges.subscribe((value) => {
            this.hasChange.next(this.formEdited);
            this.valueChanged.emit(value as any);
        });
        this.loaded = true;
    }

    ngAfterViewInit(): void {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.['user']?.isFirstChange()) {
            this.fieldConfig = baseFieldConfig(
                this.user?.type ?? 'patient',
                this.renderFor ?? 'manager'
            );
            if (this.user?.type === 'doctor') {
                this.fieldConfig.find(
                    ({ key }) => key === 'specialization'
                )!.options = this.specializations;
                this.addDoctorControls();
            }
        }
        if (changes?.['user']) {
            this.resetForm();
        }
        if (changes['disabled']?.currentValue) {
            this.profileForm.disable();
        } else {
            this.profileForm.enable();
        }
    }

    ngOnDestroy() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
        this.hasChange.complete();
        this.userChange.complete();
        this.profileEdited.complete();
        this.pictureEdited.complete();
        this.valueChanged.complete();
    }
}
