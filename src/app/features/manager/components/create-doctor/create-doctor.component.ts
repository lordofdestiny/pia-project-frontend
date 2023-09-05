import {
    Component,
    ElementRef,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import {
    emailRegex,
    passwordRegex,
    phoneRegex,
    usernameRegex,
    passwordChecks,
} from '@core/constants/verification-regex';
import { AuthService } from '@core/services/auth.service';
import {
    UniqueEmailValidator,
    UniqueUsernameValidator,
} from '@core/services/unique-creds.service';
import { ErrorMessages } from '@core/utils/form-error-messages';
import {
    FieldBase,
    ImageField,
    TextboxField,
    baseFieldConfig,
} from '@core/utils/profile-fields';
import { Doctor } from '@core/models/users';
import { FileInput } from 'ngx-material-file-input';
import { ConfirmPasswordErrorMatcher } from '@core/utils/error-state-matcher';

@Component({
    selector: 'app-create-doctor',
    templateUrl: './create-doctor.component.html',
    styleUrls: ['./create-doctor.component.css'],
})
export class CreateDoctorComponent implements OnInit {
    specializations = this.route.snapshot.data['specializations'];
    fieldConfig: FieldBase<any>[] = [];
    passwordChecks = passwordChecks;
    @Output() created = new EventEmitter<
        Partial<Doctor> & { profile_picture: FileInput }
    >();
    @Output() cleared = new EventEmitter<void>();

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.fieldConfig = baseFieldConfig('doctor', 'manager').slice();
        const specializationField = this.fieldConfig.find(
            ({ key }) => key === 'specialization'
        );
        if (specializationField) {
            specializationField.options = this.specializations;
        }
        this.fieldConfig.push(
            ...[
                new TextboxField({
                    key: 'password',
                    label: 'Password',
                    type: 'password',
                }),
                new TextboxField({
                    key: 'confirm_password',
                    label: 'Confirm Password',
                    type: 'password',
                }),
                new ImageField({
                    key: 'profile_picture',
                    label: 'Profile Picture',
                    type: 'file',
                }),
            ]
        );
    }

    private emailValidator = new UniqueEmailValidator(this.authService);
    private usernameValidator = new UniqueUsernameValidator(this.authService);
    passwordMatchValidator(g: AbstractControl) {
        return g?.get('password')?.value === g?.get('confirm_password')?.value
            ? null
            : { mismatch: true };
    }

    @ViewChild('preview', { static: false })
    preview?: ElementRef<HTMLImageElement>;
    previewDOM?: HTMLImageElement;
    ngAfterViewInit(): void {
        this.previewDOM = this.preview?.nativeElement;
    }
    async imageValidator(g: AbstractControl): Promise<ValidationErrors | null> {
        const files = g?.value?.files;
        if (files === '' || files === null || files === undefined) {
            return Promise.resolve(null);
        }
        const file = files[0];
        if ((file as File).type.split('/')[0] !== 'image') {
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

    doctorForm = this.fb.group(
        {
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: [
                '',
                [Validators.required, Validators.pattern(emailRegex)],
                [this.emailValidator.validate.bind(this.emailValidator)],
            ],
            username: [
                '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(20),
                    Validators.pattern(usernameRegex),
                ],
                [this.usernameValidator.validate.bind(this.usernameValidator)],
            ],
            phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
            address: ['', Validators.required],
            specialization: ['', Validators.required],
            licence_number: [
                '',
                [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(12),
                    Validators.pattern(/^\d{5,12}$/),
                ],
            ],
            branch: ['', Validators.required],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(14),
                    Validators.pattern(passwordRegex),
                ],
            ],
            confirm_password: ['', Validators.required],
            profile_picture: [
                null as unknown as FileInput,
                [],
                this.imageValidator.bind(this),
            ],
        },
        {
            updateOn: 'change',
            validators: [this.passwordMatchValidator.bind(this)],
        }
    );

    errorMessages = ErrorMessages;
    matcher = new ShowOnDirtyErrorStateMatcher();
    confirmPasswordMatcher = new ConfirmPasswordErrorMatcher();
    ngOnInit(): void {}

    protected handleCreate() {
        this.created.emit(this.doctorForm.value as any);
    }

    protected handleClear() {
        this.doctorForm.reset();
        this.previewDOM!.src = '';
        this.cleared.emit();
    }

    clear() {
        this.handleClear();
    }
}
