import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor, Manager, User } from '@core/models/users';
import { baseUri } from '@environments/environment';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    update_profile(data: Partial<User>) {
        const { id, type } = this.authService.user$.value;
        console.log(data);
        return this.http
            .put<User | Doctor>(
                `${baseUri}/profile/${id}`,
                Object.assign(data, { type })
            )
            .pipe(tap((user) => (this.authService.user = user)));
    }

    update_avatar(data: FormData) {
        const { id } = this.authService.user$.value;

        return this.http
            .put<User | Doctor>(`${baseUri}/avatar/${id}`, data)
            .pipe(tap((user) => (this.authService.user = user)));
    }

    delete_avatar() {
        const { id } = this.authService.user$.value;

        return this.http
            .delete<User | Doctor>(`${baseUri}/avatar/${id}`)
            .pipe(tap((user) => (this.authService.user = user)));
    }
}
