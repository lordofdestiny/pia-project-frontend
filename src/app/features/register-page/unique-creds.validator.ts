import { Injectable } from '@angular/core';
import {
    AbstractControl,
    AsyncValidator,
    ValidationErrors,
} from '@angular/forms';

import { switchMap } from 'rxjs/operators';
import { Observable, map, of, timer } from 'rxjs';

import { AuthService } from '@core/services/auth.service';

type TCredential = 'email' | 'username';

@Injectable({ providedIn: 'root' })
abstract class UniqueCredentialValidator implements AsyncValidator {
    abstract get credentialType(): TCredential;
    get errorName(): string {
        return `notunique${this.credentialType.toTitleCase()}`;
    }
    get debounceTime(): number {
        return 500;
    }
    constructor(private authService: AuthService) {}

    private mapIntoValidationErrors() {
        return map((isUnique) =>
            !isUnique
                ? ({
                      [this.errorName]: true,
                  } as ValidationErrors)
                : null
        );
    }

    private serviceObservable(value: string) {
        return this.authService
            .uniqeCredential({
                type: this.credentialType,
                value: value,
            })
            .pipe(this.mapIntoValidationErrors());
    }

    validate(
        control: AbstractControl<any, any>
    ): Observable<ValidationErrors | null> {
        if (control.pristine) {
            return of(null);
        }
        return timer(this.debounceTime).pipe(
            switchMap(() => this.serviceObservable(control.value))
        );
    }
}

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator extends UniqueCredentialValidator {
    get credentialType(): TCredential {
        return 'email';
    }
}

@Injectable({ providedIn: 'root' })
export class UniqueUsernameValidator extends UniqueCredentialValidator {
    get credentialType(): TCredential {
        return 'username';
    }
}
