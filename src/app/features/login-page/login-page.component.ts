import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
    is_manager: boolean | null = null;
    hidden: boolean = false;
    usernameRegex: RegExp = /^[_-]*[a-zA-Z][\w-]*$/;
    /* Password regex */
    startsWithLetterRegex: RegExp = /^[a-zA-Z].*$/; // Starts with a letter
    length8to14Regex: RegExp = /^(?=.{8,14}$).*/; // 8 to 14 characters

    containsUppercaseRegex: RegExp = /^(?=[^A-Z]*[A-Z]).*/; // Contains uppercase
    containsNumberRegex: RegExp = /^(?=[^0-9]*[0-9]).*/; // Contains a digit

    containsSpecialRegex: RegExp =
        /(?=[^~!@#$%^&*()_+=\-\[\]{};:'"\\\|,.<>\/?]*[~!@#$%^&*()_+=\-\[\]{};:'"\\\|,.<>\/?])/; // Contains a special charachter

    noRepeatingRegex: RegExp = /^(?:([\x21-\x7e])\1?(?!\1))+$/; // No more than 2 characters repeating

    passwordRegex: RegExp =
        /^(?=[a-zA-Z].+$)(?=.{8,14}$)(?=[^A-Z]*[A-Z])(?=[^0-9]*[0-9])(?=[^~!@#$%^&*()_+=\-\[\]{};:'"\\\|,.<>\/?]*[~!@#$%^&*()_+=\-\[\]{};:'"\\\|,.<>\/?])(?:([\w\d~!@#$%^&*()_+=\-\[\]{};:'"\\\|,.<>\/?])\1?(?!\1))+$/;

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
        private fb: FormBuilder
    ) {
        this.activatedRoute.data
            .pipe(map((data) => data['manager']))
            .subscribe((manager) => {
                this.is_manager = manager;
            });
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

    togglePassword() {
        this.hidden = !this.hidden;
    }

    getUsernameErrorMessage() {
        const usernameField = this.loginForm.get('username');
        if (usernameField.hasError('required')) {
            return 'You must enter a value';
        }
        if (usernameField.hasError('pattern')) {
            return 'Username is not in a valid format';
        }
        if (usernameField.hasError('minlength')) {
            return 'Username must be at least 4 characters';
        }
        if (usernameField.hasError('maxlength')) {
            return 'Username must be at most 16 characters';
        }
        return '';
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

    onSubmit() {
        if (!this.loginForm.valid) {
            alert('Invalid form state');
            return;
        }
        const { username, password } = this.loginForm.value;
        this.authService.login({ username, password }).subscribe((user) => {
            this.router.navigate(['/']);
        });
    }

    matcher = new (class implements ErrorStateMatcher {
        isErrorState(
            control: FormControl | null,
            form: FormGroupDirective | NgForm | null
        ): boolean {
            const isSubmitted = form && form.submitted;
            return control && control.dirty && control.invalid; // show error only when dirty and invalid
        }
    })();
}
