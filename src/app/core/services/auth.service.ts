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
    HttpHeaders,
} from '@angular/common/http';
import { baseUri } from '@environments/environment';

@Injectable()
export class AuthService {
    #logged_in = new BehaviorSubject<boolean>(false);

    get logged_in() {
        return this.#logged_in;
    }

    get user_role() {
        return this.user.type;
    }

    get user(): User {
        return JSON.parse(sessionStorage.getItem('user') ?? '{}');
    }

    set user(value: User) {
        sessionStorage.setItem('user', JSON.stringify(value));
    }

    constructor(private http: HttpClient, private router: Router) {
        if (sessionStorage.getItem('auth') == 'true') {
            this.#logged_in.next(true);
        }
    }

    register(user: FormData) {
        if (this.#logged_in.value) {
            return throwError(() => new Error('already logged in'));
        }
        return this.http
            .post<User>(`${baseUri}/auth/register/patient`, user, {
                headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
            })
            .pipe(catchError(AuthService.handleError));
    }

    login(user: UserCredentials, manager: boolean = false) {
        if (this.#logged_in.value) {
            return throwError(() => new Error('already logged in'));
        }
        return this.http
            .post<{ user: User; message: string }>(
                `${baseUri}/auth/login${manager ? 'manager' : ''}`,
                user
            )
            .pipe(
                catchError(AuthService.handleError),
                tap((response) => {
                    sessionStorage.setItem('auth', 'true');
                    this.user = response.user;
                    this.#logged_in.next(true);
                })
            );
    }

    changePassword(old_password: string, new_password: string) {
        if (!this.#logged_in.value) {
            return throwError(() => new Error('unauthorized. not logged in'));
        }
        return this.http
            .post<{}>(`${baseUri}/auth/password`, {
                username: this.user.username,
                old_password,
                new_password,
            })
            .pipe(
                catchError(AuthService.handleError),
                tap(() => {
                    this.#logged_in.next(false);
                    sessionStorage.clear();
                }),
                map(() => true)
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
