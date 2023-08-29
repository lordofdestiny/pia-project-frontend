import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DoctorListData, DoctorListDataItem } from '@core/models/doctor';
import { baseUri } from '@environments/environment';

@Injectable({
    providedIn: 'any',
})
export class DoctorsService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<DoctorListData> {
        return this.http
            .get<DoctorListData>(`${baseUri}/doctor`)
            .pipe(tap(resolveProfilePictures));
    }
}

function resolveProfilePicture(doctor: DoctorListDataItem): void {
    doctor.profile_picture = `${baseUri}${doctor.profile_picture}`;
}

function resolveProfilePictures(doctors: DoctorListData): void {
    doctors.forEach((doctor) => {
        resolveProfilePicture(doctor);
    });
}
