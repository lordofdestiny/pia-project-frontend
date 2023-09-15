import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from "rxjs";
import { User, UserCredentials } from "@core/models/users";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { baseUri } from "@environments/environment";
import { resolveProfilePicture } from "@core/utils/resolveProfilePicture";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    #logged_in = new BehaviorSubject<boolean>(false);
    user$ = new BehaviorSubject<User>({} as User);

    private parseDates(user: User) {
        if (user?.type === "doctor" && user?.vacations) {
            user.vacations = user.vacations?.map(({ start_date, end_date }) => ({
                start_date: new Date(start_date),
                end_date: new Date(end_date),
            }));
        }
        return user;
    }

    constructor(private http: HttpClient, private router: Router) {
        if (sessionStorage.getItem("auth") == "true" && !this.user?.id) {
            this.#logged_in.next(true);
            const user: User = JSON.parse(sessionStorage.getItem("user") ?? "{}");
            this.user$.next(this.parseDates(user));
        } else {
            sessionStorage.clear();
        }
        this.user$.subscribe((user) => {
            sessionStorage.setItem("user", JSON.stringify(user));
        });
    }

    private userProxyHandler = (() => {
        const that = this;
        return {
            set(obj: User, prop: string | symbol, value: any, receiver: any) {
                Reflect.set(obj, prop, value, receiver);
                that.user$.next({
                    ...obj,
                });
                return true;
            },
        };
    })();

    get user() {
        return new Proxy(this.user$.value, this.userProxyHandler);
    }

    set user(user: User) {
        this.user$.next({ ...user });
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

    login(user: UserCredentials, manager: boolean = false) {
        if (this.#logged_in.value) {
            return throwError(() => new Error("already logged in"));
        }
        return this.http
            .post<{ user: User; message: string }>(
                manager ? `${baseUri}/auth/login/manager` : `${baseUri}/auth/login`,
                user
            )
            .pipe(
                catchError(AuthService.handleError),
                tap((response) => {
                    sessionStorage.setItem("auth", "true");
                    this.#logged_in.next(true);
                }),
                map(({ user }) => user),
                tap(resolveProfilePicture),
                tap(this.parseDates),
                tap((user) => (this.user = user))
            );
    }

    changePassword(old_password: string, new_password: string) {
        if (!this.#logged_in.value) {
            return throwError(() => new Error("unauthorized. not logged in"));
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

    uniqeCredential({ value, type }: { value: string; type: "email" | "username" }) {
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
            return throwError(() => new Error("unauthorized. not logged in"));
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

    public static handleError(error: HttpErrorResponse): Observable<never> {
        switch (error.status) {
            case 0:
                console.log(error.error);
                break;
            case 401:
                console.log("401 error, unauthorized. bad credentials");
                break;
            case 404:
                console.log("404 error, resource not found");
                break;
            case 409:
                console.log("409 error, already logged in");
                break;
            case 500:
                alert("500 error, server error. Please try again later");
                console.log("500 error, server error");
                break;
            default:
                console.log("server responded with unknown error code: ", error.status);
        }
        error.error.message ??= "unknown error";
        return throwError(() => error);
    }
}
