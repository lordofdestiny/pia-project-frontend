import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor, User } from '@core/models/users';
import { baseUri } from '@environments/environment';
import { AuthService } from './auth.service';
import { map, tap } from 'rxjs';
import { resolveProfilePicture } from '@core/utils/resolveProfilePicture';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    update_profile(id: string, data: Partial<User>, updateStore = true) {
        const { type } = data;
        if (!['patient', 'doctor', 'manager'].includes(type!)) {
            throw new Error(
                'User type must be one of patient, doctor, manager'
            );
        }
        return this.http
            .put<User | Doctor>(
                `${baseUri}/profile/${id}`,
                Object.assign(data, { type })
            )
            .pipe(
                tap((user) =>
                    updateStore ? (this.authService.user = user) : null
                )
            );
    }

    delete_profile(id: string) {
        return this.http.delete<User | Doctor>(`${baseUri}/profile/${id}`);
    }

    update_avatar(id: string, data: FormData, updateStore = true) {
        return this.http
            .put<User | Doctor>(`${baseUri}/avatar/${id}`, data)
            .pipe(
                tap((user) =>
                    updateStore ? (this.authService.user = user) : null
                )
            );
    }

    delete_avatar(id: string, updateStore = true) {
        return this.http
            .delete<User | Doctor>(`${baseUri}/avatar/${id}`)
            .pipe(
                tap((user) =>
                    updateStore ? (this.authService.user = user) : null
                )
            );
    }
}
