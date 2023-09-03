import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { baseUri } from '@environments/environment';
import { Doctor } from '@core/models/users';
import {
    resolveProfilePicture,
    resolveProfilePictures,
} from '@core/utils/resolveProfilePicture';

@Injectable({
    providedIn: 'any',
})
export class DoctorsService {
    constructor(private http: HttpClient) {}

    public getAll(): Observable<Doctor[]> {
        return this.http
            .get<Doctor[]>(`${baseUri}/doctor`)
            .pipe(tap(resolveProfilePictures)) as Observable<Doctor[]>;
    }

    public getOne(doctorId: string): Observable<Doctor> {
        return this.http
            .get<Doctor>(`${baseUri}/doctor/${doctorId}`)
            .pipe(tap(resolveProfilePicture)) as Observable<Doctor>;
    }
}
