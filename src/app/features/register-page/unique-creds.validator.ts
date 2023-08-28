import { Injectable } from '@angular/core';
import {
    AbstractControl,
    AsyncValidator,
    ValidationErrors,
} from '@angular/forms';
import { AuthService } from '@shared/services/auth.service';
import { Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
    constructor(private authService: AuthService) {}

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return this.authService
            .uniqeCredential({
                type: 'email',
                value: control.value,
            })
            .pipe(
                map((isUnique) =>
                    !isUnique
                        ? ({ notuniqueEmail: true } as ValidationErrors)
                        : null
                )
            );
    }
}

@Injectable({ providedIn: 'root' })
export class UniqueUsernameValidator implements AsyncValidator {
    constructor(private authService: AuthService) {}

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return this.authService
            .uniqeCredential({
                type: 'username',
                value: control.value,
            })
            .pipe(
                map((isUnique) =>
                    !isUnique
                        ? ({ notuniqueUsername: true } as ValidationErrors)
                        : null
                )
            );
    }
}
