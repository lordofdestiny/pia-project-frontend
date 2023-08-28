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

import { InvalidDirtyErrorStateMatcher } from '@core/utils/error-state-matcher';
import { Observable, map } from 'rxjs';
import {
    UniqueEmailValidator,
    UniqueUsernameValidator,
} from './unique-creds.validator';
import { AuthService } from '@shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit, AfterViewInit {
    hidden: boolean = false;

    togglePassword(event: Event) {
        if (
            event.type == 'click' &&
            this.breakpointObserver.isMatched(Breakpoints.Handset)
        ) {
            return;
        }
        this.hidden = !this.hidden;
    }

    emailRegex: RegExp =
        /^[\w-](?:\.?[\w-]){0,63}@[\w-]{1,63}(?:\.[\w-]{1,63})*$/;
    usernameRegex: RegExp = /^[_-]*[a-zA-Z][\w-]*$/;
    phoneRegex: RegExp =
        /^((\+381)|0)?[\s-]*6[\s-]*(([0-6]|[8-9]|(7[\s-]*[7-8]))(?:[ -]*\d[ -]*){6,7})$/;
    passwordRegex: RegExp =
        /^(?=[a-zA-Z].+$)(?=.{8,14}$)(?=[^A-Z]*[A-Z])(?=[^0-9]*[0-9])(?=[^~!@#$%^&*()_+=\-\[\]{};:'"\\\|,.<>\/?]*[~!@#$%^&*()_+=\-\[\]{};:'"\\\|,.<>\/?])(?:([\w\d~!@#$%^&*()_+=\-\[\]{};:'"\\\|,.<>\/?])\1?(?!\1))+$/;

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
                    updateOn: 'blur',
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
                profile_picture: ['', [], this.imageSizeValidator.bind(this)],
            }),
        ]),
    });

    @ViewChild('preview', { static: false })
    preview: ElementRef<HTMLImageElement>;
    previewDOM: HTMLImageElement;
    ngAfterViewInit(): void {
        this.previewDOM = this.preview.nativeElement;
    }

    async imageSizeValidator(g: AbstractControl): Promise<ValidationErrors> {
        const file = g.value;
        if (file === '' || file === null || file === undefined) {
            return null;
        }
        const image =
            this.previewDOM != undefined ? this.previewDOM : new Image();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
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

                image.onerror = function (this: HTMLImageElement) {
                    reject({ 'error: ': 'Error loading image' });
                };

                image.src = reader.result as string;
            };
            reader.onerror = () => {
                reject({ error: 'Error reading file' });
            };
            reader.readAsDataURL(file as Blob);
        });
    }

    get formArray(): AbstractControl | null {
        return this.registerForm.get('formArray');
    }

    matcher = new InvalidDirtyErrorStateMatcher();

    getConfirmPasswordErrorMessage() {
        const cpwd = this.formArray.get([3]).get('confirm_password');
        if (cpwd.hasError('required')) {
            return 'Please confirm your password';
        }
        return '';
    }

    passwordMatchValidator(g: AbstractControl) {
        return g.get('password').value === g.get('confirm_password').value
            ? null
            : { mismatch: true };
    }

    getStepErrorMessage(stepIndex: number) {
        switch (stepIndex) {
            case 0:
                return 'Required';
            case 1: {
                const group = this.formArray?.get([1]);
                return group.get('email').hasError('required') ||
                    group.get('username').hasError('required')
                    ? 'Required'
                    : group.get('email').hasError('pattern')
                    ? 'Email format'
                    : group.get('username').hasError('pattern')
                    ? 'Username format'
                    : '';
            }
            case 2: {
                const group = this.formArray?.get([2]);
                return group.get('phone').hasError('required') ||
                    group.get('address').hasError('required')
                    ? 'Required'
                    : group.get('phone').hasError('pattern')
                    ? 'Phone format'
                    : '';
            }
            case 3: {
                const group = this.formArray?.get([3]);
                return group.get('password').hasError('required') ||
                    group.get('confirm_password').hasError('required')
                    ? 'Required'
                    : group.get('password').hasError('pattern')
                    ? 'Password insecure'
                    : group.hasError('mismatch')
                    ? 'Passwords do not match'
                    : '';
            }
            default:
                return '';
        }
    }

    getEmailErrorMessage() {
        const emailField = this.formArray.get([1]).get('email');
        if (emailField.hasError('required')) {
            return 'Email is required';
        }
        if (emailField.hasError('pattern')) {
            return 'Email format is not valid';
        }
        if (emailField.hasError('notuniqueEmail')) {
            return 'Email is already taken';
        }
        return '';
    }

    getUsernameErrorMessage() {
        const usernameField = this.formArray.get([1]).get('username');
        if (usernameField.hasError('required')) {
            return 'Username is required';
        }
        if (usernameField.hasError('pattern')) {
            return 'Username format is not valid';
        }
        if (usernameField.hasError('minlength')) {
            return 'Username must be at least 4 characters';
        }
        if (usernameField.hasError('maxlength')) {
            return 'Username must be at most 16 characters';
        }
        if (usernameField.hasError('notuniqueUsername')) {
            return 'Username is already taken';
        }
        return '';
    }

    getPhoneErrorMessage() {
        const phoneField = this.formArray.get([2]).get('phone');
        if (phoneField.hasError('required')) {
            return 'Phone number is required';
        }
        if (phoneField.hasError('pattern')) {
            return 'Phone number format is not valid';
        }
        return '';
    }
    passwordChecks = [
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
            regex: /^(?=[^0-9]*[0-9]).*/,
        },
        {
            error: 'Password must contain a special character',
            regex: /(?=[^~!@#$%^&*()_+=\-\[\]{};:'"\\\|,.<>\/?]*[~!@#$%^&*()_+=\-\[\]{};:'"\\\|,.<>\/?])/,
        },
        {
            error: 'Password must not contain more than 2 repeating characters',
            regex: /^(?:([\x21-\x7e])\1?(?!\1))+$/,
        },
    ];

    getPasswordErrorMessage() {
        const passwordField = this.formArray.get([3]).get('password');

        if (passwordField.hasError('required')) {
            return 'Password is required';
        }
        if (passwordField.hasError('pattern')) {
            return 'Password is not secure enough';
        }
        return '';
    }

    getPictureErrorMessage() {
        const pictureFiled = this.formArray.get([4]).get('profile_picture');
        if (pictureFiled.hasError('tooSmall')) {
            return 'Image has to be at least 100x100px';
        }
        if (pictureFiled.hasError('tooBig')) {
            return 'Image has to be at most 300x300px';
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
