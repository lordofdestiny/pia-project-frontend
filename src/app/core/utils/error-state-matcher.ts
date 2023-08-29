import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class InvalidDirtyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        const isSubmitted = form && form.submitted;
        return control && control.dirty && control.invalid; // show error only when dirty and invalid
    }
}

export class ConfirmPasswordErrorMatcher implements ErrorStateMatcher {
    isErrorState(
        control: FormControl | null,
        form: FormGroupDirective | NgForm | null
    ): boolean {
        const isSubmitted = form && form.submitted;
        return (
            control &&
            control.dirty &&
            (control.invalid || control.parent.hasError('mismatch'))
        );
    }
}
