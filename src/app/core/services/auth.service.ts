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
import { User, UserCredentials } from '@core/models/users';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { baseUri } from '@environments/environment';
import { resolveProfilePicture } from '@core/utils/resolveProfilePicture';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    #logged_in = new BehaviorSubject<boolean>(false);
    user$ = new BehaviorSubject<User>({} as User);

    set user(user: User) {
        resolveProfilePicture(user);
        this.user$.next(user);
    }

    get logged_in() {
        return this.#logged_in.asObservable();
    }

    get user_role() {
        return this.user$.value.type;
    }

    get full_name() {
        const { first_name, last_name } = this.user$.value;
        return `${first_name} ${last_name}`;
    }

    constructor(private http: HttpClient, private router: Router) {
        if (sessionStorage.getItem('auth') == 'true') {
            this.#logged_in.next(true);
            this.user$.next(JSON.parse(sessionStorage.getItem('user') ?? '{}'));
        }
        this.user$.subscribe((user) => {
            sessionStorage.setItem('user', JSON.stringify(user));
        });
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
                manager
                    ? `${baseUri}/auth/login/manager`
                    : `${baseUri}/auth/login`,
                user
            )
            .pipe(
                catchError(AuthService.handleError),
                tap(({ user, message: _msg }) => {
                    sessionStorage.setItem('auth', 'true');
                    this.user = user;
                    this.#logged_in.next(true);
                }),
                map(({ user }) => user)
            );
    }

    changePassword(old_password: string, new_password: string) {
        if (!this.#logged_in.value) {
            return throwError(() => new Error('unauthorized. not logged in'));
        }
        return this.http
            .post<{}>(`${baseUri}/auth/password`, {
                username: this.user$.value.username,
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
