import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { StepperOrientation } from '@angular/material/stepper';

import {
    ConfirmPasswordErrorMatcher,
    InvalidDirtyErrorStateMatcher,
} from '@core/utils/error-state-matcher';
import { Observable, map } from 'rxjs';
import {
    UniqueEmailValidator,
    UniqueUsernameValidator,
} from './unique-creds.validator';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit, AfterViewInit {
    matcher = new InvalidDirtyErrorStateMatcher();
    confirmPasswordMatcher = new ConfirmPasswordErrorMatcher();

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

    emailRegex: RegExp =
        /^[\w-](?:\.?[\w-]){0,63}@[\w-]{1,63}(?:\.[\w-]{1,63})*$/;
    usernameRegex: RegExp = /^[_-]*[a-zA-Z][\w-]*$/;
    phoneRegex: RegExp =
        /^((\+381)|0)?[\s-]*6[\s-]*(([0-6]|[8-9]|(7[\s-]*[7-8]))(?:[ -]*\d[ -]*){6,7})$/;
    passwordRegex: RegExp =
        /^(?=[a-zA-Z].+$)(?=.{8,14}$)(?=[^A-Z]*[A-Z])(?=[^\d]*[\d])(?=[^\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]*[\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e])(?:([\x20-\x7E])\1?(?!\1))+$/;
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
                        [
                            Validators.required,
                            Validators.pattern(this.emailRegex),
                        ],
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
                            Validators.maxLength(16),
                            Validators.pattern(this.usernameRegex),
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
                    [Validators.required, Validators.pattern(this.phoneRegex)],
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
                            Validators.pattern(this.passwordRegex),
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
    preview: ElementRef<HTMLImageElement>;
    previewDOM: HTMLImageElement;
    ngAfterViewInit(): void {
        this.previewDOM = this.preview.nativeElement;
    }

    async imageValidator(g: AbstractControl): Promise<ValidationErrors> {
        const file = g.value;
        if (file === '' || file === undefined) {
            return Promise.resolve(null);
        }
        if ((file as File).type.split('/')[0] !== 'image') {
            return Promise.resolve({ notImage: true });
        }
        return new Promise((resolve, reject) => {
            const image = this.previewDOM;
            image.onload = function (this: HTMLImageElement) {
                const { width, height } = this;
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

    get formArray(): AbstractControl | null {
        return this.registerForm.get('formArray');
    }

    readonly passwordChecks = [
        {
            error: 'Password must start with a letter',
            regex: /^[a-zA-Z].*$/,
        },
        {
            error: 'Password must be between 8 and 14 characters',
            regex: /^(?=.{8,14}$).*/,
        },
        {
            error: 'Password must contain an uppercase letter',
            regex: /^(?=[^A-Z]*[A-Z]).*/,
        },
        {
            error: 'Password must contain a digit',
            regex: /^(?=[^\d]*[\d]).*/,
        },
        {
            error: 'Password must contain a special character',
            regex: /^(?=[^\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]*[\x20-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]).*/,
        },
        {
            error: 'Password must not contain more than 2 repeating characters',
            regex: /^(?:([\x20-\x7e])\1?(?!\1))+$/,
        },
    ];

    passwordMatchValidator(g: AbstractControl) {
        return g.get('password').value === g.get('confirm_password').value
            ? null
            : { mismatch: true };
    }

    getStepErrorMessage(stepIndex: number) {
        if (stepIndex < 0 || stepIndex > 4) return '';
        const group = this.formArray?.get([stepIndex]);
        switch (stepIndex) {
            case 0:
                return 'Required';
            case 1:
                const email = group.get('email');
                const username = group.get('username');
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
                const phone = group.get('phone');
                const address = group.get('address');
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
                const pwd = group.get('password');
                const cpwd = group.get('confirm_password');
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
                const img = group.get('profile_picture');
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
        const mergedData = this.registerForm.value.formArray.reduce(
            (acc, group) => Object.assign(acc, group),
            {}
        );
        Object.assign(mergedData, { confirm_password: undefined });
        this.authService.register(mergedData).subscribe((response) => {
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
        private uniqueUsernameValidator: UniqueUsernameValidator
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
