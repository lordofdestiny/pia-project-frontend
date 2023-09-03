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
import { ProfileService } from '@core/services/profile.service';
import { FieldErrorMessagesService } from '@core/services/field-error-messages.service';

import { EditImageComponent } from '@shared/components/edit-image/edit-image.component';

import { FieldBase, baseFieldConfig } from '@core/utils/profile-fields';
import { User, UserRole } from '@core/models/users';

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
    imgLoading = true;
    @Input() renderFor?: UserRole;
    @Input() _user: User | null = null;
    @Output() profileEdited = new EventEmitter<User>();
    @Output() pictureEdited = new EventEmitter<PictureEvent>();
    @Output() valueChanged = new EventEmitter<User>();
    user?: User;
    user$ = this.authService.user$;

    formEdited = new BehaviorSubject<boolean>(false);
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

    uniqueAndNotMineValidator(
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

    fieldConfig?: FieldBase<string>[];

    specializations?: Specialization[];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        private profileService: ProfileService,
        public errorMessages: FieldErrorMessagesService,
        public dialogService: DialogService
    ) {
        this.specializations = this.route.snapshot.data['specializations'];
        this.user$.subscribe((user) => {
            if (
                user.type === 'doctor' &&
                user.specialization instanceof Object
            ) {
                user.specialization = user.specialization?.id;
            }
            this.user = user;
            this.profileForm.patchValue(this.user as any);
        });
    }

    protected resetField(key: string, event?: Event) {
        this.profileForm.patchValue({
            [key]: this.user?.[key] ?? '',
        });
    }

    protected updateProfile() {
        this.profileEdited.emit(this.profileForm.value as any);
        this.profileService
            .update_profile(this.profileForm.value as any)
            .subscribe({
                next: (_user) => {
                    this.profileForm.markAsPristine();
                },
                error: (err) => {
                    this.resetForm();
                    console.error(err);
                },
                complete: () => {
                    this.formEdited.next(false);
                },
            });
    }

    protected resetForm() {
        this.profileForm.patchValue(this.user as any);
        this.profileForm.markAsPristine();
    }

    protected fieldEdited(key: string) {
        return this.profileForm.get(key)?.value === this.user$.value[key];
    }

    get fromEdited(): boolean {
        return (
            this.fieldConfig?.every(({ key }) => this.fieldEdited(key)) ?? false
        );
    }

    private createEditImageDialog() {
        return this.dialogService.open(EditImageComponent, {
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

    ngOnInit(): void {
        this.profileForm.valueChanges.subscribe((value) => {
            this.formEdited.next(!this.fromEdited);
            this.valueChanged.emit(value as any);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.fieldConfig = baseFieldConfig(
            this.user$.value.type,
            this.renderFor ?? this.user$.value.type
        );
    }

    ngOnDestroy() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
        this.formEdited.complete();
    }
}
