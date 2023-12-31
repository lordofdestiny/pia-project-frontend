import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, AbstractControlOptions } from "@angular/forms";
import { Router } from "@angular/router";

import { ShowOnDirtyErrorStateMatcher } from "@angular/material/core";

import { AuthService } from "@core/services/auth.service";
import { passwordChecks, passwordRegex } from "@core/constants/verification-regex";
import { IsHandsetService } from "@core/services/is-handset.service";
import { ConfirmPasswordErrorMatcher } from "@core/utils/error-state-matcher";
import { MatDialog } from "@angular/material/dialog";
import { ActionResultDialogComponent } from "@shared/components/action-success-dialog/action-success-dialog.component";

@Component({
    selector: "app-edit-password",
    templateUrl: "./edit-password.component.html",
    styleUrls: ["./edit-password.component.css"],
})
export class EditPasswordComponent implements OnInit {
    matcher = new ShowOnDirtyErrorStateMatcher();
    passwordMissmatch = new ConfirmPasswordErrorMatcher();
    passwordChecks = passwordChecks;
    changePasswordForm = this.fb.group(
        {
            current: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(14)]],
            new: [
                "",
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(14),
                    Validators.pattern(passwordRegex),
                ],
            ],
            confirm: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(14)]],
        },
        {
            validators: [this.passwordMatchValidator],
        } as AbstractControlOptions
    );

    hidden: { [field: string]: boolean } = {
        current: true,
        new: true,
    };
    fieldType(field: string): string {
        return this.hidden[field] ? "password" : "text";
    }
    fieldIcon(field: string): string {
        return this.hidden[field] ? "visibility_off" : "visibility";
    }
    togglePassword(field: string, event: Event) {
        if (event.type === "click" && this.isHandsetService.isHandset) {
            return;
        }
        this.hidden[field] = !this.hidden[field];
    }

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private isHandsetService: IsHandsetService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {}

    passwordMatchValidator(g: FormGroup) {
        const { new: new_password, confirm } = g.value;
        return new_password === confirm ? null : { mismatch: true };
    }

    submitted = true; // Whether the form has been submitted
    errorMessage = ""; // Place to store errors

    onSubmit() {
        this.submitted = true;
        const { current, new: new_password } = this.changePasswordForm.value;
        if (current != null && new_password != null) {
            this.authService.changePassword(current, new_password).subscribe({
                next: this.handlePasswordChangedSuccess.bind(this),
                error: (err) => (this.errorMessage = err.error.message),
            });
        }
    }

    handlePasswordChangedSuccess() {
        this.dialog
            .open(ActionResultDialogComponent, {
                width: "300px",
                panelClass: "dialog-color",
                data: {
                    success: true,
                    message:
                        "Your password has been changed successfully.\n You will be logged out.",
                },
            })
            .afterClosed()
            .subscribe(() => this.router.navigate(["logout"]));
    }
}
