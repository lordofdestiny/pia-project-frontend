import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { baseUri } from '@environments/environment';
import { Doctor } from '@core/models/users';
import {
    resolveProfilePicture,
    resolveProfilePictures,
} from '@core/utils/resolveProfilePicture';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'any',
})
export class DoctorsService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    public register(doctor: FormData): Observable<Doctor> {
        return this.http
            .post<Doctor>(`${baseUri}/doctors`, doctor, {
                headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
            })
            .pipe(tap(resolveProfilePicture));
    }

    public get_all(): Observable<Doctor[]> {
        return this.http
            .get<Doctor[]>(`${baseUri}/doctors`)
            .pipe(tap(resolveProfilePictures));
    }

    public get(username: string): Observable<Doctor> {
        return this.http
            .get<Doctor>(`${baseUri}/doctors/${username}`)
            .pipe(tap(resolveProfilePicture));
    }

    public update_examinations(
        doctorId: string,
        offered: string[],
        requested: string[]
    ) {
        return this.http
            .put<Doctor>(`${baseUri}/doctors/${doctorId}/examinations`, {
                offered,
                requested,
            })
            .pipe(tap((doctor) => (this.authService.user = doctor)));
    }

    respond_to_examination_request(
        doctorId: string,
        data: {
            examinationId: string;
            action: boolean;
        }
    ) {
        return this.http.post(
            `${baseUri}/doctors/${doctorId}/examinations/response`,
            data
        );
    }
}
