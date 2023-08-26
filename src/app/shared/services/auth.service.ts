import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    BehaviorSubject,
    Observable,
    catchError,
    map,
    tap,
    throwError,
} from 'rxjs';
import { User, UserCredentials, UserRole } from '@core/models/user.';
import {
    HttpClient,
    HttpErrorResponse,
    HttpResponse,
} from '@angular/common/http';

import { baseUri } from '@environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {
    #logged_in = new BehaviorSubject<boolean>(false);
    #user_role: UserRole = null;

    get logged_in() {
        return this.#logged_in;
    }

    get user_role() {
        return this.#user_role;
    }

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private router: Router
    ) {
        if (sessionStorage.getItem('auth') == 'true') {
            this.#logged_in.next(true);
        }
    }

    login(user: UserCredentials, manager: boolean = false) {
        if (this.#logged_in.value) {
            return throwError(() => new Error('already logged in'));
        }
        return this.http
            .post<User>(
                `${baseUri}/auth/login${manager ? 'manager' : ''}`,
                user
            )
            .pipe(
                catchError(AuthService.handleError),
                tap((response) => {
                    sessionStorage.setItem('auth', 'true');
                    this.#user_role = response.type;
                    this.#logged_in.next(true);
                })
            );
    }

    logout() {
        if (!this.#logged_in.value) {
            return throwError(() => new Error('unauthorized. not logged in'));
        }
        return this.http.post<{}>(`${baseUri}/auth/logout`, {}).pipe(
            catchError(AuthService.handleError),
            tap(() => {
                this.#logged_in.next(false);
                sessionStorage.clear();
            }),
            map(() => true)
        );
    }

    private static handleError(error: HttpErrorResponse): Observable<never> {
        switch (error.status) {
            case 0:
                console.log(error.error);
                break;
            case 401:
                return throwError(
                    () => new Error('401 error, unauthorized. bad credentials')
                );
            case 404:
                console.log('404 error, resource not found');
                break;
            case 409:
                return throwError(
                    () => new Error('409 error, already logged in')
                );
            case 500:
                alert('500 error, server error. Please try again later');
                console.log('500 error, server error');
                break;
            default:
                console.log(
                    'server responded with unknown error code: ',
                    error.status
                );
        }
        return throwError(() => error.error);
    }
}
