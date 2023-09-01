import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    TemplateRef,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';

import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { StepperOrientation } from '@angular/material/stepper';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmPasswordErrorMatcher } from '@core/utils/error-state-matcher';
import { AuthService } from '@core/services/auth.service';
import {
    UniqueEmailValidator,
    UniqueUsernameValidator,
} from '../../../../core/services/unique-creds.service';
import {
    emailRegex,
    usernameRegex,
    passwordRegex,
    phoneRegex,
    passwordChecks,
} from '@core/constants/verification-regex';
import { FieldErrorMessagesService } from '@core/services/field-error-messages.service';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit, AfterViewInit {
    matcher = new ShowOnDirtyErrorStateMatcher();
    confirmPasswordMatcher = new ConfirmPasswordErrorMatcher();
    passwordChecks = passwordChecks;

    passwordHidden: boolean = false;
    togglePassword(event: Event) {
        if (
            event.type == 'click' &&
            this.breakpointObserver.isMatched(Breakpoints.Handset)
        ) {
            return;
        }
        this.passwordHidden = !this.passwordHidden;
    }

    registerForm: FormGroup = this.fb.group({
        formArray: this.fb.array([
            this.fb.group({
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
            }),
            this.fb.group(
                {
                    email: [
                        '',
                        [Validators.required, Validators.pattern(emailRegex)],
                        [
                            this.uniqueEmailValidator.validate.bind(
                                this.uniqueEmailValidator
                            ),
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
                            this.uniqueUsernameValidator.validate.bind(
                                this.uniqueUsernameValidator
                            ),
                        ],
                    ],
                },
                {
                    updateOn: 'change',
                }
            ),
            this.fb.group({
                phone: [
                    '',
                    [Validators.required, Validators.pattern(phoneRegex)],
                ],
                address: ['', Validators.required],
            }),
            this.fb.group(
                {
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
                },
                {
                    validators: this.passwordMatchValidator,
                }
            ),
            this.fb.group({
                profile_picture: ['', [], this.imageValidator.bind(this)],
            }),
        ]),
    });

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

    get formArray(): AbstractControl {
        return this.registerForm.get('formArray')!;
    }

    passwordMatchValidator(g: AbstractControl) {
        return g?.get('password')?.value === g?.get('confirm_password')?.value
            ? null
            : { mismatch: true };
    }

    getStepErrorMessage(stepIndex: number) {
        if (stepIndex < 0 || stepIndex > 4) return '';
        const group = this.formArray.get([stepIndex])!;
        switch (stepIndex) {
            case 0:
                return 'Required';
            case 1:
                const email = group.get('email')!;
                const username = group.get('username')!;
                if (
                    email.hasError('required') ||
                    username.hasError('required')
                ) {
                    return 'Required';
                }
                if (email.hasError('pattern')) {
                    return 'Email format';
                }
                if (
                    username.hasError('pattern') ||
                    username.hasError('minlength') ||
                    username.hasError('maxlength')
                ) {
                    return 'Username format';
                }
                break;
            case 2:
                const phone = group.get('phone')!;
                const address = group.get('address')!;
                if (
                    phone.hasError('required') ||
                    address.hasError('required')
                ) {
                    return 'Required';
                }
                if (phone.hasError('pattern')) {
                    return 'Phone format';
                }
                break;
            case 3:
                const pwd = group.get('password')!;
                const cpwd = group.get('confirm_password')!;
                if (pwd.hasError('required') || cpwd.hasError('required')) {
                    return 'Required';
                }
                if (pwd.hasError('pattern')) {
                    return 'Password insecure';
                }
                if (group.hasError('mismatch')) {
                    return 'Bad confirmation';
                }
                break;
            case 4:
                const img = group.get('profile_picture')!;

                if (img.hasError('tooSmall') || img.hasError('tooBig')) {
                    return 'Image size';
                }
                if (img.hasError('notImage')) {
                    return 'Not an image';
                }
        }
        return '';
    }

    modalRef?: BsModalRef;
    onSubmit(registerModal: TemplateRef<any>) {
        const formData = new FormData(document.querySelector('form')!);
        if (this.registerForm.get('formArray.4.profile_picture')?.value) {
            formData.append(
                'profile_picture',
                this.registerForm.get('formArray.4.profile_picture')?.value
                    ?.files?.[0]
            );
        }
        this.authService.register(formData).subscribe((response) => {
            this.modalRef = this.modalService.show(registerModal, {
                animated: true,
            });
        });
    }

    stepperOrientation: Observable<StepperOrientation>;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private modalService: BsModalService,
        private breakpointObserver: BreakpointObserver,
        private uniqueEmailValidator: UniqueEmailValidator,
        private uniqueUsernameValidator: UniqueUsernameValidator,
        public errorMessages: FieldErrorMessagesService
    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
        this.modalService.onHidden.subscribe(() => {
            this.router.navigate(['/']);
        });
    }

    ngOnInit(): void {}
}
