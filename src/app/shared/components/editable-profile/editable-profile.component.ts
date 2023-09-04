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
} from '@angular/core';
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
import { Specialization } from '@core/models/specialization';

import { EditImageComponent } from '@shared/components/edit-image/edit-image.component';

import { FieldBase, baseFieldConfig } from '@core/utils/profile-fields';
import { ErrorMessages } from '@core/utils/form-error-messages';
import { User, UserRole } from '@core/models/users';
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
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ width: '90%', opacity: 0 }),
                animate('0.5s ease-out', style({ width: '*', opacity: 1 })),
            ]),
            transition(':leave', [
                style({ width: '*', opacity: 1 }),
                animate('0.5s ease-in', style({ width: '90%', opacity: 0 })),
            ]),
        ]),
    ],
    providers: [DialogService],
})
export class EditableProfileComponent implements OnInit, OnChanges, OnDestroy {
    errorMessages = ErrorMessages;
    imgLoading = true;
    @Input() styles: any = {};
    @Input() classes: any = {};
    @Input() renderFor?: UserRole;
    @Input() user?: User | null = null;
    @Output() userChange = new EventEmitter<User>();
    @Output() profileEdited = new EventEmitter<Partial<User>>();
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
    });

    fieldConfig?: FieldBase<string>[];

    specializations?: Specialization[];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        public dialogService: DialogService
    ) {
        this.specializations = this.route.snapshot.data['specializations'];
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
        this.profileForm.patchValue({
            [key]: this.user?.[key] ?? '',
        });
    }

    protected updateProfile() {
        const { value } = this.profileForm;
        const untouchedFields = Object.keys(value).filter(
            this.fieldEdited.bind(this)
        ) as (keyof typeof value)[];
        this.profileEdited.emit(
            Object.omit(this.profileForm.value, ...untouchedFields) as any
        );
        this.userChange.emit({ ...value } as any);
    }

    protected resetForm() {
        this.profileForm.patchValue(this.user as any);
        this.profileForm.markAsPristine();
    }

    protected fieldEdited(key: string) {
        return this.profileForm.get(key)?.value === this.user?.[key];
    }

    get fromEdited(): boolean {
        return (
            this.fieldConfig?.every(({ key }) => this.fieldEdited(key)) ?? false
        );
    }

    private createEditImageDialog() {
        return this.dialogService.open(EditImageComponent, {
            data: {
                profile_picture: this.user?.profile_picture,
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
        this.profileForm.get('email')?.disable();
        this.profileForm.addControl(
            'licence_number' as any,
            this.fb.control('', [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(12),
                Validators.pattern(/^\d{5,12}$/),
            ])
        );
        this.profileForm.addControl(
            'specialization' as any,
            this.fb.control('', [Validators.required])
        );
        this.profileForm.addControl(
            'branch' as any,
            this.fb.control({ value: '', disabled: true }, [
                Validators.required,
            ])
        );
    }

    ngOnInit(): void {
        if (this.renderFor === 'doctor') {
            this.addDoctorControls();
        }
        this.profileForm.valueChanges.subscribe((value) => {
            this.hasChange.next(!this.fromEdited);
            this.valueChanged.emit(value as any);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.['user']) {
            if (this.renderFor === 'doctor') {
                this.addDoctorControls();
            }
            if (changes?.['user'].isFirstChange()) {
                this.fieldConfig = baseFieldConfig(
                    this.user?.type ?? 'patient',
                    this.renderFor ?? 'patient'
                );
                if (this.user?.type === 'doctor') {
                    this.fieldConfig.find(
                        ({ key }) => key === 'specialization'
                    )!.options = this.specializations!.map(({ id, name }) => ({
                        key: name,
                        value: id,
                    }));
                }
            }
            this.profileForm.patchValue(this.user as any);
            this.profileForm.markAsPristine();
            this.hasChange.next(false);
        }
    }

    ngOnDestroy() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
        this.hasChange.complete();
    }
}
