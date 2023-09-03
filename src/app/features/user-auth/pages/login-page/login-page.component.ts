import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { AuthService } from '@core/services/auth.service';
import { IsHandsetService } from '@core/services/is-handset.service';
import { FieldErrorMessagesService } from '@core/services/field-error-messages.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
    is_manager = this.activatedRoute.snapshot.data['manager'];
    hidden: boolean = false;
    usernameRegex: RegExp = /^[_-]*[a-zA-Z][\w-]*$/;
    matcher = new ShowOnDirtyErrorStateMatcher();

    loginForm = this.fb.group({
        username: [
            '',
            [
                Validators.required,
                Validators.pattern(this.usernameRegex),
                Validators.minLength(4),
                Validators.maxLength(20),
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
        private isHandsetService: IsHandsetService,
        public errorMessages: FieldErrorMessagesService
    ) {}

    get isHandset$() {
        return this.isHandsetService.isHandset$;
    }

    ngOnInit(): void {}

    fieldIcon(name: string): string {
        const field = this.loginForm.get(name)!;
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
        return this.loginForm.get(name)!.valid ? 'primary' : 'warn';
    }

    togglePassword(event: Event) {
        if (event.type === 'click' && this.isHandsetService.isHandset) {
            return;
        }
        this.hidden = !this.hidden;
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
        this.authService
            .login(
                {
                    username: username!,
                    password: password!,
                },
                this.is_manager
            )
            .subscribe({
                next: (user) => {
                    const role = user.type;
                    this.router.navigate([role]);
                },
                error: (err) => {
                    const msg = new String(err.error.message);
                    this.errorMessage = msg.toTitleCase();
                },
            });
    }
}
