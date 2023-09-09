import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor, User } from '@core/models/users';
import { baseUri } from '@environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    update_profile(id: string, data: Partial<User>) {
        const { type } = data;
        if (!['patient', 'doctor', 'manager'].includes(type!)) {
            throw new Error(
                'User type must be one of patient, doctor, manager'
            );
        }
        return this.http.put<User | Doctor>(
            `${baseUri}/profile/${id}`,
            Object.assign(data, { type })
        );
    }

    delete_profile(id: string) {
        return this.http.delete<User | Doctor>(`${baseUri}/profile/${id}`);
    }

    update_avatar(id: string, data: FormData) {
        return this.http.put<{ profile_picture: string }>(
            `${baseUri}/avatar/${id}`,
            data
        );
    }

    delete_avatar(id: string) {
        return this.http.delete<{ profile_picture: string }>(
            `${baseUri}/avatar/${id}`
        );
    }
}
