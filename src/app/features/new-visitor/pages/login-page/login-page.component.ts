import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { InvalidDirtyErrorStateMatcher } from '@core/utils/error-state-matcher';
import { IsHandsetService } from '@core/services/is-handset.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
    is_manager: boolean | null = null;
    hidden: boolean = false;
    usernameRegex: RegExp = /^[_-]*[a-zA-Z][\w-]*$/;
    matcher = new InvalidDirtyErrorStateMatcher();

    loginForm = this.fb.group({
        username: [
            '',
            [
                Validators.required,
                Validators.pattern(this.usernameRegex),
                Validators.minLength(4),
                Validators.maxLength(16),
            ],
        ],
        password: [
            '',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(14),
            ],
        ],
    });

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder,
        private isHandsetService: IsHandsetService
    ) {
        this.activatedRoute.data
            .pipe(map((data) => data['manager']))
            .subscribe((manager) => {
                this.is_manager = manager;
            });
    }

    get isHandset$() {
        return this.isHandsetService.isHandset$;
    }

    ngOnInit(): void {}

    fieldIcon(name: string): string {
        const field = this.loginForm.get(name);
        field.hasError('pattern');
        if (field.valid) {
            return 'check_circle_outline';
        }
        if (field.dirty && field.invalid) {
            return 'error_outline';
        }

        return '';
    }

    fieldColor(name: string): string {
        return this.loginForm.get(name).valid ? 'primary' : 'warn';
    }

    togglePassword(event: Event) {
        if (event.type === 'click' && this.isHandsetService.isHandset) {
            return;
        }
        this.hidden = !this.hidden;
    }

    getPasswordErrorMessage() {
        const passwordField = this.loginForm.get('password');
        if (passwordField.hasError('required')) {
            return 'You must enter a value';
        }
        if (passwordField.hasError('minlength')) {
            return 'Your password is at least 8 characters long';
        }
        if (passwordField.hasError('maxlength')) {
            return 'Your password is at most 14 characters long';
        }
        return '';
    }
    submitted = true; // Whether the form has been submitted
    errorMessage = ''; // Place to store errors
    onSubmit() {
        this.submitted = true;
        if (!this.loginForm.valid) {
            alert('Invalid form state');
            return;
        }
        const { username, password } = this.loginForm.value;
        this.authService.login({ username, password }).subscribe({
            next: (user) => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                const msg = new String(err.error.message);
                this.errorMessage = msg.toTitleCase();
            },
        });
    }
}
