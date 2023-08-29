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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { baseUri } from '@environments/environment';

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

    constructor(private http: HttpClient, private router: Router) {
        if (sessionStorage.getItem('auth') == 'true') {
            this.#logged_in.next(true);
        }
    }

    register(user: User) {
        if (this.#logged_in.value) {
            return throwError(() => new Error('already logged in'));
        }
        return this.http
            .post<User>(`${baseUri}/auth/register/patient`, user)
            .pipe(catchError(AuthService.handleError));
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

    uniqeCredential({
        value,
        type,
    }: {
        value: string;
        type: 'email' | 'username';
    }) {
        return this.http
            .post<{ unique: boolean }>(`${baseUri}/auth/unique`, {
                value,
                type,
            })
            .pipe(
                catchError(AuthService.handleError),
                map((response) => response.unique)
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
                console.log('401 error, unauthorized. bad credentials');
                break;
            case 404:
                console.log('404 error, resource not found');
                break;
            case 409:
                console.log('409 error, already logged in');
                break;
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
        error.error.message ??= 'unknown error';
        return throwError(() => error);
    }
}
