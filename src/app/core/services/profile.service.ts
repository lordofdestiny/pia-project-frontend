import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor, User } from '@core/models/users';
import { baseUri } from '@environments/environment';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    update_profile(data: Partial<User> | Partial<Doctor>) {
        const { id } = this.authService.user$.value;

        return this.http
            .put<User | Doctor>(`${baseUri}/${id}/profile`, data)
            .pipe(tap((user) => (this.authService.user = user)));
    }

    update_avatar(data: FormData) {
        const { id } = this.authService.user$.value;

        return this.http
            .put<User | Doctor>(`${baseUri}/${id}/avatar`, data)
            .pipe(tap((user) => (this.authService.user = user)));
    }

    delete_avatar() {
        const { id } = this.authService.user$.value;

        return this.http.delete<User | Doctor>(`${baseUri}/${id}/avatar`).pipe(
            tap(console.log),
            tap((user) => (this.authService.user = user))
        );
    }
}
